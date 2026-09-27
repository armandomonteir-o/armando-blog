# 008: A gaveta do menu no celular volta a deslizar, e o fundo acompanha

- **Status**: DONE
- **Commit**: 2993ef8
- **Severity**: MEDIUM (na auditoria era easing; a medição mostrou que era animação quebrada)
- **Category**: Easing & duration, Interruptibility
- **Estimated scope**: 2 arquivos
- **Issue**: #92 (item 5)
- **Depends on**: 001 (`--ease-drawer`, `--duration-drawer`, `--ease-out`, `--duration-small`)

## Problem

A auditoria apontou curva `ease-in-out` na gaveta. A medição quadro a quadro mostrou algo pior: **a gaveta não anima nada**.

```tsx
// components/layout/Sidebar.tsx:63,71: current
mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease-in-out",
```

No Tailwind v4, `translate-x-*` escreve a propriedade CSS `translate`, e não `transform` (PITFALL-012). A transição em `transform` nunca dispara. A gaveta vai de `-100%` a `0` num único quadro.

E o fundo escuro é montado e desmontado sem transição:

```tsx
// components/layout/AppShell.tsx:40-47: current
{mobileOpen && (
  <div
    className="fixed inset-0 z-40 lg:hidden"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    onClick={() => setMobileOpen(false)}
  />
)}
```

## Target

```tsx
// Sidebar.tsx: transition the property the class really sets
transition:
  "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), translate var(--duration-drawer) var(--ease-drawer)",
```

```tsx
// AppShell.tsx: always mounted, fades with the drawer, never blocks when closed
<div
  className="fixed inset-0 z-40 lg:hidden"
  aria-hidden="true"
  style={{
    backgroundColor: "rgba(0,0,0,0.5)",
    opacity: mobileOpen ? 1 : 0,
    pointerEvents: mobileOpen ? "auto" : "none",
    transition: "opacity var(--duration-small) var(--ease-out)",
  }}
  onClick={() => setMobileOpen(false)}
/>
```

Transição (e não keyframe) nos dois, para abrir e fechar rápido em sequência retomar do ponto atual.

## Repo conventions to follow

- Tokens do plano 001, em `styles/theme.css`.

## Steps

1. Em `Sidebar.tsx`, trocar só a parte `transform 0.3s ease-in-out` da `transition` por `translate var(--duration-drawer) var(--ease-drawer)`, com um comentário citando o motivo.
2. Em `AppShell.tsx`, trocar o overlay condicional pelo overlay sempre montado do Target.

## Boundaries

- Do NOT mexer na parte `width` da transição da Sidebar: é o item 3 da auditoria (depende de aprovação visual).
- Do NOT mexer no comportamento da sidebar no desktop.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run lint` e `npm run build` verdes.
- **Feel check** (390px, toque): abrir o menu e ver a gaveta deslizar e assentar, com o fundo escurecendo junto; fechar tocando no fundo e ver o caminho inverso. Com o menu fechado, o conteúdo continua clicável.
- **Done when**: medido quadro a quadro, a gaveta passa por posições intermediárias, e o fundo passa por opacidades intermediárias.
