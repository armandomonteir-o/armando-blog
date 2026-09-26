# 007: Nada nasce de um ponto: entradas de `scale` com piso

- **Status**: DONE
- **Commit**: 2993ef8
- **Severity**: LOW
- **Category**: Physicality & origin
- **Estimated scope**: 3 arquivos, 6 linhas
- **Issue**: #92 (itens 8 e 9)
- **Depends on**: nenhum

## Problem

Duas entradas que partem de tamanho pequeno demais:

```tsx
// components/layout/newsletter/NewsletterModal.tsx:343-344: current
initial={{ scale: 0, rotate: -30 }}
animate={{ scale: 1, rotate: 0 }}

// components/layout/newsletter/NewsletterWidget.tsx:190-191: current
initial={{ scale: 0 }}
animate={{ scale: 1 }}

// components/ui/ScrollToTop.tsx:22,24: current
initial={{ opacity: 0, y: 20, scale: 0.8 }}
exit={{ opacity: 0, y: 20, scale: 0.8 }}
```

Nada no mundo físico aparece do nada. `scale: 0` sem `opacity` faz o ícone "brotar" de um ponto visível. E 0.8 é pequeno demais para um botão que entra e sai várias vezes durante a leitura: a faixa recomendada é 0.9 a 0.97.

## Target

- **Ícones de sucesso** (momento raro, a mola fica): começar em `scale: 0.5` com `opacity: 0`.
  ```tsx
  initial={{ scale: 0.5, opacity: 0, rotate: -30 }}   // modal
  animate={{ scale: 1, opacity: 1, rotate: 0 }}
  initial={{ scale: 0.5, opacity: 0 }}                // widget
  animate={{ scale: 1, opacity: 1 }}
  ```
- **Voltar ao topo:** `scale: 0.95` no `initial` e no `exit`.

## Repo conventions to follow

- O modal do newsletter já entra certo: `NewsletterModal.tsx:81` (`scale: 0.9` com `opacity: 0`).

## Steps

1. Trocar os quatro trechos do Target, pelo conteúdo (não pelo número da linha).

## Boundaries

- Do NOT mudar a mola (`stiffness`, `damping`, `delay`) nem a duração.
- Do NOT mudar o `whileHover` e o `whileTap` do `ScrollToTop`: são o exemplo de clique neobrutalista do plano 004.

## Verification

- **Mechanical**: `npx tsc --noEmit` e `npm run lint` verdes.
- **Feel check**: assinar o newsletter da home com qualquer e-mail válido (o envio é local) e ver o ícone surgir crescendo e aparecendo junto, sem "brotar" de um ponto; rolar a página e ver o botão de voltar ao topo entrar quase no tamanho final.
- **Done when**: nenhum `scale: 0` nem `scale: 0.8` em entrada.
