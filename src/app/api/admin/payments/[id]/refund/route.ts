import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireSuperAdmin } from "@/lib/admin/guard";

/**
 * POST /api/admin/payments/[id]/refund
 *
 * Marque le paiement comme REFUNDED dans Supabase + log dans audit_logs.
 * NB : le refund réel côté provider (Stripe/Wave) doit être déclenché
 * via leur API respective — ce endpoint update seulement le statut DB.
 */
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  // Refund = action financière destructrice → SUPER_ADMIN strict
  const guard = await requireSuperAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

  const sb = supabaseAdmin();

  // Fetch payment pour vérifier qu'il est SUCCEEDED avant refund
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payment } = await (sb.from("payments") as any)
    .select("id, status, amount, provider, external_id")
    .eq("id", id)
    .maybeSingle();

  if (!payment) return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
  if (payment.status !== "SUCCEEDED") {
    return NextResponse.json(
      { error: `Seuls les paiements SUCCEEDED peuvent être remboursés (actuel : ${payment.status})` },
      { status: 400 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (sb.from("payments") as any)
    .update({ status: "REFUNDED" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: "payment.refund",
    target_type: "payment",
    target_id: id,
    meta: { amount: payment.amount, provider: payment.provider, external_id: payment.external_id },
  });

  return NextResponse.json({
    ok: true,
    note: `Statut DB → REFUNDED. ⚠️ Lance aussi le refund côté ${payment.provider} via leur API.`,
  });
}
