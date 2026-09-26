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

import { getFeaturedPost, getPost, getPosts } from "./posts";
import { getCategoryPosts } from "./categories";
import { searchPosts } from "./search";

function post(slug: string, isFeatured: boolean | null) {
  return {
    slug,
    acfPostFields: {
      heroImage: null,
      readingTime: null,
      isFeatured,
      subtitle: null,
      postSections: null,
    },
  };
}

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

describe("getFeaturedPost", () => {
  it("returns the first post flagged in ACF", async () => {
    request.mockResolvedValue({
      posts: { nodes: [post("a", false), post("b", true), post("c", true)], pageInfo: {} },
    });
    expect((await getFeaturedPost())?.slug).toBe("b");
  });

  it("returns null when no post is flagged", async () => {
    request.mockResolvedValue({
      posts: { nodes: [post("a", false), post("b", null)], pageInfo: {} },
    });
    expect(await getFeaturedPost()).toBeNull();
  });

  it("does not filter by meta in the query, which WPGraphQL rejects", async () => {
    request.mockResolvedValue({ posts: { nodes: [], pageInfo: {} } });
    await getFeaturedPost();
    expect(request.mock.calls[0][0]).not.toContain("metaKey");
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
