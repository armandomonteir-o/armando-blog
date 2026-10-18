# Como trabalhar neste repositório

> Este repositório é público para consulta e **não aceita contribuições externas** (ver a licença e o ADR-019). Este guia descreve o fluxo do próprio dono, que também vale para quem trabalha aqui por ele, e mostra como o projeto é mantido.

Leia antes: `CLAUDE.md` (regras do projeto), `docs/pitfalls/README.md` e o README. Uma issue por PR, branch `tipo/numero-slug`, commits `tipo: descrição` em português. Antes de abrir a PR: `npx tsc --noEmit`, `npm run lint`, `npm run format:check`, `npm test` e `npm run build`, e a documentação que a mudança afeta atualizada na mesma PR.

## Dependências: Dependabot e `npm audit`

O Dependabot (`.github/dependabot.yml`) abre PRs às segundas-feiras, no máximo 5 de npm:

- **minor e patch** de produção vêm numa PR só, e os de desenvolvimento em outra;
- **major** vem numa PR própria, porque pode quebrar;
- **GitHub Actions** vêm agrupadas numa PR;
- o título segue `chore(deps): ...` (`chore(deps-dev)` para desenvolvimento).

Como tratar uma PR do Dependabot:

1. Espere o CI ficar verde. Verde só vale se o `build` rodou: ele busca posts no WordPress de verdade.
2. Leia o changelog das mudanças de major e de qualquer pacote que a PR troque de versão no `next`, `next-auth` ou `graphql`. No Next, confira também `node_modules/next/dist/docs/` (AGENTS.md).
3. Rode `npm run dev` e abra a home e um post se a atualização tocar em `next`, `motion`, `tailwindcss` ou `lucide-react`. Não deve haver mudança visual.
4. Mergear. Se quebrar e não der para consertar na hora, feche a PR com um comentário dizendo por quê: o Dependabot não reabre a mesma versão.

### O passo `npm audit` do CI

- **Produção** (`npm audit --omit=dev --audit-level=high`): falha com advisory "high" ou "critical". Corrija atualizando o pacote; se o pacote vulnerável for transitivo e o dono ainda não publicou a correção, use `overrides` no `package.json` com uma PR que explique o motivo.
- **Desenvolvimento** (mesmo comando sem `--omit=dev`): só gera um aviso (`::warning`) no log, não falha. Hoje há avisos de ferramenta de lint, que não vai para produção.
- Advisory sem correção disponível bloqueia o CI. Não há lista de exceções: o `npm audit` não tem suporte nativo e criar uma exigiria script próprio. Se acontecer, resolva com `overrides`, ou troque o pacote, e registre em `docs/pitfalls/README.md`.
