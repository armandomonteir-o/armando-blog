import { afterEach, describe, expect, it, vi } from "vitest";
import { isNewsletterEnabled } from "./features";
import { NewsletterWidget } from "@/components/layout/newsletter/NewsletterWidget";

afterEach(() => vi.unstubAllEnvs());

// #112: the newsletter widget validates the e-mail and shows "subscribed", but throws the e-mail
// away. A screen must not promise what the system doesn't do, so it stays hidden until there is
// a real newsletter, and only an explicit "true" turns it on.
describe("isNewsletterEnabled", () => {
  it("is off when the variable is not set", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_NEWSLETTER", undefined as unknown as string);
    expect(isNewsletterEnabled()).toBe(false);
  });

  it.each(["", "false", "0", "1", "yes", "TRUE", " true"])("is off for %j", (value) => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_NEWSLETTER", value);
    expect(isNewsletterEnabled()).toBe(false);
  });

  it("is on only for the exact string true", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_NEWSLETTER", "true");
    expect(isNewsletterEnabled()).toBe(true);
  });
});

describe("NewsletterWidget", () => {
  it("renders nothing while the newsletter is off, not even an empty wrapper", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_NEWSLETTER", "false");
    expect(NewsletterWidget()).toBeNull();
  });

  it("renders the form when the newsletter is on", () => {
    vi.stubEnv("NEXT_PUBLIC_ENABLE_NEWSLETTER", "true");
    expect(NewsletterWidget()).not.toBeNull();
  });
});
