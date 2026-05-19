import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/payments/providers";
import { getSecret } from "@/lib/payments/secrets";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

/**
 * POST /api/checkout/stripe
 * Body : { amount: number, currency: "USD"|"EUR", description: string, planId?: string }
 * Returns : { url: stripeCheckoutUrl }
 */
export async function POST(request: Request) {
  const stripeKey = await getSecret("STRIPE", "STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe non configuré (STRIPE_SECRET_KEY manquante)" }, { status: 503 });
  }
  const stripe = new Stripe(stripeKey);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !body.amount || !body.currency || !body.description) {
    return NextResponse.json({ error: "amount, currency, description requis" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // Anti-abuse : 30 inits/min par utilisateur (bucket public).
  const rl = await rateLimit("public", user.id);
  if (!rl.success) return rateLimitResponse(rl);

  const amount = Number(body.amount);
  const currency = String(body.currency).toLowerCase();
  const planId = body.planId ? String(body.planId) : undefined;
  const description = String(body.description);

  // 1. Crée la ligne payment PENDING (audit/idempotence)
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

  // 2. Crée la Checkout Session Stripe
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency,
          product_data: { name: description },
          unit_amount: Math.round(amount * 100), // cents
        },
        quantity: 1,
      }],
      customer_email: user.email,
      client_reference_id: payment.id,
      success_url: `${APP_URL}/dashboard/billing?status=success&pid=${payment.id}`,
      cancel_url: `${APP_URL}/pricing?status=cancelled`,
      metadata: { payment_id: payment.id, user_id: user.id, plan_id: planId ?? "" },
    });

    // 3. Met à jour external_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any)
      .update({ external_id: session.id })
      .eq("id", payment.id);

    return NextResponse.json({ url: session.url, paymentId: payment.id });
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", payment.id);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
