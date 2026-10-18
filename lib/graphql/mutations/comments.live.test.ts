import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Moderation flow against the real WordPress (#54). Opt-in, because it writes to the site:
//   WP_LIVE_TEST=1 WORDPRESS_API_URL=... WP_APP_USER=... WP_APP_PASSWORD=... npm test
// It creates one comment tagged with a unique marker, checks that it is held and invisible to
// the public, approves it through the REST API, checks that it shows up, and always deletes it.
// The browser half of #54 (Google login, the "Aguardando aprovação" message) is not covered here:
// the message depends only on `queued` from the route, which is `!comment`.
const live = process.env.WP_LIVE_TEST === "1";

describe.runIf(live)("comment moderation against the live WordPress", () => {
  const marker = `teste-moderacao-54-${Date.now()}`;
  let restBase: string;
  let authHeader: string;
  const created: number[] = [];
  let create: typeof import("./comments").createWPComment;
  let getRecentComments: typeof import("../queries/comments").getRecentComments;
  let getPostSlugs: typeof import("../queries/posts").getPostSlugs;
  let getPost: typeof import("../queries/posts").getPost;

  const rest = async (path: string, init: RequestInit = {}) =>
    fetch(`${restBase}${path}`, {
      ...init,
      headers: { Authorization: authHeader, "Content-Type": "application/json" },
    });

  const publicHasMarker = async () =>
    (await getRecentComments(50)).some((c) => c.content.includes(marker));

  beforeAll(async () => {
    // Imported here: client.ts throws at import time without WORDPRESS_API_URL.
    ({ createWPComment: create } = await import("./comments"));
    ({ getRecentComments } = await import("../queries/comments"));
    ({ getPostSlugs, getPost } = await import("../queries/posts"));
    restBase = process.env.WORDPRESS_API_URL!.replace(/\/graphql\/?$/, "/wp-json/wp/v2");
    const token = Buffer.from(`${process.env.WP_APP_USER}:${process.env.WP_APP_PASSWORD}`).toString(
      "base64"
    );
    authHeader = `Basic ${token}`;
  });

  afterAll(async () => {
    // Runs even when an assertion failed, so a red test never leaves a comment behind.
    for (const id of created) await rest(`/comments/${id}?force=true`, { method: "DELETE" });
  });

  it("goes to Pending, stays invisible to the public, and shows up once approved", async () => {
    const [slug] = await getPostSlugs(1);
    const post = await getPost(slug);
    expect(post).not.toBeNull();

    await create({
      postId: post!.databaseId,
      content: marker,
      authorName: "Teste de moderação",
      authorEmail: "teste-moderacao@example.com",
    });

    const held = await (await rest(`/comments?status=hold&search=${marker}`)).json();
    expect(held).toHaveLength(1);
    const commentId: number = held[0].id;
    created.push(commentId);
    expect(held[0].status).toBe("hold");
    expect(await publicHasMarker()).toBe(false);

    const approve = await rest(`/comments/${commentId}`, {
      method: "POST",
      body: JSON.stringify({ status: "approved" }),
    });
    expect(approve.ok).toBe(true);
    expect(await publicHasMarker()).toBe(true);
  });

  // The `status: "HOLD"` we send is not what holds a returning commenter: WordPress decides, and
  // before #54 it approved a second comment from an email that already had an approved one.
  // The guard is the WordPress option "Comment must be manually approved" (`comment_moderation`
  // = 1, see PITFALL-013 and docs/ECOSYSTEM.md). This test fails if someone turns it off.
  it("still holds a second comment from an email that already has an approved one", async () => {
    const [slug] = await getPostSlugs(1);
    const post = await getPost(slug);
    const second = `${marker}-segundo`;
    await create({
      postId: post!.databaseId,
      content: second,
      authorName: "Teste de moderação",
      authorEmail: "teste-moderacao@example.com",
    });
    const held = await (await rest(`/comments?status=hold&search=${second}`)).json();
    for (const c of held) created.push(c.id);
    const approved = await (await rest(`/comments?status=approve&search=${second}`)).json();
    for (const c of approved) created.push(c.id);
    expect(approved).toHaveLength(0);
    expect(held).toHaveLength(1);
  });
});
