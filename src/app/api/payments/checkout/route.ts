import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckout } from "@/lib/payments/providers";

const schema = z.object({
  plan: z.enum(["PRO", "AGENCY"]),
  provider: z.enum(["stripe", "paypal", "paydunya", "cinetpay", "wave", "orange_money", "mtn_momo"]),
  customerPhone: z.string().optional(),
});

const PRICING: Record<"PRO" | "AGENCY", { amount: number; currency: "XOF" }> = {
  PRO: { amount: 9_900, currency: "XOF" },
  AGENCY: { amount: 49_900, currency: "XOF" },
};

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { plan, provider, customerPhone } = parsed.data;
  const price = PRICING[plan];

  try {
    const result = await createCheckout({
      userId: "demo_user",
      amount: price.amount,
      currency: price.currency,
      description: `Abonnement CreaFix AI · ${plan}`,
      successUrl: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
      provider,
      customerPhone,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 501 });
  }
}
