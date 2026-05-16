import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Flutterwave webhook
 * Configure dans Flutterwave Dashboard → Settings → Webhooks :
 *   URL : https://creafix-ai.vercel.app/api/webhooks/flutterwave
 * Set le Secret hash → FLUTTERWAVE_WEBHOOK_HASH dans Vercel env.
 * Doc : https://developer.flutterwave.com/docs/integration-guides/webhooks
 */
export async function POST(request: Request) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  const hash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
  if (!secret) return NextResponse.json({ error: "Flutterwave non configuré" }, { status: 503 });

  // Verify webhook signature
  if (hash) {
    const signature = request.headers.get("verif-hash");
    if (signature !== hash) {
      return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
    }
  }

  const event = await request.json();
  const sb = supabaseAdmin();

  // event.event = "charge.completed" est l'event principal
  if (event.event === "charge.completed") {
    const txRef = event.data?.tx_ref; // notre payment.id
    const status = event.data?.status; // "successful" | "failed" | "cancelled"
    const transactionId = event.data?.id; // ID Flutterwave pour verify

    if (!txRef || !transactionId) {
      return NextResponse.json({ received: true });
    }

    // Verify via API (source de vérité — anti-spoofing)
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      { headers: { Authorization: `Bearer ${secret}` } },
    );
    const verifyData = await verifyRes.json();

    if (verifyData.status === "success" && verifyData.data?.status === "successful") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any)
        .update({
          status: "SUCCEEDED",
          paid_at: new Date().toISOString(),
          external_id: String(transactionId),
        })
        .eq("id", txRef);
    } else if (status === "failed" || status === "cancelled") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", txRef);
    }
  }

  return NextResponse.json({ received: true });
}
