# 004: O "levantar" neobrutalista numa classe só, com clique que afunda

- **Status**: DONE
- **Commit**: 2993ef8
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens, Physicality
- **Estimated scope**: 1 CSS, 4 componentes da home
- **Issue**: #92 (item 4)
- **Depends on**: 001 (tokens `--ease-out`, `--duration-press`, `--duration-hover`)

## Problem

O hover assinatura do blog (o bloco sobe 2px e a sombra dura cresce) está copiado à mão em cerca de 20 lugares, com `onMouseEnter`/`onMouseLeave` escrevendo `style` via JS:

```tsx
// components/content/SideContent.tsx:32-47: current
style={{
  border: "2px solid var(--arm-border)",
  backgroundColor: i % 2 === 0 ? "var(--arm-bg)" : "var(--arm-bg-card)",
  boxShadow: "2px 2px 0 var(--arm-shadow)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translate(-2px, -2px)";
  e.currentTarget.style.boxShadow = "4px 4px 0 var(--arm-shadow)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translate(0, 0)";
  e.currentTarget.style.boxShadow = "2px 2px 0 var(--arm-shadow)";
}}
```

Três problemas:
- **Toque:** no celular, o toque dispara `onMouseEnter` e o bloco fica levantado até tocar em outro lugar. O hover não é restrito a dispositivos com mouse.
- **Clique sem resposta:** nenhum desses elementos tem estado `:active`. A linguagem neobrutalista pede o inverso do hover: o bloco **afunda** e a sombra colapsa, como botão físico.
- **Cópia:** 20 cópias com tamanhos e cores diferentes de sombra, nenhuma com os tokens.

## Target

Uma classe `.brutal-lift`, configurada por variáveis CSS no próprio elemento:

| Variável | Papel | Padrão |
|---|---|---|
| `--lift-color` | cor da sombra | `var(--arm-shadow)` |
| `--lift-rest` | sombra em repouso | `2px` |
| `--lift-hover` | sombra no hover | `4px` |

No fim de `styles/theme.css`:

```css
/* Neobrutalist lift: hover raises the block and grows its hard shadow; press sinks it
   and collapses the shadow, like a physical key. Hover only on devices that really hover,
   so a tap on a phone never leaves the block stuck up. */
.brutal-lift {
  --lift-color: var(--arm-shadow);
  --lift-rest: 2px;
  --lift-hover: 4px;
  box-shadow: var(--lift-rest) var(--lift-rest) 0 var(--lift-color);
  transition:
    transform var(--duration-hover) var(--ease-out),
    box-shadow var(--duration-hover) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .brutal-lift:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--lift-hover) var(--lift-hover) 0 var(--lift-color);
  }
}

.brutal-lift:active {
  transform: translate(1px, 1px);
  box-shadow: max(0px, calc(var(--lift-rest) - 1px)) max(0px, calc(var(--lift-rest) - 1px)) 0
    var(--lift-color);
  transition-duration: var(--duration-press);
}
```

Uso: o componente perde `boxShadow`, `transition`, `onMouseEnter` e `onMouseLeave`, ganha `className="... brutal-lift"` e declara as variáveis quando difere do padrão:

```tsx
style={{
  border: "3px solid var(--chrome-blue)",
  "--lift-color": "var(--chrome-blue)",
  "--lift-rest": "3px",
  "--lift-hover": "5px",
} as React.CSSProperties}
```

## Repo conventions to follow

- O exemplo de clique que afunda já existe: `components/ui/ScrollToTop.tsx:37-38` (`whileHover={{ y: -2, ... }}`, `whileTap={{ y: 1, boxShadow: "1px 1px 0 var(--arm-shadow)" }}`).
- Tokens de movimento: `--ease-out`, `--duration-hover`, `--duration-press` (plano 001).
- Estilos inline com `style={{...}}` são o padrão do projeto; a classe só substitui o que é movimento.

## Steps

Nesta leva, só a home. Cada item: remover `boxShadow`, `transition`, `onMouseEnter` e `onMouseLeave` do elemento, e acrescentar `brutal-lift` e as variáveis.

1. Em `styles/theme.css`, acrescentar o CSS do Target no fim do arquivo.
2. `components/content/SideContent.tsx:32-47` (cada recomendação): padrão, sem variáveis (`--arm-shadow`, 2px, 4px).
3. `components/content/FeaturedPost.tsx:138-153` ("Ler Manifesto") e `:156-172` ("Ver Galeria"): `--lift-color: var(--chrome-blue)`, `--lift-rest: 3px`, `--lift-hover: 5px`.
4. `components/ui/WarningDialog.tsx:14-28` (o `GlassCard`): `--lift-rest: 4px`, `--lift-hover: 6px`. O `GlassCard` repassa `className` e junta o `style` por cima de um `boxShadow` inline próprio (`components/ui/GlassCard.tsx:23-29`). Estilo inline ganha da classe, então **não basta apagar** o `boxShadow` do `WarningDialog`: passe `boxShadow: undefined` no `style`, com o comentário `// let .brutal-lift own the shadow (GlassCard sets an inline default)`, para anular o padrão do `GlassCard`.
5. `components/content/PostsGrid.tsx:78-96` (cada card): hoje a sombra em repouso é `none` e no hover é `4px 4px 0 rgba(0,0,0,0.5)` (ou `#ff0000` no post corrompido). Usar `--lift-rest: 0px`, `--lift-hover: 4px`, `--lift-color: rgba(0,0,0,0.5)` ou `#ff0000` quando `post.isCorrupted`. Manter a `animation: corruptedPulse` inline.

## Boundaries

- Do NOT mudar cor, borda, tamanho de sombra em repouso ou no hover: o hover no desktop tem que ficar **idêntico** ao atual.
- Do NOT migrar os outros arquivos com o mesmo padrão (`LoginCard`, `ProfileForm`, `CategoryClient`, `SubcategoryClient`, `PostsClient`, `PlaylistsClient`, `SobreClient`, `NowPlaying`, `PostCommentsSection`, `not-found`, `CommentsSection`): ficam para uma segunda leva.
- Do NOT tocar nos hovers que só trocam cor (Header, Footer, Sidebar, GlassCard).
- Do NOT adicionar dependência.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run lint`, `npm test` e `npm run build` verdes.
- **Feel check** na home:
  - **Desktop, hover:** cada elemento sobe 2px e a sombra cresce exatamente como no `main` (comparar lado a lado).
  - **Clique:** ao segurar o botão do mouse, o bloco desce 1px e a sombra quase some; ao soltar, volta. O afundar é mais rápido (100ms) que o levantar (160ms).
  - **Celular** (DevTools, modo dispositivo com toque, ou aparelho real): tocar num card da grade não deixa ele levantado.
  - **Câmera lenta** (DevTools > Animations, 10%): o levantar começa rápido e desacelera (ease-out), sem "arrancar" devagar.
  - Post corrompido continua pulsando em vermelho, com sombra vermelha no hover.
- **Done when**: os 4 componentes da home não têm mais `onMouseEnter` de levantar, e o hover no desktop é idêntico.
