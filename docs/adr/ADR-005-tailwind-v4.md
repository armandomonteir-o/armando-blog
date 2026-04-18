# ADR-005: Tailwind CSS v4

**Date**: 2026-04-18
**Status**: Accepted
**Deciders**: Armando Monteiro

## Context

The prototype was built with Tailwind v4 (via `@tailwindcss/vite`). The Next.js scaffold also installs Tailwind v4 (via `@tailwindcss/postcss`). Tailwind v4 has a fundamentally different configuration model from v3.

## Decision

**Stay on Tailwind v4** as shipped by `create-next-app`.

The prototype already uses v4 patterns, and downgrading to v3 would require rewriting all utility classes. The key v4 changes to be aware of throughout the migration are documented below.

## Tailwind v4 Key Differences (Critical for Migration)

### 1. CSS-first configuration
No `tailwind.config.js`. Customization is done in CSS using `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-brand: #0347c1;
  --font-sans: var(--font-space-grotesk);
}
```

### 2. `@source` directive for class scanning
In Next.js, Tailwind v4 auto-detects content via `@tailwindcss/postcss`. If custom paths are needed:

```css
@source "../components/**/*.tsx";
```

### 3. CSS custom properties as design tokens
`--arm-*` variables (from `theme.css`) integrate with Tailwind v4 via `@theme`:

```css
@theme inline {
  --color-arm-bg: var(--arm-bg);
  --color-arm-panel-bg: var(--arm-panel-bg);
}
```

This allows using `bg-arm-bg` as a Tailwind utility while keeping the CSS variable system.

### 4. `tw-animate-css` compatibility
The prototype uses `tw-animate-css` for animation utilities. It is compatible with Tailwind v4 via `@import`.

## Consequences

### Positive
- No config file to maintain — design tokens live in CSS, closer to the existing `theme.css` pattern
- Faster build times (Rust-based engine, Oxide)
- CSS custom properties are first-class tokens

### Negative
- Tailwind v4 is relatively new — some third-party component libraries (shadcn/ui) may have partial v4 support
- No `tailwind.config.js` means some ecosystem tools that read the config file won't work
- `@apply` directive has limited support in v4 — prefer utility classes directly in JSX

### Neutral
- The `--arm-*` variable system from `theme.css` coexists with Tailwind's token system. Both are kept deliberately — see DESIGN-SYSTEM.md for the two-color-system explanation.

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| Tailwind v3 | Would require rewriting all utility classes in the prototype. Tailwind v4 is the current release and the prototype already uses it. |
| CSS Modules | More scoped but loses the utility-first development speed. The design-heavy neobrutalism aesthetic benefits from rapid utility composition. |
