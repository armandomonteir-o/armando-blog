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
  },
});
