import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { guardRedirect } from "@/lib/auth/route-guard";

export default auth((req) => {
  const target = guardRedirect(req.nextUrl.pathname, !!req.auth);
  if (target) return NextResponse.redirect(new URL(target, req.nextUrl));
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
