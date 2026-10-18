# ADR-013 — Evitar o ACF no WordPress headless e preferir os blocos do Gutenberg

**Status:** Accepted  
**Date:** 2026-10-18

---

## Contexto

Este blog nasceu usando o ACF (Advanced Custom Fields) como a forma de dar estrutura ao conteúdo: o plugin do `blog-cms` registra um grupo de campos para o post (`heroImage`, `readingTime`, `isFeatured`, `subtitle`, `postSections`) e o front lê esses campos pelo WPGraphQL for ACF. Na época, era o único jeito de WordPress headless que o autor conhecia. Depois, trabalhando em outro projeto com WordPress headless, ele viu que o próprio editor de blocos (Gutenberg) é bem mais dinâmico e flexível como modelo de conteúdo, e passou a querer evitar o ACF aqui.

O repositório já dá sinais de que o ACF custa caro neste projeto. O ADR-008 existe porque uma atualização do plugin WPGraphQL for ACF para a versão 2.x mudou o formato dos campos de imagem e quebrou todas as consultas de uma vez. O ADR-010 já tinha deixado o ACF de fora do perfil de usuário, registrando os campos com `register_graphql_field`, porque a escrita de meta via ACF dependia demais da versão do plugin. E o `postSections`, que alimenta o índice lateral do post, está nulo em todos os posts publicados: o corpo do post hoje é o HTML do editor com as tags apagadas (`stripHtml`), e a estrutura que o editor já salva é jogada fora (#84).

## Decisão

**Não criar novos campos ACF, e migrar aos poucos os que existem para o modelo nativo do WordPress.** A estrutura do conteúdo passa a vir dos blocos do Gutenberg, lidos no front pelo formato de blocos (`editorBlocks`, via plugin WPGraphQL Content Blocks, ou parser de blocos; a escolha entre as duas vias é da #84). Cada tipo de bloco vira um componente do front, e um índice lateral, por exemplo, é montado a partir dos blocos de título do próprio corpo, sem um repetidor `postSections` preenchido à mão.

Para o que hoje o ACF faz e os blocos não cobrem, a ordem de preferência é: o recurso nativo do WordPress primeiro (imagem destacada no lugar de `heroImage`, resumo no lugar de `subtitle`, tempo de leitura calculado no front a partir do texto), e só depois metadado próprio registrado em PHP com `register_post_meta` e `register_graphql_field` no plugin do `blog-cms`, como o ADR-010 já fez. A forma de marcar o post em destaque (`isFeatured`) fica para ser decidida na migração: posts fixos nativos do WordPress são a primeira opção a verificar. O ACF só volta a ser considerado se houver um campo que realmente não caiba em nenhuma dessas saídas, e isso precisa ser registrado aqui.

Isto não manda apagar o ACF agora. Os campos atuais continuam funcionando enquanto a migração não acontece, e nenhuma rota deve quebrar por causa desta decisão.

## Alternativas consideradas

A alternativa descartada é manter o ACF como o modelo principal do conteúdo, do jeito que o projeto já está. Foi descartada porque o conteúdo estruturado fica preso a um plugin e à versão dele (o ADR-008 foi exatamente esse custo), porque cada campo novo exige um grupo de campos para criar, versionar em JSON e consultar, e porque o editor de blocos já guarda a estrutura que o projeto hoje apaga e tenta recriar à mão.

Também foi descartada a versão intermediária de usar blocos criados com o ACF (ACF Blocks): ela mantém a dependência do plugin e só muda onde o campo aparece.

Ler o HTML cru do corpo do post e interpretá-lo no front foi descartado como caminho principal, porque perde a hierarquia e os atributos dos blocos, que são justamente o ganho. Ele continua possível como parte da leitura dos blocos (#84).

## Custo aceito

Trocar de plugin não é eliminar plugin: ler os blocos pelo GraphQL depende do WPGraphQL Content Blocks (ou de um parser nosso, que é código para manter), então a dependência de terceiros muda de lugar, não some. Cada tipo de bloco que o autor usar no editor precisa de um componente no front, e um bloco sem componente não aparece, o que exige uma regra clara para o bloco desconhecido. Os campos nativos são menos "preenchíveis" pelo painel do que um grupo de campos do ACF, e o metadado que sobrar passa a exigir um pouco de PHP no plugin em vez de cliques. Os seis posts publicados só têm parágrafos simples (#84), então precisam ser revisados em blocos para aproveitar o modelo novo. E enquanto a migração não termina, o projeto convive com dois modelos ao mesmo tempo, o que é mais difícil de explicar do que qualquer um dos dois sozinho.

## Relação com outras decisões

O **ADR-008** (formato de conexão dos campos de imagem do ACF 2.x) continua correto enquanto houver campo ACF em uso, e passa a `Deprecated` quando o último for migrado. O **ADR-003** e o **ADR-006** citam o ACF como parte do desenho e valem no resto; só o trecho sobre o ACF fica superado por este. No repositório `blog-cms`, o **ADR-005** (grupos do ACF versionados em JSON dentro do plugin) tem a mesma situação. O **ADR-010** já seguia o que este ADR decide. A implementação da leitura dos blocos é a **#84**, e o ADR-013 é o motivo de ela ser prioridade para o modelo de conteúdo do blog.
