import { z } from "zod";

/** Login form rules. Used by the login form (field messages) and by authorize() in auth.ts. */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required." })
    .pipe(z.email({ error: "Enter a valid email address." })),
  password: z.string().min(1, { error: "Password is required." }),
});

export type LoginFieldErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;
