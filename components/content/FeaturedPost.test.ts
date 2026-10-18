import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FeaturedPost } from "./FeaturedPost";
import type { Post } from "@/constants/posts";

const post: Post = {
  id: 7,
  title: "Neobrutalism e a Web",
  slug: "neobrutalism-e-a-web",
  category: "Design",
  date: "16 mai 2026",
  reads: null,
  comments: 2,
  image: "https://exemplo.com/capa.jpg",
  excerpt: "Bordas grossas e sombras duras.",
};

describe("FeaturedPost (#72)", () => {
  it("shows the real post: title, excerpt, link, category, date and comment count", () => {
    const html = renderToStaticMarkup(createElement(FeaturedPost, { post }));
    expect(html).toContain("Neobrutalism e a Web");
    expect(html).toContain("Bordas grossas e sombras duras.");
    expect(html).toContain('href="/post/neobrutalism-e-a-web"');
    expect(html).toContain("Design");
    expect(html).toContain("16 mai 2026");
  });

  it("carries nothing from the old fixed post or its invented numbers", () => {
    const html = renderToStaticMarkup(createElement(FeaturedPost, { post }));
    for (const invented of ["REVOLUCAO", "a-revolucao-do-algoritmo", "42+", "#1", "reacoes"]) {
      expect(html).not.toContain(invented);
    }
  });

  it("renders nothing when there is no post", () => {
    expect(renderToStaticMarkup(createElement(FeaturedPost, { post: null }))).toBe("");
  });
});
