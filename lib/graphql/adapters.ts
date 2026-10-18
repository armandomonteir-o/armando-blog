import type { WPPost, WPPostDetail, WPRecentComment } from "./types";
import type { Post } from "@/constants/posts";
import { plainText, sectionsFromBlocks, type EditorBlock, type PostSection } from "@/lib/blocks";

export const FALLBACK_IMAGE =
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
    reads: null,
    comments: wp.commentCount ?? 0,
    image:
      wp.acfPostFields?.heroImage?.node.sourceUrl ??
      wp.featuredImage?.node.sourceUrl ??
      FALLBACK_IMAGE,
    excerpt: stripHtml(wp.excerpt),
  };
}

// Words per minute for the estimate. The site has no stored reading time unless ACF sets one.
const WORDS_PER_MINUTE = 200;

function estimateReadTime(html: string): string {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min`;
}

// The post for the home page's featured block: a pinned ("sticky") post if there is one, else
// the newest, which WordPress lists first. Pinning is WordPress's own feature, no ACF field.
export function pickFeaturedPost(posts: WPPost[]): WPPost | null {
  return posts.find((post) => post.isSticky) ?? posts[0] ?? null;
}

export interface HomeComment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  date: string;
  postSlug: string;
  postTitle: string;
}

// Null for a comment that is not on a post, so the home never links to something that is not one.
export function adaptHomeComment(wp: WPRecentComment): HomeComment | null {
  const post = wp.commentedOn?.node;
  if (!post?.slug || !post.title) return null;
  return {
    id: wp.id,
    name: wp.author.node.name,
    avatar: wp.author.node.avatar?.url ?? "/avatar-pixel-art.png",
    text: stripHtml(wp.content),
    date: formatWPDate(wp.date),
    postSlug: post.slug,
    postTitle: post.title,
  };
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Plain text as paragraph blocks, for a post that has no Gutenberg blocks to read. The text is
// escaped, so a literal "<" in it stays text and never becomes a tag.
function paragraphBlocks(html: string, idPrefix: string): EditorBlock[] {
  return plainText(html.replace(/<\/p>/gi, "\n\n"))
    .split(/\n{2,}/)
    .filter((text) => text.trim())
    .map((text, i) => ({
      __typename: "CoreParagraph",
      name: "core/paragraph",
      clientId: `${idPrefix}-${i}`,
      renderedHtml: "",
      attributes: { content: escapeHtml(text.trim()) },
    }));
}

// The body is always a list of sections of blocks. Gutenberg blocks win; without them, the ACF
// sections (being retired, ADR-013), and last the plain text of the content.
export function adaptWPPostDetail(wp: WPPostDetail, blocks?: EditorBlock[] | null) {
  const acf = wp.acfPostFields;

  const sections: PostSection[] = blocks?.length
    ? sectionsFromBlocks(blocks)
    : acf?.postSections?.length
      ? acf.postSections.map((s) => ({
          id: s.sectionId,
          title: s.sectionTitle,
          blocks: paragraphBlocks(s.sectionContent, s.sectionId),
        }))
      : [{ id: "content", title: "", blocks: paragraphBlocks(wp.content, "content") }];

  return {
    title: wp.title,
    subtitle: acf?.subtitle ?? stripHtml(wp.excerpt),
    category: wp.categories.nodes[0]?.name ?? "Blog",
    date: formatWPDate(wp.date),
    readTime: acf?.readingTime ?? estimateReadTime(wp.content),
    reads: null,
    comments: wp.commentCount ?? 0,
    likes: null,
    heroImage: acf?.heroImage?.node.sourceUrl ?? wp.featuredImage?.node.sourceUrl ?? FALLBACK_IMAGE,
    author: {
      name: wp.author?.node.name ?? "Armando",
      role: "autor",
      avatar: wp.author?.node.avatar?.url ?? "/avatar-pixel-art.png",
      bio: wp.author?.node.description ?? "",
    },
    sections,
  };
}
