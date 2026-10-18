import { afterEach, describe, expect, it, vi } from "vitest";

// #12: the sitemap lists the public routes plus every post and category WordPress has.
let slugs: () => Promise<string[]> = async () => [];
let categories: () => Promise<unknown> = async () => [];
vi.mock("@/lib/graphql", () => ({
  getPostSlugs: () => slugs(),
  getCategories: () => categories(),
}));

const sitemapMod = await import("./sitemap");
const sitemap = sitemapMod.default;
const robotsMod = await import("./robots");

const BASE = "https://armando-blog.vercel.app";
const urls = async () => (await sitemap()).map((e) => e.url);

afterEach(() => vi.unstubAllEnvs());

describe("sitemap", () => {
  it("lists the fixed routes, the posts, the categories and the subcategories", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    slugs = async () => ["ola", "outro"];
    categories = async () => [
      {
        slug: "games",
        children: { nodes: [{ slug: "habbo" }, { slug: "stardew-valley" }] },
      },
      { slug: "arte", children: { nodes: [] } },
    ];
    expect(await urls()).toEqual([
      BASE,
      `${BASE}/posts`,
      `${BASE}/sobre`,
      `${BASE}/post/ola`,
      `${BASE}/post/outro`,
      `${BASE}/categoria/games`,
      `${BASE}/categoria/games/habbo`,
      `${BASE}/categoria/games/stardew-valley`,
      `${BASE}/categoria/arte`,
    ]);
  });

  it("follows NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://blog.armandomonteiro.com");
    slugs = async () => [];
    categories = async () => [];
    expect((await urls())[0]).toBe("https://blog.armandomonteiro.com");
  });

  it("encodes slugs and lists no URL twice", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    slugs = async () => ["a b", "a b"];
    categories = async () => [];
    const list = await urls();
    expect(list.filter((u) => u.includes("/post/"))).toEqual([`${BASE}/post/a%20b`]);
  });

  it("fails (never answers a half-empty sitemap) when WordPress is down", async () => {
    slugs = async () => {
      throw new Error("ENOTFOUND");
    };
    categories = async () => [];
    await expect(sitemap()).rejects.toThrow("ENOTFOUND");
  });

  it("is rendered per request, so a failure is never cached and the build never calls WordPress", () => {
    expect(sitemapMod.dynamic).toBe("force-dynamic");
  });
});

describe("robots", () => {
  it("allows the public site, blocks /api/ and points to the sitemap", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const r = robotsMod.default();
    expect(r.sitemap).toBe(`${BASE}/sitemap.xml`);
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule.userAgent).toBe("*");
    expect(rule.allow).toBe("/");
    expect(rule.disallow).toBe("/api/");
  });
});
