# 002: Respeitar movimento reduzido em todo o site

- **Status**: DONE
- **Commit**: 2993ef8
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 arquivo novo, 4 alterados, cerca de 40 linhas
- **Issue**: #92 (item 1)
- **Depends on**: nenhum

## Problem

Zero ocorrências de `prefers-reduced-motion` ou `useReducedMotion` no projeto. Quem pede ao sistema para reduzir movimento (vestibular, enxaqueca, distração) recebe:

- **loops infinitos de deslocamento em CSS**, em quase toda página:
  ```ts
  // components/ui/AeroElements.tsx:125: current
  animation: `aeroFloat ${6 + delay}s ease-in-out infinite alternate`,
  // components/ui/AeroElements.tsx:164: current
  animation: `aeroBubble ${5 + delay * 1.5}s ease-in-out infinite alternate`,
  // components/ui/AeroElements.tsx:287, 298, 309, 320, 331, 342: current (6 pixel icons)
  animation: "pixelBounce 3s ease-in-out infinite",
  // app/not-found.tsx:91, 105, 120, 158: aeroFloat / aeroBubble
  // app/not-found.tsx:194: current
  animation: "glitchShake 0.5s ease-in-out infinite",
  ```
- **loops e entradas com `transform` no `motion/react`**, em 15 arquivos. Exemplos: `components/layout/Sidebar.tsx:249` (`animate={{ rotate: [0, 12, -12, 0] }}`, repeat Infinity), `components/content/ContactCTA.tsx:40`, `components/layout/newsletter/NewsletterWidget.tsx:40,68`, `components/content/single-post/PostHero.tsx:47-49` (zoom de 1.2s).

## Target

Movimento reduzido é **menos e mais suave, não zero**: some o deslocamento, fica a opacidade e a cor.

**1. `motion/react`: uma configuração global.** Arquivo novo `components/providers/MotionProvider.tsx`:

```tsx
"use client";

import { MotionConfig } from "motion/react";

// With the OS "reduce motion" setting on, motion/react skips transform and layout
// animations and keeps opacity and color ones.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

**2. Loops de CSS: uma classe de ambiente.** No fim de `styles/theme.css`, fora de qualquer bloco:

```css
/* Ambient loops (floating orbs, bubbles, pixel icons, glitch): decorative movement
   that stops when the OS asks for reduced motion. The element rests at its first frame. */
@media (prefers-reduced-motion: reduce) {
  .motion-ambient {
    animation: none !important;
  }
}
```

`!important` é necessário porque a `animation` vem de `style` inline, que ganha de qualquer regra de classe.

## Repo conventions to follow

- Providers de cliente ficam em `components/providers/`, um por arquivo, com `"use client"` (exemplar: `components/providers/SessionProvider.tsx`).
- `app/layout.tsx:56-58` já aninha providers: `<SessionProvider><AppShell>{children}</AppShell></SessionProvider>`.

## Steps

1. Criar `components/providers/MotionProvider.tsx` com o código do Target.
2. Em `app/layout.tsx`, importar `MotionProvider` e envolver o `AppShell`:
   ```tsx
   <SessionProvider>
     <MotionProvider>
       <AppShell>{children}</AppShell>
     </MotionProvider>
   </SessionProvider>
   ```
3. Em `styles/theme.css`, acrescentar o bloco `@media` do Target no fim do arquivo.
4. Acrescentar `className="motion-ambient"` a cada elemento que recebe a `animation` inline de loop:
   - `components/ui/AeroElements.tsx`: o elemento das linhas 125 e 164, e os 6 ícones das linhas 287 a 342. Se o elemento já tem `className`, juntar (`className="... motion-ambient"`).
   - `app/not-found.tsx`: os elementos das linhas 91, 105, 120, 158 e 194.
5. **Não** marcar como ambiente o `corruptedPulse` (`app/posts/PostsClient.tsx:98,165`), o `pulse` e o `gradientShift` (`app/playlists/PlaylistsClient.tsx`): animam opacidade, cor ou fundo, não posição.

## Boundaries

- Do NOT remover nem alterar nenhuma animação para quem **não** pede movimento reduzido. O visual padrão fica idêntico.
- Do NOT tocar nos hovers com `onMouseEnter` (deslocamento de 2px, disparado pelo usuário): é o plano 004.
- Do NOT adicionar dependência (`MotionConfig` já vem no `motion`).
- If algum dos números de linha citados não tiver uma `animation` inline, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run lint`, `npm test` e `npm run build` verdes.
- **Feel check** (DevTools > Rendering > "Emulate CSS media feature prefers-reduced-motion"):
  - **com `no-preference`**: home, um post e o 404 idênticos ao `main` (orbes flutuando, ícones pulando, sino balançando, zoom do hero).
  - **com `reduce`**: orbes, bolhas e ícones parados; o sino da sidebar parado; o hero do post aparece sem zoom; o modal do newsletter continua aparecendo com fade (opacidade fica).
  - O glitch do 404 para de tremer, mas o texto continua legível.
- **Done when**: com `reduce`, nenhum elemento da home, do post e do 404 muda de posição sozinho.
