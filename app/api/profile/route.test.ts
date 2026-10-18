import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// #178: /api/profile writes to WordPress with the site's application password. The guards here are
// the ones that keep a visitor from writing without a session, with a bad avatar link, or into
// someone else's profile (the profile key is the hash of the SESSION's e-mail, never of the body).

// The route reads the WordPress address when the module loads, and ES imports run before any
// statement here, so the variables have to be set in a hoisted block.
vi.hoisted(() => {
  process.env.WORDPRESS_API_URL = "https://wp.example.com/graphql";
  process.env.WP_APP_USER = "robot";
  process.env.WP_APP_PASSWORD = "abcd efgh ijkl";
});

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/graphql/queries/profile", () => ({ getUserProfile: vi.fn() }));
vi.mock("@/lib/wp", () => ({ logProfileEvent: vi.fn() }));

import { auth } from "@/auth";
import { getUserProfile } from "@/lib/graphql/queries/profile";
import { logProfileEvent } from "@/lib/wp";
import { GET, PUT } from "./route";

const mockAuth = vi.mocked(auth as unknown as () => Promise<unknown>);
const mockProfile = vi.mocked(getUserProfile);
const mockLog = vi.mocked(logProfileEvent);

const EMAIL = "Leitor@Exemplo.com";
const HASH = createHash("sha256").update("leitor@exemplo.com").digest("hex");
const BASIC = `Basic ${Buffer.from("robot:abcd efgh ijkl").toString("base64")}`;

let fetchCalls: Array<{ url: string; init: RequestInit }> = [];
let fetchStatus = 200;

function put(body: unknown) {
  return new Request("http://localhost/api/profile", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  fetchCalls = [];
  fetchStatus = 200;
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    fetchCalls.push({ url, init });
    return new Response(fetchStatus === 200 ? "{}" : "wp says: secret internal detail", {
      status: fetchStatus,
    });
  });
  mockAuth.mockResolvedValue({ user: { email: EMAIL } });
  mockProfile.mockResolvedValue(null);
  mockLog.mockResolvedValue(undefined);
});

afterEach(() => vi.unstubAllGlobals());

describe("GET /api/profile", () => {
  it("answers null without a session and never asks WordPress", async () => {
    mockAuth.mockResolvedValue(null);
    expect(await (await GET()).json()).toEqual({ profile: null });
    expect(mockProfile).not.toHaveBeenCalled();
  });

  it("looks the profile up by the hash of the session's e-mail, lowercased", async () => {
    mockProfile.mockResolvedValue({ displayName: "Leitor Fiel" } as never);
    const body = await (await GET()).json();
    expect(mockProfile).toHaveBeenCalledWith(HASH);
    expect(body.profile.displayName).toBe("Leitor Fiel");
  });

  it("answers null, not an error, when WordPress fails", async () => {
    mockProfile.mockRejectedValue(new Error("down"));
    expect(await (await GET()).json()).toEqual({ profile: null });
  });
});

describe("PUT /api/profile: guards", () => {
  it("refuses without a session, and writes nothing", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await PUT(put({ displayName: "Eu" }));
    expect(res.status).toBe(401);
    expect(fetchCalls).toEqual([]);
  });

  it.each([
    ["an empty body", {}],
    ["blank fields", { displayName: "  ", avatarUrl: " " }],
    ["a body that is not JSON", "{quebrado"],
  ])("rejects %s with 400", async (_name, body) => {
    const res = await PUT(put(body));
    expect(res.status).toBe(400);
    expect(fetchCalls).toEqual([]);
  });

  it.each(["http://exemplo.com/a.png", "javascript:alert(1)", "//exemplo.com/a.png"])(
    "rejects the avatar link %s (only https is accepted)",
    async (avatarUrl) => {
      const res = await PUT(put({ avatarUrl }));
      expect(res.status).toBe(400);
      expect(fetchCalls).toEqual([]);
    }
  );
});

describe("PUT /api/profile: writing", () => {
  it("creates the profile, keyed by the hash of the session's e-mail, with the application password", async () => {
    const res = await PUT(put({ displayName: "  Leitor Fiel  " }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(fetchCalls).toHaveLength(1);
    expect(fetchCalls[0].url).toBe("https://wp.example.com/wp-json/wp/v2/user-profile");
    expect((fetchCalls[0].init.headers as Record<string, string>).Authorization).toBe(BASIC);
    expect(JSON.parse(fetchCalls[0].init.body as string)).toEqual({
      title: HASH,
      slug: HASH,
      status: "publish",
      meta: { display_name: "Leitor Fiel" },
    });
  });

  it("ignores an e-mail or hash sent in the body: the key always comes from the session", async () => {
    await PUT(put({ displayName: "Eu", email: "outro@exemplo.com", hash: "abc", slug: "abc" }));
    expect(mockProfile).toHaveBeenCalledWith(HASH);
    expect(JSON.parse(fetchCalls[0].init.body as string).slug).toBe(HASH);
  });

  it("updates the existing profile at its own id instead of creating another", async () => {
    mockProfile.mockResolvedValue({ databaseId: 77, displayName: "Antigo" } as never);
    await PUT(put({ displayName: "Novo", avatarUrl: "https://exemplo.com/a.png" }));
    expect(fetchCalls[0].url).toBe("https://wp.example.com/wp-json/wp/v2/user-profile/77");
    expect(JSON.parse(fetchCalls[0].init.body as string)).toEqual({
      meta: { display_name: "Novo", avatar_url: "https://exemplo.com/a.png" },
    });
  });

  it("answers 500 with a generic message and leaks nothing when WordPress fails", async () => {
    fetchStatus = 500;
    const res = await PUT(put({ displayName: "Eu" }));
    expect(res.status).toBe(500);
    const text = JSON.stringify(await res.json());
    expect(text).not.toContain("secret internal detail");
    expect(text).not.toContain("abcd efgh");
  });
});

describe("PUT /api/profile: events", () => {
  it("logs a nick change with the old and the new name only when the name really changed", async () => {
    mockProfile.mockResolvedValue({ databaseId: 77, displayName: "Antigo" } as never);
    await PUT(put({ displayName: "Novo" }));
    expect(mockLog).toHaveBeenCalledWith({
      hash: HASH,
      event: "nick_change",
      extra: { from: "Antigo", to: "Novo" },
    });

    mockLog.mockClear();
    await PUT(put({ displayName: "Antigo" }));
    expect(mockLog).not.toHaveBeenCalled();
  });

  it("logs an avatar change", async () => {
    await PUT(put({ avatarUrl: "https://exemplo.com/a.png" }));
    expect(mockLog).toHaveBeenCalledWith({ hash: HASH, event: "avatar_change" });
  });

  it("still saves when logging the event fails", async () => {
    mockLog.mockImplementation(() => Promise.reject(new Error("log down")));
    const res = await PUT(put({ displayName: "Eu" }));
    expect(res.status).toBe(200);
  });
});
