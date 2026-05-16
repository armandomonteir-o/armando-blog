# ADR-006: Adapter Pattern to Map WP GraphQL → Local Types with Mock Fallback

**Date**: 2026-05-16
**Status**: Accepted
**Deciders**: Armando Monteiro

## Context

The frontend has two data sources for posts: real WordPress data via WPGraphQL and mock data in `constants/posts.ts` for offline development and for slugs that don't exist in WP yet.

Types returned by WPGraphQL (`WPPost`, `WPPostDetail`) have a different shape from the `Post` type used by components — different field names, dates in ISO 8601, images in connection structures, optional ACF fields.

We needed a strategy that:
- Keeps components agnostic to data origin
- Ensures graceful fallback when WP is unavailable or the slug doesn't exist yet
- Allows incremental migration (not all posts exist in WP yet)

## Decision

We created `lib/graphql/adapters.ts` with pure functions that transform WP types into local types:

- `adaptWPPost(wp: WPPost): Post` — used on homepage/grid
- `adaptWPPostDetail(wp: WPPostDetail)` — used on the single post page
- `stripHtml(html)` and `formatWPDate(iso)` as internal helpers

Server Components (`app/page.tsx`, `app/post/[slug]/page.tsx`) attempt the WP fetch inside `try/catch`. On error, they fall back silently to local mock data. Fallback logic lives in the Server Component, not the adapter.

## Consequences

### Positive
- Components never know where data came from — zero coupling to WP
- Automatic fallback keeps the site functional during deploys, network errors, or posts not yet migrated
- Adapters are pure functions — straightforward to unit test
- Incremental migration: posts can exist only in mock or only in WP without conflict

### Negative
- Two type systems to keep in sync (`WPPost` and `Post`)
- When the WPGraphQL schema changes (e.g. ACF 2.x changed image field shape), adapter and types need a coordinated update

### Neutral
- `console.error` in catch blocks exposes silent failures during development without affecting UX in production

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| Use `WPPost` directly in components | Would couple all components to the WP schema; rolling back to mock would be impossible |
| GraphQL Code Generator | Overkill for current query volume; adds tooling and CI complexity |
| React Query / SWR for fetching | Next.js 16 Server Components don't need client-side fetching; would add unnecessary bundle |
