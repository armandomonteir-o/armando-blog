import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SEARCH_MAX_LENGTH,
  SEARCH_MIN_LENGTH,
  createSearchRunner,
  moveActive,
  normalizeSearchTerm,
  splitHighlight,
  type SearchResult,
  type SearchState,
} from "./search";

describe("normalizeSearchTerm", () => {
  it("trims and collapses inner whitespace", () => {
    expect(normalizeSearchTerm("  lorem   ipsum ")).toEqual({ ok: true, term: "lorem ipsum" });
  });

  it("rejects a blank or too short term", () => {
    expect(normalizeSearchTerm("   ")).toEqual({ ok: false, reason: "short" });
    expect(normalizeSearchTerm("a".repeat(SEARCH_MIN_LENGTH - 1))).toEqual({
      ok: false,
      reason: "short",
    });
  });

  it("accepts the limits and rejects a term longer than the maximum", () => {
    expect(normalizeSearchTerm("a".repeat(SEARCH_MIN_LENGTH)).ok).toBe(true);
    expect(normalizeSearchTerm("a".repeat(SEARCH_MAX_LENGTH)).ok).toBe(true);
    expect(normalizeSearchTerm("a".repeat(SEARCH_MAX_LENGTH + 1))).toEqual({
      ok: false,
      reason: "long",
    });
  });
});

const hit: SearchResult = { title: "Lorem", slug: "lorem", category: "ARTE" };

describe("createSearchRunner", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function setup(fetchResults: (term: string, signal: AbortSignal) => Promise<SearchResult[]>) {
    const states: SearchState[] = [];
    const runner = createSearchRunner({ fetchResults, onState: (s) => states.push(s) });
    return { states, runner };
  }

  it("waits 300 ms of silence before asking, and shows loading meanwhile", async () => {
    const calls: string[] = [];
    const { states, runner } = setup(async (term) => {
      calls.push(term);
      return [hit];
    });
    runner.update("lor");
    runner.update("lore");
    runner.update("lorem");
    expect(states.at(-1)).toEqual({ status: "loading" });
    await vi.advanceTimersByTimeAsync(299);
    expect(calls).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    expect(calls).toEqual(["lorem"]);
    expect(states.at(-1)).toEqual({ status: "done", results: [hit] });
  });

  it("does not ask for a short term and goes back to idle", async () => {
    const calls: string[] = [];
    const { states, runner } = setup(async (term) => {
      calls.push(term);
      return [];
    });
    runner.update("lorem");
    runner.update("l");
    await vi.advanceTimersByTimeAsync(1000);
    expect(calls).toEqual([]);
    expect(states.at(-1)).toEqual({ status: "idle" });
  });

  it("reports done with no results as an empty list, not as an error", async () => {
    const { states, runner } = setup(async () => []);
    runner.update("zzzz");
    await vi.advanceTimersByTimeAsync(300);
    expect(states.at(-1)).toEqual({ status: "done", results: [] });
  });

  it("reports an error when the request fails", async () => {
    const { states, runner } = setup(() => Promise.reject(new Error("boom")));
    runner.update("lorem");
    await vi.advanceTimersByTimeAsync(300);
    expect(states.at(-1)).toEqual({ status: "error" });
  });

  it("aborts the previous request and ignores its late answer", async () => {
    const signals: AbortSignal[] = [];
    const resolvers: Array<(r: SearchResult[]) => void> = [];
    const { states, runner } = setup(
      (_term, signal) =>
        new Promise<SearchResult[]>((resolve) => {
          signals.push(signal);
          resolvers.push(resolve);
        })
    );
    runner.update("first");
    await vi.advanceTimersByTimeAsync(300);
    runner.update("second");
    expect(signals[0].aborted).toBe(true);
    await vi.advanceTimersByTimeAsync(300);
    resolvers[1]([{ ...hit, slug: "second" }]);
    await vi.advanceTimersByTimeAsync(0);
    resolvers[0]([{ ...hit, slug: "first" }]);
    await vi.advanceTimersByTimeAsync(0);
    expect(states.at(-1)).toEqual({ status: "done", results: [{ ...hit, slug: "second" }] });
  });

  it("does not turn an abort into an error", async () => {
    const { states, runner } = setup(
      (_term, signal) =>
        new Promise<SearchResult[]>((_resolve, reject) => {
          signal.addEventListener("abort", () => reject(new DOMException("x", "AbortError")));
        })
    );
    runner.update("first");
    await vi.advanceTimersByTimeAsync(300);
    runner.update("");
    await vi.advanceTimersByTimeAsync(0);
    expect(states.some((s) => s.status === "error")).toBe(false);
    expect(states.at(-1)).toEqual({ status: "idle" });
  });

  it("cancel() stops a pending search without emitting anything more", async () => {
    const calls: string[] = [];
    const { states, runner } = setup(async (term) => {
      calls.push(term);
      return [];
    });
    runner.update("lorem");
    const seen = states.length;
    runner.cancel();
    await vi.advanceTimersByTimeAsync(1000);
    expect(calls).toEqual([]);
    expect(states.length).toBe(seen);
  });
});

describe("moveActive", () => {
  it("moves down and up, wrapping at both ends", () => {
    expect(moveActive(0, 1, 3)).toBe(1);
    expect(moveActive(2, 1, 3)).toBe(0);
    expect(moveActive(0, -1, 3)).toBe(2);
  });

  it("stays at 0 when there is nothing to move through", () => {
    expect(moveActive(0, 1, 0)).toBe(0);
    expect(moveActive(0, -1, 0)).toBe(0);
  });
});

describe("splitHighlight", () => {
  const join = (parts: { text: string; match: boolean }[]) => parts.map((p) => p.text).join("");

  it("marks every word of the term, ignoring case", () => {
    const parts = splitHighlight("Lorem Ipsum: Pixel Art 2", "pixel lorem");
    expect(parts.filter((p) => p.match).map((p) => p.text)).toEqual(["Lorem", "Pixel"]);
    expect(join(parts)).toBe("Lorem Ipsum: Pixel Art 2");
  });

  it("ignores accents, keeping the original text", () => {
    const parts = splitHighlight("Programação Criativa", "programacao");
    expect(parts[0]).toEqual({ text: "Programação", match: true });
    expect(join(parts)).toBe("Programação Criativa");
  });

  it("treats regex characters in the term as plain text", () => {
    expect(splitHighlight("a (b) c", "(b)")).toEqual([
      { text: "a ", match: false },
      { text: "(b)", match: true },
      { text: " c", match: false },
    ]);
  });

  it("returns the whole text unmarked when nothing matches", () => {
    expect(splitHighlight("Habbo 1", "zzz")).toEqual([{ text: "Habbo 1", match: false }]);
  });
});
