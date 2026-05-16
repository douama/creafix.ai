import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Action = "suspend" | "unsuspend" | "ban" | "reset" | "upgrade";

const VALID: Action[] = ["suspend", "unsuspend", "ban", "reset", "upgrade"];

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { action?: Action } | null;
  const action = body?.action;

  if (!action || !VALID.includes(action)) {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  // ── Guard : doit être ADMIN ──
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });
  }

  // Empêche de s'auto-bannir
  if (user.id === id && (action === "ban" || action === "suspend")) {
    return NextResponse.json({ error: "Impossible d'appliquer cette action sur ton propre compte" }, { status: 400 });
  }

  // ── Apply action ──
  const sb = supabaseAdmin();

  const updates: Record<string, unknown> = {};
  switch (action) {
    case "suspend":
      updates.status = "SUSPENDED";
      updates.suspended_at = new Date().toISOString();
      updates.suspended_reason = "Suspendu par admin";
      break;
    case "unsuspend":
      updates.status = "ACTIVE";
      updates.suspended_at = null;
      updates.suspended_reason = null;
      break;
    case "ban":
      updates.status = "BANNED";
      updates.suspended_at = new Date().toISOString();
      updates.suspended_reason = "Banni par admin";
      break;
    case "reset":
      updates.credits = 50;
      break;
    case "upgrade":
      updates.plan = "PRO";
      break;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updErr } = await (sb.from("user_profiles") as any)
    .update(updates)
    .eq("id", id);

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  // ── Log dans audit_logs ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: `user.${action}`,
    target_type: "user_profile",
    target_id: id,
    meta: updates,
  });

  return NextResponse.json({ ok: true, action, id });
}
