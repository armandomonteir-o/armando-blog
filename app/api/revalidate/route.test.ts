import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { revalidatePath } from "next/cache";
import * as route from "./route";

const mockRevalidate = vi.mocked(revalidatePath);
const SECRET = "segredo-de-teste-com-tamanho-razoavel";

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
const bearer = (token: string) => ({ authorization: `Bearer ${token}` });

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("REVALIDATE_SECRET", SECRET);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/revalidate: who may call it", () => {
  it("refuses a call without the secret", async () => {
    const res = await route.POST(request({ slug: "um-post" }));
    expect(res.status).toBe(401);
    expect(mockRevalidate).not.toHaveBeenCalled();
  });

  it.each([
    ["a wrong secret", bearer("outro-segredo")],
    ["a secret that is a prefix of the real one", bearer(SECRET.slice(0, -1))],
    ["the real secret with extra characters", bearer(`${SECRET}x`)],
    ["the secret without the Bearer word", { authorization: SECRET }],
    ["an empty token", bearer("")],
  ])("refuses %s", async (_name, headers) => {
    const res = await route.POST(request({ slug: "um-post" }, headers));
    expect(res.status).toBe(401);
    expect(mockRevalidate).not.toHaveBeenCalled();
  });

  it("fails closed when the secret is not configured, even for an empty or 'undefined' token", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "");
    for (const headers of [bearer(""), bearer("undefined"), {}]) {
      const res = await route.POST(request({ slug: "um-post" }, headers));
      expect(res.status).toBe(503);
    }
    expect(mockRevalidate).not.toHaveBeenCalled();
  });

  it("has no GET, so a link or a crawler cannot trigger it", () => {
    expect((route as Record<string, unknown>).GET).toBeUndefined();
  });
});

describe("POST /api/revalidate: what it refreshes", () => {
  // The category pages list posts and their comment counts, so they refresh too (#73). A dynamic
  // route pattern needs the explicit "page" type, or Next throws.
  const CATEGORY_PAGES = [
    ["/categoria/[category]", "page"],
    ["/categoria/[category]/[subcategory]", "page"],
  ];

  it("refreshes the home, the list, the post that changed and the category pages", async () => {
    const res = await route.POST(request({ slug: "um-post" }, bearer(SECRET)));
    expect(res.status).toBe(200);
    expect(mockRevalidate.mock.calls).toEqual([
      ["/"],
      ["/posts"],
      ["/post/um-post"],
      ...CATEGORY_PAGES,
    ]);
    expect(await res.json()).toEqual({
      revalidated: true,
      paths: ["/", "/posts", "/post/um-post", ...CATEGORY_PAGES.map(([p]) => p)],
    });
  });

  it("refreshes everything but the post when no slug is given", async () => {
    const res = await route.POST(request({}, bearer(SECRET)));
    expect(res.status).toBe(200);
    expect(mockRevalidate.mock.calls).toEqual([["/"], ["/posts"], ...CATEGORY_PAGES]);
  });
});

describe("POST /api/revalidate: bad input", () => {
  it.each([
    ["a path traversal", { slug: "../admin" }],
    ["a slash", { slug: "a/b" }],
    ["a query string", { slug: "a?x=1" }],
    ["an empty slug", { slug: "" }],
    ["a slug that is not a string", { slug: 42 }],
    ["a slug that is far too long", { slug: "a".repeat(300) }],
  ])("refuses %s, and refreshes nothing", async (_name, body) => {
    const res = await route.POST(request(body, bearer(SECRET)));
    expect(res.status).toBe(400);
    expect(mockRevalidate).not.toHaveBeenCalled();
  });

  it("refuses a body that is not JSON", async () => {
    const res = await route.POST(request("não é json", bearer(SECRET)));
    expect(res.status).toBe(400);
    expect(mockRevalidate).not.toHaveBeenCalled();
  });
});
