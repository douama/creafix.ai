import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSecret } from "@/lib/payments/secrets";

/**
 * CinetPay webhook (notify_url) — HMAC + check API double-verify.
 *
 * Sécurité bout-en-bout :
 *   1. HMAC-SHA256 du payload avec CINETPAY_SECRET_KEY → compare au header x-token
 *      (timing-safe compare anti-side-channel)
 *   2. Si HMAC OK → re-vérification via API /v2/payment/check (source de vérité,
 *      anti-replay si l'attaquant a sniffé un payload légitime)
 *   3. Mise à jour status en DB
 *
 * Doc : https://docs.cinetpay.com/api/1.0-fr/checkout/hmac
 *
 * Champs concaténés dans l'ORDRE EXACT pour le calcul HMAC :
 *   cpm_site_id + cpm_trans_id + cpm_trans_date + cpm_amount + cpm_currency
 *   + signature + payment_method + cel_phone_num + cel_phone_num_show
 *   + created_at + updated_at
 */
export async function POST(request: Request) {
  const apiKey = await getSecret("CINETPAY", "CINETPAY_API_KEY");
  const siteId = await getSecret("CINETPAY", "CINETPAY_SITE_ID");
  if (!apiKey || !siteId) {
    return NextResponse.json({ error: "CinetPay non configuré" }, { status: 503 });
  }

  const formData = await request.formData();
  const transId = formData.get("cpm_trans_id");
  if (!transId) {
    return NextResponse.json({ error: "cpm_trans_id manquant" }, { status: 400 });
  }

  // ─── 1. HMAC validation ────
  // Fail-close en prod : si CINETPAY_SECRET_KEY est absente, on refuse le
  // webhook (sinon un attaquant pourrait poster n'importe quoi). En dev on
  // tolère l'absence pour faciliter le bootstrap.
  const secretKey = await getSecret("CINETPAY", "CINETPAY_SECRET_KEY");
  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[cinetpay] CINETPAY_SECRET_KEY manquante en prod — webhook refusé");
      return NextResponse.json({ error: "Webhook non configuré" }, { status: 503 });
    }
    console.warn("[cinetpay] CINETPAY_SECRET_KEY manquante (dev only) — HMAC skip");
  } else {
    const receivedToken = request.headers.get("x-token") ?? "";
    if (!receivedToken) {
      console.error("[cinetpay] x-token header manquant");
      return NextResponse.json({ error: "x-token manquant" }, { status: 401 });
    }

    // Concaténation dans l'ordre exact spécifié par la doc CinetPay
    const fields = [
      "cpm_site_id",
      "cpm_trans_id",
      "cpm_trans_date",
      "cpm_amount",
      "cpm_currency",
      "signature",
      "payment_method",
      "cel_phone_num",
      "cel_phone_num_show",
      "created_at",
      "updated_at",
    ];
    const data = fields.map((f) => formData.get(f)?.toString() ?? "").join("");
    const computed = createHmac("sha256", secretKey).update(data).digest("hex");

    // Timing-safe compare (anti side-channel timing attack)
    const a = Buffer.from(receivedToken, "utf8");
    const b = Buffer.from(computed, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      console.error("[cinetpay] HMAC invalide pour transId:", String(transId));
      return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
    }
  }

  // ─── 2. Vérification via API check (source de vérité, anti-replay) ────
  const res = await fetch("https://api-checkout.cinetpay.com/v2/payment/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apikey: apiKey, site_id: siteId, transaction_id: String(transId) }),
  });
  const checkData = await res.json();

  // ─── 3. Update DB ────────────────────────────────────────────────
  const sb = supabaseAdmin();
  if (checkData.code === "00" && checkData.data?.status === "ACCEPTED") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any)
      .update({ status: "SUCCEEDED", paid_at: new Date().toISOString() })
      .eq("id", String(transId));
  } else if (
    checkData.code === "627" ||
    checkData.data?.status === "REFUSED" ||
    checkData.data?.status === "CANCELLED"
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", String(transId));
  }

  return NextResponse.json({ received: true });
}
