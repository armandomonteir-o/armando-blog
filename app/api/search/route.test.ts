import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/graphql/queries/search", () => ({ searchPosts: vi.fn() }));

import { searchPosts } from "@/lib/graphql/queries/search";
import { GET } from "./route";

const mockSearch = vi.mocked(searchPosts);

function request(q?: string) {
  const url = new URL("http://localhost/api/search");
  if (q !== undefined) url.searchParams.set("q", q);
  return new Request(url);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/search", () => {
  it.each([
    ["missing", undefined],
    ["blank", "   "],
    ["one character", "a"],
    ["longer than the maximum", "a".repeat(81)],
  ])("answers 400 and never calls WordPress for a term that is %s", async (_name, q) => {
    const res = await GET(request(q));
    expect(res.status).toBe(400);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it("searches the trimmed term and returns title, slug and the first category", async () => {
    mockSearch.mockResolvedValue([
      { title: "Lorem", slug: "lorem", categories: { nodes: [{ name: "Arte" }, { name: "X" }] } },
      { title: "Sem categoria", slug: "sem", categories: { nodes: [] } },
    ]);
    const res = await GET(request("  lorem  "));
    expect(res.status).toBe(200);
    expect(mockSearch).toHaveBeenCalledWith("lorem");
    expect(await res.json()).toEqual({
      results: [
        { title: "Lorem", slug: "lorem", category: "Arte" },
        { title: "Sem categoria", slug: "sem", category: "" },
      ],
    });
  });

  it("returns an empty list when nothing matches", async () => {
    mockSearch.mockResolvedValue([]);
    const res = await GET(request("zzzz"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ results: [] });
  });

  it("answers 502 without leaking the WordPress error", async () => {
    mockSearch.mockRejectedValue(new Error("secret internal detail"));
    const res = await GET(request("lorem"));
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain("secret");
  });
});
