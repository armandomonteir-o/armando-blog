import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Same alias as tsconfig.json ("@/*" → project root).
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    // "**/node_modules/**" and ".claude/**": copies of the repo (agent worktrees) live inside
    // .claude/ and bring their own node_modules; running their tests is not testing this code.
    exclude: ["**/node_modules/**", ".next/**", ".claude/**"],
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "json-summary"],
      // Measured over the code that holds logic and the screens, never over the tests themselves,
      // the generated types or the config files.
      include: [
        "lib/**/*.ts",
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "constants/**/*.ts",
      ],
      exclude: ["**/*.test.ts", "**/*.d.ts", "**/*.live.test.ts"],
      // Floors, set just under what was measured on 2026-10-18 (#130): a PR that lowers the
      // coverage of an area below its floor fails CI. Raise a floor when the coverage grows.
      // Areas not listed (components, most pages) have no floor of their own: they are layout and
      // are covered by smoke tests (see CLAUDE.md), only the overall floor applies.
      thresholds: {
        lines: 38,
        "lib/auth/**": { lines: 95 },
        "lib/blocks/**": { lines: 95 },
        "lib/graphql/**": { lines: 75 },
        "lib/*.ts": { lines: 85 },
        "app/api/**": { lines: 35 },
      },
    },
  },
});
