import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TableOfContents } from "./TableOfContents";

describe("TableOfContents", () => {
  it("shows a dash when the read count is not measured (#71)", () => {
    const html = renderToStaticMarkup(
      createElement(TableOfContents, {
        sections: [{ id: "a", title: "A" }],
        readTime: "3 min",
        reads: null,
      })
    );
    expect(html).toContain("—");
  });
});
