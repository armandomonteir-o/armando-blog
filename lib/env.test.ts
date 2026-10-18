import { describe, expect, it } from "vitest";
import { EnvError, assertEnv, checkEnv } from "./env";

// #134: forgetting a variable on Vercel used to show up as a generic 500 in production (#91). The
// check names what is wrong, all at once, and never prints a value.

const WP = "https://wp.example.com/graphql";

const productionEnv = {
  VERCEL_ENV: "production",
  WORDPRESS_API_URL: WP,
  AUTH_SECRET: "a".repeat(44),
  AUTH_GOOGLE_ID: "google-id",
  AUTH_GOOGLE_SECRET: "google-secret",
  WP_APP_USER: "robot",
  WP_APP_PASSWORD: "abcd efgh ijkl",
  REVALIDATE_SECRET: "b".repeat(44),
};

describe("checkEnv: where only WordPress is needed (local, CI, preview)", () => {
  it("accepts just WORDPRESS_API_URL", () => {
    expect(checkEnv({ WORDPRESS_API_URL: WP })).toEqual({ errors: [], warnings: [] });
  });

  it("names WORDPRESS_API_URL when it is missing, or blank", () => {
    expect(checkEnv({}).errors).toEqual([expect.stringContaining("WORDPRESS_API_URL")]);
    expect(checkEnv({ WORDPRESS_API_URL: "   " }).errors[0]).toContain("WORDPRESS_API_URL");
  });

  it("rejects a value that is not an http(s) URL", () => {
    const { errors } = checkEnv({ WORDPRESS_API_URL: "wp.example.com/graphql" });
    expect(errors[0]).toContain("WORDPRESS_API_URL");
    expect(errors[0]).toContain("http");
  });

  it("allows plain http on a developer machine, but not on a Vercel deploy", () => {
    expect(checkEnv({ WORDPRESS_API_URL: "http://localhost:8080/graphql" }).errors).toEqual([]);
    const { errors } = checkEnv({
      VERCEL_ENV: "preview",
      WORDPRESS_API_URL: "http://wp.example.com/graphql",
    });
    expect(errors[0]).toContain("https");
  });

  it("does not ask for the production-only variables on a preview deploy", () => {
    expect(checkEnv({ VERCEL_ENV: "preview", WORDPRESS_API_URL: WP }).errors).toEqual([]);
  });
});

describe("checkEnv: a production deploy on Vercel", () => {
  it("accepts the full set", () => {
    expect(checkEnv(productionEnv)).toEqual({ errors: [], warnings: [] });
  });

  it("lists every missing variable by name, in one pass", () => {
    const { errors } = checkEnv({ VERCEL_ENV: "production", WORDPRESS_API_URL: WP });
    const text = errors.join("\n");
    for (const name of [
      "AUTH_SECRET",
      "AUTH_GOOGLE_ID",
      "AUTH_GOOGLE_SECRET",
      "WP_APP_USER",
      "WP_APP_PASSWORD",
      "REVALIDATE_SECRET",
    ]) {
      expect(text).toContain(name);
    }
    expect(errors).toHaveLength(6);
  });

  it("rejects a secret that is too short, without printing it", () => {
    const { errors } = checkEnv({ ...productionEnv, AUTH_SECRET: "tooshort-S3CR3T" });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("AUTH_SECRET");
    expect(errors[0]).toContain("32");
    expect(errors[0]).not.toContain("S3CR3T");
  });
});

describe("checkEnv: feature flags and the public URL only warn", () => {
  it("accepts the flags as true, false or unset", () => {
    for (const value of ["true", "false", undefined, ""]) {
      const env = { WORDPRESS_API_URL: WP, NEXT_PUBLIC_ENABLE_NEWSLETTER: value };
      expect(checkEnv(env).warnings).toEqual([]);
    }
  });

  it("warns about a value that looks like on but that the code reads as off", () => {
    const { errors, warnings } = checkEnv({
      WORDPRESS_API_URL: WP,
      NEXT_PUBLIC_ENABLE_NOTIFICATIONS: "TRUE",
    });
    expect(errors).toEqual([]);
    expect(warnings).toEqual([expect.stringContaining("NEXT_PUBLIC_ENABLE_NOTIFICATIONS")]);
  });

  it("warns about a NEXT_PUBLIC_SITE_URL that would be ignored", () => {
    const { errors, warnings } = checkEnv({
      WORDPRESS_API_URL: WP,
      NEXT_PUBLIC_SITE_URL: "blog.example.com",
    });
    expect(errors).toEqual([]);
    expect(warnings[0]).toContain("NEXT_PUBLIC_SITE_URL");
  });
});

describe("assertEnv", () => {
  it("does not throw when everything is right", () => {
    expect(() => assertEnv({ WORDPRESS_API_URL: WP })).not.toThrow();
  });

  it("throws an EnvError that names every problem and carries no value", () => {
    const env = { VERCEL_ENV: "production", WORDPRESS_API_URL: WP, AUTH_SECRET: "x-S3CR3T" };
    let caught: unknown;
    try {
      assertEnv(env);
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(EnvError);
    const message = (caught as EnvError).message;
    expect(message).toContain("AUTH_SECRET");
    expect(message).toContain("REVALIDATE_SECRET");
    expect(message).toContain(".env.example");
    expect(message).not.toContain("S3CR3T");
    expect((caught as EnvError).problems.length).toBeGreaterThan(1);
  });
});
