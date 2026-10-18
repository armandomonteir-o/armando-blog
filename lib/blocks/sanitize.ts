import sanitizeHtml from "sanitize-html";

// The content of WordPress blocks is HTML written by an author, and it ends up in the page. It
// never goes in unchecked: everything is cut down to an allowlist first (no script, iframe, style,
// form or event handlers) and only http, https and mailto links survive.
const LINKS = {
  allowedAttributes: { a: ["href", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName: string, attribs: Record<string, string>) => ({
      tagName,
      attribs: { ...attribs, rel: "noopener noreferrer" },
    }),
  },
};

const INLINE_TAGS = ["a", "strong", "b", "em", "i", "code", "br", "sub", "sup", "mark", "s", "kbd"];

// For the text of a block (paragraph, list item, caption): inline formatting only.
export function sanitizeInline(html: string): string {
  return sanitizeHtml(html ?? "", { ...LINKS, allowedTags: INLINE_TAGS });
}

// For a block the renderer doesn't know (or raw HTML): keeps the structure, drops anything active.
export function sanitizeFallback(html: string): string {
  return sanitizeHtml(html ?? "", {
    ...LINKS,
    allowedTags: [
      ...INLINE_TAGS,
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "hr",
      "figure",
      "figcaption",
    ],
  });
}
