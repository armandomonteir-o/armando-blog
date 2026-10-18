import { describe, expect, it, vi } from "vitest";

// #68: the home, /posts and the post page used to be frozen at build time. They now regenerate
// in the background. Next requires `revalidate` to be a literal number in each file, so it cannot
// be imported from one place: this test keeps the three from drifting apart.
let slugs: () => Promise<string[]> = async () => [];
vi.mock("@/lib/graphql", () => ({
  getPosts: async () => ({ nodes: [] }),
  getPost: async () => null,
  getRecentComments: async () => [],
  getPostSlugs: () => slugs(),
}));

const ONE_HOUR = 3600;

describe("time-based revalidation", () => {
  it("is set to one hour on the home, on /posts and on the post page", async () => {
    expect((await import("./page")).revalidate).toBe(ONE_HOUR);
    expect((await import("./posts/page")).revalidate).toBe(ONE_HOUR);
    expect((await import("./post/[slug]/page")).revalidate).toBe(ONE_HOUR);
  });
});

describe("post page generateStaticParams", () => {
  it("prerenders the posts WordPress has, and leaves new ones to the first visit", async () => {
    const page = await import("./post/[slug]/page");
    slugs = async () => ["a", "b"];
    expect(await page.generateStaticParams()).toEqual([{ slug: "a" }, { slug: "b" }]);
  });
});
