import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/graphql/mutations/comments", () => ({ createWPComment: vi.fn() }));

import { auth } from "@/auth";
import { createWPComment } from "@/lib/graphql/mutations/comments";
import { POST } from "./route";

const mockAuth = vi.mocked(auth as unknown as () => Promise<unknown>);
const mockCreate = vi.mocked(createWPComment);

const session = {
  user: { email: "leitor@exemplo.com", name: "Leitor", displayName: "Leitor Fiel" },
};

function request(body: unknown) {
  return new Request("http://localhost/api/comments", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockAuth.mockResolvedValue(session);
});

describe("POST /api/comments", () => {
  it("refuses without a signed-in user", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(request({ postId: 1, content: "oi" }));
    expect(res.status).toBe(401);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it.each([
    ["no postId", { content: "oi" }],
    ["postId as a string", { postId: "1", content: "oi" }],
    ["blank content", { postId: 1, content: "   " }],
    ["content as a number", { postId: 1, content: 42 }],
    ["content as an array", { postId: 1, content: ["oi"] }],
    ["content as an object", { postId: 1, content: { text: "oi" } }],
    ["a body that is not JSON", "{quebrado"],
  ])("rejects %s with 400", async (_, body) => {
    const res = await POST(request(body));
    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("creates the comment with trimmed content and the session's display name", async () => {
    const comment = { id: "c1", content: "Belo texto", date: "2026-04-10T12:00:00" };
    mockCreate.mockResolvedValue(comment as never);

    const res = await POST(request({ postId: 42, content: "  Belo texto  " }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ comment, queued: false });
    expect(mockCreate).toHaveBeenCalledWith({
      postId: 42,
      content: "Belo texto",
      authorName: "Leitor Fiel",
      authorEmail: "leitor@exemplo.com",
    });
  });

  it("reports a held comment as queued, not as a failure", async () => {
    // WPGraphQL returns no comment to non-admin viewers while it waits for moderation.
    mockCreate.mockResolvedValue(null);
    const res = await POST(request({ postId: 42, content: "Aguardando" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ comment: null, queued: true });
  });

  it("answers 500 when WordPress fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockCreate.mockRejectedValue(new Error("rede"));
    const res = await POST(request({ postId: 42, content: "oi" }));
    expect(res.status).toBe(500);
  });
});
