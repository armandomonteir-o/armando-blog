import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CommentsSection } from "./CommentsSection";

const comments = [
  {
    id: "c1",
    name: "Ana",
    avatar: "https://exemplo.com/ana.jpg",
    text: "Gostei muito do texto.",
    date: "17 mai 2026",
    postSlug: "arte-e-codigo",
    postTitle: "Arte e código",
  },
];

describe("CommentsSection (#72)", () => {
  it("shows the real comments, each linking to its post", () => {
    const html = renderToStaticMarkup(createElement(CommentsSection, { comments }));
    expect(html).toContain("Ana");
    expect(html).toContain("Gostei muito do texto.");
    expect(html).toContain("17 mai 2026");
    expect(html).toContain('href="/post/arte-e-codigo"');
  });

  it("has no invented rating, total, chart or progress bar", () => {
    const html = renderToStaticMarkup(createElement(CommentsSection, { comments }));
    for (const invented of ["4.4", "127", "ENGAJAMENTO", "DOWNLOADING", "Nicol", "Marco T."]) {
      expect(html).not.toContain(invented);
    }
  });
});
