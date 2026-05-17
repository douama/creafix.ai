import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSecret } from "@/lib/payments/secrets";

/**
 * POST /api/checkout/stripe/intent
 * Body : { amount: number, currency: "USD"|"EUR", description: string, planId?: string }
 * Returns : { clientSecret, paymentId, publishableKey }
 *
 * Crée un PaymentIntent Stripe pour paiement inline (Elements modal) au lieu
 * du redirect vers la Stripe Checkout hosted page.
 */
export async function POST(request: Request) {
  const [secretKey, publishableKey] = await Promise.all([
    getSecret("STRIPE", "STRIPE_SECRET_KEY"),
    getSecret("STRIPE", "STRIPE_PUBLISHABLE_KEY"),
  ]);
  if (!secretKey || !publishableKey) {
    return NextResponse.json(
      { error: "Stripe non configuré (clés Secret + Publishable requises)" },
      { status: 503 },
    );
  }
  const stripe = new Stripe(secretKey);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !body.amount || !body.currency || !body.description) {
    return NextResponse.json({ error: "amount, currency, description requis" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const amount = Number(body.amount);
  const currency = String(body.currency).toLowerCase();
  const planId = body.planId ? String(body.planId) : undefined;
  const description = String(body.description);

  // 1. Insère la ligne payment PENDING
  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payment, error: pErr } = await (sb.from("payments") as any).insert({
    user_id: user.id,
    provider: "STRIPE",
    amount,
    currency: currency.toUpperCase(),
    status: "PENDING",
    description,
    metadata: { plan_id: planId ?? null },
  }).select("id").single();
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  // 2. Crée le PaymentIntent
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency,
      description,
      receipt_email: user.email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        payment_id: payment.id,
        user_id: user.id,
        plan_id: planId ?? "",
      },
    });

    // 3. Persiste external_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any)
      .update({ external_id: intent.id })
      .eq("id", payment.id);

    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentId: payment.id,
      publishableKey,
    });
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", payment.id);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
