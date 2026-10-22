import "server-only";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Uploads live outside public/ (files added there after a build aren't guaranteed to be
// served) and are served by app/avatars/[file]/route.ts.
const AVATAR_DIR = path.join(process.cwd(), "storage", "avatars");
const URL_PREFIX = "/avatars/";
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const CONTENT_TYPES = { png: "image/png", jpg: "image/jpeg", webp: "image/webp", gif: "image/gif" } as const;
type ImageExt = keyof typeof CONTENT_TYPES;

// Only names this module generates: <cuid>-<timestamp>.<ext>. Also blocks path traversal.
const FILE_NAME = /^[a-z0-9]+-\d+\.(png|jpg|webp|gif)$/;

/** Identify the image type from its first bytes; the client-sent MIME type is not trusted. */
function detectImageType(buf: Buffer): ImageExt | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.toString("ascii", 0, 4) === "GIF8") return "gif";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

export async function saveAvatar(file: File, userId: string): Promise<{ url: string } | { error: string }> {
  if (file.size > MAX_AVATAR_BYTES) return { error: "Image must be 2 MB or smaller." };
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = detectImageType(buf);
  if (!ext) return { error: "Upload a PNG, JPG, WEBP or GIF image." };

  const name = `${userId}-${Date.now()}.${ext}`;
  await mkdir(AVATAR_DIR, { recursive: true });
  await writeFile(path.join(AVATAR_DIR, name), buf);
  return { url: URL_PREFIX + name };
}

/** Best-effort removal of an avatar this module stored; ignores external URLs. */
export async function deleteAvatar(url: string | null | undefined) {
  if (!url?.startsWith(URL_PREFIX)) return;
  const name = url.slice(URL_PREFIX.length);
  if (!FILE_NAME.test(name)) return;
  await unlink(path.join(AVATAR_DIR, name)).catch(() => {});
}

export async function readAvatar(name: string): Promise<{ data: Buffer; contentType: string } | null> {
  if (!FILE_NAME.test(name)) return null;
  const ext = name.slice(name.lastIndexOf(".") + 1) as ImageExt;
  try {
    return { data: await readFile(path.join(AVATAR_DIR, name)), contentType: CONTENT_TYPES[ext] };
  } catch {
    return null;
  }
}
