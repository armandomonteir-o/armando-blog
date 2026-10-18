import { sanitizeInline } from "@/lib/blocks";

// The text of a block is HTML written by an author (bold, italic, links). It is cut down to an
// allowlist before it is placed in the page, so this is the one place that sets inner HTML.
export function RichText({
  html,
  as: Tag = "span",
  className,
  style,
}: {
  html: unknown;
  as?: "p" | "span" | "li" | "cite" | "figcaption" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  style?: React.CSSProperties;
}) {
  const clean = sanitizeInline(typeof html === "string" ? html : "");
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: clean }} />;
}
