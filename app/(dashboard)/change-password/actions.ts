"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { changePasswordSchema, type ChangePasswordState } from "@/lib/validations/password";

// Never log, return or echo any password value from this action.
export async function changePassword(_prev: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  // SECURITY: whose password changes is decided only by the server-side session.
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { status: "error", message: "Your session has expired. Please sign in again." };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const errs = z.flattenError(parsed.error).fieldErrors;
    const fieldErrors = {
      currentPassword: errs.currentPassword?.[0],
      newPassword: errs.newPassword?.[0],
      confirmPassword: errs.confirmPassword?.[0],
    };
    const message = fieldErrors.currentPassword ?? fieldErrors.newPassword ?? fieldErrors.confirmPassword;
    return { status: "error", message, fieldErrors };
  }
  const { currentPassword, newPassword } = parsed.data;

  const user = await db.user.findUnique({ where: { id: userId }, select: { password: true } });
  if (!user) return { status: "error", message: "Your account could not be found." };

  // Verify the current password before changing anything.
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    const message = "Current password is incorrect.";
    return { status: "error", message, fieldErrors: { currentPassword: message } };
  }

  await db.user.update({
    where: { id: userId },
    data: { password: await bcrypt.hash(newPassword, 12) },
  });

  // Possible enhancement: sign the user out after a change so they log in again with the
  // new password. Note that JWT sessions on other devices stay valid until they expire;
  // ending those would need e.g. a `passwordChangedAt` column checked in the jwt callback.
  return { status: "success", message: "Password updated" };
}
