# ADR-015 — As categorias existem no WordPress, o visual delas fica no código

**Status:** Accepted  
**Date:** 2026-10-18  
**Issue:** #73

---

## Contexto

`/categoria/[category]` e `/categoria/[category]/[subcategory]` liam `data/categories.ts`: 6 categorias e 24 subcategorias inventadas, contadores inventados e uma página de subcategoria que **gerava posts falsos** (todos com link para o mesmo post). O WordPress tinha outra árvore (6 categorias sem subcategorias) e nenhuma das duas batia com a outra.

O dono não vai usar a maior parte dessas categorias e prefere criá-las aos poucos, conforme posta. Mas o visual de cada categoria (cor, imagem, ícone, tags) é decisão de design, e não pertence ao WordPress (ADR-013 evita criar campos ACF para isso).

## Decisão

**O WordPress decide quais categorias existem, como se chamam e quantos posts têm. O `data/categories.ts` passa a ser só personalização visual, opcional.**

- As páginas leem a árvore do WordPress (`getCategories`) e os posts por categoria (`getCategoryPosts`), com ISR de 1 hora e revalidação sob demanda (ADR-014).
- `lib/categories.ts` junta as duas coisas. Categoria sem visual desenhado usa `DEFAULT_CATEGORY_STYLE`, que reaproveita as cores de `livros` e a imagem de fallback dos posts (nenhum hex nem imagem novos).
- Uma categoria é **conhecida** se o WordPress a tem ou se o `data/categories.ts` a desenhou. O menu lateral e o rodapé continuam com a lista fixa (Músicas, Filmes, Livros...), então as desenhadas que ainda não existem no WordPress abrem uma **página vazia honesta**, não um 404. Um slug que nenhum dos dois conhece é 404.
- A contagem de uma categoria principal soma as das filhas, porque o WordPress só conta posts diretos e devolve `null` quando não há nenhum.

## Alternativas consideradas

**Criar a árvore inteira e um grupo ACF de categoria no WordPress.** Descartada: são 24 subcategorias que não serão usadas, vai contra o ADR-013 e prende o visual a um plugin.

**Manter o mock e só trocar os posts.** Descartada: os contadores e a lista de subcategorias continuariam inventados.

**Tirar do menu o que não existe no WordPress.** Descartada por ora: muda o visual da navegação e depende de aprovação. Fica como possível passo futuro.

## Custo aceito

Mudar a **aparência** de uma categoria ainda exige deploy (é código). Criar a categoria, não: ela aparece sozinha em até 1 hora, ou em segundos pelo aviso de revalidação. A lista de categorias desenhadas mas inexistentes cria páginas vazias que não levam a lugar nenhum até o dono postar nelas.

## Relação com outras decisões

Depende do **ADR-014** (ISR e revalidação: `/api/revalidate` passou a atualizar também as páginas de categoria) e do **ADR-013** (sem ACF para visual). Fecha a parte de categorias do **ADR-006**, que ainda falava de fallback para mock.
