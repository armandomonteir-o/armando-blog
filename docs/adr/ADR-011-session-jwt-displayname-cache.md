# ADR-011 — Cache de displayName no JWT da Sessão

**Status:** Accepted  
**Date:** 2026-05-17

---

## Problema

O endpoint `POST /api/comments` fazia **duas chamadas sequenciais** ao WordPress (Hostinger) por comentário enviado:

1. `getUserProfile(emailHash)` via WPGraphQL autenticado — para buscar o `displayName` customizado do usuário
2. `createWPComment()` via WPGraphQL autenticado — para criar o comentário

Cada round-trip Vercel → Hostinger custa ~300–600ms. Em série, o usuário via "ENVIANDO..." por 600ms–1.2s antes do comentário aparecer.

---

## Decisão

**Cachear o `displayName` dentro do JWT da sessão (Auth.js).**

O JWT é um cookie assinado que vive no browser. Auth.js expõe dois callbacks para manipulá-lo:

- **`jwt` callback** — executa quando o token é criado ou renovado. Aqui fazemos a busca no WP.
- **`session` callback** — executa a cada leitura de sessão (`auth()`). Aqui só transferimos o dado do token para o objeto `session`.

---

## Como funciona

### 1. No login (`trigger === "signIn"`)

```
Usuário faz login com Google
        ↓
jwt callback (trigger: "signIn")
        ↓
getUserProfile(sha256(email)) → WP GraphQL (autenticado)
        ↓
token.displayName = profile?.displayName ?? null
        ↓
JWT salvo no cookie (assinado, httpOnly)
```

O `displayName` fica dentro do token. Não precisa ser rebuscado enquanto o token for válido.

#### Auto-seed de avatar no login

Durante o login, o `jwt` callback também garante que o perfil WP tenha um avatar:

```
profile não existe → seedWPProfileAvatar(hash, googlePhoto)    → cria perfil com avatar
profile existe, avatarUrl null → seedWPProfileAvatar(hash, googlePhoto, id) → atualiza perfil com avatar
profile existe, avatarUrl preenchido → nada
```

O `seedWPProfileAvatar` faz POST para `WP REST /wp-json/wp/v2/user-profile` com `Application Password`. Erros são logados mas não bloqueiam o login — o avatar é não-crítico. O filtro PHP `pre_get_avatar_data` intercepta as chamadas de `get_avatar_data()` do WPGraphQL e retorna o avatar customizado automaticamente para todos os comentários do usuário.

### 2. Ao enviar um comentário

```
POST /api/comments { postId, content }
        ↓
auth() → lê JWT do cookie (sem chamada ao WP)
        ↓
authorName = session.user.displayName ?? session.user.name ?? "Anônimo"
        ↓
createWPComment({ authorName, ... }) → 1 chamada ao WP
```

**Antes:** 2 chamadas ao WP. **Depois:** 1 chamada ao WP.

### 3. Quando o usuário atualiza o perfil

```
PUT /api/profile { displayName: "novo nome" } → WP REST API
        ↓
ProfileForm chama session.update()
        ↓
jwt callback (trigger: "update")
        ↓
getUserProfile(...) → rebusca no WP
        ↓
token.displayName atualizado → novo cookie
```

O próximo comentário já usa o nome novo — sem precisar fazer logout/login.

---

## Por que o JWT e não outros mecanismos

| Opção | Problema |
|---|---|
| Buscar no WP a cada request | Lento — é o que tínhamos antes |
| localStorage / sessionStorage | Não disponível no servidor (API routes rodam server-side) |
| Cache em memória (Map no servidor) | Não funciona em serverless — cada invocação é isolada |
| Redis / KV externo | Serviço extra desnecessário — o JWT já é um cache persistido no cliente |
| Database session (Auth.js adapter) | Troca JWT por DB session — toda leitura de sessão vira uma query ao banco |

O JWT é o lugar certo: já existe, é assinado (não pode ser forjado), é enviado em todo request, e vive no browser sem custo de infraestrutura.

---

## Trade-offs e limitações

**Staleness:** Se o usuário alterar o `displayName` e NÃO chamar `session.update()`, o JWT fica desatualizado até o próximo login ou renovação de token (padrão: 24h). Mitigado: `ProfileForm` chama `update()` automaticamente após salvar.

**Latência no login:** O `jwt` callback agora faz uma chamada ao WP no momento do login (nova sessão). Esse custo é aceitável — acontece uma vez por sessão, não por comentário.

**Usuário sem perfil:** `getUserProfile` retorna `null` → `token.displayName = null` → fallback para `session.user.name` (nome do Google). Comportamento correto.

---

## Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `auth.ts` | Adicionados `jwt` e `session` callbacks; `Session` type estendido com `displayName`; `seedWPProfileAvatar` para auto-seed de avatar no login |
| `app/api/comments/route.ts` | Removida busca de perfil — usa `session.user.displayName` |
| `app/minha-conta/ProfileForm.tsx` | Chama `update()` após salvar para invalidar o cache do JWT |
| `components/content/single-post/PostCommentsSection.tsx` | Formulário exibe `displayName ?? name` — não o nome do Google diretamente |
| `blog-cms/.../avatar-override.php` | Filtro `pre_get_avatar_data` retorna avatar customizado do CPT para todos os comentários |
