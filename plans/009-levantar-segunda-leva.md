# 009: Segunda leva do levantar neobrutalista

- **Status**: DONE
- **Commit**: 2993ef8
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens, Physicality
- **Estimated scope**: 1 CSS, 8 componentes, 11 elementos
- **Issue**: #92 (item 4, continuação do plano 004)
- **Depends on**: 004 (`.brutal-lift`)

## Problem

Depois do plano 004, o levantar escrito à mão com `onMouseEnter`/`onMouseLeave` continua fora da home, com três variações que a classe ainda não cobre:

- **subida de 1px** em vez de 2px (subcategoria, Spotify, NowPlaying);
- **sombra que não cresce** no hover (subcategoria: 3px em repouso e no hover);
- **botão desabilitado não levanta**: `if (!loading)`, `if (canSave)`, `if (uploadState !== "uploading")`, sempre espelhando o atributo `disabled` do próprio botão.

## Target

Na `.brutal-lift` (`styles/theme.css`):

```css
.brutal-lift {
  /* ... */
  --lift-distance: 2px;
}
@media (hover: hover) and (pointer: fine) {
  .brutal-lift:not(:disabled):hover {
    transform: translate(calc(-1 * var(--lift-distance)), calc(-1 * var(--lift-distance)));
    /* ... */
  }
}
.brutal-lift:not(:disabled):active { /* ... */ }
```

Migração, com os valores dos handlers removidos:

| Elemento | rest / hover / distance | cor |
|---|---|---|
| card da categoria | 4 / 6 / 2 | `--arm-panel-bg-deep` |
| card da subcategoria | 3 / 3 / 1 | `#022a6e` |
| botão de login | 0 / 4 / 2 | `--arm-border` |
| "escolher arquivo" | 0 / 3 / 2 | `--arm-border` |
| "salvar perfil" | 0 / 4 / 2 | `--arm-border` |
| 404, dois botões | 3 / 5 / 2 | `--arm-shadow` |
| card de `/posts` | 0 / 4 / 2 | `#022a6e` ou `#ff0000` |
| "abrir no Spotify" | 3 / 4 / 1 | `#022a6e` |
| NowPlaying, "Sim!" e play | 2 / 3 / 1 | `--arm-panel-bg-deep` |

## Repo conventions to follow

- Exemplo: `components/content/FeaturedPost.tsx`, migrado no plano 004 (`className="... brutal-lift"` e as variáveis no `style` com `as React.CSSProperties`).

## Steps

1. Acrescentar `--lift-distance` e as guardas `:not(:disabled)` na `.brutal-lift`.
2. Em cada elemento da tabela: remover `boxShadow`, `transition`, `onMouseEnter` e `onMouseLeave`; acrescentar `brutal-lift` ao `className` e as variáveis ao `style`.
3. No 404, apagar o objeto `buttonHover`, que deixa de ter uso.

## Boundaries

- **Fora de propósito:**
  - `LoginCard.tsx`, o card inteiro: a sombra é composta (sombra dura, brilho e reflexo interno) e não cabe na classe.
  - `SobreClient.tsx:773`: o elemento é `motion.div`, e o Motion escreve `transform` inline, que ganharia do hover da classe.
  - `CommentsSection.tsx:218` e `PostCommentsSection.tsx:185`: cards não clicáveis (`cursor: default`); o clique que afunda sugeriria uma ação que não existe.
  - `PlaylistsClient.tsx:97`: o estado `isHovered` do card de playlist também controla a borda, o disco girando e o equalizador; não é só o levantar.
  - `PlaylistsClient.tsx:64`: é o estado "ativo" do chip de gênero, não hover.
- Do NOT mudar cor, borda ou os tamanhos de sombra da tabela.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npm run lint` e `npm run build` verdes.
- **Feel check**: passar o mouse e segurar o clique em cada elemento; conferir que o hover é o de antes e que o clique afunda; conferir que "salvar perfil" desabilitado não se mexe.
- **Done when**: `grep -rn "translate(-" app components` só encontra os lugares fora de propósito, keyframes e centralizações (`translate(-50%, -50%)`).
