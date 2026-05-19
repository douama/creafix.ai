import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

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

  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

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

  // Récupère la config actuelle pour connaître le provider
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: current } = await (sb.from("ai_model_configs") as any)
    .select("provider, enabled")
    .eq("id", id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (sb.from("ai_model_configs") as any)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-activer les agents qui utilisent ce provider quand une clé est fournie et le provider est enabled
  const providerNowEnabled = updates.enabled === true || (updates.api_key_set === true && (current?.enabled || updates.enabled !== false));
  if (current?.provider && providerNowEnabled && updates.api_key_set === true) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("ai_agents") as any)
      .update({ enabled: true })
      .eq("primary_provider", current.provider)
      .eq("enabled", false);
  }

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
