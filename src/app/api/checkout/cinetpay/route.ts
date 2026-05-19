import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/payments/providers";
import { getSecret } from "@/lib/payments/secrets";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

/**
 * POST /api/checkout/cinetpay
 * Body : { amount, currency: "XOF"|"XAF"|"CDF"|"GNF", description, planId?, customerPhone? }
 * Doc : https://docs.cinetpay.com/api/1.0-fr/checkout/initialisation
 */
export async function POST(request: Request) {
  const apiKey = await getSecret("CINETPAY", "CINETPAY_API_KEY");
  const siteId = await getSecret("CINETPAY", "CINETPAY_SITE_ID");
  if (!apiKey || !siteId) {
    return NextResponse.json({ error: "CinetPay non configuré" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !body.amount || !body.currency || !body.description) {
    return NextResponse.json({ error: "amount, currency, description requis" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const rl = await rateLimit("public", user.id);
  if (!rl.success) return rateLimitResponse(rl);

  const amount = Math.round(Number(body.amount));
  const currency = String(body.currency).toUpperCase(); // XOF, XAF, CDF, GNF
  const description = String(body.description);
  const planId = body.planId ? String(body.planId) : undefined;
  const customerPhone = body.customerPhone ? String(body.customerPhone) : undefined;

  // CinetPay : amount doit être un multiple de 5 (limitation API CFA)
  if (currency === "XOF" || currency === "XAF") {
    if (amount % 5 !== 0) {
      return NextResponse.json({ error: "En CFA, le montant doit être un multiple de 5" }, { status: 400 });
    }
  }

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payment, error: pErr } = await (sb.from("payments") as any).insert({
    user_id: user.id,
    provider: "CINETPAY",
    amount,
    currency,
    status: "PENDING",
    description,
    metadata: { plan_id: planId ?? null, phone: customerPhone ?? null },
  }).select("id").single();
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  const transactionId = payment.id; // CinetPay accepte UUID

  try {
    const res = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: apiKey,
        site_id: siteId,
        transaction_id: transactionId,
        amount,
        currency,
        description,
        return_url: `${APP_URL}/dashboard/billing?status=success&pid=${payment.id}&provider=cinetpay`,
        notify_url: `${APP_URL}/api/webhooks/cinetpay`,
        customer_email: user.email,
        customer_phone_number: customerPhone,
        channels: "ALL",
        lang: "FR",
      }),
    });
    const data = await res.json();

    if (data.code !== "201" || !data.data?.payment_url) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", payment.id);
      return NextResponse.json({ error: data.message ?? "CinetPay init échouée" }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any)
      .update({ external_id: data.data.payment_token ?? transactionId })
      .eq("id", payment.id);

    return NextResponse.json({ url: data.data.payment_url, paymentId: payment.id });
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", payment.id);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
