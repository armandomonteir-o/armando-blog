import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ErrorPage from "./error";

describe("error.tsx", () => {
  it("tells the visitor the content server failed and offers a retry", () => {
    const html = renderToStaticMarkup(
      createElement(ErrorPage, { error: new Error("boom"), retry: () => {} })
    );

    expect(html).toContain("nao consegui falar com o servidor");
    expect(html).toContain("Tentar de Novo");
    expect(html).not.toContain("boom");
  });
});
