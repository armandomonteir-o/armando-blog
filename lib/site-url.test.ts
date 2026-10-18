import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SITE_URL, absoluteUrl, getSiteUrl } from "./site-url";

afterEach(() => vi.unstubAllEnvs());

describe("getSiteUrl", () => {
  it("falls back to the Vercel address when the variable is missing or blank", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "   ");
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
    expect(DEFAULT_SITE_URL).toBe("https://armando-blog.vercel.app");
  });

  it("uses the variable and drops trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://blog.armandomonteiro.com/");
    expect(getSiteUrl()).toBe("https://blog.armandomonteiro.com");
  });

  it("ignores a value that is not an http(s) URL instead of emitting broken links", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "blog.armandomonteiro.com");
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
  });
});

describe("absoluteUrl", () => {
  it("joins the base and a path", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://x.test/");
    expect(absoluteUrl("/posts")).toBe("https://x.test/posts");
    expect(absoluteUrl("/")).toBe("https://x.test");
  });
});
