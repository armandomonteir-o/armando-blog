// Feature flags read from NEXT_PUBLIC_* variables. Next inlines them into the bundle at build
// time, so changing one on Vercel only takes effect on the next deploy.

// Off unless the variable is exactly "true" (#112): the newsletter has no backend yet, so showing
// it would promise a subscription the site can't keep.
export function isNewsletterEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER === "true";
}
