# Planos de animação

Planos autocontidos da auditoria de animações (issue #92), no formato da skill `improve-animations`: cada plano traz o código atual, o valor exato de destino, os limites e como conferir a sensação. O status fica no topo de cada plano.

| # | Plano | Gravidade | Depende de |
|---|---|---|---|
| 001 | [Tokens de movimento](001-tokens-de-movimento.md) | LOW | nada |
| 002 | [Movimento reduzido](002-movimento-reduzido.md) | MEDIUM | nada |
| 003 | [Barra de leitura com transform](003-barra-de-leitura-com-transform.md) | HIGH | nada |
| 004 | [Levantar neobrutalista](004-levantar-neobrutalista.md) | MEDIUM | 001 |

**Ordem recomendada:** 001, 002, 003 e 004. Um PR por plano.

**Fora desta leva** (ver o comentário da auditoria na #92): a sidebar que redimensiona a página no hover (precisa de aprovação visual), a gaveta mobile, o escalonamento da categoria, os `transition-all`, o `scale: 0` do sucesso, o `ScrollToTop` e a segunda leva do plano 004.
