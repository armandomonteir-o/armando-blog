# ADR-004: WPGraphQL over WP REST API

**Date**: 2026-04-18
**Status**: Accepted
**Deciders**: Armando Monteiro

## Context

WordPress exposes content via two APIs: the native REST API (available without plugins) and WPGraphQL (plugin required). Both can serve posts, categories, and custom post types. The decision affects query patterns, TypeScript integration, and bundle size.

## Decision

**WPGraphQL** for all data fetching.

GraphQL enables co-located, typed queries that fetch exactly the fields needed — no over-fetching. With `graphql-request` as the client and TypeScript interfaces matching the schema, the data layer is self-documenting.

## Consequences

### Positive
- No over-fetching: each query requests only the fields the component needs
- Single endpoint (`/graphql`) vs. multiple REST endpoints per resource
- Typed schema enables TypeScript autocomplete and compile-time safety
- `generateStaticParams` + `revalidate` works cleanly with a single GraphQL fetch per build
- WPGraphQL for ACF exposes all ACF fields in the same schema

### Negative
- Requires installing and maintaining the WPGraphQL plugin
- GraphQL queries are more verbose to write than REST URLs for simple cases
- Caching semantics differ from REST — must be deliberate about `cache: 'force-cache'` vs `revalidate`
- WPGraphQL plugin has had breaking changes between major versions

### Neutral
- `graphql-request` is a thin client (no normalized cache). This is intentional — Next.js's built-in fetch cache handles caching at the HTTP layer.

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| WP REST API | Available without plugins, but returns large payloads with many unused fields. No typed schema without manual TypeScript interface maintenance. Multiple round-trips needed for related data (post + author + categories). |
| Apollo Client | Full-featured GraphQL client with normalized cache. Rejected: overkill for this use case. The normalized cache adds complexity without benefit in a Next.js RSC architecture where Server Components re-fetch on demand. |
