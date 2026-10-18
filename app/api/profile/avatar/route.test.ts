import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// #178: the avatar upload writes a file to the WordPress media library with the site's application
// password. These are its guards, and one known weakness written down as it is today (#136).

// The route reads the WordPress address when the module loads, and ES imports run before any
// statement here, so the variables have to be set in a hoisted block.
vi.hoisted(() => {
  process.env.WORDPRESS_API_URL = "https://wp.example.com/graphql";
  process.env.WP_APP_USER = "robot";
  process.env.WP_APP_PASSWORD = "abcd efgh ijkl";
});

vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { auth } from "@/auth";
import { POST } from "./route";

const mockAuth = vi.mocked(auth as unknown as () => Promise<unknown>);

let fetchCalls: Array<{ url: string; init: RequestInit }> = [];
let fetchStatus = 201;

function upload(file?: File | string) {
  const form = new FormData();
  if (file !== undefined) form.set("file", file);
  return new Request("http://localhost/api/profile/avatar", { method: "POST", body: form });
}

const png = (name = "foto.png", size = 10) =>
  new File([new Uint8Array(size)], name, { type: "image/png" });

beforeEach(() => {
  vi.clearAllMocks();
  fetchCalls = [];
  fetchStatus = 201;
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    fetchCalls.push({ url, init });
    return fetchStatus === 201
      ? Response.json({ source_url: "https://wp.example.com/wp-content/uploads/foto.png" })
      : new Response("wp says: secret internal detail", { status: fetchStatus });
  });
  mockAuth.mockResolvedValue({ user: { email: "leitor@exemplo.com" } });
});

afterEach(() => vi.unstubAllGlobals());

describe("POST /api/profile/avatar: guards", () => {
  it("refuses without a session, and uploads nothing", async () => {
    mockAuth.mockResolvedValue(null);
    expect((await POST(upload(png()))).status).toBe(401);
    expect(fetchCalls).toEqual([]);
  });

  it.each([
    ["no file field", undefined],
    ["a text field instead of a file", "oi"],
  ])("rejects %s with 400", async (_name, value) => {
    expect((await POST(upload(value))).status).toBe(400);
    expect(fetchCalls).toEqual([]);
  });

  it("rejects a file that does not declare an image type", async () => {
    const pdf = new File([new Uint8Array(10)], "a.pdf", { type: "application/pdf" });
    expect((await POST(upload(pdf))).status).toBe(400);
    expect(fetchCalls).toEqual([]);
  });

  it("rejects a file over 2 MB and accepts one of exactly 2 MB", async () => {
    expect((await POST(upload(png("grande.png", 2 * 1024 * 1024 + 1)))).status).toBe(400);
    expect(fetchCalls).toEqual([]);
    expect((await POST(upload(png("limite.png", 2 * 1024 * 1024)))).status).toBe(200);
  });

  // Known weakness (#136): the type is what the BROWSER says. A client can label anything as
  // image/png, and the content is never looked at. The only other guard is WordPress's own upload
  // rules. If the route starts reading the real content, this test should change on purpose.
  it("trusts the declared type: a file labelled image/png goes through whatever it holds", async () => {
    const disguised = new File(["<?php echo 1; ?>"], "x.png", { type: "image/png" });
    expect((await POST(upload(disguised))).status).toBe(200);
  });
});

describe("POST /api/profile/avatar: uploading", () => {
  it("sends the file to the media library with the application password and returns its URL", async () => {
    const res = await POST(upload(png("foto.png")));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      url: "https://wp.example.com/wp-content/uploads/foto.png",
    });

    expect(fetchCalls).toHaveLength(1);
    expect(fetchCalls[0].url).toBe("https://wp.example.com/wp-json/wp/v2/media");
    const headers = fetchCalls[0].init.headers as Record<string, string>;
    expect(headers.Authorization).toBe(
      `Basic ${Buffer.from("robot:abcd efgh ijkl").toString("base64")}`
    );
    expect(headers["Content-Type"]).toBe("image/png");
  });

  it("cleans the file name: no slashes, spaces or quotes in the header", async () => {
    await POST(upload(png('../meu "avatar" final.png')));
    const disposition = (fetchCalls[0].init.headers as Record<string, string>)[
      "Content-Disposition"
    ];
    expect(disposition).toBe('attachment; filename=".._meu__avatar__final.png"');
  });

  it("answers 500 with a generic message and leaks nothing when WordPress refuses", async () => {
    fetchStatus = 500;
    const res = await POST(upload(png()));
    expect(res.status).toBe(500);
    const text = JSON.stringify(await res.json());
    expect(text).not.toContain("secret internal detail");
  });
});
