@AGENTS.md

# CLAUDE.md — Armando Blog

## Project Overview

**Armando** is a personal blog about art and digital technology by Armando Monteiro. The current codebase is a **Next.js 16 (App Router) + Headless WordPress** project migrated from a Figma Make (Vite + React SPA) prototype.

The design aesthetic is a deliberate mix of **neobrutalism**, **retro-digital**, and **Frutiger Aero** — intentional and non-negotiable.

**The Figma Make prototype** lives in `Neobrutalist Art Blog Homepage/` (gitignored). It is the visual source of truth. Before touching any UI component, open the prototype and verify your output matches it pixel-for-pixel.

## Documentation

Read these before starting any work:

- `/docs/ECOSYSTEM.md` — where each piece lives (Vercel, Hostinger WordPress, Google OAuth, domains), how code gets deployed, and what only the account owner can confirm
- `/docs/ARCHITECTURE.md` — layout system, routing, scroll behavior, component hierarchy
- `/docs/DESIGN-SYSTEM.md` — colors, typography, CSS variables, dark mode
- `/docs/DATA-MODELS.md` — TypeScript interfaces, WordPress CPT/taxonomy/ACF mapping
- `/docs/MIGRATION-GUIDE.md` — step-by-step migration plan
- `/docs/COMPONENTS.md` — component catalog with data dependencies and behavior notes
- `/docs/adr/` — architecture decisions with full context and trade-offs
- `/docs/pitfalls/README.md` — check this FIRST before debugging anything

## Keep the documentation current (MANDATORY)

**Updating the documentation is part of the work, not a follow-up.** A task is not done, and a PR must not be opened, until every document the change affects has been updated in that same PR. This covers the `README.md`, the ADRs in `docs/adr/`, `docs/ECOSYSTEM.md`, `docs/pitfalls/README.md`, `docs/COMPONENTS.md`, `docs/ARCHITECTURE.md`, `docs/DATA-MODELS.md`, `docs/DESIGN-SYSTEM.md` and this file. Do not wait to be asked, and do not leave it for later.

Documentation that drifts is worse than none: it already sent a deploy README toward the very method that wiped WordPress twice, and an ADR kept saying "Accepted" for a mock fallback the code no longer had.

Before every commit, ask: _what did this change make false in the docs?_ Then search for it (`grep -rn` for the route, variable, flag or behavior name in `README.md` and `docs/`) and fix it.

| If the PR changes... | Update |
|---|---|
| a host, domain, env var, deploy step, or third-party account (Vercel, Hostinger, Google) | `docs/ECOSYSTEM.md` |
| which routes use real data versus mock | the table in `README.md` and `docs/COMPONENTS.md` |
| a decision with real trade-offs | a new ADR in `docs/adr/`, plus its line in the "Decisions and trade-offs" table of `README.md` |
| a decision that replaces or weakens an earlier ADR | the status line of the old ADR, so it never contradicts the code |
| a non-obvious behavior you tripped over | `docs/pitfalls/README.md` |
| the test, CI or build setup | `README.md` and this file |
| a component's data source or behavior | `docs/COMPONENTS.md` |
| the layout, routing or scroll system | `docs/ARCHITECTURE.md` |
| types or the WordPress mapping | `docs/DATA-MODELS.md` |
| colors, fonts or CSS variables | `docs/DESIGN-SYSTEM.md` |

In `docs/ECOSYSTEM.md`, mark each claim **[confirmado]** (checked against code or a real request) or **[conferir]** (only the account owner can say). Never write a secret, only variable names.

At the end of every session, say which docs you touched, or say explicitly that none needed it and why. Also keep `.claude/handoff.md` up to date.

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

### Authorship

No AI attribution anywhere in the repository: not in commits, PRs, issues or ADRs. Commit messages follow the pattern above, in Portuguese. Use `closes #N` only when the PR really closes the issue, and `Refs #N` otherwise (GitHub closes an issue on any "Closes ... #N" in the text, even in a sentence that says it will not).

### Context files to provide at session start

1. This `CLAUDE.md`
2. The relevant `/docs/*.md` for the area you're working on
3. The specific GitHub issue number and description
4. Screenshots of the prototype for visual reference

## Testing Strategy

### Philosophy: test behavior, not implementation

We don't test CSS. We test that components render correctly and behave as expected.

### Stack
- **Vitest**, in a Node environment: unit and integration tests, run with `npm test` (offline, in CI).
- **Opt-in live tests** that touch real services, off by default: `WP_LIVE_TEST=1` (WordPress schema and the comment moderation flow), `SMOKE_TEST=1` (login on the published site) and `ROUTE_TEST_URL` (the comment route with a session made inside the test). See the Tests section of `README.md`.
- **Not installed yet:** `@testing-library/react` (component tests) and **Playwright** (E2E and visual regression, #104).

A mock written from an assumption proves nothing about the real service (PITFALL-014): test the real one at least once, and for a security guard, break the code on purpose to see the test fail.

### Coverage targets (goals, not measured yet)
- Utility functions: 90%+
- WPGraphQL query functions: 80%+
- Page components: smoke tests (renders without crashing)
- Critical E2E flows: Home → Post, Category → Post, Search

### Visual regression (planned, depends on Playwright)
Playwright screenshots for each page in light mode, dark mode, mobile (375px), and tablet (768px).
