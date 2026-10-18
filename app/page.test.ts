import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// Regression for #66: a WordPress failure used to be swallowed by the home page, which then
// showed the mock posts (frozen into the static build). Failure must propagate instead.
let impl: () => Promise<unknown> = async () => ({ nodes: [] });
let commentsImpl: () => Promise<unknown> = async () => [];
vi.mock("@/lib/graphql", () => ({
  getPosts: () => impl(),
  getRecentComments: () => commentsImpl(),
}));

const { default: HomePage } = await import("./page");
const { PostsGrid } = await import("@/components/content/PostsGrid");
const { FeaturedPost } = await import("@/components/content/FeaturedPost");
const { CommentsSection } = await import("@/components/content/CommentsSection");

function findByType(node: ReactNode, type: unknown): unknown[] {
  if (Array.isArray(node)) return node.flatMap((n) => findByType(n, type));
  if (!isValidElement<{ children?: ReactNode }>(node)) return [];
  const own = node.type === type ? [node] : [];
  return [...own, ...findByType(node.props.children, type)];
}

describe("HomePage", () => {
  it("propagates the error when WordPress fails, instead of rendering mock posts", async () => {
    impl = async () => {
      throw new Error("ENOTFOUND");
    };
    await expect(HomePage()).rejects.toThrow("ENOTFOUND");
  });

  it("passes an empty list (not undefined) when WordPress answers with no posts", async () => {
    impl = async () => ({ nodes: [] });
    const tree = await HomePage();
    const [grid] = findByType(tree, PostsGrid) as { props: { posts?: unknown[] } }[];
    expect(grid.props.posts).toEqual([]);
  });
});

// #72: the featured post and the comments used to be fixed, invented content.
const wp = (slug: string, isSticky = false) => ({
  id: slug,
  databaseId: slug.length,
  slug,
  title: slug,
  excerpt: "",
  date: "2026-04-10T12:00:00",
  commentCount: 0,
  isSticky,
  categories: { nodes: [] },
  featuredImage: null,
  acfPostFields: null,
});

const wpComment = {
  id: "c1",
  date: "2026-05-17 17:04:54",
  content: "<p>oi</p>",
  author: { node: { name: "Ana", avatar: null } },
  commentedOn: { node: { slug: "a", title: "A" } },
};

describe("HomePage featured post and comments", () => {
  it("features the pinned post, or the newest when none is pinned", async () => {
    impl = async () => ({ nodes: [wp("novo"), wp("fixado", true)] });
    let [f] = findByType(await HomePage(), FeaturedPost) as { props: { post: { slug: string } } }[];
    expect(f.props.post.slug).toBe("fixado");

    impl = async () => ({ nodes: [wp("novo"), wp("velho")] });
    [f] = findByType(await HomePage(), FeaturedPost) as { props: { post: { slug: string } } }[];
    expect(f.props.post.slug).toBe("novo");
  });

  it("hides the comments section while there are no real comments", async () => {
    impl = async () => ({ nodes: [wp("a")] });
    commentsImpl = async () => [];
    expect(findByType(await HomePage(), CommentsSection)).toHaveLength(0);
  });

  it("hides it too when the only comments are not on posts", async () => {
    impl = async () => ({ nodes: [wp("a")] });
    commentsImpl = async () => [{ ...wpComment, commentedOn: null }];
    expect(findByType(await HomePage(), CommentsSection)).toHaveLength(0);
  });

  it("shows the real comments when there are some", async () => {
    impl = async () => ({ nodes: [wp("a")] });
    commentsImpl = async () => [wpComment];
    const [c] = findByType(await HomePage(), CommentsSection) as {
      props: { comments: { name: string }[] };
    }[];
    expect(c.props.comments.map((x) => x.name)).toEqual(["Ana"]);
  });

  it("propagates a failure of the comments query instead of hiding it", async () => {
    impl = async () => ({ nodes: [wp("a")] });
    commentsImpl = async () => {
      throw new Error("ENOTFOUND");
    };
    await expect(HomePage()).rejects.toThrow("ENOTFOUND");
  });
});
