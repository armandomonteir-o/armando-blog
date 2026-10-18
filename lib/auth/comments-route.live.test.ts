import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { encode } from "next-auth/jwt";

// POST /api/comments with a session made inside the test, without going through Google (#54, #104).
// Auth.js keeps the session in a JWT sealed with AUTH_SECRET, so a cookie sealed with a throwaway
// secret is a valid session for a local server started with that same secret. It never touches
// the production AUTH_SECRET. Opt-in, because it writes one comment to the real WordPress:
//
//   AUTH_SECRET=<throwaway> npm run dev -- -p 3010        (in another terminal)
//   ROUTE_TEST_URL=http://localhost:3010 ROUTE_TEST_AUTH_SECRET=<same throwaway> \
//     WORDPRESS_API_URL=... WP_APP_USER=... WP_APP_PASSWORD=... npm test
const url = process.env.ROUTE_TEST_URL;
const secret = process.env.ROUTE_TEST_AUTH_SECRET;
const enabled = Boolean(url && secret);

const COOKIE = "authjs.session-token";

describe.runIf(enabled)("POST /api/comments with a generated session", () => {
  const marker = `teste-rota-54-${Date.now()}`;
  const created: number[] = [];
  let sessionCookie: string;
  let restBase: string;
  let authHeader: string;
  let getPostSlugs: typeof import("@/lib/graphql/queries/posts").getPostSlugs;
  let getPost: typeof import("@/lib/graphql/queries/posts").getPost;
  let getRecentComments: typeof import("@/lib/graphql/queries/comments").getRecentComments;

  const rest = (path: string, init: RequestInit = {}) =>
    fetch(`${restBase}${path}`, {
      ...init,
      headers: { Authorization: authHeader, "Content-Type": "application/json" },
    });

  const post = (body: unknown, cookie?: string) =>
    fetch(`${url}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
      body: JSON.stringify(body),
    });

  beforeAll(async () => {
    ({ getPostSlugs, getPost } = await import("@/lib/graphql/queries/posts"));
    ({ getRecentComments } = await import("@/lib/graphql/queries/comments"));
    restBase = process.env.WORDPRESS_API_URL!.replace(/\/graphql\/?$/, "/wp-json/wp/v2");
    authHeader = `Basic ${Buffer.from(
      `${process.env.WP_APP_USER}:${process.env.WP_APP_PASSWORD}`
    ).toString("base64")}`;
    const token = await encode({
      token: {
        sub: "teste-rota-54",
        name: "Teste da rota",
        email: "teste-rota@example.com",
        displayName: "Teste da rota",
      },
      secret: secret!,
      salt: COOKIE,
    });
    sessionCookie = `${COOKIE}=${token}`;
  });

  afterAll(async () => {
    // Also runs when an assertion failed, so a red test never leaves a comment behind.
    const found = await (await rest(`/comments?status=all&search=${marker}&per_page=50`)).json();
    for (const c of found) created.push(c.id);
    for (const id of new Set(created))
      await rest(`/comments/${id}?force=true`, { method: "DELETE" });
  });

  it("rejects a request without a session", async () => {
    const res = await post({ postId: 1, content: marker });
    expect(res.status).toBe(401);
  });

  it("rejects a session sealed with another secret", async () => {
    const forged = await encode({
      token: { sub: "x", email: "x@example.com" },
      secret: "outro-segredo-qualquer-0123456789-abcdefghij",
      salt: COOKIE,
    });
    const res = await post({ postId: 1, content: marker }, `${COOKIE}=${forged}`);
    expect(res.status).toBe(401);
  });

  it("queues the comment: Pending in WordPress, not public, and `queued` is true", async () => {
    const [slug] = await getPostSlugs(1);
    const target = await getPost(slug);
    const res = await post({ postId: target!.databaseId, content: marker }, sessionCookie);
    expect(res.status).toBe(200);
    const body = await res.json();
    // `queued` is what makes the screen say "Aguardando aprovação".
    expect(body.queued).toBe(true);

    const held = await (await rest(`/comments?status=hold&search=${marker}`)).json();
    expect(held).toHaveLength(1);
    expect(held[0].author_name).toBe("Teste da rota");
    expect((await getRecentComments(50)).some((c) => c.content.includes(marker))).toBe(false);
  });
});
