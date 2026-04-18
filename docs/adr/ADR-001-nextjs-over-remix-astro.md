# ADR-001: Next.js 16 over Remix / Astro

**Date**: 2026-04-18
**Status**: Accepted
**Deciders**: Armando Monteiro

## Context

The blog is migrating from a Figma Make (Vite + React Router v7) SPA to a production-grade stack with server-side rendering, SEO, and headless WordPress integration. Three frameworks were evaluated: Next.js, Remix, and Astro.

The blog has mixed content: mostly static (post pages, category pages) with some interactive client components (Sidebar, Header search, NowPlaying, dark mode toggle, Framer Motion animations). It will integrate with WordPress via WPGraphQL for all content.

## Decision

**Next.js 16 with App Router.**

Next.js wins on ecosystem size, Vercel deployment integration, and the React Server Components model which maps cleanly to this use case: static shell (Sidebar, Header, Footer) + dynamic content per route. The App Router's `generateStaticParams` + `revalidate` pattern is a perfect fit for a WordPress-backed blog — pages are statically generated at build time and revalidated on demand (ISR).

## Consequences

### Positive
- First-class Vercel deployment (preview deploys on every PR, zero config)
- `next/font` eliminates font CLS — critical for a design-heavy blog
- `next/image` handles WordPress media optimization automatically
- Large ecosystem: tutorials, Stack Overflow answers, and shadcn/ui are all Next.js-first
- `generateMetadata()` API makes SEO straightforward per-page

### Negative
- Next.js 16 has breaking changes vs. Next.js 15 (see AGENTS.md warning). The `node_modules/next/dist/docs/` directory is the authoritative reference for this project's version.
- App Router has a learning curve vs. the Pages Router that most tutorials cover
- Bundle size is larger than Astro (Astro ships zero JS by default)

### Neutral
- React Server Components require careful `"use client"` boundary management — this is new for a developer coming from a pure-SPA background

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| Remix | Excellent DX and loader/action model, but smaller ecosystem. WPGraphQL integration examples are scarce. Vercel support is good but not as seamless. |
| Astro | Best performance (near-zero JS), great for static blogs. Rejected because the design uses heavy Framer Motion animations and interactive widgets (NowPlaying, Sidebar collapse, dark mode) that work awkwardly in Astro's island architecture. |
| Stay on Vite SPA | No SSR = no SEO. WordPress integration would require client-side fetching on every load. Not viable for a public blog. |
