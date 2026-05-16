import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/payments/providers";
import { getSecret } from "@/lib/payments/secrets";

/**
 * POST /api/checkout/flutterwave
 * Body : { amount, currency: "NGN"|"KES"|"ZAR"|"GHS"|"USD"|"EUR"|"UGX"|"EGP", description, planId?, customerPhone? }
 * Doc : https://developer.flutterwave.com/reference/endpoints/standard
 */
export async function POST(request: Request) {
  const secret = await getSecret("FLUTTERWAVE", "FLUTTERWAVE_SECRET_KEY");
  if (!secret) return NextResponse.json({ error: "Flutterwave non configuré" }, { status: 503 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !body.amount || !body.currency || !body.description) {
    return NextResponse.json({ error: "amount, currency, description requis" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const amount = Number(body.amount);
  const currency = String(body.currency).toUpperCase();
  const description = String(body.description);
  const planId = body.planId ? String(body.planId) : undefined;
  const customerPhone = body.customerPhone ? String(body.customerPhone) : undefined;
  const customerName = body.customerName ? String(body.customerName) : user.email;

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: payment, error: pErr } = await (sb.from("payments") as any).insert({
    user_id: user.id,
    provider: "FLUTTERWAVE",
    amount,
    currency,
    status: "PENDING",
    description,
    metadata: { plan_id: planId ?? null, phone: customerPhone ?? null },
  }).select("id").single();
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  try {
    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: { "Authorization": `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        tx_ref: payment.id,
        amount,
        currency,
        redirect_url: `${APP_URL}/dashboard/billing?status=success&pid=${payment.id}&provider=flutterwave`,
        meta: { user_id: user.id, plan_id: planId },
        customer: {
          email: user.email,
          name: customerName,
          phonenumber: customerPhone,
        },
        customizations: {
          title: "CreaFix AI",
          description,
          logo: `${APP_URL}/logos/logo-light.svg`,
        },
        payment_options: "card,mobilemoneyghana,mobilemoneykenya,mobilemoneyuganda,mobilemoneyfranco,ussd,banktransfer",
      }),
    });
    const data = await res.json();

    if (data.status !== "success" || !data.data?.link) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", payment.id);
      return NextResponse.json({ error: data.message ?? "Flutterwave init échouée" }, { status: 500 });
    }

    // tx_ref est notre payment.id; data.data.link contient le checkout URL
    return NextResponse.json({ url: data.data.link, paymentId: payment.id });
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb.from("payments") as any).update({ status: "FAILED" }).eq("id", payment.id);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
