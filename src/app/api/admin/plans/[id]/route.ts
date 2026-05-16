import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "body requis" }, { status: 400 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });

  // Whitelist des champs éditables
  const allowed = [
    "name", "description",
    "price_monthly_usd", "price_yearly_usd",
    "features", "credits_included",
    "max_audits_monthly", "max_social_accounts",
    "highlight", "active",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
  }
  updates.updated_by = user.id;

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (sb.from("plans_config") as any).update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: "plan.update",
    target_type: "plans_config",
    target_id: id,
    meta: Object.fromEntries(
      Object.entries(updates).map(([k, v]) => [k, k === "features" ? `${Array.isArray(v) ? v.length : 0} items` : v]),
    ),
  });

  return NextResponse.json({ ok: true });
}
