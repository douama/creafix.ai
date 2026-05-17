import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * POST /api/account/avatar
 * multipart/form-data : file (image/jpeg|png|webp, max 2MB)
 * Upload dans user-avatars/{userId}/{timestamp}.ext + update user_profiles.avatar_url
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "file requis" }, { status: 400 });

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop lourd (max 2 MB)" }, { status: 400 });
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return NextResponse.json({ error: "Format non supporté (jpg/png/webp)" }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const sb = supabaseAdmin();
  const { error: upErr } = await sb.storage
    .from("user-avatars")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = sb.storage.from("user-avatars").getPublicUrl(path);

  // Update profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updErr } = await (sb.from("user_profiles") as any)
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  return NextResponse.json({ url: publicUrl });
}
