// Route rules applied by proxy.ts. Kept free of next-auth so they can be tested
// without the Next.js runtime.

const PROTECTED = ["/minha-conta"];
const GUEST_ONLY = ["/login"];

// The route itself or anything under it: "/minha-conta/x" matches, "/minha-contas" does not.
const isUnder = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

// Returns where to redirect the request, or null to let it through.
export function guardRedirect(pathname: string, isLoggedIn: boolean): string | null {
  if (PROTECTED.some((route) => isUnder(pathname, route)) && !isLoggedIn) {
    return `/login?callbackUrl=${encodeURIComponent(pathname)}`;
  }

  if (GUEST_ONLY.some((route) => isUnder(pathname, route)) && isLoggedIn) {
    return "/";
  }

  return null;
}
