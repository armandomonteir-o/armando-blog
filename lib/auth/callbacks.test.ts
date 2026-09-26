import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/graphql/queries/profile", () => ({ getUserProfile: vi.fn() }));
vi.mock("@/lib/wp", () => ({ logProfileEvent: vi.fn() }));

import { getUserProfile } from "@/lib/graphql/queries/profile";
import { logProfileEvent } from "@/lib/wp";
import { callbacks } from "./callbacks";

const mockProfile = vi.mocked(getUserProfile);
const mockLog = vi.mocked(logProfileEvent);

type JwtParams = Parameters<typeof callbacks.jwt>[0];
const jwt = (token: Record<string, unknown>, trigger?: JwtParams["trigger"]) =>
  callbacks.jwt({ token, trigger } as JwtParams) as Promise<Record<string, unknown>>;

const profile = {
  id: "p1",
  databaseId: 1,
  slug: "hash",
  displayName: "Nome Escolhido",
  avatarUrl: "https://exemplo.com/avatar.png",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("jwt callback", () => {
  it("copies the WordPress profile into the token on sign-in and logs the login", async () => {
    mockProfile.mockResolvedValue(profile);
    const token = await jwt({ email: "Leitor@Exemplo.com ", picture: "https://g/p.png" }, "signIn");

    expect(token).toMatchObject({
      displayName: "Nome Escolhido",
      avatarUrl: "https://exemplo.com/avatar.png",
    });
    // The profile is looked up by the sha256 of the normalized email, never the email itself.
    expect(mockProfile).toHaveBeenCalledWith(expect.stringMatching(/^[0-9a-f]{64}$/));
    expect(mockLog).toHaveBeenCalledWith(expect.objectContaining({ event: "login" }));
  });

  it("clears the cached fields when WordPress answers that there is no profile", async () => {
    mockProfile.mockResolvedValue(null);
    const token = await jwt(
      { email: "a@b.com", displayName: "Antigo", avatarUrl: "https://antigo" },
      "update"
    );
    expect(token.displayName).toBeNull();
    expect(token.avatarUrl).toBeNull();
  });

  it("keeps the cached name and avatar when WordPress fails during an update", async () => {
    // A session that already has a custom name, from an earlier successful sign-in.
    const before = { email: "a@b.com", displayName: "Nome Escolhido", avatarUrl: "https://av" };
    mockProfile.mockRejectedValue(new Error("WordPress down"));

    const token = await jwt({ ...before }, "update");

    expect(token.displayName).toBe("Nome Escolhido");
    expect(token.avatarUrl).toBe("https://av");
  });

  it("does not call WordPress on ordinary requests", async () => {
    const token = await jwt({ email: "a@b.com", displayName: "Nome" });
    expect(mockProfile).not.toHaveBeenCalled();
    expect(token.displayName).toBe("Nome");
  });
});

describe("session callback", () => {
  it("exposes the cached fields on session.user, as null when missing", () => {
    const session = { user: { name: "Google Name", email: "a@b.com" }, expires: "" };
    const result = callbacks.session({
      session,
      token: { displayName: "Nome Escolhido" },
    } as unknown as Parameters<typeof callbacks.session>[0]);

    expect(result.user).toMatchObject({ displayName: "Nome Escolhido", avatarUrl: null });
  });
});
