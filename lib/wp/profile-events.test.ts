import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logProfileEvent } from "./profile-events";

// #178: logProfileEvent records a user event in WordPress with the application password. It runs
// next to a save the visitor is waiting for, so it must never throw and never break that save.

let calls: Array<{ url: string; init: RequestInit }> = [];
let respond: () => Promise<Response> = async () => new Response("{}", { status: 200 });

beforeEach(() => {
  calls = [];
  respond = async () => new Response("{}", { status: 200 });
  vi.stubEnv("WORDPRESS_API_URL", "https://wp.example.com/graphql");
  vi.stubEnv("WP_APP_USER", "robot");
  vi.stubEnv("WP_APP_PASSWORD", "abcd efgh ijkl");
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.stubGlobal("fetch", (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return respond();
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("logProfileEvent", () => {
  it("posts the event to the plugin endpoint with the application password", async () => {
    await logProfileEvent({ hash: "h1", event: "nick_change", extra: { from: "a", to: "b" } });

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://wp.example.com/wp-json/armando/v1/profile-event");
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers.Authorization).toBe(
      `Basic ${Buffer.from("robot:abcd efgh ijkl").toString("base64")}`
    );
    const body = JSON.parse(calls[0].init.body as string);
    expect(body).toMatchObject({ hash: "h1", event: "nick_change", extra: { from: "a", to: "b" } });
    expect(new Date(body.at).toString()).not.toBe("Invalid Date");
  });

  it.each([
    ["https://wp.example.com/graphql", "https://wp.example.com"],
    ["https://wp.example.com/graphql/", "https://wp.example.com"],
    ["https://wp.example.com/", "https://wp.example.com"],
  ])("derives the REST address from %s", async (api, base) => {
    vi.stubEnv("WORDPRESS_API_URL", api);
    await logProfileEvent({ hash: "h", event: "login" });
    expect(calls[0].url).toBe(`${base}/wp-json/armando/v1/profile-event`);
  });

  it.each([
    ["WP_APP_USER", ""],
    ["WP_APP_PASSWORD", ""],
    ["WORDPRESS_API_URL", ""],
  ])("does nothing, and does not call WordPress, when %s is not set", async (name, value) => {
    vi.stubEnv(name, value);
    await expect(logProfileEvent({ hash: "h", event: "login" })).resolves.toBeUndefined();
    expect(calls).toEqual([]);
  });

  it("does not throw when the network fails", async () => {
    respond = () => Promise.reject(new Error("ECONNRESET"));
    await expect(logProfileEvent({ hash: "h", event: "login" })).resolves.toBeUndefined();
  });

  it("does not throw when WordPress answers with an error, and logs it", async () => {
    respond = async () => new Response("boom", { status: 500 });
    await expect(logProfileEvent({ hash: "h", event: "login" })).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });
});
