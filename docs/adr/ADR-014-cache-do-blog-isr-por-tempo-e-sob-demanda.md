# ADR-014 — Cache do blog: ISR por tempo mais revalidação sob demanda

**Status:** Accepted  
**Date:** 2026-10-18  
**Issue:** #68

---

## Contexto

Até aqui a home e a lista de posts eram geradas uma vez, no build, e ficavam congeladas até o deploy seguinte: um post novo só aparecia depois de publicar o site de novo. A rota de um post fazia o contrário e ia ao WordPress a cada visita, com 1 a 4 segundos de resposta medidos.

Ao mesmo tempo, a remoção do fallback para posts de mentira (#66, #67, #70) tornou o build dependente de o WordPress estar de pé, e o CI passou a buildar contra o WordPress real. Um build do CI quebrou com `ETIMEDOUT` ao buscar a Hostinger a partir do servidor do GitHub, e o mesmo comando passou na segunda tentativa: foi uma oscilação de rede, mas mostrou que um solavanco de segundos podia derrubar um build inteiro.

O Armando queria que "só a página que mudou fosse atualizada quando ela muda". Isso é a revalidação sob demanda, que é diferente do ISR por tempo, e a decisão precisou separar os dois.

## Decisão

Usar as duas formas, em três etapas independentes.

**Primeira etapa (esta):** a home, a lista de posts e a rota de post passam a ser regeneradas em segundo plano, no máximo uma vez por hora (`revalidate = 3600`). A rota de post pré-gera os posts que o WordPress já tem (`generateStaticParams`) e deixa um post publicado depois para ser gerado na primeira visita, e depois cacheado como os demais. As consultas de leitura ao WordPress passam a repetir até três vezes, com espera crescente, mas só diante de falha de rede passageira (`ETIMEDOUT`, `ECONNRESET`, falha de DNS) e de erro 5xx. Um erro 4xx ou de GraphQL não é repetido, porque repetir não o conserta. As escritas, como criar um comentário, nunca são repetidas, porque repetir poderia gravar duas vezes.

**Segunda etapa:** uma rota `/api/revalidate`, protegida por um segredo, que refaz a home, a lista e o post que mudou.

**Terceira etapa:** um gancho no plugin do WordPress que chama essa rota quando um post ou um comentário muda.

O atraso aceito no pior caso, se o aviso do WordPress não chegar, é de uma hora. Esse é o teto que o tempo garante.

## Alternativas consideradas

A primeira alternativa descartada foi usar só o ISR por tempo. É simples, mas quem escreve publica e só vê o post depois do prazo, o que parece quebrado. Ele fica como a rede de segurança, não como o caminho normal.

A segunda foi usar só a revalidação sob demanda. Ela falha em silêncio: se o aviso do WordPress falhar por rede, segredo errado ou plugin desativado, o site fica velho para sempre e nenhum erro aparece. Sem um prazo atrás dela não há teto para o pior caso.

A terceira foi deixar tudo dinâmico, sem cache. Fica sempre atualizado, mas toda visita espera o WordPress, e se ele estiver fora do ar todo visitante vê erro. Com o cache, a última versão boa continua sendo servida.

A quarta, e a mais relevante para o futuro, foi adotar o Cache Components do Next 16 (`cacheComponents: true`, com `"use cache"`, `cacheLife` e `cacheTag`). Foi descartada por ora porque exige fronteiras de carregamento (Suspense) onde há leitura de dado de requisição, e o layout do blog lê a sessão do login. É uma reorganização grande para um benefício que a revalidação sob demanda já entrega. Vale reavaliar quando o resto estiver pronto.

## Custo aceito

Há mais uma peça para manter: na segunda e na terceira etapas, um segredo precisa existir em dois lugares, na Vercel e no WordPress. O aviso do WordPress pode falhar sem barulho, e o custo disso é aceitar até uma hora de atraso nesse caso raro.

O 404 de um endereço que não existe pode ou não ficar em cache, e isso depende de onde se mede. Num servidor de produção local (`next start`) a resposta 404 vem com a mesma regra de uma hora (`s-maxage=3600`). Na Vercel, o 404 de um endereço novo respondeu `x-vercel-cache: MISS` duas vezes seguidas, ou seja, não ficou preso no cache dela. A primeira medida foi lida como se valesse para a Vercel, e não vale; a que vale é a segunda. Mesmo assim, a revalidação sob demanda refaz o endereço do post novo no momento em que ele é publicado, então o resultado é o mesmo.

A tentativa repetida alonga o build quando o WordPress está lento. O limite de três tentativas existe para que ela não vire espera infinita, e um WordPress que continua fora do ar depois delas ainda derruba o build, de propósito: o deploy anterior continua no ar e o erro fica visível, em vez de um site congelado com conteúdo falso.

Por fim, a revalidação precisa ser um número literal em cada arquivo de rota, porque o Next o lê de forma estática e não aceita importá-lo de um lugar só. Um teste (`app/cache-config.test.ts`) garante que os três valores não se separem.

## Relação com outras decisões

Esta decisão é consequência de #66, #67 e #70, que tiraram o fallback de mock e tornaram o build dependente do WordPress. Ela não contradiz nenhum ADR existente. O ADR-013 (evitar o ACF) é independente: nada aqui depende de como o conteúdo é modelado no WordPress. As rotas `/categoria/*` ainda são mock e entram no mesmo cache quando virarem dado real (#73).

## Estado das etapas

As três etapas estão feitas e foram verificadas de ponta a ponta em produção em 18/10/2026: a rota `/api/revalidate` no site, o gancho no plugin do `blog-cms` e o segredo nos dois lados. Com um post de teste (criado e apagado pelo próprio teste), a lista `/posts` passou a mostrá-lo em 1,3 s, o slug antigo virou 404 em 0,9 s depois de um renome, o post sumiu em 2,2 s depois de ir para a lixeira, e um comentário aprovado apareceu na página do post em 2,1 s e na home em 2,8 s. Sem o gancho, cada uma dessas páginas estáticas teria esperado até uma hora. O teste não prova sozinho que um post novo aparece (o endereço, que não está em cache, também apareceria por conta própria); o que prova o gancho são a lista, o renome, a lixeira e os comentários.
