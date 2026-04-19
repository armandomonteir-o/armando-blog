# Learning: Barrel index.ts Pattern for Component Folders

**Date**: 2026-04-19
**Context**: Organizing component folders during the Next.js migration (issues #20 and #22)
**Developer**: Armando Monteiro

---

## What is a barrel file?

A barrel file is an `index.ts` at the root of a folder that re-exports everything the folder wants to make public. It is the **public API of that folder**.

```ts
// components/layout/newsletter/index.ts
export { NewsletterWidget } from "./NewsletterWidget";
export { NewsletterModal } from "./NewsletterModal";
```

Consumers import from the folder, not from individual files:

```ts
// ✅ barrel import — stable, doesn't leak internals
import { NewsletterWidget, NewsletterModal } from "@/components/layout/newsletter";

// ❌ deep import — breaks if the file is renamed or split
import { NewsletterWidget } from "@/components/layout/newsletter/NewsletterWidget";
```

---

## Why we adopted this pattern

### 1. Import paths don't leak internal structure

If `NewsletterWidget.tsx` is renamed or split into two files, only `index.ts` changes. Every consumer stays untouched. The folder path is the stable contract.

### 2. Co-located things stay co-located with a clear public API

The `newsletter/` folder owns its own components. Anything not re-exported from `index.ts` is considered private — other folders shouldn't reach in. This gives each folder clear ownership and boundaries.

### 3. Refactoring is cheaper

Moving a component to a different file inside the same folder? Update `index.ts` only. Splitting one component into two? Update `index.ts` only. The rest of the codebase never changes its imports.

---

## Project rule

**Every subfolder inside `components/` must have an `index.ts` barrel file.**

When creating a new subfolder, always create the `index.ts` alongside the components. When touching an existing subfolder that doesn't have one, add it.

---

## Current barrel files

```
components/
  ui/index.ts
  layout/index.ts
  layout/newsletter/index.ts    ← nested subfolder also gets its own barrel
  content/index.ts
```

The `layout/index.ts` re-exports from the `newsletter/` subfolder's own barrel:

```ts
// components/layout/index.ts
export { NewsletterWidget, NewsletterModal } from "./newsletter";
```

This means you can import from either level depending on what makes sense:

```ts
// from the subfolder (specific)
import { NewsletterModal } from "@/components/layout/newsletter";

// from the parent (broad)
import { NewsletterModal } from "@/components/layout";
```

---

## Known trade-off: tree-shaking

In some bundlers, barrel files that re-export broadly can interfere with tree-shaking if the bundler can't statically analyze what's used. With Next.js + Turbopack this is not a concern for a project of this size. If it ever becomes an issue, the fix is to add `sideEffects: false` in `package.json` or use per-file imports as an escape hatch.
