import { describe, expect, it, vi } from "vitest";
import { posts as mockPosts } from "@/constants/posts";

// Regression for #67: a WordPress failure was turned into "post not found" (404), and a slug that
// exists in the mock list rendered an invented post. A failure must reach error.tsx instead;
// only an explicit "no such post" answer from WordPress is a 404.
let impl: (slug: string) => Promise<unknown> = async () => null;
vi.mock("@/lib/graphql", () => ({ getPost: (slug: string) => impl(slug) }));

const { default: PostPage, generateMetadata } = await import("./page");
const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const is404 = { digest: expect.stringContaining("404") };

describe("PostPage", () => {
  it("propagates the error when WordPress fails, instead of a 404 or a mock post", async () => {
    impl = async () => {
      throw new Error("ENOTFOUND");
    };
    await expect(PostPage(params("qualquer-slug"))).rejects.toThrow("ENOTFOUND");
    await expect(PostPage(params(mockPosts[0].slug))).rejects.toThrow("ENOTFOUND");
  });

  it("is a 404 when WordPress answers that the post does not exist", async () => {
    impl = async () => null;
    await expect(PostPage(params("nao-existe"))).rejects.toMatchObject(is404);
  });

  it("does not render a post that only exists in the mock list", async () => {
    impl = async () => null;
    await expect(PostPage(params(mockPosts[0].slug))).rejects.toMatchObject(is404);
  });
});

describe("generateMetadata", () => {
  it("propagates the error when WordPress fails", async () => {
    impl = async () => {
      throw new Error("ENOTFOUND");
    };
    await expect(generateMetadata(params("qualquer-slug"))).rejects.toThrow("ENOTFOUND");
  });

  it("does not describe a mock post when WordPress says the post does not exist", async () => {
    impl = async () => null;
    const meta = await generateMetadata(params(mockPosts[0].slug));
    expect(meta.title).not.toContain(mockPosts[0].title);
  });
});
