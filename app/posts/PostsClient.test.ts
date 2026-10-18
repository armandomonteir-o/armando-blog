import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PostsClient from "./PostsClient";
import { posts as mockPosts, type Post } from "@/constants/posts";

const post = (id: number, category: string): Post => ({
  id,
  title: `Post real ${id}`,
  slug: `post-real-${id}`,
  category,
  date: "10 abr 2026",
  reads: null,
  comments: 0,
  image: "https://exemplo.com/i.jpg",
  excerpt: "Resumo real.",
});

describe("PostsClient (#70)", () => {
  it("lists the posts it is given, with the count and the categories derived from them", () => {
    const html = renderToStaticMarkup(
      createElement(PostsClient, { posts: [post(1, "Design"), post(2, "Arte"), post(3, "Design")] })
    );
    expect(html).toContain("Post real 1");
    expect(html).toContain("Post real 3");
    expect(html).toContain('href="/post/post-real-2"');
    expect(html).toMatch(/3\s*ENTRIES FOUND/);
    expect(html).toContain("DESIGN");
    expect(html).toContain("ARTE");
  });

  it("shows nothing from the mock list", () => {
    const html = renderToStaticMarkup(createElement(PostsClient, { posts: [post(1, "Design")] }));
    for (const mock of mockPosts) expect(html).not.toContain(mock.title);
    expect(html).not.toContain("/void/corrupted");
  });

  it("shows an honest empty state, not the mock list, when there are no posts", () => {
    const html = renderToStaticMarkup(createElement(PostsClient, { posts: [] }));
    expect(html).toContain("NENHUM POST PUBLICADO");
    for (const mock of mockPosts) expect(html).not.toContain(mock.title);
  });
});
