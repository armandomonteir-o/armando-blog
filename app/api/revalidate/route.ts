import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// On-demand revalidation (#68, step 2). WordPress calls this when a post or comment changes, so
// the site refreshes the affected pages in seconds instead of waiting for the hourly ISR.
// The hourly revalidation stays as the safety net: if this call never arrives, the site is at
// most an hour behind, not stale forever.

// WordPress slugs are lowercase letters, digits and hyphens. Anything else (a slash, "..", a
// query string) must never reach revalidatePath.
const SLUG = /^[a-z0-9_-]{1,200}$/i;

// Compares hashes, so the comparison takes the same time whatever the length or the content.
function isSameSecret(received: string, expected: string): boolean {
  const a = createHash("sha256").update(received).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  // Fail closed: without a configured secret nobody can call this, not even with an empty token.
  if (!expected) {
    console.error("[POST /api/revalidate] REVALIDATE_SECRET is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  if (!token || !isSameSecret(token, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }

  const { slug } = body as { slug?: unknown };
  if (slug !== undefined && (typeof slug !== "string" || !SLUG.test(slug))) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  // The category pages list posts and comment counts, so they refresh with every change (#73).
  // A route pattern with dynamic segments needs the explicit "page" type.
  const categoryPages = ["/categoria/[category]", "/categoria/[category]/[subcategory]"];
  const paths = ["/", "/posts", ...(slug ? [`/post/${slug}`] : []), ...categoryPages];
  try {
    for (const path of paths) {
      if (categoryPages.includes(path)) revalidatePath(path, "page");
      else revalidatePath(path);
    }
  } catch (err) {
    console.error("[POST /api/revalidate]", err);
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
  return NextResponse.json({ revalidated: true, paths });
}
