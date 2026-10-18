import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

async function allHeaders(): Promise<Record<string, string>> {
  const rules = await nextConfig.headers?.();
  expect(rules).toBeDefined();
  const rule = rules!.find((r) => r.source === "/:path*");
  expect(rule, "headers() must cover every route with /:path*").toBeDefined();
  return Object.fromEntries(rule!.headers.map((h) => [h.key, h.value]));
}

function directive(csp: string, name: string): string[] {
  const part = csp
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${name} `) || p === name);
  return part ? part.split(/\s+/).slice(1) : [];
}

const REPORT_ONLY = "Content-Security-Policy-Report-Only";

describe("security headers (#135)", () => {
  it("blocks MIME sniffing", async () => {
    expect((await allHeaders())["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("limits the referrer sent to other sites", async () => {
    expect((await allHeaders())["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("turns off the browser features the site does not use", async () => {
    const policy = (await allHeaders())["Permissions-Policy"];
    for (const feature of ["camera", "microphone", "geolocation", "payment", "usb"]) {
      expect(policy).toContain(`${feature}=()`);
    }
  });

  it("forbids being framed, in both the old and the new way", async () => {
    const h = await allHeaders();
    expect(h["X-Frame-Options"]).toBe("DENY");
    expect(directive(h[REPORT_ONLY], "frame-ancestors")).toEqual(["'none'"]);
  });

  it("does not repeat the HSTS that Vercel already sends", async () => {
    expect(await allHeaders()).not.toHaveProperty("Strict-Transport-Security");
  });

  it("ships the CSP in report-only mode, never enforced yet", async () => {
    const h = await allHeaders();
    expect(h).toHaveProperty(REPORT_ONLY);
    expect(h).not.toHaveProperty("Content-Security-Policy");
  });

  describe("CSP allow-list", () => {
    it("allows every image host from images.remotePatterns", async () => {
      const img = directive((await allHeaders())[REPORT_ONLY], "img-src");
      const hosts = nextConfig.images!.remotePatterns!.map((p) => {
        const u = p as { protocol?: string; hostname: string };
        return `${u.protocol ?? "https"}://${u.hostname}`;
      });
      expect(hosts.length).toBeGreaterThan(0);
      for (const host of hosts) expect(img).toContain(host);
    });

    it("keeps Vercel Analytics working", async () => {
      const csp = (await allHeaders())[REPORT_ONLY];
      expect(directive(csp, "script-src")).toContain("https://va.vercel-scripts.com");
      expect(directive(csp, "connect-src")).toContain("https://vitals.vercel-insights.com");
    });

    it("lets the Google sign-in form redirect to Google", async () => {
      const csp = (await allHeaders())[REPORT_ONLY];
      expect(directive(csp, "form-action")).toContain("https://accounts.google.com");
    });

    it("allows the audio of the now-playing widget", async () => {
      const csp = (await allHeaders())[REPORT_ONLY];
      expect(directive(csp, "media-src")).toContain("https://cdn.pixabay.com");
    });

    it("closes plugins and the base tag", async () => {
      const csp = (await allHeaders())[REPORT_ONLY];
      expect(directive(csp, "object-src")).toEqual(["'none'"]);
      expect(directive(csp, "base-uri")).toEqual(["'self'"]);
      expect(directive(csp, "default-src")).toEqual(["'self'"]);
    });
  });
});
