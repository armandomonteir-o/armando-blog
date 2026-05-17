# ADR-010 — User Profile CPT for Comment Identity Customization

**Status:** Accepted  
**Date:** 2026-05-17  
**Issue:** #45 (a abrir)

---

## Contexto

Comentários criados via Google OAuth mostram o Gravatar do email — não a foto do Google. O usuário quer poder:
1. Definir um **nome de exibição** customizado (que aparece no comentário em vez do nome do Google)
2. Definir um **avatar customizado** (URL de imagem) que substitui o Gravatar

Isso exige persistir essas preferências em algum lugar.

---

## Decisão

**Armazenar o perfil do usuário como um Custom Post Type (CPT) no WordPress.**

### Por quê o WordPress (e não outra coisa)?

| Opção | Motivo de rejeição |
|---|---|
| Vercel KV (Redis) | Adiciona um novo serviço externo. ADR-003 estabeleceu o WP como CMS único. |
| localStorage | Não persiste entre dispositivos. Desaparece se o usuário limpar o browser. |
| Database separado (Supabase, PlanetScale) | Overengineering. O projeto já tem hospedagem WP na Hostinger com capacidade de sobra. |
| Auth.js database adapter | Exigiria trocar de JWT sessions para database sessions — quebra a configuração atual sem benefício claro. |

---

## Como funciona — passo a passo

### 1. CPT `user-profile` no WordPress

Um Custom Post Type é basicamente uma "tabela extra" gerenciada pelo próprio WordPress. Cada usuário do blog vira um "post" desse tipo:

```
post_type:  user-profile
post_title: bc2247a6e8af05... (sha256 do email — opaco, não é o email em si)
post_slug:  bc2247a6e8af05... (mesmo hash — é a chave de busca)
status:     publish
meta:
  display_name: "Armando" (opcional)
  avatar_url:   "https://..." (opcional)
```

**Por que o slug é um hash sha256 do email e não o email diretamente?**

O email (`armandojr.ara@gmail.com`) é dado pessoal (PII — Personally Identifiable Information). Expor ele na URL, nos logs do servidor, ou em qualquer lugar público seria uma má prática de privacidade.

O sha256 é uma função de hash criptográfico — ela transforma o email em uma string opaca de 64 caracteres. Não dá para reverter (não existe operação de "deshashar"). Dois emails diferentes sempre produzem hashes diferentes, então funciona como chave de busca única sem expor o dado original.

```
sha256("armandojr.ara@gmail.com") = "bc2247a6e8af0513a978f164430891c2218d1cc2f161c6924406e492b3f309b7"
```

Esse hash aparece em:
- URL interna do WP Admin (só você vê)
- Logs do servidor WordPress
- Código-fonte (como identificador de busca)

O email real fica apenas em:
- A sessão do Auth.js (no servidor, nunca exposta ao browser)
- O campo `comment_author_email` do WP (privado por padrão, não retornado pelo GraphQL)

---

### 2. Escrita — WP REST API com Application Password

Quando você salva seu perfil em `/minha-conta`, o Next.js faz isso no servidor:

```
Browser → PUT /api/profile { displayName, avatarUrl }
               ↓
          auth() → valida sessão (você está logado?)
               ↓
          sha256(email) → calcula o hash
               ↓
          getUserProfile(hash) → busca no WP se já existe
               ↓
          POST /wp-json/wp/v2/user-profile  ← WP REST API
          Authorization: Basic base64(WP_APP_USER:WP_APP_PASSWORD)
          body: { title: hash, slug: hash, status: "publish",
                  meta: { display_name, avatar_url } }
               ↓
          WordPress cria/atualiza o post
```

**Por que WP REST API e não WPGraphQL para escrever?**

WPGraphQL para ACF (o plugin que expõe os dados do ACF via GraphQL) suporta leitura muito bem. Para **mutações** com dados de meta (post_meta), o comportamento varia bastante dependendo da versão do plugin. A WP REST API com `register_post_meta` e `show_in_rest: true` é o jeito mais estável e documentado de escrever meta via API. Menos suposição, mais garantia.

**Validações de segurança no route:**
- Rejeita qualquer `avatarUrl` que não comece com `https://` — elimina `javascript:`, `data:`, URLs de protocolo malicioso
- `display_name` passa por `sanitize_text_field()` no PHP — remove HTML, strips tags
- `avatar_url` passa por `esc_url_raw()` no PHP — força URL válida
- A rota exige sessão autenticada — sem login, retorna 401
- As credenciais (`WP_APP_USER`, `WP_APP_PASSWORD`) ficam apenas no `.env.local` e nas variáveis do Vercel — o browser nunca as vê

---

### 3. Leitura — WPGraphQL

Para ler o perfil (na página `/minha-conta` e antes de criar um comentário):

```graphql
query GetUserProfile($slug: ID!) {
  userProfile(id: $slug, idType: SLUG) {
    id
    databaseId
    slug
    displayName
    avatarUrl
  }
}
```

Os campos `displayName` e `avatarUrl` são registrados via `register_graphql_field()` no PHP — resolvem diretamente do `post_meta`. Sem ACF, sem dependência de plugin extra.

---

### 4. Avatar automático — filtro `pre_get_avatar_data`

Esse é o ponto mais elegante. Quando o WPGraphQL retorna um comentário com `author { node { avatar { url } } }`, o WordPress internamente chama `get_avatar_data($email)` para gerar a URL do Gravatar.

Instalamos um filtro PHP que **intercepta essa chamada** antes do Gravatar ser consultado:

```
WPGraphQL pede avatar do email X
    ↓
pre_get_avatar_data filter
    ↓
sha256(email X) → busca no CPT user-profile
    ↓
Encontrou avatar_url? → retorna ela
Não encontrou?       → deixa o Gravatar funcionar normalmente (fallback)
```

**Resultado:** Nenhuma query do Next.js precisa mudar. O campo `avatar.url` nos comentários já retorna o avatar customizado automaticamente quando existe, e o Gravatar quando não existe.

---

### 5. Como o nome customizado chega nos comentários

```
Browser → POST /api/comments { postId, content }
               ↓
          auth() → valida sessão
               ↓
          sha256(email) → getUserProfile(hash) → pega displayName
               ↓
          authorName = displayName ?? session.user.name ?? "Anônimo"
               ↓
          createWPComment({ authorName, authorEmail, content, postId })
               ↓
          WordPress armazena comentário com esse nome
```

O nome customizado é resolvido no servidor antes de criar o comentário. O browser só manda `content`. Não tem como o usuário forjar o nome de outro — ele vem da sessão + perfil armazenado no WP.

---

## Análise de segurança

| Risco | Mitigação |
|---|---|
| **Injeção de HTML no nome** | `sanitize_text_field()` no PHP remove qualquer HTML/JS |
| **URL de avatar maliciosa** | Validação `https://` no Next.js + `esc_url_raw()` no PHP |
| **Usuário não autenticado escrevendo** | Todas as rotas verificam `auth()` antes de qualquer operação |
| **Acesso ao perfil de outro usuário** | A rota usa o email da sessão — não aceita email externo no body |
| **PII no banco** | Email só existe no campo interno `comment_author_email` do WP (privado) e na sessão |
| **Credentials no código** | `WP_APP_USER` e `WP_APP_PASSWORD` só existem em `.env.local` e Vercel env vars |
| **CPT visível publicamente** | `public: false`, `publicly_queryable: false` — não aparece em nenhuma URL pública do WP |

---

## Arquivos modificados

### `blog-cms` (WordPress — requer deploy na Hostinger)
| Arquivo | O que faz |
|---|---|
| `includes/cpt-user-profile.php` | Registra o CPT, os meta fields (REST + GraphQL), e os campos GraphQL customizados |
| `includes/avatar-override.php` | Intercepta `get_avatar_data` e substitui pelo avatar customizado quando existe |
| `armando-headless.php` | Carrega os dois novos arquivos acima |

### `blog-armandin` (Next.js — deploy no Vercel)
| Arquivo | O que faz |
|---|---|
| `lib/graphql/types.ts` | Tipo `WPUserProfile` |
| `lib/graphql/queries/profile.ts` | `getUserProfile(hash)` — query WPGraphQL |
| `app/api/profile/route.ts` | GET + PUT do perfil (protegidos por sessão) |
| `app/api/comments/route.ts` | Busca `displayName` do perfil antes de criar comentário |
| `app/minha-conta/page.tsx` | Página protegida — redireciona para `/login` se não logado |
| `app/minha-conta/ProfileForm.tsx` | Formulário de edição (nome + avatar URL + botão "usar foto do Google") |
| `components/layout/Header.tsx` | Avatar/nome agora são link clicável para `/minha-conta` |

---

## Ordem de deploy

1. **Primeiro:** Push do `blog-cms` e atualização do plugin na Hostinger
   - O CPT precisa existir antes das queries do Next.js funcionarem
2. **Depois:** Deploy do `blog-armandin` no Vercel
   - As queries vão retornar `null` graciosamente enquanto o WP não tiver o CPT

## Consequências

- **Sem banco extra:** Tudo no WordPress. Uma hospedagem, uma fonte de verdade.
- **Gravatar como fallback:** Se o usuário não configurar avatar, Gravatar continua funcionando.
- **Google name como fallback:** Se o usuário não configurar nome, o nome do Google é usado.
- **Perfil persistente:** Funciona em qualquer browser, qualquer dispositivo, qualquer sessão.
- **Admin vê os perfis:** No WP Admin aparece a seção "User Profiles" com os hashes. Não expõe emails mas permite moderar se necessário.
