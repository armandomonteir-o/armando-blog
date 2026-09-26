import { describe, expect, it } from "vitest";
import { adaptWPPost, adaptWPPostDetail, formatWPDate, stripHtml } from "./adapters";
import type { WPPost, WPPostDetail } from "./types";

const post: WPPost = {
  id: "cG9zdDo0Mg==",
  databaseId: 42,
  slug: "arte-e-codigo",
  title: "Arte e código",
  excerpt: "<p>Um resumo <strong>curto</strong>.</p>\n",
  date: "2026-04-10T12:00:00",
  commentCount: 3,
  categories: { nodes: [{ name: "Tecnologia", slug: "tecnologia" }] },
  featuredImage: { node: { sourceUrl: "https://exemplo.com/destaque.jpg" } },
  acfPostFields: null,
};

describe("formatWPDate", () => {
  it("formats a WordPress date as day, short month and year, single-spaced", () => {
    expect(formatWPDate("2026-04-10T12:00:00")).toBe("10 abr 2026");
    expect(formatWPDate("2026-09-01T12:00:00")).toBe("01 set 2026");
  });

  it("names every month the way the site writes them", () => {
    const months = Array.from(
      { length: 12 },
      (_, i) => formatWPDate(`2026-${String(i + 1).padStart(2, "0")}-15T12:00:00`).split(" ")[1]
    );
    expect(months).toEqual([
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ]);
  });

  it("reads the comment format, which uses a space instead of T", () => {
    // WPGraphQL sends Comment.date like this; parsing it with new Date() is engine-defined.
    expect(formatWPDate("2026-05-17 17:04:54")).toBe("17 mai 2026");
  });

  it.each(["UTC", "Pacific/Kiritimati", "Pacific/Pago_Pago", "America/Sao_Paulo"])(
    "keeps the WordPress day near midnight when the runtime is in %s",
    (tz) => {
      const original = process.env.TZ;
      process.env.TZ = tz;
      try {
        expect(formatWPDate("2026-04-10T23:59:59")).toBe("10 abr 2026");
        expect(formatWPDate("2026-04-10 00:00:01")).toBe("10 abr 2026");
      } finally {
        process.env.TZ = original;
      }
    }
  );

  it.each([[""], ["não é data"], [null], [undefined]])(
    "returns an empty string for %j instead of throwing or inventing a date",
    (input) => {
      expect(formatWPDate(input as unknown as string)).toBe("");
    }
  );
});

describe("stripHtml", () => {
  it("removes tags and surrounding whitespace", () => {
    expect(stripHtml("<p>Um <em>texto</em></p>\n")).toBe("Um texto");
  });
});

describe("adaptWPPost", () => {
  it("maps a WPGraphQL post to the card shape", () => {
    expect(adaptWPPost(post)).toEqual({
      id: 42,
      title: "Arte e código",
      slug: "arte-e-codigo",
      category: "Tecnologia",
      date: "10 abr 2026",
      reads: 0,
      comments: 3,
      image: "https://exemplo.com/destaque.jpg",
      excerpt: "Um resumo curto.",
    });
  });

  it("prefers the ACF hero image over the featured image", () => {
    const withHero: WPPost = {
      ...post,
      acfPostFields: {
        heroImage: { node: { sourceUrl: "https://exemplo.com/hero.jpg" } },
        readingTime: null,
        isFeatured: null,
        subtitle: null,
        postSections: null,
      },
    };
    expect(adaptWPPost(withHero).image).toBe("https://exemplo.com/hero.jpg");
  });

  it("falls back when category, comment count and images are missing", () => {
    const bare: WPPost = {
      ...post,
      categories: { nodes: [] },
      commentCount: null,
      featuredImage: null,
    };
    const card = adaptWPPost(bare);
    expect(card.category).toBe("Blog");
    expect(card.comments).toBe(0);
    expect(card.image).toMatch(/^https:\/\/images\.unsplash\.com\//);
  });
});

describe("adaptWPPostDetail", () => {
  const detail: WPPostDetail = {
    ...post,
    content: "<p>Corpo do post.</p>",
    author: {
      node: { name: "Armando", description: "", avatar: { url: "https://exemplo.com/a.jpg" } },
    },
    comments: { nodes: [] },
  };

  it("uses the whole content as one section when ACF has no sections", () => {
    expect(adaptWPPostDetail(detail).sections).toEqual([
      { id: "content", title: "", content: "Corpo do post." },
    ]);
  });

  it("uses the ACF sections when there are any", () => {
    const withSections: WPPostDetail = {
      ...detail,
      acfPostFields: {
        heroImage: null,
        readingTime: "8 min",
        isFeatured: null,
        subtitle: "Subtítulo",
        postSections: [{ sectionId: "intro", sectionTitle: "Intro", sectionContent: "<p>Olá</p>" }],
      },
    };
    const out = adaptWPPostDetail(withSections);
    expect(out.sections).toEqual([{ id: "intro", title: "Intro", content: "Olá" }]);
    expect(out.subtitle).toBe("Subtítulo");
    expect(out.readTime).toBe("8 min");
  });
});
