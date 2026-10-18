import { requireUser } from "@/lib/dal";

/**
 * Renders `children` only for a signed-in user; otherwise redirects to the login page.
 * Must sit inside a <Suspense> boundary: it reads the session at request time.
 *
 * In a layout this hides the UI and redirects, but does not stop the page segment from
 * rendering; pages must call requireUser() themselves (see lib/dal.ts).
 */
export default async function RequireSession({ children }: { children: React.ReactNode }) {
  await requireUser();
  return children;
}
