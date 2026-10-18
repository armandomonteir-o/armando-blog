// The public address of the site, the one place that reads NEXT_PUBLIC_SITE_URL (#12). The sitemap
// and robots.txt need absolute URLs. When the blog moves to blog.armandomonteiro.com, set the
// variable on Vercel (it is inlined at build time, so it takes effect on the next deploy).
export const DEFAULT_SITE_URL = "https://armando-blog.vercel.app";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  // A value without http(s):// would produce relative-looking, broken URLs in the sitemap.
  if (!raw || !/^https?:\/\//i.test(raw)) return DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string {
  return path === "/" ? getSiteUrl() : `${getSiteUrl()}${path}`;
}
