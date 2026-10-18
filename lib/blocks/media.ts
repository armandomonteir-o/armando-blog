// Hosts next.config.ts lets next/image optimize. An image from any other host would throw at
// render time and take the whole post page down, so those are shown as they are, unoptimized.
const OPTIMIZABLE_HOSTS = new Set(["armandomonteiro.com", "images.unsplash.com"]);

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;

// Only absolute http(s) URLs: the address comes from the post, so `javascript:`, `data:` and
// protocol-relative or relative ones are dropped.
export function safeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

function positiveNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

export interface ImageSource {
  src: string;
  alt: string;
  width: number;
  height: number;
  optimized: boolean;
}

export function imageSource(
  attributes: Record<string, unknown> | null | undefined
): ImageSource | null {
  const src = safeUrl(attributes?.url);
  if (!src) return null;
  return {
    src,
    alt: typeof attributes?.alt === "string" ? attributes.alt : "",
    width: positiveNumber(attributes?.width, DEFAULT_WIDTH),
    height: positiveNumber(attributes?.height, DEFAULT_HEIGHT),
    optimized: OPTIMIZABLE_HOSTS.has(new URL(src).hostname),
  };
}

export function embedLabel(attributes: Record<string, unknown> | null | undefined): string {
  const slug = attributes?.providerNameSlug;
  if (typeof slug === "string" && slug) return slug.toUpperCase();
  const url = safeUrl(attributes?.url);
  return url ? new URL(url).hostname.replace(/^www\./, "").toUpperCase() : "LINK";
}

const MAX_FILE_NAME = 24;

// The name in the title bar of an image, like a file on the old desktop: the last part of the url
// in capitals, shortened so it fits, with a generic one when the url has no name to show.
export function imageFileName(src: string): string {
  const url = safeUrl(src);
  if (!url) return "IMAGE.PNG";
  let name = new URL(url).pathname.split("/").filter(Boolean).pop() ?? "";
  try {
    name = decodeURIComponent(name);
  } catch {
    // keep the raw name when it is not valid percent-encoding
  }
  if (!name) return "IMAGE.PNG";
  name = name.toUpperCase();
  if (name.length <= MAX_FILE_NAME) return name;
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot) : "";
  return `${name.slice(0, MAX_FILE_NAME - ext.length - 1)}…${ext}`;
}
