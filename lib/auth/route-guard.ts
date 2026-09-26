// Route rules applied by proxy.ts. Kept free of next-auth so they can be tested
// without the Next.js runtime.

const PROTECTED = ["/minha-conta"];
const GUEST_ONLY = ["/login"];

// Returns where to redirect the request, or null to let it through.
export function guardRedirect(pathname: string, isLoggedIn: boolean): string | null {
  if (PROTECTED.some((path) => pathname.startsWith(path)) && !isLoggedIn) {
    return `/login?callbackUrl=${encodeURIComponent(pathname)}`;
  }

  if (GUEST_ONLY.some((path) => pathname.startsWith(path)) && isLoggedIn) {
    return "/";
  }

  return null;
}
