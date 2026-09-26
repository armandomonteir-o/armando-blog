# 001: Tokens de movimento, curvas e durações num lugar só

- **Status**: DONE
- **Commit**: 2993ef8
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 arquivos novos ou alterados, cerca de 40 linhas
- **Issue**: #92 (item 10)

## Problem

Não existe nenhum token de movimento no projeto. `app/globals.css` e `styles/theme.css` não definem `--ease-*` nem `--duration-*`, e as animações usam pelo menos seis curvas e molas digitadas à mão:

```ts
// components/layout/Sidebar.tsx:71: current
transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease-in-out",
// components/content/PostsGrid.tsx:84: current (repeated in ~20 places)
transition: "transform 0.2s ease, box-shadow 0.2s ease",
// components/layout/newsletter/NewsletterModal.tsx:84-88: current
transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.05 }}
// components/content/NowPlaying.tsx:123: current
transition={{ type: "spring", stiffness: 280, damping: 26 }}
```

Os planos 002 a 004 precisam de valores compartilhados. Sem tokens, cada um inventaria os seus.

## Target

**CSS**, no fim do bloco `:root` de `styles/theme.css` (antes da linha 96, a `}` que fecha o `:root`):

```css
  /* ── Motion (issue #92) ── */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1); /* enter, exit, press: starts fast */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1); /* movement already on screen */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1); /* drawers and sheets */
  --duration-press: 100ms; /* :active feedback */
  --duration-hover: 160ms; /* hover lift, color */
  --duration-small: 200ms; /* tooltips, small popovers, fades */
  --duration-drawer: 400ms; /* drawers, sheets */
```

**TypeScript**, para o `motion/react`, em arquivo novo `lib/motion.ts`:

```ts
// Same values as the --ease-* tokens in styles/theme.css, for motion/react.
export const easeOut = [0.23, 1, 0.32, 1] as const;
export const easeInOut = [0.77, 0, 0.175, 1] as const;
export const easeDrawer = [0.32, 0.72, 0, 1] as const;

// Apple-style spring: subtle bounce, carries velocity when interrupted.
export const spring = { type: "spring", duration: 0.5, bounce: 0.2 } as const;
```

## Repo conventions to follow

- Tokens globais vivem em `styles/theme.css`, no `:root`, agrupados por comentário `/* ── Grupo ── */` (exemplo: `styles/theme.css:6`, `/* ── Chrome (structural — never changes with theme) ── */`).
- Helpers compartilhados vivem em `lib/` (exemplo: `lib/design-tokens.ts`).
- Comentários em inglês.

## Steps

1. Em `styles/theme.css`, dentro do `:root`, logo antes da `}` da linha 96, inserir o bloco CSS do Target.
2. Criar `lib/motion.ts` com o conteúdo TypeScript do Target.
3. Em `docs/DESIGN-SYSTEM.md`, na seção `## CSS Custom Properties`, acrescentar uma subseção `### Motion` com a tabela dos 7 tokens e uma linha dizendo que `lib/motion.ts` espelha as curvas para o `motion/react`.

## Boundaries

- Do NOT trocar nenhuma animação existente para usar os tokens: isso é dos planos 002 a 004 e de levas futuras.
- Do NOT adicionar dependência.
- Do NOT mudar nenhum outro token do `:root`.
- If `styles/theme.css:96` não for a `}` do `:root`, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run lint` e `npm test` sem erro; `npm run build` verde.
- **Feel check**: nenhum. Os tokens ainda não têm consumidor, então nada muda na tela. Conferir no DevTools (Elements, `:root`, Computed) que `--ease-out` aparece com o valor exato.
- **Done when**: os 7 tokens estão no `:root`, `lib/motion.ts` existe, e o `DESIGN-SYSTEM.md` lista os tokens.
