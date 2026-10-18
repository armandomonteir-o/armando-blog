import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// Regression for #66: a WordPress failure used to be swallowed by the home page, which then
// showed the mock posts (frozen into the static build). Failure must propagate instead.
let impl: () => Promise<unknown> = async () => ({ nodes: [] });
vi.mock("@/lib/graphql", () => ({ getPosts: () => impl() }));

const { default: HomePage } = await import("./page");
const { PostsGrid } = await import("@/components/content/PostsGrid");

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
