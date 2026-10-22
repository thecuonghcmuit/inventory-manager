import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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

/**
 * The signed-in user's current database record (never the password). Unlike the session,
 * which is fixed at sign-in, this reflects profile edits immediately.
 * Returns null if the account no longer exists.
 */
export const getCurrentUser = cache(async () => {
  const { id } = await requireUser();
  return db.user.findUnique({
    where: { id },
    select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true, image: true, role: true },
  });
});
