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
    const comment = {
      id: "c1",
      content: "Belo texto",
      date: "2026-04-10T12:00:00",
      status: "APPROVE",
    };
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

  it("reports a held comment as queued when WordPress withholds it", async () => {
    mockCreate.mockResolvedValue(null);
    const res = await POST(request({ postId: 42, content: "Aguardando" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ comment: null, queued: true });
  });

  // Found by #54: the mutation runs with the admin application password, so WordPress DOES
  // return the held comment. Judging by `comment === null` made the screen skip the
  // "Aguardando aprovação" notice and list a comment that is not public.
  it.each(["HOLD", "SPAM", "TRASH"])(
    "reports a returned comment with status %s as queued and does not hand it back",
    async (status) => {
      mockCreate.mockResolvedValue({ id: "c2", content: "x", date: "d", status } as never);
      const res = await POST(request({ postId: 42, content: "x" }));
      expect(await res.json()).toEqual({ comment: null, queued: true });
    }
  );

  it("answers 500 when WordPress fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockCreate.mockRejectedValue(new Error("rede"));
    const res = await POST(request({ postId: 42, content: "oi" }));
    expect(res.status).toBe(500);
  });
});
