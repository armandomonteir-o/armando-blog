import type { NextConfig } from "next";

const imageHosts = [
  "images.unsplash.com",
  "armandomonteiro.com",
  "lh3.googleusercontent.com",
  "secure.gravatar.com",
];

// CSP in report-only mode (#135, ADR-017). `'unsafe-inline'` stays because a nonce needs dynamic
// rendering for every page, which would give up the ISR cache (ADR-014).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${imageHosts.map((h) => `https://${h}`).join(" ")}`,
  "font-src 'self'",
  "media-src 'self' https://cdn.pixabay.com",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
  "object-src 'none'",
].join("; ");

// HSTS is not here on purpose: Vercel already sends it (measured with curl -I).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
