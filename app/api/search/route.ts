import { NextResponse } from "next/server";
import { searchPosts } from "@/lib/graphql/queries/search";
import { normalizeSearchTerm } from "@/lib/search";

// The browser never talks to WordPress: it asks this route, which validates the term first so an
// empty or huge query never reaches the CMS.
export async function GET(req: Request) {
  const parsed = normalizeSearchTerm(new URL(req.url).searchParams.get("q") ?? "");
  if (!parsed.ok) {
    return NextResponse.json({ error: "Invalid search term" }, { status: 400 });
  }

  try {
    const posts = await searchPosts(parsed.term);
    return NextResponse.json({
      results: posts.map((p) => ({
        title: p.title,
        slug: p.slug,
        category: p.categories.nodes[0]?.name ?? "",
      })),
    });
  } catch (err) {
    console.error("[GET /api/search]", err);
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
