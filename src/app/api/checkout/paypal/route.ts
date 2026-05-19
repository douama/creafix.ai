import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/payments/providers";
import { createOrder } from "@/lib/payments/paypal";
import { getSecret } from "@/lib/payments/secrets";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ppId = await getSecret("PAYPAL", "PAYPAL_CLIENT_ID");
  const ppSecret = await getSecret("PAYPAL", "PAYPAL_CLIENT_SECRET");
  if (!ppId || !ppSecret) {
    return NextResponse.json({ error: "PayPal non configuré" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !body.amount || !body.currency || !body.description) {
    return NextResponse.json({ error: "amount, currency, description requis" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const rl = await rateLimit("public", user.id);
  if (!rl.success) return rateLimitResponse(rl);

  const amount = Number(body.amount);
  const currency = String(body.currency).toUpperCase();
  const description = String(body.description);
  const planId = body.planId ? String(body.planId) : undefined;

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payment, error: pErr } = await (sb.from("payments") as any).insert({
    user_id: user.id,
    provider: "PAYPAL",
    amount,
    currency,
    status: "PENDING",
    description,
    metadata: { plan_id: planId ?? null },
  }).select("id").single();
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  try {
    const order = await createOrder({
      amount, currency, description,
      paymentId: payment.id,
      successUrl: `${APP_URL}/dashboard/billing?status=success&pid=${payment.id}&provider=paypal`,
      cancelUrl: `${APP_URL}/pricing?status=cancelled`,
    });

    const approveLink = order.links.find((l) => l.rel === "approve")?.href;
    if (!approveLink) throw new Error("Lien d'approbation PayPal manquant");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any)
      .update({ external_id: order.id })
      .eq("id", payment.id);

    return NextResponse.json({ url: approveLink, paymentId: payment.id });
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", payment.id);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
