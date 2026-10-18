import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  adaptHomeComment,
  adaptWPPost,
  adaptWPPostDetail,
  formatWPDate,
  pickFeaturedPost,
  stripHtml,
} from "./adapters";
import type { WPPost, WPPostDetail, WPRecentComment } from "./types";

const post: WPPost = {
  id: "cG9zdDo0Mg==",
  databaseId: 42,
  slug: "arte-e-codigo",
  title: "Arte e código",
  excerpt: "<p>Um resumo <strong>curto</strong>.</p>\n",
  date: "2026-04-10T12:00:00",
  commentCount: 3,
  isSticky: false,
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
      reads: null,
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

  // The body is always a list of sections of blocks (#84). Without Gutenberg blocks, the text
  // goes in one section of paragraph blocks, as before.
  const texts = (out: ReturnType<typeof adaptWPPostDetail>) =>
    out.sections.map((s) => ({
      id: s.id,
      title: s.title,
      paragraphs: s.blocks.map((b) => b.attributes?.content),
    }));

  it("uses the whole content as one section when there are no blocks and no ACF sections", () => {
    expect(texts(adaptWPPostDetail(detail))).toEqual([
      { id: "content", title: "", paragraphs: ["Corpo do post."] },
    ]);
  });

  it("splits the fallback text into paragraphs and keeps entities escaped, to be shown as text", () => {
    const out = adaptWPPostDetail({ ...detail, content: "<p>A &amp; B</p>\n\n<p>C &lt;d&gt;</p>" });
    expect(texts(out)[0].paragraphs).toEqual(["A &amp; B", "C &lt;d&gt;"]);
  });

  it("keeps the fallback text as text: a literal < never becomes a tag", () => {
    const out = adaptWPPostDetail({ ...detail, content: "<p>1 &lt; 2 &lt;script&gt;</p>" });
    expect(out.sections[0].blocks[0].attributes?.content).toBe("1 &lt; 2 &lt;script&gt;");
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
    expect(texts(out)).toEqual([{ id: "intro", title: "Intro", paragraphs: ["Olá"] }]);
    expect(out.subtitle).toBe("Subtítulo");
    expect(out.readTime).toBe("8 min");
  });

  describe("with Gutenberg blocks", () => {
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

    it("builds the sections from the blocks, which win over the plain content", () => {
      const out = adaptWPPostDetail(detail, [heading("Um"), para("a"), heading("Dois"), para("b")]);
      expect(texts(out)).toEqual([
        { id: "um", title: "Um", paragraphs: ["a"] },
        { id: "dois", title: "Dois", paragraphs: ["b"] },
      ]);
    });

    it("falls back to the plain content when WordPress returns no blocks", () => {
      expect(texts(adaptWPPostDetail(detail, []))).toEqual([
        { id: "content", title: "", paragraphs: ["Corpo do post."] },
      ]);
      expect(texts(adaptWPPostDetail(detail, null))[0].id).toBe("content");
    });
  });

  it("has no read or like count, because the site does not measure either (#71)", () => {
    const out = adaptWPPostDetail(detail);
    expect(out.reads).toBeNull();
    expect(out.likes).toBeNull();
  });

  it("computes the reading time from the text when ACF has none, instead of inventing one", () => {
    const words = (n: number) => `<p>${Array.from({ length: n }, () => "palavra").join(" ")}</p>`;
    expect(adaptWPPostDetail({ ...detail, content: words(450) }).readTime).toBe("3 min");
    expect(adaptWPPostDetail({ ...detail, content: words(1) }).readTime).toBe("1 min");
  });

  it("falls back to an avatar file that exists when the author has none", () => {
    const noAvatar = {
      ...detail,
      author: { node: { name: "Armando", description: "", avatar: null } },
    } as unknown as WPPostDetail;
    const { avatar } = adaptWPPostDetail(noAvatar).author;
    expect(existsSync(join(process.cwd(), "public", avatar))).toBe(true);
  });
});

describe("pickFeaturedPost (#72)", () => {
  const p = (slug: string, isSticky: boolean | null): WPPost => ({ ...post, slug, isSticky });

  it("prefers a sticky post, WordPress's native way of pinning one", () => {
    expect(pickFeaturedPost([p("a", false), p("b", true), p("c", true)])?.slug).toBe("b");
  });

  it("falls back to the newest post, which WordPress lists first, when none is pinned", () => {
    expect(pickFeaturedPost([p("novo", false), p("velho", null)])?.slug).toBe("novo");
  });

  it("is null when there are no posts at all", () => {
    expect(pickFeaturedPost([])).toBeNull();
  });
});

describe("adaptHomeComment (#72)", () => {
  const comment: WPRecentComment = {
    id: "c1",
    date: "2026-05-17 17:04:54",
    content: "<p>Gostei <strong>muito</strong>.</p>\n",
    author: { node: { name: "Ana", avatar: { url: "https://exemplo.com/ana.jpg" } } },
    commentedOn: { node: { slug: "arte-e-codigo", title: "Arte e código" } },
  };

  it("keeps only what WordPress has: author, plain text, day, avatar and the post it is on", () => {
    expect(adaptHomeComment(comment)).toEqual({
      id: "c1",
      name: "Ana",
      avatar: "https://exemplo.com/ana.jpg",
      text: "Gostei muito.",
      date: "17 mai 2026",
      postSlug: "arte-e-codigo",
      postTitle: "Arte e código",
    });
  });

  it("drops a comment that is not on a post, such as one on a page", () => {
    expect(adaptHomeComment({ ...comment, commentedOn: { node: {} } })).toBeNull();
    expect(adaptHomeComment({ ...comment, commentedOn: null })).toBeNull();
  });

  it("uses the local avatar when the commenter has none", () => {
    const noAvatar = { ...comment, author: { node: { name: "Ana", avatar: null } } };
    expect(adaptHomeComment(noAvatar)?.avatar).toBe("/avatar-pixel-art.png");
  });
});
