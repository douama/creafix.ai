import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";
import { invalidateAiSecretCache, type AiProvider } from "@/lib/ai/secrets";

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
  const incomingKey = body.api_key && body.api_key.length > 8 ? body.api_key : null;

  if (incomingKey) {
    // Le mask reste en table pour l'UI ; la valeur réelle part au Vault plus bas.
    updates.api_key_mask = `…${incomingKey.slice(-4)}`;
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

  // Persiste la clé réelle dans Vault (RPC SECURITY DEFINER côté DB).
  // Si la RPC n'est pas encore déployée (migration 0008), on log mais on
  // n'échoue pas le PATCH — la mask/flag UI reste cohérente.
  if (incomingKey && current?.provider) {
    const providerName = String(current.provider).toUpperCase() as AiProvider;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: vaultErr } = await (sb.rpc as any)("set_ai_secret", {
      p_provider: providerName,
      p_value: incomingKey,
    });
    if (vaultErr) {
      console.error(
        `[admin/models] Vault set_ai_secret failed for ${providerName}:`,
        vaultErr.message,
      );
      return NextResponse.json(
        { error: `Échec stockage Vault : ${vaultErr.message}` },
        { status: 500 },
      );
    }
    invalidateAiSecretCache(providerName);
  }

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
