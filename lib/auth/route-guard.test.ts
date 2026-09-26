import { describe, expect, it, vi } from "vitest";
import { NextRequest, type NextResponse } from "next/server";
// The Next 16.3 docs call it unstable_doesProxyMatch, but the package still exports the old name.
import { getRedirectUrl, unstable_doesMiddlewareMatch } from "next/experimental/testing/server";

// auth(handler) wraps the handler and puts the session on req.auth; here it just passes it through,
// and each test sets req.auth itself.
vi.mock("@/auth", () => ({ auth: (handler: unknown) => handler }));

import proxy, { config } from "@/proxy";
import { guardRedirect } from "./route-guard";

type ProxyRequest = NextRequest & { auth: unknown };
const run = (path: string, session: unknown) => {
  const req = new NextRequest(`https://armando.test${path}`) as ProxyRequest;
  req.auth = session;
  return (proxy as unknown as (req: ProxyRequest) => NextResponse | undefined)(req);
};

describe("guardRedirect", () => {
  it("sends a visitor from the account page to login, keeping where they came from", () => {
    expect(guardRedirect("/minha-conta", false)).toBe("/login?callbackUrl=%2Fminha-conta");
  });

  it("protects paths under the account page too", () => {
    expect(guardRedirect("/minha-conta/avatar", false)).toBe(
      "/login?callbackUrl=%2Fminha-conta%2Favatar"
    );
  });

  it("lets a signed-in user into the account page", () => {
    expect(guardRedirect("/minha-conta", true)).toBeNull();
  });

  it("sends a signed-in user away from login", () => {
    expect(guardRedirect("/login", true)).toBe("/");
  });

  it("lets a visitor reach login", () => {
    expect(guardRedirect("/login", false)).toBeNull();
  });

  it.each(["/minha-contas", "/minha-conta-antiga", "/login-help", "/loginx"])(
    "does not treat %s as a protected or guest-only route",
    (path) => {
      expect(guardRedirect(path, false)).toBeNull();
      expect(guardRedirect(path, true)).toBeNull();
    }
  );
});

describe("proxy", () => {
  it("redirects a request without session from /minha-conta to /login", () => {
    const res = run("/minha-conta", null);
    expect(getRedirectUrl(res!)).toBe("https://armando.test/login?callbackUrl=%2Fminha-conta");
  });

  it("lets a request with session through", () => {
    expect(run("/minha-conta", { user: { email: "a@b.com" } })).toBeUndefined();
  });

  it.each([
    ["/", true],
    ["/minha-conta", true],
    ["/login", true],
    ["/api/comments", false],
    ["/_next/static/chunk.js", false],
    ["/_next/image", false],
    ["/favicon.ico", false],
  ])("runs on %s: %s", (url, expected) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(expected);
  });
});
