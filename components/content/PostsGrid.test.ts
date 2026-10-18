import { createElement, type FunctionComponent } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PostsGrid } from "./PostsGrid";
import { posts as mockPosts, type Post } from "@/constants/posts";

describe("PostsGrid", () => {
  it("shows an honest empty state, and no mock post, when given an empty list", () => {
    const html = renderToStaticMarkup(
      createElement(PostsGrid as FunctionComponent<{ posts?: Post[] }>, { posts: [] })
    );

    expect(html).toContain("NENHUM POST PUBLICADO");
    expect(html).toContain("0 ENTRIES FOUND");
    for (const mock of mockPosts) expect(html).not.toContain(mock.title);
  });
});
