import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

/**
 * POST /api/admin/testimonials/upload
 * multipart/form-data : file (image/*, max 2MB)
 * Returns : { url: publicUrl }
 */
export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "file requis" }, { status: 400 });

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop lourd (max 2 MB)" }, { status: 400 });
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return NextResponse.json({ error: "Format non supporté (jpg/png/webp uniquement)" }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const sb = supabaseAdmin();
  const { error: upErr } = await sb.storage
    .from("testimonial-avatars")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = sb.storage.from("testimonial-avatars").getPublicUrl(path);
  return NextResponse.json({ url: publicUrl, path });
}
