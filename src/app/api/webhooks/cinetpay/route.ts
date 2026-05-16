import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSecret } from "@/lib/payments/secrets";

/**
 * CinetPay webhook (notify_url)
 * CinetPay POST en form-urlencoded avec cpm_trans_id (notre payment.id).
 * Pour vérifier le succès → on fait un GET sur leur API check.
 * Doc : https://docs.cinetpay.com/api/1.0-fr/checkout/hmac
 */
export async function POST(request: Request) {
  const apiKey = await getSecret("CINETPAY", "CINETPAY_API_KEY");
  const siteId = await getSecret("CINETPAY", "CINETPAY_SITE_ID");
  if (!apiKey || !siteId) return NextResponse.json({ error: "CinetPay non configuré" }, { status: 503 });

  const formData = await request.formData();
  const transId = formData.get("cpm_trans_id");
  if (!transId) return NextResponse.json({ error: "cpm_trans_id manquant" }, { status: 400 });

  // Vérification via API check (source de vérité)
  const res = await fetch("https://api-checkout.cinetpay.com/v2/payment/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apikey: apiKey, site_id: siteId, transaction_id: String(transId) }),
  });
  const data = await res.json();

  const sb = supabaseAdmin();
  if (data.code === "00" && data.data?.status === "ACCEPTED") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any)
      .update({ status: "SUCCEEDED", paid_at: new Date().toISOString() })
      .eq("id", String(transId));
  } else if (data.code === "627" || data.data?.status === "REFUSED" || data.data?.status === "CANCELLED") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", String(transId));
  }

  return NextResponse.json({ received: true });
}
