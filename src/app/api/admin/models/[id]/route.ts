import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    api_key?: string;
    enabled?: boolean;
    default_model?: string;
  };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });

  const updates: Record<string, unknown> = {};

  if (body.api_key && body.api_key.length > 8) {
    // ⚠️ POC : on stocke juste un mask. En prod : chiffrer via Supabase Vault.
    updates.api_key_mask = `…${body.api_key.slice(-4)}`;
    updates.api_key_set = true;
  }
  if (typeof body.enabled === "boolean") updates.enabled = body.enabled;
  if (body.default_model) updates.default_model = body.default_model;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucune mise à jour" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (sb.from("ai_model_configs") as any)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: "ai_model.update",
    target_type: "ai_model_config",
    target_id: id,
    meta: Object.keys(updates).reduce((acc, k) => ({ ...acc, [k]: k === "api_key_mask" ? "***" : updates[k] }), {}),
  });

  return NextResponse.json({ ok: true, model: data });
}
