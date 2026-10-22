"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { Check, CircleAlert, CircleCheck, Pencil, UserRound } from "lucide-react";
import { updateProfile } from "@/app/(dashboard)/profile/actions";
import type { ProfileField, ProfileFormState } from "@/lib/validations/profile";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  image: string | null;
  role: string;
};

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // keep in sync with lib/avatars.ts
const initialState: ProfileFormState = { status: "idle" };

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // After a successful save the refreshed `profile.image` is the source of truth,
  // so drop the local preview and the chosen file.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "success") {
      setPreview(null);
      setFileInputKey((k) => k + 1);
    }
  }

  // Release the preview's object URL when it is replaced or the form unmounts.
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageError(null);
    if (!file) return setPreview(null);
    if (!file.type.startsWith("image/")) {
      e.target.value = "";
      return setImageError("Upload a PNG, JPG, WEBP or GIF image.");
    }
    if (file.size > MAX_IMAGE_BYTES) {
      e.target.value = "";
      return setImageError("Image must be 2 MB or smaller.");
    }
    setPreview(URL.createObjectURL(file));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    // Submitting manually (not via the `action` prop) stops React from resetting the
    // inputs after the action, so a failed save keeps what the user typed.
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  }

  function onReset() {
    setPreview(null);
    setImageError(null);
  }

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const fieldError = (f: ProfileField) => (f === "image" ? imageError ?? errors.image : errors[f]);
  const avatarSrc = preview ?? profile.image;

  return (
    <form className="gg-card gg-card-pad" onSubmit={onSubmit} onReset={onReset} noValidate>
      {state.status === "success" && (
        <div className="form-alert form-alert--success" role="status">
          <CircleCheck /> {state.message}
        </div>
      )}
      {state.status === "error" && state.message && (
        <div className="form-alert form-alert--error" role="alert">
          <CircleAlert /> {state.message}
        </div>
      )}

      <div className="user-ava-wrap">
        <label className="gg-label" htmlFor="image" style={{ display: "block", marginBottom: "var(--sp-3)" }}>
          Change Image
        </label>
        <div className="user-ava">
          <div className="circ">
            {avatarSrc ? (
              // Plain <img>: the source is a local blob preview, an uploaded file, or an external URL.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarSrc} alt="Profile image" />
            ) : (
              <UserRound />
            )}
          </div>
          <button type="button" className="edit" title="Change image" onClick={() => fileRef.current?.click()}>
            <Pencil />
          </button>
        </div>
        <input
          key={fileInputKey}
          ref={fileRef}
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={onImageChange}
        />
        <p className="gg-caption user-ava-hint">PNG, JPG, WEBP or GIF, up to 2 MB.</p>
        <FieldError id="image-error" message={fieldError("image")} />
      </div>

      <div className="exp-grid">
        <TextField name="firstName" label="First Name" placeholder="Enter First Name" defaultValue={profile.firstName} error={fieldError("firstName")} autoComplete="given-name" />
        <TextField name="lastName" label="Last Name" placeholder="Enter Last Name" defaultValue={profile.lastName} error={fieldError("lastName")} autoComplete="family-name" />
        <TextField name="email" label="Email" type="email" placeholder="Enter Email" defaultValue={profile.email} error={fieldError("email")} autoComplete="email" />
        <TextField name="phoneNumber" label="Phone Number" type="tel" placeholder="Enter Phone Number" defaultValue={profile.phoneNumber} error={fieldError("phoneNumber")} autoComplete="tel" />

        {/* SECURITY: Role is display-only on the self-profile page. The select is disabled and
            has no `name`, so it is never submitted, and updateProfile ignores any role value
            anyway. Letting users edit their own role would let anyone make themselves admin;
            role changes belong on the admin Users page. */}
        <div className="gg-field">
          <label className="gg-label" htmlFor="role">Role</label>
          <select id="role" className="gg-select" value={profile.role} disabled aria-describedby="role-hint">
            <option value={profile.role}>{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</option>
          </select>
          <span id="role-hint" className="gg-caption">Only an administrator can change roles.</span>
        </div>
      </div>

      <div className="gg-form-actions">
        <button type="submit" className="gg-btn gg-btn--primary" disabled={pending} aria-busy={pending}>
          <Check /> {pending ? "Saving…" : "Save"}
        </button>
        <button type="reset" className="gg-btn gg-btn--secondary" disabled={pending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function TextField({
  name,
  label,
  error,
  ...input
}: {
  name: Exclude<ProfileField, "image">;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="gg-field">
      <label className="gg-label" htmlFor={name}>
        {label} <span className="gg-req">*</span>
      </label>
      <input
        id={name}
        name={name}
        className="gg-input"
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        {...input}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string | null }) {
  if (!message) return null;
  return (
    <p className="gg-field-error" id={id}>
      <CircleAlert /> {message}
    </p>
  );
}
