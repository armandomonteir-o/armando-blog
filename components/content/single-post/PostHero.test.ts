import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PostHero } from "./PostHero";

const baseProps = {
  title: "Título",
  subtitle: "Sub",
  category: "Blog",
  date: "10 abr 2026",
  readTime: "3 min",
  comments: 18,
  heroImage: "https://exemplo.com/h.jpg",
  categoryColors: {},
};

describe("PostHero stats", () => {
  it("shows a dash, not a number, for reads and likes the site does not measure (#71)", () => {
    const html = renderToStaticMarkup(
      createElement(PostHero, { ...baseProps, reads: null, likes: null })
    );
    expect(html.match(/—/g)?.length).toBe(2);
    expect(html).toContain(">18<");
    expect(html).not.toMatch(/>0</);
  });
});
