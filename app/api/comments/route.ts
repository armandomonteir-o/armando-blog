import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { auth } from "@/auth";
import { createWPComment } from "@/lib/graphql/mutations/comments";
import { getUserProfile } from "@/lib/graphql/queries/profile";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { postId, content } = body ?? {};

  if (!postId || typeof postId !== "number" || !content?.trim()) {
    return NextResponse.json(
      { error: "Missing fields: postId (number) and content (string) required" },
      { status: 400 }
    );
  }

  // Use custom display name from user profile if set, otherwise fall back to Google name
  const emailHash = createHash("sha256")
    .update(session.user.email.toLowerCase().trim())
    .digest("hex");
  const profile = await getUserProfile(emailHash).catch(() => null);
  const authorName = profile?.displayName ?? session.user.name ?? "Anônimo";

  try {
    const comment = await createWPComment({
      postId,
      content: content.trim(),
      authorName,
      authorEmail: session.user.email,
    });
    return NextResponse.json({ comment });
  } catch (err) {
    console.error("[POST /api/comments]", err);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
