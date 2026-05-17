# ADR-012 — Cache de avatarUrl no JWT e comportamento de migração de token

**Status:** Accepted  
**Date:** 2026-05-17

---

## Contexto

Depois de implementar o cache de `displayName` no JWT (ADR-011), o Header e o formulário de comentário ainda mostravam a foto do Google (`session.user.image`) em vez do avatar customizado do usuário armazenado no WordPress. O `session.user.image` é o campo padrão do Auth.js para a foto do provedor OAuth — ele nunca muda após o login, mesmo que o usuário troque o avatar.

---

## Decisão

**Cachear também o `avatarUrl` no JWT da sessão**, seguindo exatamente o mesmo padrão do `displayName`.

O `getUserProfile()` já era chamado no `jwt` callback para buscar o `displayName` — o `avatarUrl` vinha junto na mesma query GraphQL sem custo adicional. Bastou propagar o campo.

```
jwt callback (trigger: "signIn" | "update")
        ↓
getUserProfile(sha256(email)) → WP GraphQL
        ↓
t.displayName = profile?.displayName ?? null
t.avatarUrl   = profile?.avatarUrl ?? null     ← novo
        ↓
session callback
        ↓
session.user.displayName = t.displayName ?? null
session.user.avatarUrl   = t.avatarUrl ?? null  ← novo
```

### Onde é consumido

| Componente | Antes | Depois |
|---|---|---|
| `Header.tsx` avatar | `session.user.image` (Google) | `avatarUrl ?? image` |
| `Header.tsx` nome | `session.user.name` (Google) | `displayName ?? name` |
| `PostCommentsSection` form | `session.user.image` (Google) | `avatarUrl ?? image` |

O padrão `avatarUrl ?? image` garante que usuários sem avatar customizado continuem vendo a foto do Google — nenhum fallback quebra.

---

## Comportamento de migração de token (gotcha importante)

### O problema

Quando um novo campo é adicionado ao JWT, **sessões já existentes no browser não têm esse campo**. O cookie JWT foi criado antes da mudança — ele contém apenas os campos que existiam na época. O Auth.js não re-emite tokens existentes automaticamente.

### Consequência observada

Ao fazer deploy com `avatarUrl` no JWT, usuários já logados continuaram sem ver o avatar customizado no Header até que seu token fosse renovado.

### Mecanismos de renovação (do mais rápido ao mais lento)

| Mecanismo | Quando ocorre |
|---|---|
| `session.update()` | Imediato — chamado pelo `ProfileForm` após salvar |
| Logout + login | Imediato — novo token emitido do zero |
| Expiração natural do token | 24h (padrão Auth.js) |

### Por que só acontece uma vez

A `ProfileForm` chama `update()` após qualquer save. Então:
1. Primeira vez que o usuário salva o perfil após o deploy → token renovado → campo aparece
2. A partir daí o ciclo é normal — nenhuma nova migração necessária

Novos usuários (login pela primeira vez após o deploy) nunca enfrentam o problema — o token já é emitido com todos os campos.

### Regra geral para o futuro

> **Sempre que um novo campo for adicionado ao JWT, usuários existentes precisarão de `session.update()` ou novo login para vê-lo.** Isso é intrínseco ao design de JWT stateless — não há como "notificar" tokens existentes. Mitigação: chamar `session.update()` em algum fluxo que o usuário naturalmente executa (ex: salvar configurações).

---

## Alternativas consideradas

| Opção | Problema |
|---|---|
| Buscar avatar via `/api/profile` em cada componente | Round-trip extra por page load; complica o código do Header |
| Passar avatar como prop do servidor para o Header | Header é client component — receberia props stale do server render |
| Armazenar avatar no cookie separado | Duplica o mecanismo de auth sem ganho real |

O JWT já existia, o campo vinha de graça na query que já fazíamos. Sem custo, sem nova infraestrutura.

---

## Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `auth.ts` | `avatarUrl` adicionado a `AppToken`, `Session`, jwt e session callbacks |
| `components/layout/Header.tsx` | Usa `session.user.avatarUrl ?? session.user.image` e `displayName ?? name` |
| `components/content/single-post/PostCommentsSection.tsx` | Mesmo padrão no mini-header do formulário |
