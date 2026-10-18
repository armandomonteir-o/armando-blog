# ADR-018 — Limite de requisições na borda da Vercel, não no código

**Status:** Accepted (a regra está ativa em produção; falta o limite por usuário, ver "O que falta")  
**Date:** 2026-10-18  
**Issue:** #136

---

## Contexto

`/api/comments`, `/api/profile` e `/api/profile/avatar` escrevem no WordPress com a credencial de aplicação do site, e `/api/search` (#150) consulta o WordPress a cada pausa na digitação. Exigem login (menos a busca), mas não tinham limite: uma conta, ou um script, podia enviar comentários ou arquivos sem parar, ou martelar a busca contra a hospedagem compartilhada da Hostinger.

Em funções serverless a memória não é compartilhada entre instâncias, então um contador em memória não vale. Era preciso um armazenamento externo ou uma regra de borda.

O WordPress já tem proteção própria contra comentário em sequência, e todo comentário espera aprovação (`comment_moderation = 1`), o que limita o estrago de um abuso.

## Decisão

Uma **regra do firewall (WAF) da Vercel**, sem código novo e sem conta nova:

- nome `limite-api-escrita-e-busca`;
- vale quando o caminho **começa com** `/api/comments`, `/api/profile` (cobre `/api/profile/avatar`) ou `/api/search`;
- **30 requisições por 60 s por IP**, janela fixa, e acima disso a Vercel responde **429** antes de a função rodar;
- `/api/auth/*` e `/api/revalidate` ficam de fora: a segunda é chamada pelo WordPress, e um limite por IP poderia bloqueá-lo.

A regra foi criada pela API da Vercel (`PATCH /v1/security/firewall/config`, `rules.insert`) em 18/10/2026, e o JSON dela está abaixo para recriar no painel se for preciso. **Ela não está no repositório**: vive no projeto da Vercel (Firewall).

```json
{
  "name": "limite-api-escrita-e-busca",
  "active": true,
  "conditionGroup": [
    { "conditions": [{ "type": "path", "op": "pre", "value": "/api/comments" }] },
    { "conditions": [{ "type": "path", "op": "pre", "value": "/api/profile" }] },
    { "conditions": [{ "type": "path", "op": "pre", "value": "/api/search" }] }
  ],
  "action": {
    "mitigate": {
      "action": "rate_limit",
      "rateLimit": { "algo": "fixed_window", "window": 60, "limit": 30, "keys": ["ip"] }
    }
  }
}
```

**Prova em produção (18/10/2026):** 45 chamadas seguidas a `/api/search?q=lorem`: as 30 primeiras deram 200 e da 31ª em diante 429 (`x-vercel-mitigated: deny`), enquanto `/` e `/api/auth/providers` seguiram em 200.

## Consequências

### Positivo
- Sem dependência nova, sem conta nova, sem peça de infraestrutura para manter. A resposta 429 sai da borda, então um abuso nem chega a gastar função nem o WordPress.
- Custo zero no plano Hobby (1 regra de limite por projeto, 1 milhão de requisições incluídas).

### Negativo
- **É por IP, não por usuário.** Duas pessoas atrás do mesmo IP (uma rede de empresa) dividem a cota, e uma pessoa com vários IPs não é limitada junto.
- **Uma regra só no Hobby**, então o limite é o mesmo para as três rotas: apertado demais seria ruim para a busca, frouxo demais para o envio de comentário e avatar.
- **O contador é por região** da Vercel: o mesmo IP em duas regiões pode passar do limite.
- **A resposta 429 não manda `Retry-After`** (conferido com `curl -i`).
- **Não dá para provar por teste automático** (vitest): a regra roda na borda, não no código. A prova é o `curl` acima, a refazer se a regra mudar.
- **Configuração fora do Git:** se o projeto da Vercel for recriado, a regra some. O JSON acima é o plano de recuperação.

## O que falta para fechar a #136

- Limite **por usuário** (a conta do Google), com chave própria, e `Retry-After` na resposta.
- Conferir o **tipo real** do arquivo no envio de avatar (hoje há só o limite de 2 MB).
- Testes de código para esses dois pontos. Só vale a pena se aparecer abuso real, porque exigem Upstash ou o pacote `@vercel/firewall` com chave por usuário.

## Alternativas consideradas

| Opção | Por que não |
|---|---|
| Upstash Redis (ou outro KV) no código | Resolve por usuário, por rota e com teste, mas é conta nova, dependência nova e mais uma coisa para manter. Fica como o próximo passo se o abuso aparecer |
| `@vercel/firewall` (`checkRateLimit`) | Permite chave por usuário, mas conta contra a mesma regra única do Hobby e tem um único limite para todas as rotas |
| Contador em memória na função | Não funciona: cada instância serverless tem a sua memória |
| Não limitar | A busca e os envios ficam abertos a abuso contra a hospedagem compartilhada |
