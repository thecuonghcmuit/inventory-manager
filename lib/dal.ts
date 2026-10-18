import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * The signed-in user, or a redirect to the login page.
 *
 * Call this in every protected page and data function. A layout-level check is not
 * enough: Next.js renders a page's segment independently of its layout, so the
 * page's output reaches the client even when the layout redirects.
 * Callers must sit inside a <Suspense> boundary (the session is request-time data).
 */
export const requireUser = cache(async () => {
  // auth() re-encrypts the session cookie (random IV), which must not run during a prerender.
  await connection();
  const session = await auth();
  if (!session?.user) redirect("/");
  return session.user;
});
