import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Enter your current password." }),
    newPassword: z
      .string()
      .min(8, { error: "New password must be at least 8 characters." })
      // bcrypt only uses the first 72 bytes of a password.
      .refine((v) => Buffer.byteLength(v, "utf8") <= 72, { error: "New password is too long." })
      .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), { error: "New password must include a letter and a number." }),
    confirmPassword: z.string().min(1, { error: "Confirm your new password." }),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    path: ["newPassword"],
    error: "New password must be different from your current password.",
  });

export type PasswordField = keyof z.infer<typeof changePasswordSchema>;

/** Result of the change-password action. Never contains a password value. */
export type ChangePasswordState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<PasswordField, string>>;
};
