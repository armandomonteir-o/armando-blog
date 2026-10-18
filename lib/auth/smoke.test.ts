import { describe, expect, it } from "vitest";

// Smoke test against the published site. Regression for #91: /api/auth/providers answered 500
// in production because AUTH_SECRET, AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET were missing from
// Vercel, while build and CI stayed green. Opt-in, because it needs the network:
//   SMOKE_TEST=1 npm test                                  (checks production)
//   SMOKE_TEST=1 SMOKE_URL=https://<preview>.vercel.app npm test
const smoke = process.env.SMOKE_TEST === "1";
const baseUrl = (process.env.SMOKE_URL ?? "https://armando-blog.vercel.app").replace(/\/$/, "");

describe.runIf(smoke)(`auth config on ${baseUrl}`, () => {
  it("lists the google provider", async () => {
    const res = await fetch(`${baseUrl}/api/auth/providers`);

    expect(
      res.status,
      "Expected 200. A 500 here means the Auth.js config is broken: check AUTH_SECRET, " +
        "AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in the Vercel environment (Production), then redeploy."
    ).toBe(200);

    const providers = await res.json();
    expect(providers.google?.id).toBe("google");
  });
});
