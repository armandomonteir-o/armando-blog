import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// #70: /posts used to read the mock list from constants/posts.ts.
let impl: (first: number) => Promise<unknown> = async () => ({ nodes: [] });
vi.mock("@/lib/graphql", () => ({ getPosts: (first: number) => impl(first) }));

const { default: PostsPage } = await import("./page");
const { default: PostsClient } = await import("./PostsClient");

const wp = (slug: string, category: string) => ({
  id: slug,
  databaseId: slug.length,
  slug,
  title: `Título ${slug}`,
  excerpt: "<p>Resumo</p>",
  date: "2026-04-10T12:00:00",
  commentCount: 0,
  isSticky: false,
  categories: { nodes: [{ name: category, slug: category.toLowerCase() }] },
  featuredImage: null,
  acfPostFields: null,
});

function findByType(node: ReactNode, type: unknown): unknown[] {
  if (Array.isArray(node)) return node.flatMap((n) => findByType(n, type));
  if (!isValidElement<{ children?: ReactNode }>(node)) return [];
  const own = node.type === type ? [node] : [];
  return [...own, ...findByType(node.props.children, type)];
}

describe("PostsPage", () => {
  it("hands the client the real posts, fetched all at once", async () => {
    let asked = 0;
    impl = async (first) => {
      asked = first;
      return { nodes: [wp("a", "Design"), wp("b", "Arte")] };
    };
    const [client] = findByType(await PostsPage(), PostsClient) as {
      props: { posts: { slug: string; category: string }[] };
    }[];
    expect(client.props.posts.map((p) => [p.slug, p.category])).toEqual([
      ["a", "Design"],
      ["b", "Arte"],
    ]);
    expect(asked).toBe(100);
  });

  it("propagates a WordPress failure instead of showing the mock list", async () => {
    impl = async () => {
      throw new Error("ENOTFOUND");
    };
    await expect(PostsPage()).rejects.toThrow("ENOTFOUND");
  });
});
