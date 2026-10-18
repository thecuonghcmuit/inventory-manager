import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PUBLIC_PATHS = new Set(["/"]);

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const signedIn = !!req.auth;

  // Signed-in users have no reason to see the login page.
  if (pathname === "/" && signedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (PUBLIC_PATHS.has(pathname) || signedIn) return NextResponse.next();

  // API callers get a status code, not a redirect to an HTML page.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/", req.nextUrl));
});

export const config = {
  // Everything except the Auth.js endpoints, Next.js internals and files with an extension
  // (favicon, images, fonts...).
  matcher: ["/((?!api/auth|_next/static|_next/image|.*\\..*).*)"],
};
