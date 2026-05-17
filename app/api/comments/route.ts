import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createWPComment } from "@/lib/graphql/mutations/comments";

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

  // displayName is cached in the JWT session (set on login / after session.update())
  const authorName = session.user.displayName ?? session.user.name ?? "Anônimo";

  try {
    const comment = await createWPComment({
      postId,
      content: content.trim(),
      authorName,
      authorEmail: session.user.email,
    });
    // comment is null when WPGraphQL withholds held/pending comments from non-admin viewers
    return NextResponse.json({ comment, queued: !comment });
  } catch (err) {
    console.error("[POST /api/comments]", err);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
