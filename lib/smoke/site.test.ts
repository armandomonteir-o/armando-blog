import { beforeAll, describe, expect, it } from "vitest";

// Smoke test of the published site (#131). Looks at the site the way a visitor (or a crawler)
// does, because build and CI stayed green while login answered 500 for weeks (#91). Opt-in, since
// it needs the network; the scheduled workflow (.github/workflows/smoke.yml) runs it every hour:
//   SMOKE_TEST=1 npm test                                  (checks production)
//   SMOKE_TEST=1 SMOKE_URL=https://<preview>.vercel.app npm test
// The login check lives in lib/auth/smoke.test.ts and runs under the same flag.
const smoke = process.env.SMOKE_TEST === "1";
const baseUrl = (process.env.SMOKE_URL || "https://armando-blog.vercel.app").replace(/\/$/, "");

// A hung request must fail the run instead of eating the whole workflow time.
const get = (path: string, init?: RequestInit) =>
  fetch(`${baseUrl}${path}`, { redirect: "manual", signal: AbortSignal.timeout(20_000), ...init });

describe.runIf(smoke)(`published site on ${baseUrl}`, () => {
  it("serves the home page", async () => {
    const res = await get("/");
    expect(res.status, "Expected 200 on /").toBe(200);
  });

  it("serves /posts", async () => {
    const res = await get("/posts");
    expect(res.status, "Expected 200 on /posts (WordPress may be down)").toBe(200);
  });

  describe("a real post", () => {
    let slug: string | undefined;

    // The slug comes from the sitemap, never hard-coded: a post that gets deleted must not turn
    // this test red.
    beforeAll(async () => {
      const res = await get("/sitemap.xml");
      const xml = await res.text();
      slug = /<loc>[^<]*\/post\/([^<\/]+)<\/loc>/.exec(xml)?.[1];
    });

    it("serves the first post listed in the sitemap", async () => {
      expect(
        slug,
        "No /post/<slug> in /sitemap.xml: WordPress is down or has no posts"
      ).toBeTruthy();
      const res = await get(`/post/${slug}`);
      expect(res.status, `Expected 200 on /post/${slug}`).toBe(200);
    });
  });

  it("answers 404 for a slug that does not exist", async () => {
    const res = await get("/post/smoke-test-this-slug-does-not-exist");
    expect(res.status, "Expected 404 for an unknown post").toBe(404);
  });

  it("refuses /api/revalidate without the secret", async () => {
    const res = await get("/api/revalidate", { method: "POST" });
    expect(
      res.status,
      res.status === 503
        ? "503 means REVALIDATE_SECRET is missing from the Vercel environment (Production): set it and redeploy."
        : "Expected 401 without the secret"
    ).toBe(401);
  });

  it("serves /sitemap.xml with URLs", async () => {
    const res = await get("/sitemap.xml");
    expect(res.status, "Expected 200 on /sitemap.xml (500 usually means WordPress is down)").toBe(
      200
    );
    expect(await res.text()).toContain("<loc>");
  });

  it("serves /robots.txt", async () => {
    const res = await get("/robots.txt");
    expect(res.status, "Expected 200 on /robots.txt").toBe(200);
  });

  it("sends the security headers", async () => {
    const res = await get("/");
    expect(res.headers.get("x-content-type-options"), "next.config.ts headers are gone").toBe(
      "nosniff"
    );
    expect(res.headers.get("x-frame-options")).toBe("DENY");
  });
});
