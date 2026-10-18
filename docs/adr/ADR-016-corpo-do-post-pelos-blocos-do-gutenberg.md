# ADR-016 — O corpo do post vem dos blocos do Gutenberg, pelo plugin WPGraphQL Content Blocks

**Status:** Accepted  
**Date:** 2026-10-18  
**Issue:** #84

---

## Contexto

O corpo do post perdia toda a estrutura que o editor salva: o adaptador apagava todas as tags (`stripHtml`) e a página quebrava o texto em parágrafos nas linhas em branco. Título, imagem, link, lista, citação e código viravam texto corrido ou sumiam. Não aparecia porque os 6 posts de exemplo só tinham parágrafo, mas o primeiro post de verdade com uma imagem ou um link quebraria. O índice lateral dependia de um repeater do ACF (`postSections`) que estava vazio em todos os posts.

O ADR-013 já decidiu preferir os blocos do Gutenberg ao ACF. Faltava escolher **como** ler os blocos.

## Decisão

**Ler os blocos pelo plugin WPGraphQL Content Blocks (`editorBlocks`), e renderizar cada tipo de bloco com um componente próprio.**

- **Plugin:** versão 4.8.6, da WP Engine (a mesma que mantém o WPGraphQL), GPL-2.0. Ele **não está no diretório do wordpress.org**: é instalado pelo zip fixo da release do GitHub. O hash SHA-256 do zip validado é `e0f8c4b9a98d6d4e7b8dcce856ca80f64744e3e15495042bd33a42059df102ec`.
- **Validação antes de instalar em produção:** o autor testou o plugin só até o WPGraphQL 2.1.1 e o site usa o 2.13.0. Por isso a combinação foi provada num WordPress descartável no Docker, com as versões de produção (WPGraphQL 2.13.0, ACF 6.8.2, WPGraphQL for ACF 2.6.0 e o plugin próprio), antes de qualquer mudança no servidor. O teste live `getPostBlocks` repete essa prova contra o WordPress que estiver configurado.
- **Seções:** cada `core/heading` de nível 2 abre uma seção, que mantém o visual numerado que o post já tinha. O texto antes do primeiro título vira uma seção "intro" sem título. O índice lateral é gerado desses títulos e substitui o repeater `postSections`.
- **Componentes:** `core/paragraph`, `core/heading` (níveis 3 a 6), `core/image`, `core/list` e `core/list-item`, `core/quote`, `core/code`, `core/embed` e `core/separator`. Um bloco desconhecido, ou HTML cru, usa um fallback que mantém a estrutura depois de passar por uma lista de permissões.
- **Segurança:** todo HTML de autor passa por `sanitize-html` com lista de permissões (sem script, iframe, estilo, formulário ou atributo de evento; só links `http`, `https` e `mailto`, com `rel="noopener noreferrer"`). O código é decodificado para texto puro e nunca vira HTML. Imagem de um host que o `next.config.ts` não conhece é exibida sem otimização, em vez de derrubar a página.
- **Embeds** aparecem como um link com o nome do provedor, e não como o iframe dele: nenhum script ou cookie de terceiro carrega só porque o post tem um vídeo.
- **Consulta separada:** os blocos vêm de uma consulta própria. Se só ela falhar (por exemplo, o plugin não está instalado), a página mostra o texto simples e registra o erro com `console.error`. Uma queda do WordPress continua derrubando a página, porque a consulta do post vem antes.

## Alternativas consideradas

**Ler o HTML renderizado (`content`) e mapear as tags para componentes.** Descartada como caminho principal (como no ADR-013): perde os atributos dos blocos e depende de interpretar HTML. Continua sendo a base do fallback de texto simples.

**Um parser próprio da serialização de blocos.** Descartada: exigiria expor o conteúdo bruto do post, que por padrão só sai para um usuário autenticado, e é código para manter.

**Embeds como iframe.** Descartada por ora: carrega código de terceiros sem decisão explícita. Pode vir depois.

## Custo aceito

- É **código de terceiros instalado fora do diretório oficial**. Nenhuma atualização automática o alcança, então uma atualização do WPGraphQL pode quebrar a combinação sem aviso. O teste live `getPostBlocks` existe para pegar isso, e vale rodá-lo depois de atualizar o WPGraphQL.
- O plugin não se instala pelo slug. O `setup.sh` do `blog-cms` o instala pelo mesmo zip fixo, conferindo o hash antes (ADR-008 do `blog-cms`), então quem recriar o WordPress do zero o recebe.
- Cada tipo de bloco novo que o autor passar a usar precisa de um componente, ou cai no fallback.

## Relação com outras decisões

Cumpre o **ADR-013** (blocos no lugar do ACF) e deprecia o repeater `postSections`. O ADR-008 (formato do ACF 2.x) continua valendo para os campos que ainda existem.
