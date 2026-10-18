import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "@/components/auth/LoginForm";
import "./auth.css";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="auth-page">
      {/* Reading the session is request-time data, so it sits behind Suspense
          (required by cacheComponents); the form itself stays in the static shell. */}
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <LoginForm />
    </div>
  );
}

async function RedirectIfSignedIn() {
  // auth() re-encrypts the session cookie (random IV), which must not run during a prerender.
  await connection();
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  return null;
}
