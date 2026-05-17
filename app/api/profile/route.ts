import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { auth } from "@/auth";
import { getUserProfile } from "@/lib/graphql/queries/profile";
import { logProfileEvent } from "@/lib/wp";

// Derive WP REST base from WORDPRESS_API_URL (strips /graphql suffix)
const wpRestBase = process.env.WORDPRESS_API_URL
  ?.replace(/\/graphql\/?$/, "")
  .replace(/\/$/, "");

function getAuthHeader() {
  const user = process.env.WP_APP_USER;
  const pass = process.env.WP_APP_PASSWORD;
  if (!user || !pass) throw new Error("WP_APP_USER or WP_APP_PASSWORD is not set");
  return `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
}

function emailHash(email: string) {
  return createHash("sha256").update(email.toLowerCase().trim()).digest("hex");
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ profile: null });
  }
  const hash = emailHash(session.user.email);
  const profile = await getUserProfile(hash).catch(() => null);
  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const displayName = (body?.displayName ?? "").trim();
  const avatarUrl = (body?.avatarUrl ?? "").trim();

  if (!displayName && !avatarUrl) {
    return NextResponse.json({ error: "Nenhum campo informado" }, { status: 400 });
  }

  // Validate avatar URL if provided
  if (avatarUrl && !avatarUrl.startsWith("https://")) {
    return NextResponse.json({ error: "Avatar URL deve começar com https://" }, { status: 400 });
  }

  const hash = emailHash(session.user.email);
  const authHeader = getAuthHeader();
  const meta: Record<string, string> = {};
  if (displayName) meta.display_name = displayName;
  if (avatarUrl) meta.avatar_url = avatarUrl;

  const existing = await getUserProfile(hash).catch(() => null);

  if (existing) {
    const res = await fetch(`${wpRestBase}/wp-json/wp/v2/user-profile/${existing.databaseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify({ meta }),
    });
    if (!res.ok) {
      console.error("[PUT /api/profile] WP update failed:", await res.text());
      return NextResponse.json({ error: "Falha ao atualizar perfil" }, { status: 500 });
    }
  } else {
    const res = await fetch(`${wpRestBase}/wp-json/wp/v2/user-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify({ title: hash, slug: hash, status: "publish", meta }),
    });
    if (!res.ok) {
      console.error("[PUT /api/profile] WP create failed:", await res.text());
      return NextResponse.json({ error: "Falha ao criar perfil" }, { status: 500 });
    }
  }

  // Log events in parallel — non-blocking, failures don't break the save
  const events: Promise<void>[] = [];
  if (displayName && displayName !== existing?.displayName) {
    events.push(logProfileEvent({
      hash,
      event: "nick_change",
      extra: { from: existing?.displayName ?? "", to: displayName },
    }));
  }
  if (avatarUrl) {
    events.push(logProfileEvent({ hash, event: "avatar_change" }));
  }
  await Promise.allSettled(events);

  return NextResponse.json({ ok: true });
}
