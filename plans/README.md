# Planos de animação

Planos autocontidos da auditoria de animações (issue #92), no formato da skill `improve-animations`: cada plano traz o código atual, o valor exato de destino, os limites e como conferir a sensação. O status fica no topo de cada plano.

| # | Plano | Gravidade | Depende de |
|---|---|---|---|
| 001 | [Tokens de movimento](001-tokens-de-movimento.md) | LOW | nada |
| 002 | [Movimento reduzido](002-movimento-reduzido.md) | MEDIUM | nada |
| 003 | [Barra de leitura com transform](003-barra-de-leitura-com-transform.md) | HIGH | nada |
| 004 | [Levantar neobrutalista](004-levantar-neobrutalista.md) | MEDIUM | 001 |
| 005 | [Escalonamento da categoria](005-escalonamento-da-categoria.md) | MEDIUM | nada |
| 006 | [transition-all](006-transition-all.md) | LOW | nada |
| 007 | [Entradas pequenas demais](007-entradas-pequenas-demais.md) | LOW | nada |
| 008 | [Gaveta mobile](008-gaveta-mobile.md) | MEDIUM | 001 |
| 009 | [Levantar, segunda leva](009-levantar-segunda-leva.md) | MEDIUM | 004 |

**Ordem recomendada:** 001 a 004 (primeira leva), depois 005 a 009. Um PR por plano. Os planos 005 a 009 foram escritos junto com a execução, no mesmo PR.

**Ainda fora** (ver o comentário da auditoria na #92): a sidebar que redimensiona a página no hover (item 3), que precisa de aprovação visual.
