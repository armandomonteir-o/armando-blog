# ADR-008: WPGraphQL for ACF 2.x Uses Connection Shape for Image Fields

**Date**: 2026-05-16
**Status**: Accepted
**Deciders**: Armando Monteiro

## Context

WPGraphQL for ACF 2.x changed the GraphQL shape of `image` type fields compared to version 1.x.

In version 1.x, image fields returned a `MediaItem` directly:
```graphql
heroImage { sourceUrl }
```

In version 2.x, image fields return a connection edge (`AcfMediaItemConnectionEdge`):
```graphql
heroImage { node { sourceUrl } }
```

After installing WPGraphQL for ACF 2.6.0, all queries using the old shape broke with:
`Cannot query field "sourceUrl" on type "AcfMediaItemConnectionEdge"`

## Decision

We updated all queries and the `WPAcfPostFields` TypeScript type to use the connection shape:

```graphql
# queries/posts.ts
acfPostFields {
  heroImage { node { sourceUrl } }
}
```

```typescript
// types.ts
interface WPAcfPostFields {
  heroImage: { node: WPImage } | null;
}
```

```typescript
// adapters.ts
wp.acfPostFields?.heroImage?.node.sourceUrl
```

The existing `WPImage` type (`{ sourceUrl: string }`) was reused as the `node` type — no duplication.

## Consequences

### Positive
- Compatible with WPGraphQL for ACF 2.x (current, actively maintained version)
- The connection shape is consistent with the WPGraphQL pattern for other relationships (e.g. `featuredImage { node { sourceUrl } }`)

### Negative
- Incompatible with WPGraphQL for ACF 1.x — downgrading would break all image field queries
- Online documentation still mixes v1 and v2 examples, making debugging harder

### Neutral
- The versioned `acf-json/` field group in the repo ensures the ACF schema is reproducible on any WP reinstall

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| Pin WPGraphQL for ACF to 1.x | Discontinued; no longer receives security updates |
| Register ACF fields via PHP code instead of JSON | More verbose; doesn't leverage ACF's UI for visual editing; JSON is more portable |
