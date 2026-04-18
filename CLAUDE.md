@AGENTS.md

# CLAUDE.md — Armando Blog

## Project Overview

**Armando** is a personal blog about art and digital technology by Armando Monteiro. The current codebase is a **Next.js 16 (App Router) + Headless WordPress** project migrated from a Figma Make (Vite + React SPA) prototype.

The design aesthetic is a deliberate mix of **neobrutalism**, **retro-digital**, and **Frutiger Aero** — intentional and non-negotiable.

**The Figma Make prototype** lives in `Neobrutalist Art Blog Homepage/` (gitignored). It is the visual source of truth. Before touching any UI component, open the prototype and verify your output matches it pixel-for-pixel.

## Documentation

Read these before starting any work:

- `/docs/ARCHITECTURE.md` — layout system, routing, scroll behavior, component hierarchy
- `/docs/DESIGN-SYSTEM.md` — colors, typography, CSS variables, dark mode
- `/docs/DATA-MODELS.md` — TypeScript interfaces, WordPress CPT/taxonomy/ACF mapping
- `/docs/MIGRATION-GUIDE.md` — step-by-step migration plan
- `/docs/COMPONENTS.md` — component catalog with data dependencies and behavior notes
- `/docs/adr/` — architecture decisions with full context and trade-offs
- `/docs/pitfalls/README.md` — check this FIRST before debugging anything

## Critical Rules

1. **Do NOT change any visual styling.** Every color, border, shadow, font-size, spacing, and animation is intentional.

2. **The sidebar, header, and footer are fixed chrome** — they don't come from WordPress.

3. **`react-router-dom` does not exist in this project.** The prototype uses `react-router` v7. In Next.js, use `next/navigation` and `next/link`.

4. **`motion/react`** is the import path. Package name: `motion`. Import: `import { motion } from 'motion/react'`.

5. **The scroll system is custom**: `app/layout.tsx` must use `overflow-hidden` on the root div with `#main-scroll-container` as the scrollable element. `ReadingProgress`, `ScrollToTop`, and scroll-to-top-on-navigate all reference this ID. See pitfall #004.

6. **Dark mode uses `[data-theme="dark"]` on `<html>`**, NOT a CSS class. See pitfall #003.

7. **Two color systems coexist intentionally** — `--arm-*` vars, `--arm-panel-*` vars, and hardcoded chrome hex values. See pitfall #006 and DESIGN-SYSTEM.md.

8. **Next.js 16 has breaking changes vs. v15.** The `node_modules/next/dist/docs/` directory is the authoritative API reference. See `AGENTS.md` and ADR-001.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind v4 + `tw-animate-css` + `--arm-*` CSS variables |
| Animation | `motion/react` (Motion v12+) |
| State | Zustand (replaces ThemeContext) |
| Fonts | `next/font/google` (Space Grotesk, Space Mono, Rubik Glitch, Bungee Shade) |
| CMS | Headless WordPress + WPGraphQL |
| GraphQL client | `graphql-request` |
| Analytics | `@vercel/analytics` |
| Sitemap | `next-sitemap` |
| Deployment | Vercel |
| Node | 22.14.0 (see `.nvmrc`) |

## Next.js Migration Quick Reference

| Prototype (React Router) | Next.js App Router |
|---|---|
| `routes.ts` + `createBrowserRouter` | `app/` directory with `layout.tsx` + `page.tsx` |
| `Layout.tsx` with `<Outlet />` | `app/layout.tsx` with `{children}` |
| `useParams()` from `react-router` | `params` prop in page components |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `<Link to="...">` | `<Link href="...">` from `next/link` |
| `useLocation()` | `usePathname()` from `next/navigation` |
| `Navigate` component | `redirect()` from `next/navigation` |
| `ThemeContext.tsx` | `store/useThemeStore.ts` (Zustand) |
| Google Fonts in `fonts.css` | `next/font/google` in `app/layout.tsx` |
| `ImageWithFallback` | `next/image` with fallback |
| Client-side only | Server Components by default; `"use client"` only when needed |

## App Router Route Structure

```
app/
  layout.tsx                    # Root: Sidebar + Header + Footer chrome + Zustand
  page.tsx                      # /
  not-found.tsx                 # 404
  post/[slug]/page.tsx          # /post/:slug
  categoria/[category]/
    page.tsx                    # /categoria/:category
    [subcategory]/page.tsx      # /categoria/:category/:subcategory
  posts/page.tsx                # /posts
  playlists/page.tsx            # /playlists
  sobre/page.tsx                # /sobre
```

## AI Workflow Guidelines

### Working with Claude Code on this project

1. **One issue at a time.** Never ask Claude to work on more than one GitHub issue per session.
2. **Always cite the issue number** you're working on at the start of each session.
3. **Verify visual output.** After any component migration, the result MUST match the prototype visually. Screenshot to confirm.
4. **Check pitfalls first.** Before debugging anything, read `/docs/pitfalls/README.md`.
5. **Document new pitfalls immediately.** If you discover non-obvious behavior, add it to the log before the session ends.

### Commit message convention (Conventional Commits)

```
feat: add WPGraphQL client configuration
fix: resolve dark mode flicker on initial load
chore: update next-sitemap config
docs: add ADR-006 for GraphQL client choice
refactor: extract categoryColors to constants file
```

### AI-assisted issue disclosure

Any issue implemented with significant AI assistance should have the `status: ai-assisted` label. Add a comment to the issue explaining what was generated vs. manually written.

### Context files to provide at session start

1. This `CLAUDE.md`
2. The relevant `/docs/*.md` for the area you're working on
3. The specific GitHub issue number and description
4. Screenshots of the prototype for visual reference

## Testing Strategy

### Philosophy: test behavior, not implementation

We don't test CSS. We test that components render correctly and behave as expected.

### Stack (to be added in M2)
- **Vitest** — unit and integration tests
- **@testing-library/react** — component testing
- **Playwright** — E2E and visual regression

### Coverage targets
- Utility functions: 90%+
- WPGraphQL query functions: 80%+
- Page components: smoke tests (renders without crashing)
- Critical E2E flows: Home → Post, Category → Post, Search

### Visual regression
Playwright screenshots for each page in light mode, dark mode, mobile (375px), and tablet (768px).
