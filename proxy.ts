import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED = ["/minha-conta"];
const GUEST_ONLY = ["/login"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  if (PROTECTED.some((path) => nextUrl.pathname.startsWith(path)) && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (GUEST_ONLY.some((path) => nextUrl.pathname.startsWith(path)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
