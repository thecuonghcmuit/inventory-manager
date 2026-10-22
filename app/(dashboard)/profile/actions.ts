"use server";

import { refresh } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { deleteAvatar, saveAvatar } from "@/lib/avatars";
import { profileSchema, type ProfileFormState } from "@/lib/validations/profile";

const EMAIL_TAKEN = "This email is already used by another account.";

export async function updateProfile(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  // SECURITY: the user id comes only from the server-side session. Nothing in formData
  // (an id, a role, ...) decides whose record is edited, so users can only edit themselves.
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { status: "error", message: "Your session has expired. Please sign in again." };

  // SECURITY: `role` is intentionally not read. Self-edits must never change a role
  // (anyone could make themselves admin); role changes belong to the admin Users page.
  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
  });
  if (!parsed.success) {
    const errs = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        firstName: errs.firstName?.[0],
        lastName: errs.lastName?.[0],
        email: errs.email?.[0],
        phoneNumber: errs.phoneNumber?.[0],
      },
    };
  }
  const data = parsed.data;

  const current = await db.user.findUnique({ where: { id: userId }, select: { email: true, image: true } });
  if (!current) return { status: "error", message: "Your account could not be found." };

  if (data.email !== current.email) {
    const taken = await db.user.findFirst({ where: { email: data.email, NOT: { id: userId } }, select: { id: true } });
    if (taken) return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: { email: EMAIL_TAKEN } };
  }

  let image = current.image;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const saved = await saveAvatar(file, userId);
    if ("error" in saved) {
      return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: { image: saved.error } };
    }
    image = saved.url;
  }

  try {
    // Password is not touched here; that is the Change Password page's job.
    await db.user.update({ where: { id: userId }, data: { ...data, image } });
  } catch (err) {
    if (image !== current.image) await deleteAvatar(image);
    // Another account claimed the email between the check above and this update.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: { email: EMAIL_TAKEN } };
    }
    throw err;
  }

  if (image !== current.image) await deleteAvatar(current.image);

  // Re-render the page and the topbar (name/avatar) with the saved data.
  refresh();
  return { status: "success", message: "Your profile has been updated." };
}
