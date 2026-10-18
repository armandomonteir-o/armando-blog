import { describe, expect, it } from "vitest";
import { embedLabel, imageFileName, imageSource, safeUrl } from "./media";

describe("safeUrl", () => {
  it.each(["https://example.com/a?b=1", "http://example.com/a"])("accepts %s", (url) => {
    expect(safeUrl(url)).toBe(url);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>1</script>",
    "//example.com/x",
    "/relativo",
    "not a url",
    "",
    null,
    undefined,
    42,
  ])("rejects %j", (url) => {
    expect(safeUrl(url)).toBeNull();
  });
});

describe("imageSource", () => {
  it("optimizes an image from the WordPress host", () => {
    const img = imageSource({ url: "https://armandomonteiro.com/wp-content/a.jpg", alt: "x" });
    expect(img?.optimized).toBe(true);
  });

  it("does not optimize an image from another host, which would crash next/image", () => {
    const img = imageSource({ url: "https://outro-site.example/a.jpg", alt: "x" });
    expect(img?.optimized).toBe(false);
    expect(img?.src).toBe("https://outro-site.example/a.jpg");
  });

  it("uses the size WordPress sent, or a default, never zero or NaN", () => {
    expect(imageSource({ url: "https://a.example/a.jpg", width: 800, height: 600 })).toMatchObject({
      width: 800,
      height: 600,
    });
    const fallback = imageSource({ url: "https://a.example/a.jpg", width: null, height: "x" });
    expect(fallback?.width).toBeGreaterThan(0);
    expect(fallback?.height).toBeGreaterThan(0);
  });

  it("returns an empty alt, not undefined, when the author wrote none", () => {
    expect(imageSource({ url: "https://a.example/a.jpg" })?.alt).toBe("");
  });

  it("returns null for an image with no usable url", () => {
    expect(imageSource({ url: "javascript:alert(1)" })).toBeNull();
    expect(imageSource({})).toBeNull();
    expect(imageSource(null)).toBeNull();
  });
});

describe("embedLabel", () => {
  it("names the provider, and falls back to the host", () => {
    expect(
      embedLabel({ providerNameSlug: "youtube", url: "https://www.youtube.com/watch?v=1" })
    ).toBe("YOUTUBE");
    expect(embedLabel({ url: "https://exemplo.org/x" })).toBe("EXEMPLO.ORG");
  });
});

describe("imageFileName", () => {
  it("shows the file name from the url, in capitals, like a file on the old desktop", () => {
    expect(imageFileName("https://a.example/wp-content/foto.jpg")).toBe("FOTO.JPG");
  });

  it("decodes the name and drops the query string", () => {
    expect(imageFileName("https://a.example/a/Minha%20Foto.png?w=800&auto=format")).toBe(
      "MINHA FOTO.PNG"
    );
  });

  it("shortens a long name but keeps the extension", () => {
    const name = imageFileName(`https://a.example/${"a".repeat(60)}.jpeg`);
    expect(name.length).toBeLessThanOrEqual(24);
    expect(name.endsWith(".JPEG")).toBe(true);
  });

  it("falls back to a generic name when there is none to show", () => {
    expect(imageFileName("https://a.example/")).toBe("IMAGE.PNG");
    expect(imageFileName("not a url")).toBe("IMAGE.PNG");
  });

  it("shortens a long name that has no extension too, with an ellipsis", () => {
    expect(imageFileName("https://a.example/photo-1518770660439-4636190af475")).toBe(
      "PHOTO-1518770660439-463…"
    );
  });
});
