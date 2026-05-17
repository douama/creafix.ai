import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSecret } from "@/lib/payments/secrets";

/**
 * POST /api/webhooks/stripe
 * Stripe envoie ici les events après checkout.
 * Vérifie la signature + met à jour monetiq.payments.
 *
 * Config Vercel : configure le webhook dans le Stripe Dashboard avec URL :
 *   https://creafix-ai.vercel.app/api/webhooks/stripe
 * Events à écouter : checkout.session.completed, checkout.session.async_payment_failed
 * Copie le webhook signing secret dans STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  // Lit les clés depuis Vault (DB) ou env vars (fallback). Pour le webhook,
  // les DEUX clés sont nécessaires : secret_key pour instancier le SDK,
  // webhook_secret pour vérifier la signature de l'event.
  const stripeKey = await getSecret("STRIPE", "STRIPE_SECRET_KEY");
  const webhookSecret = await getSecret("STRIPE", "STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }
  const stripe = new Stripe(stripeKey);

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Signature manquante" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (e: unknown) {
    return NextResponse.json({ error: `Signature invalide: ${(e as Error).message}` }, { status: 400 });
  }

  const sb = supabaseAdmin();

  // Handlers
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.payment_id ?? session.client_reference_id;
    if (paymentId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any)
        .update({
          status: "SUCCEEDED",
          paid_at: new Date().toISOString(),
          external_id: session.id,
        })
        .eq("id", paymentId);
    }
  } else if (event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.payment_id ?? session.client_reference_id;
    if (paymentId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", paymentId);
    }
  } else if (event.type === "payment_intent.succeeded") {
    // ── Flow inline Elements (modal carte) ──
    const intent = event.data.object as Stripe.PaymentIntent;
    const paymentId = intent.metadata?.payment_id;
    if (paymentId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any)
        .update({
          status: "SUCCEEDED",
          paid_at: new Date().toISOString(),
          external_id: intent.id,
        })
        .eq("id", paymentId);
    }
  } else if (event.type === "payment_intent.payment_failed" || event.type === "payment_intent.canceled") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const paymentId = intent.metadata?.payment_id;
    if (paymentId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", paymentId);
    }
  }

  return NextResponse.json({ received: true });
}
