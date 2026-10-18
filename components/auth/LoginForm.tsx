"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { CircleAlert, UserRound } from "lucide-react";
import { loginSchema, type LoginFieldErrors } from "@/lib/validations/auth";

type Field = keyof LoginFieldErrors;

export default function LoginForm() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      const { fieldErrors: errs } = z.flattenError(parsed.error);
      setFieldErrors({ email: errs.email?.[0], password: errs.password?.[0] });
      const firstInvalid: Field = errs.email ? "email" : "password";
      form.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setFieldErrors({});
    setPending(true);

    try {
      const res = await signIn("credentials", { ...parsed.data, redirect: false });
      if (res.error) {
        setError(
          res.error === "CredentialsSignin"
            ? "Invalid email or password."
            : "Something went wrong. Please try again.",
        );
        setPending(false);
        return;
      }
      // Leave the button disabled while navigating away.
      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  // Clear a field's message as soon as the user edits it.
  function clearFieldError(field: Field) {
    if (fieldErrors[field]) setFieldErrors((errs) => ({ ...errs, [field]: undefined }));
  }

  const invalid = (field: Field) => (fieldErrors[field] || error ? true : undefined);

  return (
    <div className="auth">
      <div className="auth-ava">
        <UserRound />
      </div>
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        {error && (
          <div className="auth-error" role="alert">
            <CircleAlert />
            <span>{error}</span>
          </div>
        )}
        {/* noValidate: the browser's own tooltips are replaced by the messages below. */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="email">
                Email : <span className="req">*</span>
              </label>
            </div>
            <input
              id="email"
              name="email"
              className="auth-input"
              type="email"
              placeholder="Enter Email"
              autoComplete="email"
              required
              aria-invalid={invalid("email")}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              onChange={() => clearFieldError("email")}
            />
            <FieldError id="email-error" message={fieldErrors.email} />
          </div>
          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="password">
                Password: <span className="req">*</span>
              </label>
              <a href="#" className="auth-forgot">
                Forgot Password ?
              </a>
            </div>
            <input
              id="password"
              name="password"
              className="auth-input"
              type="password"
              placeholder="Enter Password"
              autoComplete="current-password"
              required
              aria-invalid={invalid("password")}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              onChange={() => clearFieldError("password")}
            />
            <FieldError id="password-error" message={fieldErrors.password} />
          </div>
          <button className="auth-btn" type="submit" disabled={pending} aria-busy={pending}>
            {pending ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="auth-field-error" id={id} role="alert">
      <CircleAlert />
      {message}
    </p>
  );
}
