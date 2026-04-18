# Armando — art & digital technology

Personal blog by Armando Monteiro about art and digital technology.

**Design aesthetic**: Neobrutalism + Retro-digital + Frutiger Aero — intentional, non-negotiable.

**Stack**: Next.js 16 (App Router) · Tailwind v4 · TypeScript · Headless WordPress · WPGraphQL · Zustand

## Getting started

```bash
nvm use          # switches to node 22 via .nvmrc
npm install
npm run dev      # http://localhost:3000
```

## Documentation

All technical documentation lives in [`/docs`](./docs/):

- [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — layout system, routing, scroll behavior
- [`DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md) — colors, typography, CSS variables, dark mode
- [`DATA-MODELS.md`](./docs/DATA-MODELS.md) — TypeScript interfaces, WP/ACF mapping
- [`MIGRATION-GUIDE.md`](./docs/MIGRATION-GUIDE.md) — step-by-step migration plan
- [`COMPONENTS.md`](./docs/COMPONENTS.md) — component catalog with data dependencies
- [`adr/`](./docs/adr/) — architecture decision records
- [`pitfalls/`](./docs/pitfalls/) — known gotchas and non-obvious behavior

## Repository structure

```
app/           Next.js App Router (pages and layouts)
components/    Shared React components
lib/           GraphQL client, utilities, hooks
store/         Zustand stores
types/         TypeScript interfaces
constants/     Shared lookup tables (categoryColors, navigation)
styles/        CSS custom properties and global styles
docs/          Project documentation
```

## Reference prototype

The Figma Make prototype lives in `Neobrutalist Art Blog Homepage/` (gitignored — local reference only). All visual decisions are derived from it. Do not change any styling without consulting it.
