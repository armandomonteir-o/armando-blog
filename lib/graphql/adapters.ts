import type { WPPost, WPPostDetail } from "./types";
import type { Post } from "@/constants/posts";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop";

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// WPGraphQL sends the site's wall-clock time with no offset: "2026-04-10T23:30:00" for posts,
// "2026-04-10 23:30:00" for comments. The day is read straight from the string, so the result
// is the same on the server and in any browser, whatever its timezone or date parser.
export function formatWPDate(wpDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T ]|$)/.exec(wpDate ?? "");
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  if (!match || !month) return "";
  return `${match[3]} ${month} ${match[1]}`;
}

export function adaptWPPost(wp: WPPost): Post {
  return {
    id: wp.databaseId,
    title: wp.title,
    slug: wp.slug,
    category: wp.categories.nodes[0]?.name ?? "Blog",
    date: formatWPDate(wp.date),
    reads: 0,
    comments: wp.commentCount ?? 0,
    image:
      wp.acfPostFields?.heroImage?.node.sourceUrl ??
      wp.featuredImage?.node.sourceUrl ??
      FALLBACK_IMAGE,
    excerpt: stripHtml(wp.excerpt),
  };
}

export function adaptWPPostDetail(wp: WPPostDetail) {
  const acf = wp.acfPostFields;

  const sections =
    acf?.postSections?.length
      ? acf.postSections.map((s) => ({
          id: s.sectionId,
          title: s.sectionTitle,
          content: stripHtml(s.sectionContent),
        }))
      : [{ id: "content", title: "", content: stripHtml(wp.content) }];

  return {
    title: wp.title,
    subtitle: acf?.subtitle ?? stripHtml(wp.excerpt),
    category: wp.categories.nodes[0]?.name ?? "Blog",
    date: formatWPDate(wp.date),
    readTime: acf?.readingTime ?? "5 min",
    reads: 0,
    comments: wp.commentCount ?? 0,
    likes: 0,
    heroImage:
      acf?.heroImage?.node.sourceUrl ??
      wp.featuredImage?.node.sourceUrl ??
      FALLBACK_IMAGE,
    author: {
      name: wp.author?.node.name ?? "Armando",
      role: "autor",
      avatar: wp.author?.node.avatar?.url ?? "/avatar-placeholder.jpg",
      bio: wp.author?.node.description ?? "",
    },
    sections,
  };
}
