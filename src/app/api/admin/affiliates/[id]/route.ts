import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * POST /api/admin/affiliates/[id]
 * Actions :
 *   - { action: "payout" } : marque la commission comme payée
 *   - { action: "approve" } : status → approved
 *   - { action: "reject" }  : status → rejected
 *   - { commission_pct: 25 } : édite le pourcentage de commission
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    action?: "payout" | "approve" | "reject";
    commission_pct?: number;
  } | null;

  if (!body) return NextResponse.json({ error: "body requis" }, { status: 400 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });

  const sb = supabaseAdmin();

  // Fetch current
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ref } = await (sb.from("affiliate_referrals") as any)
    .select("id, earned_usd, paid_usd, status, commission_pct, affiliate_id")
    .eq("id", id)
    .maybeSingle();

  if (!ref) return NextResponse.json({ error: "Referral introuvable" }, { status: 404 });

  const updates: Record<string, unknown> = {};
  let actionLabel = "update";

  if (body.action === "payout") {
    const pending = Number(ref.earned_usd) - Number(ref.paid_usd);
    if (pending <= 0) {
      return NextResponse.json({ error: "Rien à payer" }, { status: 400 });
    }
    updates.paid_usd = Number(ref.earned_usd);
    updates.paid_at = new Date().toISOString();
    updates.status = "paid";
    actionLabel = "payout";
  } else if (body.action === "approve") {
    updates.status = "approved";
    actionLabel = "approve";
  } else if (body.action === "reject") {
    updates.status = "rejected";
    actionLabel = "reject";
  } else if (typeof body.commission_pct === "number") {
    if (body.commission_pct < 0 || body.commission_pct > 100) {
      return NextResponse.json({ error: "commission_pct doit être 0-100" }, { status: 400 });
    }
    updates.commission_pct = body.commission_pct;
    actionLabel = "commission_update";
  } else {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (sb.from("affiliate_referrals") as any).update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: `affiliate.${actionLabel}`,
    target_type: "affiliate_referral",
    target_id: id,
    meta: updates,
  });

  return NextResponse.json({ ok: true, updates });
}
