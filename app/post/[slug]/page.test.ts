import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { posts as mockPosts } from "@/constants/posts";

// Regression for #67: a WordPress failure was turned into "post not found" (404), and a slug that
// exists in the mock list rendered an invented post. A failure must reach error.tsx instead;
// only an explicit "no such post" answer from WordPress is a 404.
let impl: (slug: string) => Promise<unknown> = async () => null;
let relatedImpl: () => Promise<unknown> = async () => ({ nodes: [] });
let blocksImpl: () => Promise<unknown> = async () => [];
vi.mock("@/lib/graphql", () => ({
  getPost: (slug: string) => impl(slug),
  getPosts: () => relatedImpl(),
  getPostBlocks: () => blocksImpl(),
}));

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

// #71: the related posts used to be a fixed list with Unsplash images.
const wpPost = (slug: string, title = slug) => ({
  id: slug,
  databaseId: slug.length,
  slug,
  title,
  excerpt: "<p>Resumo</p>",
  date: "2026-04-10T12:00:00",
  commentCount: 0,
  categories: { nodes: [{ name: "Tecnologia", slug: "tecnologia" }] },
  featuredImage: null,
  acfPostFields: null,
  content: "<p>Corpo</p>",
  author: { node: { name: "Armando", description: "", avatar: null } },
  comments: { nodes: [] },
});

function findByType(node: ReactNode, type: unknown): unknown[] {
  if (Array.isArray(node)) return node.flatMap((n) => findByType(n, type));
  if (!isValidElement<{ children?: ReactNode }>(node)) return [];
  const own = node.type === type ? [node] : [];
  return [...own, ...findByType(node.props.children, type)];
}

describe("PostPage related posts", () => {
  it("lists real posts from the same category, without the current one", async () => {
    const { RelatedPosts } = await import("@/components/content/single-post");
    impl = async () => wpPost("atual");
    relatedImpl = async () => ({
      nodes: [wpPost("atual"), wpPost("outro-1"), wpPost("outro-2")],
    });
    const tree = await PostPage(params("atual"));
    const [related] = findByType(tree, RelatedPosts) as { props: { posts: { slug: string }[] } }[];
    expect(related.props.posts.map((p) => p.slug)).toEqual(["outro-1", "outro-2"]);
  });

  it("hides the section when there are no other posts in the category", async () => {
    const { RelatedPosts } = await import("@/components/content/single-post");
    impl = async () => wpPost("atual");
    relatedImpl = async () => ({ nodes: [wpPost("atual")] });
    const tree = await PostPage(params("atual"));
    expect(findByType(tree, RelatedPosts)).toHaveLength(0);
  });

  it("still renders the post, without the section, if only the related query fails", async () => {
    const { RelatedPosts } = await import("@/components/content/single-post");
    impl = async () => wpPost("atual");
    relatedImpl = async () => {
      throw new Error("ENOTFOUND");
    };
    const tree = await PostPage(params("atual"));
    expect(findByType(tree, RelatedPosts)).toHaveLength(0);
  });
});

// #84: the body used to be the content with every tag stripped, cut at blank lines.
describe("PostPage body", () => {
  const heading = (content: string) => ({
    __typename: "CoreHeading",
    name: "core/heading",
    clientId: content,
    renderedHtml: "",
    attributes: { content, level: 2, anchor: null },
  });
  const para = (content: string) => ({
    __typename: "CoreParagraph",
    name: "core/paragraph",
    clientId: content,
    renderedHtml: "",
    attributes: { content },
  });

  it("renders the Gutenberg blocks, and feeds the index with the titled sections", async () => {
    const { BlockRenderer, TableOfContents } = await import("@/components/content/single-post");
    impl = async () => wpPost("atual");
    blocksImpl = async () => [heading("Um"), para("a"), heading("Dois"), para("b")];
    const tree = await PostPage(params("atual"));
    expect(findByType(tree, BlockRenderer)).toHaveLength(2);
    const [toc] = findByType(tree, TableOfContents) as {
      props: { sections: { id: string; title: string }[] };
    }[];
    expect(toc.props.sections).toEqual([
      { id: "um", title: "Um" },
      { id: "dois", title: "Dois" },
    ]);
  });

  it("still shows the text, and logs, when the blocks query fails (plugin missing)", async () => {
    const { BlockRenderer } = await import("@/components/content/single-post");
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});
    impl = async () => wpPost("atual");
    blocksImpl = async () => {
      throw new Error('Cannot query field "editorBlocks" on type "Post"');
    };
    const tree = await PostPage(params("atual"));
    expect(findByType(tree, BlockRenderer)).toHaveLength(1);
    expect(logged).toHaveBeenCalled();
    logged.mockRestore();
  });

  it("does not hide a WordPress outage behind the fallback: the post query still fails the page", async () => {
    impl = async () => {
      throw new Error("ENOTFOUND");
    };
    blocksImpl = async () => [];
    await expect(PostPage(params("atual"))).rejects.toThrow("ENOTFOUND");
  });
});
