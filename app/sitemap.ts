import type { MetadataRoute } from "next";
import { getCategories, getPostSlugs } from "@/lib/graphql";
import { absoluteUrl } from "@/lib/site-url";

// Rendered on each request, never at build time (#12). A prerendered sitemap would either fail the
// build when WordPress is down or, worse, freeze a half-empty list (PITFALL-018: Next caches what
// it fetched, errors included). Per request, a WordPress failure is a 500 the crawler retries,
// and nothing is stored. Crawlers fetch it rarely, so the cost is a few GraphQL queries.
export const dynamic = "force-dynamic";

// Only routes that really answer 200. /login and /minha-conta are not public content.
const FIXED_PATHS = ["/", "/posts", "/sobre", "/playlists"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // No try/catch on purpose, like the pages: a failure must not become a smaller sitemap.
  const [slugs, categories] = await Promise.all([getPostSlugs(), getCategories()]);

  const paths = [
    ...FIXED_PATHS,
    ...slugs.map((s) => `/post/${encodeURIComponent(s)}`),
    ...categories.flatMap((c) => [
      `/categoria/${encodeURIComponent(c.slug)}`,
      ...c.children.nodes.map(
        (s) => `/categoria/${encodeURIComponent(c.slug)}/${encodeURIComponent(s.slug)}`
      ),
    ]),
  ];

  return [...new Set(paths)].map((path) => ({ url: absoluteUrl(path) }));
}
