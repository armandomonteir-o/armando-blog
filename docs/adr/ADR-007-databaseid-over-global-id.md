# ADR-007: Use `databaseId` Instead of Global `id` for Post Identifiers

**Date**: 2026-05-16
**Status**: Accepted
**Deciders**: Armando Monteiro

## Context

WPGraphQL exposes two identifiers per node:

- `id` — Base64-encoded Global ID (`cG9zdDo1`), unique in the GraphQL schema but unreadable and non-numeric
- `databaseId` — Integer ID from the `wp_posts` MySQL table (`5`)

The local `Post` type uses `id: number`, and `PostsGrid` uses `post.id` as a React key. Using `parseInt(wp.id, 10)` in the adapter produced `NaN` (base64 is not a decimal number), causing React warnings and potential DOM duplication.

## Decision

We added `databaseId: number` to the `WPPost` type and included the field in all GraphQL queries that return posts. The adapter uses `wp.databaseId` directly with no conversion.

## Consequences

### Positive
- React keys are stable integers — no `NaN`, no DOM duplication
- `databaseId` is consistent with the WP Admin ID and WP-CLI — easier to cross-reference during debugging
- No parsing cost — the field comes as `Int` from GraphQL

### Negative
- Exposes the internal database ID in the rendered HTML — acceptable for a public blog, but would be a concern in contexts with private resource enumeration

### Neutral
- `databaseId` is WPGraphQL-specific; switching CMS would require remapping this field

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| Decode the Global ID from base64 | Brittle — WPGraphQL's internal format may change; adds unnecessary logic |
| Use `slug` as key | Slugs are strings; compatible with `Post.id: number` would require type change or conversion |
| Change `Post.id` to `string` | Would break compatibility with existing mocks and components that use `post.id` as a number |
