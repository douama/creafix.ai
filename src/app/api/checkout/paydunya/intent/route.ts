import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/payments/providers";
import { createInvoice, isConfigured } from "@/lib/payments/paydunya";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/checkout/paydunya/intent
 * Body : { amount, description, planId?, customerPhone? }
 * Returns: { token, paymentId } (sans redirect — utilisé par le modal softpay)
 */
export async function POST(request: Request) {
  if (!(await isConfigured())) {
    return NextResponse.json({ error: "PayDunya non configuré" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !body.amount || !body.description) {
    return NextResponse.json({ error: "amount, description requis" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // Rate limit : 10 req/min par user
  const rlId = user?.id ?? getClientIp(request);
  const rl = await rateLimit("checkout", rlId);
  if (!rl.success) return rateLimitResponse(rl);

  const amount = Math.round(Number(body.amount));
  if (!Number.isFinite(amount) || amount < 100) {
    return NextResponse.json({ error: "amount invalide (min 100 XOF)" }, { status: 400 });
  }

  const description = String(body.description);
  const planId = body.planId ? String(body.planId) : undefined;
  const customerPhone = body.customerPhone ? String(body.customerPhone) : undefined;

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payment, error: pErr } = await (sb.from("payments") as any).insert({
    user_id: user.id,
    provider: "PAYDUNYA",
    amount,
    currency: "XOF",
    status: "PENDING",
    description,
    metadata: { plan_id: planId ?? null, phone: customerPhone ?? null },
  }).select("id").single();
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  const invoice = await createInvoice({
    amount,
    description,
    customerName: user.user_metadata?.full_name ?? user.email,
    customerEmail: user.email,
    customerPhone,
    returnUrl: `${APP_URL}/dashboard/billing?status=success&pid=${payment.id}&provider=paydunya`,
    cancelUrl: `${APP_URL}/checkout?status=cancelled&pid=${payment.id}&provider=paydunya`,
    callbackUrl: `${APP_URL}/api/webhooks/paydunya`,
    customData: { payment_id: payment.id, user_id: user.id, plan_id: planId ?? null },
  });

  if (!invoice.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", payment.id);
    return NextResponse.json({ error: invoice.error }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("payments") as any)
    .update({ external_id: invoice.token })
    .eq("id", payment.id);

  return NextResponse.json({
    token: invoice.token,
    paymentId: payment.id,
    customerName: user.user_metadata?.full_name ?? user.email,
    customerEmail: user.email,
  });
}
