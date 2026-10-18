import sanitizeHtml from "sanitize-html";

const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(text: string): string {
  return text.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (match, dec, hex, name) => {
    if (dec) return String.fromCodePoint(Number(dec));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return NAMED[name.toLowerCase()] ?? match;
  });
}

// Text with no tags and no entities. Tags go first, so an escaped `&lt;b&gt;` stays the literal
// text `<b>` and is never read as a tag.
export function plainText(html: string): string {
  const stripped = sanitizeHtml(html ?? "", { allowedTags: [], allowedAttributes: {} });
  return decodeEntities(stripped).trim();
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
