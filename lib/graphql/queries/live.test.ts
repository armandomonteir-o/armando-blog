import { beforeAll, describe, expect, it } from "vitest";

// Contract test against a real WPGraphQL endpoint: a query that does not match the
// schema fails here even when no content exists yet. Opt-in, because CI has no WordPress:
//   WP_LIVE_TEST=1 WORDPRESS_API_URL=https://.../graphql npm test
const live = process.env.WP_LIVE_TEST === "1";

type Queries = typeof import("./posts") &
  typeof import("./categories") &
  typeof import("./playlists") &
  typeof import("./search");

describe.runIf(live)("queries against the live WordPress schema", () => {
  // Imported here, not at the top: client.ts throws at import time without WORDPRESS_API_URL,
  // and the body of a skipped describe still runs during collection.
  let q: Queries;
  beforeAll(async () => {
    q = Object.assign(
      {},
      await import("./posts"),
      await import("./categories"),
      await import("./playlists"),
      await import("./search")
    );
  });

  it("getPosts returns posts with databaseId", async () => {
    const { nodes } = await q.getPosts(3);
    expect(nodes.length).toBeGreaterThan(0);
    expect(typeof nodes[0].databaseId).toBe("number");
  });

  it("getFeaturedPost resolves", async () => {
    await expect(q.getFeaturedPost()).resolves.not.toThrow();
  });

  it("getPost resolves a real slug and null for a missing one", async () => {
    const [slug] = await q.getPostSlugs(1);
    expect((await q.getPost(slug))?.slug).toBe(slug);
    expect(await q.getPost("slug-that-does-not-exist-xyz")).toBeNull();
  });

  it("getCategories resolves", async () => {
    const categories = await q.getCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  it("getCategoryPosts returns posts with databaseId", async () => {
    const [category] = (await q.getCategories()).filter((c) => (c.count ?? 0) > 0);
    const { nodes } = await q.getCategoryPosts(category.slug, 3);
    expect(nodes.length).toBeGreaterThan(0);
    expect(typeof nodes[0].databaseId).toBe("number");
  });

  it("getPlaylists and getPlaylist resolve", async () => {
    await expect(q.getPlaylists(1)).resolves.toBeDefined();
    await expect(q.getPlaylist("slug-that-does-not-exist-xyz")).resolves.toBeNull();
  });

  it("searchPosts resolves", async () => {
    await expect(q.searchPosts("a")).resolves.toBeDefined();
  });
});
