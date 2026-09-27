# 006: `transition-all` vira a lista do que realmente muda

- **Status**: DONE
- **Commit**: 2993ef8
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 6 arquivos, 7 linhas
- **Issue**: #92 (item 7)
- **Depends on**: nenhum

## Problem

`transition-all` (e `transition: "all ..."`) anima qualquer propriedade que mudar, inclusive as que ninguém quis animar, e pode tirar a animação da GPU. Em cada lugar, só algumas propriedades mudam de fato:

| Onde | O que muda |
|---|---|
| `SubcategoryClient.tsx:175` (tags) | fundo, borda, cor |
| `PlaylistsClient.tsx:57` (gêneros) | cores, sombra, `transform` |
| `PostsClient.tsx:117,131` (filtros) | fundo, borda, cor |
| `CommentsSection.tsx:69` ("ver todos") | `filter`, `translate` |
| `PostsGrid.tsx:53` ("ver todos") | `filter`, `translate` |
| `TableOfContents.tsx:95` (item ativo) | fundo, borda |

```tsx
// components/content/PostsGrid.tsx:53: current
className="px-4 py-1.5 cursor-pointer transition-all duration-150 hover:brightness-125 hover:-translate-y-px font-mono font-bold"
```

**Atenção:** no Tailwind v4, `hover:-translate-y-px` usa a propriedade CSS `translate`, e não `transform`. A lista certa ali é `filter,translate`.

## Target

| Onde | Troca |
|---|---|
| `SubcategoryClient.tsx:175` | `transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease"` |
| `PlaylistsClient.tsx:57` | `transition-[color,background-color,border-color,box-shadow,transform]` |
| `PostsClient.tsx:117,131` | `transition-colors` |
| `CommentsSection.tsx:69` | `transition-[filter,translate]` |
| `PostsGrid.tsx:53` | `transition-[filter,translate]` |
| `TableOfContents.tsx:95` | `transition-colors` |

Durações e curvas não mudam.

## Repo conventions to follow

- Classes utilitárias do Tailwind v4, com valor arbitrário entre colchetes quando não existe atalho.
- Exemplo de lista explícita que já existe: `Header.tsx:484` (`transition: "background-color 0.15s, color 0.15s, transform 0.15s"`).

## Steps

1. Aplicar cada troca da tabela do Target, só no trecho `transition-all` ou `transition: "all ..."`.

## Boundaries

- Do NOT tocar em `Sidebar.tsx:183`: o `transition-all` ali anima o `padding` junto com a largura da sidebar, e isso é do item 3 da auditoria, que depende de aprovação visual.
- Do NOT mudar duração, curva nem estado de hover.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run lint` e `npm run build` verdes; o CSS gerado contém `transition-property:filter,translate` e `transition-property:color,background-color,border-color,box-shadow,transform`.
- **Feel check**: passar o mouse nos links "ver todos" da home e nos filtros de `/posts`, e conferir que o hover é igual ao de antes.
- **Done when**: `grep -rn "transition-all" app components` só encontra a Sidebar.
