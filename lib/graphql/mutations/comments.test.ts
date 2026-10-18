import { beforeEach, describe, expect, it, vi } from "vitest";

const wpMutation = vi.fn();
vi.mock("../client", () => ({ wpMutation: (...args: unknown[]) => wpMutation(...args) }));

import { createWPComment } from "./comments";

describe("createWPComment", () => {
  beforeEach(() => {
    wpMutation.mockReset();
    wpMutation.mockResolvedValue({ createComment: { success: true, comment: null } });
  });

  // Moderation guard (#54): a visitor's comment must wait in Pending, never go public on its own.
  it("always sends the comment as HOLD", async () => {
    await createWPComment({
      postId: 5,
      content: "oi",
      authorName: "Ana",
      authorEmail: "ana@example.com",
    });
    expect(wpMutation.mock.calls[0][1].input).toMatchObject({
      commentOn: 5,
      content: "oi",
      status: "HOLD",
    });
  });

  it("returns null when WordPress withholds the held comment", async () => {
    await expect(
      createWPComment({ postId: 1, content: "x", authorName: "A", authorEmail: "a@a.com" })
    ).resolves.toBeNull();
  });
});
