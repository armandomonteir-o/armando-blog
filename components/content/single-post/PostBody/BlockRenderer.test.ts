import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import fixture from "@/lib/blocks/fixture-editor-blocks.json";
import type { EditorBlock } from "@/lib/blocks";

// next/image needs the Next runtime; what matters here is the markup around it.
vi.mock("@/components/ui/AppImage", () => ({
  AppImage: (props: { src: string; alt: string; unoptimized?: boolean }) =>
    createElement("img", {
      src: props.src,
      alt: props.alt,
      "data-unoptimized": String(Boolean(props.unoptimized)),
    }),
}));

import { BlockRenderer } from "./BlockRenderer";

const render = (block: EditorBlock) =>
  renderToStaticMarkup(createElement(BlockRenderer, { block }));
const blocks = fixture as unknown as EditorBlock[];
const named = (name: string) => blocks.find((b) => b.name === name)!;
const block = (
  name: string,
  attributes: Record<string, unknown> | null,
  extra = {}
): EditorBlock => ({
  __typename: "X",
  name,
  clientId: name,
  renderedHtml: "",
  attributes,
  ...extra,
});

describe("BlockRenderer with a real post", () => {
  const html = blocks.map(render).join("\n");

  it("renders every block of the example post", () => {
    expect(html).toContain("<h3");
    expect(html).toContain("<ul");
    expect(html).toContain("<ol");
    expect(html).toContain("<li ");
    expect(html).toContain("<blockquote");
    expect(html).toContain("<pre");
    expect(html).toContain("Legenda da foto");
    expect(html).toContain("Alguém Famoso");
  });

  it("keeps the bold, italic and link of a paragraph, with a safe link", () => {
    const p = render(named("core/paragraph"));
    expect(p).toContain("<strong>negrito</strong>");
    expect(p).toContain("<em>itálico</em>");
    expect(p).toContain('rel="noopener noreferrer"');
  });

  it("nests the items inside their list", () => {
    const ul = render(named("core/list"));
    expect(ul).toMatch(
      /<ul[^>]*><li[^>]*><span>item um<\/span><\/li><li[^>]*><span>item <a[^>]*>dois<\/a><\/span><\/li><\/ul>/
    );
  });

  it("shows code as text, escaped once, not run and not double-escaped", () => {
    const code = render(named("core/code"));
    expect(code).toContain("const x = 1 &lt; 2 &amp;&amp; &quot;ok&quot;;");
    expect(code).not.toContain("&amp;lt;");
  });

  it("shows an embed as a link, with no iframe or script from the provider", () => {
    const embed = render(named("core/embed"));
    expect(embed).toContain("EMBED.LNK");
    expect(embed).toContain("YOUTUBE");
    expect(embed).toContain('href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"');
    expect(embed).not.toContain("<iframe");
  });

  it("strips the script and the handler from a raw html block", () => {
    const raw = render(named("core/html"));
    expect(raw).not.toContain("<script");
    expect(raw).not.toContain("onclick");
    expect(raw).not.toContain("alert");
  });
});

describe("BlockRenderer safety", () => {
  it("drops a javascript: link inside a paragraph", () => {
    const out = render(
      block("core/paragraph", { content: '<a href="javascript:alert(1)">x</a><script>1</script>' })
    );
    expect(out).not.toContain("javascript:");
    expect(out).not.toContain("<script");
  });

  it("renders an unknown block from its html, without anything active", () => {
    const out = render({
      ...block("acme/custom", null),
      renderedHtml: '<p>ok</p><iframe src="https://e.x"></iframe><img src=x onerror=x()>',
    });
    expect(out).toContain("<p>ok</p>");
    expect(out).not.toContain("iframe");
    expect(out).not.toContain("onerror");
  });

  it("renders nothing for an unknown block with no html", () => {
    expect(render(block("acme/empty", null))).toBe("");
  });

  it("renders nothing for an image or an embed with an unsafe url", () => {
    expect(render(block("core/image", { url: "javascript:alert(1)" }))).toBe("");
    expect(render(block("core/embed", { url: "data:text/html,x" }))).toBe("");
  });

  it("does not optimize an image from a host Next doesn't know, which would crash the page", () => {
    const out = render(
      block("core/image", { url: "https://desconhecido.example/a.jpg", alt: "a" })
    );
    expect(out).toContain('data-unoptimized="true"');
  });

  it("escapes a heading, so a < in its text is not a tag", () => {
    const out = render(block("core/heading", { content: "1 &lt; 2", level: 3 }));
    expect(out).toContain("1 &lt; 2");
    expect(out).not.toContain("<2");
  });
});
