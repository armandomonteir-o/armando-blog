import { describe, expect, it, vi } from "vitest";
import { isTransientError, withRetry } from "./retry";

// #68: one network blip during `next build` took the CI down (ETIMEDOUT from the GitHub runner
// to the host). Retrying a few times fixes that, but it must never retry what cannot succeed.
const network = (code: string) => Object.assign(new TypeError("fetch failed"), { cause: { code } });
const http = (status: number) =>
  Object.assign(new Error(`HTTP ${status}`), { response: { status } });
const graphqlError = Object.assign(new Error("Cannot query field"), {
  response: { status: 200, errors: [{ message: "Cannot query field" }] },
});

const noWait = async () => {};

describe("isTransientError", () => {
  it("is true for network failures that pass", () => {
    for (const code of ["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "EAI_AGAIN"]) {
      expect(isTransientError(network(code))).toBe(true);
    }
  });

  it("is true for a server error (5xx)", () => {
    expect(isTransientError(http(502))).toBe(true);
    expect(isTransientError(http(503))).toBe(true);
  });

  it("is false for what repeating cannot fix: 4xx, a GraphQL error, any other error", () => {
    expect(isTransientError(http(401))).toBe(false);
    expect(isTransientError(http(404))).toBe(false);
    expect(isTransientError(graphqlError)).toBe(false);
    expect(isTransientError(new Error("boom"))).toBe(false);
    expect(isTransientError("nope")).toBe(false);
  });
});

describe("withRetry", () => {
  it("returns the result without retrying when the first call works", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    expect(await withRetry(fn, { sleep: noWait })).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries a passing network failure and returns the real result", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(network("ETIMEDOUT"))
      .mockRejectedValueOnce(http(503))
      .mockResolvedValue("ok");
    expect(await withRetry(fn, { sleep: noWait })).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("gives up after 3 attempts and throws the last error", async () => {
    const fn = vi.fn().mockRejectedValue(network("ETIMEDOUT"));
    await expect(withRetry(fn, { sleep: noWait })).rejects.toThrow("fetch failed");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("does not retry an error that repeating cannot fix", async () => {
    for (const err of [graphqlError, http(404), new Error("boom")]) {
      const fn = vi.fn().mockRejectedValue(err);
      await expect(withRetry(fn, { sleep: noWait })).rejects.toBe(err);
      expect(fn).toHaveBeenCalledTimes(1);
    }
  });

  it("waits longer before each new attempt", async () => {
    const sleep = vi.fn(async (ms: number) => {
      void ms;
    });
    const fn = vi.fn().mockRejectedValue(network("ETIMEDOUT"));
    await expect(withRetry(fn, { sleep, baseDelayMs: 100 })).rejects.toThrow();
    expect(sleep.mock.calls.map((c) => c[0])).toEqual([100, 200]);
  });
});
