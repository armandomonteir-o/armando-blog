import { describe, expect, it } from "vitest";
import fixture from "./fixture-editor-blocks.json";
import {
  plainText,
  sanitizeFallback,
  sanitizeInline,
  sectionsFromBlocks,
  slugify,
  type EditorBlock,
} from "./index";

const blocks = fixture as unknown as EditorBlock[];

const heading = (content: string, level = 2, anchor: string | null = null): EditorBlock => ({
  __typename: "CoreHeading",
  name: "core/heading",
  clientId: content,
  renderedHtml: "",
  attributes: { content, level, anchor },
});
const paragraph = (content: string): EditorBlock => ({
  __typename: "CoreParagraph",
  name: "core/paragraph",
  clientId: content,
  renderedHtml: "",
  attributes: { content },
});

describe("sectionsFromBlocks", () => {
  it("opens a section at each level-2 heading and keeps the other blocks inside it", () => {
    const sections = sectionsFromBlocks(blocks);
    expect(sections).toHaveLength(1);
    expect(sections[0].title).toBe("Primeira seção");
    expect(sections[0].id).toBe("primeira-secao");
    // paragraph, image, h3, two lists, quote, code, embed, separator, html: the h2 is the title.
    expect(sections[0].blocks.map((b) => b.name)).toEqual([
      "core/paragraph",
      "core/image",
      "core/heading",
      "core/list",
      "core/list",
      "core/quote",
      "core/code",
      "core/embed",
      "core/separator",
      "core/html",
    ]);
  });

  it("keeps a smaller heading as content, not as a new section", () => {
    const sections = sectionsFromBlocks([heading("A"), heading("sub", 3), paragraph("x")]);
    expect(sections).toHaveLength(1);
    expect(sections[0].blocks.map((b) => b.name)).toEqual(["core/heading", "core/paragraph"]);
  });

  it("puts what comes before the first heading in an untitled intro section", () => {
    const sections = sectionsFromBlocks([
      paragraph("abertura"),
      heading("Primeira"),
      paragraph("b"),
    ]);
    expect(sections.map((s) => s.title)).toEqual(["", "Primeira"]);
    expect(sections[0].id).toBe("intro");
  });

  it("returns no sections for no blocks", () => {
    expect(sectionsFromBlocks([])).toEqual([]);
  });

  it("gives repeated titles different ids, so the anchors never collide", () => {
    const ids = sectionsFromBlocks([heading("Igual"), heading("Igual"), heading("Igual")]).map(
      (s) => s.id
    );
    expect(ids).toEqual(["igual", "igual-2", "igual-3"]);
  });

  it("uses the anchor the author set, when there is one", () => {
    expect(sectionsFromBlocks([heading("Título", 2, "meu-id")])[0].id).toBe("meu-id");
  });

  it("reads the title as plain text, without tags or entities", () => {
    expect(sectionsFromBlocks([heading("A &amp; B <em>c</em>")])[0].title).toBe("A & B c");
  });

  it("never gives an empty id to a title with no letters", () => {
    expect(sectionsFromBlocks([heading("???")])[0].id).toMatch(/^secao-\d+$/);
  });
});

describe("slugify", () => {
  it("folds accents and punctuation into a url-safe id", () => {
    expect(slugify("Ação & Reação: O Início!")).toBe("acao-reacao-o-inicio");
  });
});

describe("plainText", () => {
  it("strips tags and decodes entities", () => {
    expect(plainText("<strong>a</strong> &lt;b&gt; &amp; &quot;c&quot;")).toBe('a <b> & "c"');
  });
});

describe("sanitizeInline", () => {
  it("keeps the inline formatting an author can use", () => {
    expect(sanitizeInline("a <strong>b</strong> <em>c</em> <code>d</code>")).toBe(
      "a <strong>b</strong> <em>c</em> <code>d</code>"
    );
  });

  it("keeps a link and makes it safe to open", () => {
    const out = sanitizeInline('<a href="https://example.com/x?a=1&amp;b=2">l</a>');
    expect(out).toContain('href="https://example.com/x?a=1&amp;b=2"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it.each([
    ["a script tag", "<script>alert(1)</script>ok", "ok"],
    ["an event handler", '<strong onclick="x()">ok</strong>', "<strong>ok</strong>"],
    [
      "a javascript: link",
      '<a href="javascript:alert(1)">ok</a>',
      '<a rel="noopener noreferrer">ok</a>',
    ],
    ["an iframe", '<iframe src="https://evil.example"></iframe>ok', "ok"],
    ["an image (not inline content)", '<img src="x" onerror="x()">ok', "ok"],
    ["a style attribute", '<strong style="position:fixed">ok</strong>', "<strong>ok</strong>"],
  ])("strips %s", (_name, input, expected) => {
    expect(sanitizeInline(input)).toBe(expected);
  });

  it("drops a data: link too", () => {
    expect(sanitizeInline('<a href="data:text/html,<script>1</script>">ok</a>')).not.toContain(
      "data:"
    );
  });
});

describe("sanitizeFallback", () => {
  it("keeps structure from an unknown block", () => {
    const out = sanitizeFallback(
      '<h3>t</h3><p>a <a href="https://example.com">b</a></p><ul><li>x</li></ul><blockquote>q</blockquote>'
    );
    expect(out).toContain("<h3>t</h3>");
    expect(out).toContain("<li>x</li>");
    expect(out).toContain("<blockquote>q</blockquote>");
  });

  it("removes the script and the handler from a raw html block", () => {
    const out = sanitizeFallback('<script>alert("xss")</script><div onclick="x()">html cru</div>');
    expect(out).not.toContain("script");
    expect(out).not.toContain("onclick");
    expect(out).not.toContain("alert");
    expect(out).toContain("html cru");
  });

  it("removes an iframe and a form", () => {
    const out = sanitizeFallback(
      '<iframe src="https://e.x"></iframe><form action="/x"><input></form>t'
    );
    expect(out).toBe("t");
  });
});
