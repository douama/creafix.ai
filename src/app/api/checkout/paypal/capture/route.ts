import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { captureOrder } from "@/lib/payments/paypal";

/**
 * POST /api/checkout/paypal/capture
 * Body : { orderId, paymentId }
 * Capture une order PayPal après que l'utilisateur a approuvé dans la popup.
 * Met à jour monetiq.payments.status.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { orderId?: string; paymentId?: string } | null;
  if (!body?.orderId || !body?.paymentId) {
    return NextResponse.json({ error: "orderId + paymentId requis" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const sb = supabaseAdmin();

  try {
    const captured = await captureOrder(body.orderId);

    const succeeded = captured?.status === "COMPLETED";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any)
      .update({
        status: succeeded ? "SUCCEEDED" : "FAILED",
        paid_at: succeeded ? new Date().toISOString() : null,
      })
      .eq("id", body.paymentId)
      .eq("user_id", user.id);

    return NextResponse.json({ ok: succeeded, status: captured?.status });
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any)
      .update({ status: "FAILED" })
      .eq("id", body.paymentId)
      .eq("user_id", user.id);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
