// Conventional Commits in Portuguese: "tipo: descrição" (CLAUDE.md, #133).
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // The types the project really uses, no more.
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    // The history has headers up to 120 characters; Portuguese runs longer than English.
    "header-max-length": [2, "always", 150],
    // Sentence case, acronyms and file names (CONTRIBUTING, ECOSYSTEM) are all normal here.
    "subject-case": [0],
    // Squash merges and Dependabot write long body lines.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
