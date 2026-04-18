# ADR-003: WordPress as Headless CMS

**Date**: 2026-04-18
**Status**: Accepted
**Deciders**: Armando Monteiro

## Context

The blog needs a CMS for managing posts, categories, playlists, and author data. The developer is already familiar with WordPress. Requirements:

- Custom Post Types (Playlists)
- Advanced Custom Fields (accent colors, hero images, reading time, featured flags)
- Hierarchical categories (category → subcategory)
- Native comments or headless alternative
- GraphQL API (preferred over REST for typed, co-located queries)

## Decision

**Self-hosted WordPress with WPGraphQL + Advanced Custom Fields (ACF).**

WordPress is chosen primarily because of the developer's existing familiarity and the mature ACF ecosystem for structured content. WPGraphQL exposes the full WordPress data model (CPTs, taxonomies, ACF fields) as a typed GraphQL schema.

## Consequences

### Positive
- Zero CMS learning curve — developer knows WordPress
- ACF + WPGraphQL for ACF enables fully typed custom field queries
- Hierarchical categories work natively in WordPress taxonomy system
- Large hosting ecosystem (can start on shared hosting, scale to WP Engine / Kinsta)
- Native comments available if needed

### Negative
- WordPress requires its own server/hosting (separate from Next.js on Vercel)
- PHP maintenance overhead vs. fully managed SaaS CMS
- WPGraphQL plugin must be kept up to date — breaking changes happen
- CORS configuration required for cross-origin GraphQL requests

### Neutral
- Content editing UX is WordPress admin — familiar but not modern (vs. Sanity Studio or Contentful)

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| Sanity | Excellent DX and real-time CDN. Rejected: new platform to learn, free tier has usage limits, migrating existing content would be manual work. |
| Contentful | Mature SaaS CMS. Rejected: pricing model becomes expensive at scale, and the developer has no prior experience with it. |
| Notion API | Simple but not designed as a CMS — no taxonomy system, no custom post types, rate limits. |
| Markdown files in Git | No media management, no non-developer editing workflow. Rejected for long-term maintainability. |
