# Design System Tokens — Learnings

## The Problem We Solved

The blog started with ~600 hardcoded hex values like `#0347c1`, `#022a6e`, `#a0c4ff` scattered across 25+ component files. Changing one color meant grep-replacing every file. Adding dark mode required touching every component. There was no way to look at one file and understand what colors existed in the system.

## The Solution: Three-Layer Token Architecture

### Layer 1 — CSS Custom Properties (the only place raw hex lives)

```css
/* styles/theme.css */
:root {
  --arm-bg: #f5f0e3;       /* theme-responsive: changes in dark mode */
  --chrome-blue: #0347c1;  /* static: never changes, structural chrome */
}

[data-theme="dark"] {
  --arm-bg: #0c0b14;       /* only --arm-* vars are overridden here */
}
```

**Why CSS vars?** The browser resolves them at paint time. When the dark mode attribute flips, every element using `var(--arm-bg)` updates automatically — zero JS involved.

### Layer 2 — Tailwind `@theme inline` (maps CSS vars to utility classes)

```css
/* styles/theme.css */
@theme inline {
  --color-arm-bg: var(--arm-bg);           /* generates bg-arm-bg, text-arm-bg, border-arm-bg */
  --color-chrome-blue: var(--chrome-blue); /* generates bg-chrome-blue, text-chrome-blue, etc. */
  --font-mono: 'Space Mono', monospace;    /* generates font-mono class */
}
```

**Why `@theme inline`?** Tailwind v4 replaced `tailwind.config.js` with this CSS-native approach. Tokens declared here become utility classes automatically. The `inline` keyword means "resolve the variable immediately, don't lazy-compute it" — important for values that change with the cascade (like CSS vars pointing to `:root`).

**What v3 looked like (for comparison):**
```js
// tailwind.config.js (v3 — NOT used in this project)
module.exports = {
  theme: {
    extend: {
      colors: { 'chrome-blue': '#0347c1' }
    }
  }
}
```
Tailwind v4 eliminates this file entirely. All token configuration is in CSS.

### Layer 3 — TypeScript Constants (for things CSS can't do)

```ts
// lib/design-tokens.ts
export const FONT_MONO = "'Space Mono', monospace";

// constants/posts.ts
export const categoryColors: Record<string, string> = {
  "Estudos": "#4ade80",
  "Filmes":  "#e05050",
};
```

**Why JS constants?** CSS vars can't do runtime key lookups. `categoryColors[post.category]` is a dynamic access — we get the color at runtime based on a string. CSS has no equivalent.

Font family strings are also duplicated here because `style={{ fontFamily: FONT_MONO }}` is still needed in a few places where a Tailwind class isn't enough (e.g., inside `motion` component style props, or when the font is set conditionally).

---

## Two Token Namespaces

### `--arm-*` — Theme-Responsive

These change between light and dark mode. Use for page backgrounds, text colors, borders on content areas.

```
bg-arm-bg           → page background (cream light / dark night)
text-arm-text       → primary text (#022a6e light / #e4ecf8 dark)
border-arm-border   → general borders
bg-arm-panel-bg     → dark panel interior (inside RetroWindow dark)
text-arm-panel-text-body → body text inside dark panels
```

### `--chrome-*` — Static

These never change between themes. The sidebar, header, and window chrome are the same blue regardless of light/dark mode — that's an intentional design decision.

```
bg-chrome-blue        → #0347c1 sidebar bg
bg-chrome-blue-mid    → #0458d4 panel interior
border-chrome-blue-accent → #0560e0 borders inside dark panels
text-chrome-blue-body → #a0c4ff secondary text on dark surfaces
text-chrome-green     → #4ade80 active/online indicators
text-chrome-red       → #e05050 close buttons, errors
```

---

## Decision Rule: When to Use What

| Situation | Use |
|---|---|
| Static color, maps to a token | Tailwind class: `className="bg-chrome-blue"` |
| Font family (static element) | Tailwind class: `className="font-mono"` |
| Dynamic color (e.g. `categoryColors[x]`) | `style={{ color: categoryColors[x] }}` with import |
| Complex box-shadow or gradient | `style={{}}` with `var(--chrome-*)` refs for any hex inside |
| Conditional color ternary | `style={{ color: cond ? "var(--chrome-green)" : "var(--chrome-blue-accent)" }}` |

The key insight: **Tailwind utility classes for anything static, CSS var references inside `style={{}}` for anything dynamic.**

---

## Why This Makes Dark Mode a Drop-In

When dark mode is restored, only one block changes:

```css
[data-theme="dark"] {
  --arm-bg: #0c0b14;
  --arm-text: #e4ecf8;
  /* ... override only the --arm-* vars ... */
}
```

Every component using `bg-arm-bg`, `text-arm-text` etc. responds automatically. The chrome (`--chrome-*`) stays unchanged because it's structural — the sidebar is always blue. Only the content area adapts.

**Zero component changes needed to restore dark mode** — that's the payoff of this architecture.

---

## Applying This in Future Projects

1. **Define all raw colors in CSS `:root` first** — one file, one place.
2. **Separate "theme-responsive" from "always-static" tokens** from the start. Name them differently (`--brand-*`, `--static-*`, or `--chrome-*`).
3. **Register all tokens in your framework's theme system** — Tailwind `@theme`, Chakra theme, etc.
4. **JS constants only for dynamic access** — if you're doing `colors[key]`, you need JS. If you're setting a fixed color, you don't.
5. **Never hardcode hex in components** — the moment you do, you lose the single source of truth.
