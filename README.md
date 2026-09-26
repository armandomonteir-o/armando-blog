# Armando — art & digital technology

Personal blog by Armando Monteiro about art and digital technology.

**Live:** [armando-blog.vercel.app](https://armando-blog.vercel.app)

**Where the interface came from:** the visual layer is a port. It started as a React (Vite) SPA prototype generated in Figma Make, and I migrated it to Next.js 16 with the App Router, server components and real data from WordPress. The work in this repository is that migration and everything behind the screens: the WPGraphQL data layer, Google sign-in, moderated comments and the CI.

**Design aesthetic**: Neobrutalism + Retro-digital + Frutiger Aero — intentional, non-negotiable.

**Stack**: Next.js 16 (App Router) · Tailwind v4 · TypeScript · Headless WordPress · WPGraphQL · Zustand

## What is real data and what is still mock

| Route | Data |
|---|---|
| `/` (home) | **WordPress**, via WPGraphQL |
| `/post/[slug]` | **WordPress** for the post; read, like and related-post counts are still placeholders |
| comments, `/login`, `/minha-conta` | **WordPress** and Google OAuth |
| `/posts` | mock, from `constants/posts.ts` |
| `/categoria/...` | mock, from `data/categories.ts` |
| `/playlists` | mock, and the page says so on screen |

## Getting started

```bash
nvm use          # switches to node 22 via .nvmrc
npm install
npm run dev      # http://localhost:3000
```

`WORDPRESS_API_URL` must be set in `.env.local`, pointing to the WPGraphQL endpoint.

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
lib/           GraphQL client, queries, adapters, WordPress helpers, design tokens
store/         Zustand stores
constants/     Shared lookup tables (categoryColors, navigation) and the mock post list
data/          Mock content for the routes not yet on WordPress
styles/        CSS custom properties and global styles
docs/          Project documentation
```

## Reference prototype

The Figma Make prototype this interface was ported from lives in `Neobrutalist Art Blog Homepage/` (gitignored, local reference only). All visual decisions are derived from it. Do not change any styling without consulting it.
