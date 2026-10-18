import { describe, expect, it } from "vitest";
import lint from "@commitlint/lint";
import load from "@commitlint/load";

// #133: the commit convention in CLAUDE.md ("tipo: descrição", in Portuguese) is enforced by the
// commit-msg hook. These cases are the real shapes of the history, so a rule that would reject our
// own commits shows up here instead of on someone's machine.

type LintOptions = NonNullable<Parameters<typeof lint>[2]>;

async function check(message: string) {
  const { rules, parserPreset } = await load(
    {},
    { file: "./commitlint.config.mjs", cwd: process.cwd() }
  );
  const options: LintOptions = parserPreset
    ? { parserOpts: parserPreset.parserOpts as LintOptions["parserOpts"] }
    : {};
  return lint(message, rules, options);
}

describe("commit messages", () => {
  it.each([
    "feat: busca do cabeçalho de verdade (#150)",
    "fix: esconder por flag o sino com notificações falsas do cabeçalho (#151)",
    "docs: ADR-018 e ECOSYSTEM sobre o limite de requisições na borda (#136)",
    "chore(deps): bump the producao-minor-patch group with 5 updates",
    "chore(deps-dev): bump eslint from 9.39.4 to 10.12.0",
    "ci: smoke test da produção a cada hora, com issue se falhar (#131)",
    "refactor: lista de resultados da busca compacta, com destaque só na cor (#150)",
    "test: cobertura do FeaturedPost sem o botão da galeria",
    "style: formata o smoke test (#131)",
    "perf: imagem do destaque com preload",
    "build: atualiza o Node para 22.14",
    "revert: desfaz o limite de requisições",
  ])("accepts %s", async (message) => {
    expect((await check(message)).valid).toBe(true);
  });

  it("accepts a very long Portuguese header (the history has up to 120 characters)", async () => {
    const message =
      "fix: vitest ignora cópias do repositório em .claude/ e docs sem afirmações falsas (/sobre, Dependabot, cache)";
    expect((await check(message)).valid).toBe(true);
  });

  it("ignores the merge commits GitHub and git make", async () => {
    expect(
      (await check("Merge pull request #53 from armandomonteir-o/feat/comment-moderation-51")).valid
    ).toBe(true);
    expect((await check("Merge branch 'main' into feat/x")).valid).toBe(true);
  });

  it.each([
    ["a message without a type", "corrige o botão da galeria"],
    ["an unknown type", "feature: botão da galeria"],
    ["a type in capitals", "Fix: botão da galeria"],
    ["an empty description", "fix:"],
    ["no space after the colon", "fix:botão da galeria"],
  ])("rejects %s", async (_name, message) => {
    expect((await check(message)).valid).toBe(false);
  });

  it("rejects a header over 150 characters", async () => {
    expect((await check(`fix: ${"a".repeat(150)}`)).valid).toBe(false);
  });
});
