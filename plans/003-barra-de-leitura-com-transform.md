# 003: Barra de leitura presa à rolagem, com `transform`

- **Status**: DONE
- **Commit**: 2993ef8
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 arquivo, cerca de 30 linhas
- **Issue**: #92 (item 2)
- **Depends on**: nenhum

## Problem

`components/content/single-post/ReadingProgress.tsx` anima `width` a cada evento de rolagem, com transição, listener sem `passive` e um `setState` por evento:

```tsx
// components/content/single-post/ReadingProgress.tsx:8-16: current
useEffect(() => {
  const el = document.getElementById("main-scroll-container");
  if (!el) return;
  const handleScroll = () => {
    const scrollHeight = el.scrollHeight - el.clientHeight;
    setProgress(scrollHeight > 0 ? Math.min((el.scrollTop / scrollHeight) * 100, 100) : 0);
  };
  el.addEventListener("scroll", handleScroll);
  return () => el.removeEventListener("scroll", handleScroll);
}, []);

// components/content/single-post/ReadingProgress.tsx:21-28: current
<div
  style={{
    height: "100%",
    width: `${progress}%`,
    background: "linear-gradient(90deg, var(--chrome-green), #80b0ff, #c084fc)",
    transition: "width 0.15s ease-out",
    boxShadow: "0 0 8px rgba(52,211,153,0.4)",
  }}
/>
```

Três custos, durante toda a leitura de um post:
- `width` força layout e pintura a cada quadro.
- A transição de 150ms faz a barra **correr atrás** da rolagem: movimento ligado à rolagem precisa ser 1:1.
- O `setState` re-renderiza o componente a cada evento de rolagem.

## Target

A barra ocupa 100% da largura e escala no eixo X, a partir da esquerda, escrita direto no DOM uma vez por quadro:

```tsx
"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById("main-scroll-container");
    const bar = barRef.current;
    if (!el || !bar) return;

    // Scroll-linked motion must track the scroll 1:1: no transition, at most one write per frame.
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.min(el.scrollTop / max, 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full" style={{ height: "4px", backgroundColor: "#022a6e" }}>
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "100%",
          transform: "scaleX(0)",
          transformOrigin: "left",
          background: "linear-gradient(90deg, var(--chrome-green), #80b0ff, #c084fc)",
          boxShadow: "0 0 8px rgba(52,211,153,0.4)",
        }}
      />
    </div>
  );
}
```

## Repo conventions to follow

- O container de rolagem é `#main-scroll-container`, não `window` (PITFALL-004, `docs/pitfalls/README.md`).
- Listener `passive` já é usado em `components/ui/ScrollToTop.tsx:14`.

## Steps

1. Substituir o conteúdo de `components/content/single-post/ReadingProgress.tsx` pelo código do Target.
2. Conferir que o componente continua exportado com o mesmo nome (`ReadingProgress`) e que `components/content/single-post/index.ts` não precisa mudar.

## Boundaries

- Do NOT mudar cores, altura, gradiente, sombra ou posição da barra.
- Do NOT trocar para `animation-timeline: scroll()`: o suporte ainda não é universal.
- Do NOT tocar em `ScrollToTop.tsx`.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run lint`, `npm test` e `npm run build` verdes.
- **Feel check** num post longo:
  - A barra acompanha a rolagem **sem atraso**: rolar rápido e parar de uma vez, e a barra para junto, sem "alcançar" depois.
  - No topo, a barra está vazia. No fim, cheia.
  - DevTools > Performance, gravando uma rolagem: sem "Layout" disparado pela barra a cada quadro.
  - React DevTools > Profiler: o `ReadingProgress` não re-renderiza durante a rolagem.
  - O brilho (`box-shadow`) na ponta da barra fica mais estreito no começo da leitura, porque escala junto. Conferir se isso incomoda; se incomodar, reportar em vez de improvisar.
- **Done when**: a barra usa `transform`, não tem `transition`, não tem `useState`, e o listener é `passive`.
