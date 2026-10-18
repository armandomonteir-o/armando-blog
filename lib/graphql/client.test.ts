import { beforeEach, describe, expect, it, vi } from "vitest";

// Reads are retried; writes are not: repeating a "create comment" could post it twice.
const { request } = vi.hoisted(() => {
  process.env.WORDPRESS_API_URL = "https://wp.test/graphql";
  process.env.WP_APP_USER = "user";
  process.env.WP_APP_PASSWORD = "pass";
  return { request: vi.fn() };
});

vi.mock("graphql-request", () => ({
  GraphQLClient: vi.fn(function () {
    return { request };
  }),
}));

import { wpMutation, wpQuery } from "./client";

const network = (code: string) => Object.assign(new TypeError("fetch failed"), { cause: { code } });

beforeEach(() => {
  request.mockReset();
  vi.useFakeTimers();
});

describe("wpQuery", () => {
  it("retries a passing network failure, so a blip does not break the build", async () => {
    request.mockRejectedValueOnce(network("ETIMEDOUT")).mockResolvedValue({ ok: true });
    const result = wpQuery("query { x }");
    await vi.runAllTimersAsync();
    expect(await result).toEqual({ ok: true });
    expect(request).toHaveBeenCalledTimes(2);
  });
});

describe("wpMutation", () => {
  it("does not retry, because repeating a write is not safe", async () => {
    request.mockRejectedValue(network("ETIMEDOUT"));
    const result = wpMutation("mutation { x }");
    const assertion = expect(result).rejects.toThrow("fetch failed");
    await vi.runAllTimersAsync();
    await assertion;
    expect(request).toHaveBeenCalledTimes(1);
  });
});
