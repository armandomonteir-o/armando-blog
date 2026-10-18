# ADR-019 — Repositório público para consulta, sem licença aberta

**Status:** Accepted  
**Date:** 2026-10-18  
**Issue:** #128

---

## Contexto

O repositório é público para servir de portfólio: quem avalia o projeto precisa ler o código, as decisões e o histórico. Ele nasceu com a licença MIT e com sugestões de `CONTRIBUTING.md` e `SECURITY.md` "para recrutadores". Mas o projeto não é open source: o autor não quer que o código, o design nem o texto sejam copiados, e não pretende receber contribuição externa.

A licença MIT contradizia isso (qualquer pessoa pode copiar, modificar e vender), e um `CONTRIBUTING.md` na raiz é mostrado pelo GitHub a quem abre issue ou PR, como um convite.

## Decisão

- **`LICENSE`: todos os direitos reservados.** Permite ler e ver o repositório no GitHub e os direitos que os Termos de Serviço do GitHub dão a qualquer usuário de repositório público (ver e fazer fork dentro do GitHub). Nada além disso. O `package.json` passa a `"license": "UNLICENSED"`.
- **`CONTRIBUTING.md` vira `docs/DEVELOPMENT.md`**, com um aviso no topo de que o repositório não aceita contribuição externa. O conteúdo (branch, commit, verificações, como tratar uma PR do Dependabot) continua valendo como documentação do fluxo do autor.
- **`SECURITY.md` continua fazendo sentido** (alguém precisa saber onde reportar uma falha) e segue na #128, sem a parte de contribuição.

## Consequências

### Positivo
- A licença diz o que o autor quer, e o repositório não convida a contribuir.
- O fluxo de trabalho continua documentado, o que mostra processo a quem avalia.

### Negativo
- Ninguém pode reaproveitar o código, nem para aprender copiando um trecho, sem pedir. Portfólio mais fechado ganha menos "estrelas" e reuso.
- As versões já publicadas sob a MIT continuam MIT para quem as obteve: não dá para retirar uma licença já concedida. O `LICENSE` diz isso.
- O GitHub continua permitindo fork de repositório público, pelos próprios Termos de Serviço; só tornar o repositório privado impede isso.

## Alternativas consideradas

| Opção | Por que não |
|---|---|
| Manter a MIT | Contradiz o objetivo: qualquer um poderia copiar e vender |
| Licença de código visível (como a PolyForm Noncommercial ou a Business Source License) | Dá permissões que o autor não quis dar; melhor reservar tudo e abrir exceção por pedido |
| Tornar o repositório privado | Perde o objetivo de portfólio público |
