"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Check, CircleAlert, Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/app/(dashboard)/change-password/actions";
import type { ChangePasswordState, PasswordField } from "@/lib/validations/password";

const initialState: ChangePasswordState = { status: "idle" };

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Every result is reported as a toast; the field hints below are secondary.
  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Password updated");
      formRef.current?.reset();
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    // Submitting manually (not via the `action` prop) keeps the inputs after a failed
    // attempt; on success the effect above clears them.
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  }

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form ref={formRef} className="gg-card gg-card-pad" style={{ maxWidth: 640 }} onSubmit={onSubmit} noValidate>
      <div className="gg-stack gg-gap-6">
        <PasswordInput name="currentPassword" label="Current Password" placeholder="Enter Current Password" autoComplete="current-password" error={errors.currentPassword} />
        <PasswordInput name="newPassword" label="New Password" placeholder="Enter New Password" autoComplete="new-password" error={errors.newPassword} hint="At least 8 characters, including a letter and a number." />
        <PasswordInput name="confirmPassword" label="Confirm New Password" placeholder="Re-enter New Password" autoComplete="new-password" error={errors.confirmPassword} />
      </div>

      <div className="gg-form-actions">
        <button type="submit" className="gg-btn gg-btn--primary" disabled={pending} aria-busy={pending}>
          <Check /> {pending ? "Updating…" : "Update Password"}
        </button>
        <button type="reset" className="gg-btn gg-btn--secondary" disabled={pending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function PasswordInput({
  name,
  label,
  error,
  hint,
  ...input
}: {
  name: PasswordField;
  label: string;
  error?: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const describedBy = [error && `${name}-error`, hint && `${name}-hint`].filter(Boolean).join(" ") || undefined;

  return (
    <div className="gg-field">
      <label className="gg-label" htmlFor={name}>
        {label} <span className="gg-req">*</span>
      </label>
      <div className="pw-field">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          className="gg-input"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...input}
        />
        <button
          type="button"
          className="pw-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
      {error ? (
        <p className="gg-field-error" id={`${name}-error`}>
          <CircleAlert /> {error}
        </p>
      ) : (
        hint && (
          <span className="gg-caption" id={`${name}-hint`}>
            {hint}
          </span>
        )
      )}
    </div>
  );
}
