import { readAvatar } from "@/lib/avatars";

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const avatar = await readAvatar((await params).file);
  if (!avatar) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(avatar.data), {
    headers: {
      "Content-Type": avatar.contentType,
      // File names are unique per upload, so they never change.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
