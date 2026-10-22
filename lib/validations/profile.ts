import { z } from "zod";

/**
 * Self-profile fields. Deliberately has no `role` or `password`: role changes belong to
 * the admin Users page and passwords to the Change Password page.
 */
export const profileSchema = z.object({
  firstName: z.string().trim().min(1, { error: "First name is required." }).max(100, { error: "First name is too long." }),
  lastName: z.string().trim().min(1, { error: "Last name is required." }).max(100, { error: "Last name is too long." }),
  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required." })
    .pipe(z.email({ error: "Enter a valid email address." })),
  phoneNumber: z
    .string()
    .trim()
    .min(1, { error: "Phone number is required." })
    .regex(/^\+?[0-9\s\-().]{6,20}$/, { error: "Enter a valid phone number." }),
});

export type ProfileField = keyof z.infer<typeof profileSchema> | "image";

export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ProfileField, string>>;
};
