# 005: Cards da categoria entram no mesmo ritmo do resto do site

- **Status**: DONE
- **Commit**: 2993ef8
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 arquivo, 3 valores
- **Issue**: #92 (item 6)
- **Depends on**: nenhum

## Problem

Os cards de subcategoria entram em sequência com 150ms entre um e outro, e cada entrada dura 500ms:

```tsx
// app/categoria/[category]/CategoryClient.tsx:111-116: current
<motion.div
  key={sub.slug}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.15 * i }}
>
```

Com 4 cards por página, o último só fica totalmente visível perto de 1 segundo depois. O escalonamento é decorativo e deve ficar entre 30 e 80ms por item, sem segurar a leitura. A lista de `/posts` já faz certo.

## Target

Os mesmos valores de `app/posts/PostsClient.tsx:153-155`:

```tsx
<motion.div
  key={sub.slug}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, delay: 0.05 * i }}
>
```

## Repo conventions to follow

- Exemplo: `app/posts/PostsClient.tsx:153-155`, a lista de posts, com 50ms entre itens e 350ms por entrada.

## Steps

1. Em `app/categoria/[category]/CategoryClient.tsx:113`, trocar `y: 30` por `y: 20`.
2. Na linha 115, trocar `duration: 0.5, delay: 0.15 * i` por `duration: 0.35, delay: 0.05 * i`.

## Boundaries

- Do NOT mexer no `CategoryHero` nem em outra animação da página.
- Do NOT mexer no escalonamento da subcategoria (`SubcategoryClient.tsx:264-267`, 80ms, dentro da faixa).

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run lint`, `npm test` e `npm run build` verdes.
- **Feel check**: abrir `/categoria/musicas` e confirmar que os 4 cards entram em cascata curta, sem o último "demorar".
- **Done when**: o último card fica visível em cerca de 0,5s, e não 1s.
