import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyWebhook, captureOrder } from "@/lib/payments/paypal";
import { getSecret } from "@/lib/payments/secrets";

/**
 * PayPal webhook
 * Configure dans PayPal Dashboard → Webhooks → URL :
 *   https://creafix-ai.vercel.app/api/webhooks/paypal
 * Events à écouter : CHECKOUT.ORDER.APPROVED, PAYMENT.CAPTURE.COMPLETED,
 * PAYMENT.CAPTURE.DENIED. Copie le Webhook ID dans PAYPAL_WEBHOOK_ID.
 */
export async function POST(request: Request) {
  const raw = await request.text();

  const verified = await verifyWebhook(request.headers, raw).catch(() => false);
  if (!verified && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Signature PayPal invalide" }, { status: 400 });
  }

  const event = JSON.parse(raw);
  const sb = supabaseAdmin();

  if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
    const orderId = event.resource.id;
    try {
      await captureOrder(orderId);
      // Le PAYMENT.CAPTURE.COMPLETED arrivera ensuite et mettra à jour status
    } catch {
      // Ignore : on attend juste le capture event
    }
  } else if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    // resource.supplementary_data.related_ids.order_id → notre external_id
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
    if (orderId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any)
        .update({ status: "SUCCEEDED", paid_at: new Date().toISOString() })
        .eq("external_id", orderId);
    }
  } else if (event.event_type === "PAYMENT.CAPTURE.DENIED") {
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
    if (orderId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any).update({ status: "FAILED" }).eq("external_id", orderId);
    }
  }

  return NextResponse.json({ received: true });
}
