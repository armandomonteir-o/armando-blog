import { beforeEach, describe, expect, it, vi } from "vitest";

// client.ts reads the endpoint at import time; the mocked GraphQLClient records every request.
const { request } = vi.hoisted(() => {
  process.env.WORDPRESS_API_URL = "https://wp.test/graphql";
  return { request: vi.fn() };
});

vi.mock("graphql-request", () => ({
  GraphQLClient: vi.fn(function () {
    return { request };
  }),
}));

import { getPost, getPostBlocks, getPosts } from "./posts";
import { getRecentComments } from "./comments";
import { getCategoryPosts } from "./categories";
import { searchPosts } from "./search";

beforeEach(() => {
  request.mockReset();
});

describe("getPosts", () => {
  it("sends null, not undefined, for the optional cursor and category", async () => {
    request.mockResolvedValue({
      posts: { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } },
    });
    await getPosts(5);
    expect(request).toHaveBeenCalledWith(expect.stringContaining("query GetPosts"), {
      first: 5,
      after: null,
      categorySlug: null,
    });
  });
});

describe("getCategoryPosts", () => {
  it("is getPosts filtered by the category slug, so it selects databaseId too", async () => {
    request.mockResolvedValue({
      posts: { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } },
    });
    await getCategoryPosts("design", 3, "cursor");
    const [query, variables] = request.mock.calls[0];
    expect(query).toContain("databaseId");
    expect(variables).toEqual({ first: 3, after: "cursor", categorySlug: "design" });
  });
});

describe("getRecentComments", () => {
  it("asks for the newest approved comments on posts, limited by the argument", async () => {
    request.mockResolvedValue({ comments: { nodes: [] } });
    await getRecentComments(4);
    const [query, variables] = request.mock.calls[0];
    expect(query).toContain('status: "approve"');
    expect(query).toContain("contentType: POST");
    expect(query).toContain("order: DESC");
    expect(variables).toEqual({ first: 4 });
  });

  it("returns the nodes, and lets a WordPress failure propagate", async () => {
    request.mockResolvedValue({ comments: { nodes: [{ id: "x" }] } });
    expect(await getRecentComments()).toEqual([{ id: "x" }]);
    request.mockRejectedValue(new Error("network"));
    await expect(getRecentComments()).rejects.toThrow("network");
  });
});

describe("getPost", () => {
  it("returns null when WordPress has no post with that slug", async () => {
    request.mockResolvedValue({ post: null });
    expect(await getPost("nope")).toBeNull();
  });

  it("lets a WordPress failure propagate instead of turning it into null", async () => {
    request.mockRejectedValue(new Error("network"));
    await expect(getPost("any")).rejects.toThrow("network");
  });
});

describe("searchPosts", () => {
  it("does not call WordPress for a blank query", async () => {
    expect(await searchPosts("   ")).toEqual([]);
    expect(request).not.toHaveBeenCalled();
  });
});

describe("getPostBlocks", () => {
  it("asks for the blocks as a tree (flat: false) of the post with that slug", async () => {
    request.mockResolvedValue({ post: { editorBlocks: [] } });
    await getPostBlocks("meu-post");
    const [query, variables] = request.mock.calls[0];
    expect(query).toContain("editorBlocks(flat: false)");
    expect(variables).toEqual({ slug: "meu-post" });
  });

  it("returns the blocks WordPress sent", async () => {
    const blocks = [{ name: "core/paragraph" }];
    request.mockResolvedValue({ post: { editorBlocks: blocks } });
    await expect(getPostBlocks("x")).resolves.toEqual(blocks);
  });

  it("returns null when the post does not exist", async () => {
    request.mockResolvedValue({ post: null });
    await expect(getPostBlocks("nao-existe")).resolves.toBeNull();
  });

  it("lets a GraphQL error through, so the caller can decide what to do", async () => {
    request.mockRejectedValue(new Error('Cannot query field "editorBlocks" on type "Post"'));
    await expect(getPostBlocks("x")).rejects.toThrow("editorBlocks");
  });
});
