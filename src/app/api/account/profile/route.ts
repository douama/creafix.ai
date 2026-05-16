import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * GET /api/account/profile → retourne le profil de l'utilisateur connecté
 * PATCH /api/account/profile → met à jour son propre profil
 *
 * Tout utilisateur authentifié peut éditer SON profil (full_name, phone,
 * country, preferred_lang, preferred_niches, avatar_url).
 * Le rôle, plan, credits, status sont READ-ONLY (réservés admin).
 */
const EDITABLE_FIELDS = [
  "full_name",
  "phone",
  "country",
  "preferred_lang",
  "preferred_niches",
  "avatar_url",
];

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (sb.from("user_profiles") as any)
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    ...data,
    email: user.email,
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "body requis" }, { status: 400 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const updates: Record<string, unknown> = {};
  for (const k of EDITABLE_FIELDS) {
    if (k in body) updates[k] = body[k];
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
  }
  updates.updated_at = new Date().toISOString();

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (sb.from("user_profiles") as any).update(updates).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
