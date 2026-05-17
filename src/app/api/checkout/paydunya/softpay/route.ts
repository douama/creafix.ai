import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { softpay, type WalletId } from "@/lib/payments/paydunya";

const VALID_WALLETS: WalletId[] = [
  "WAVE_SN", "ORANGE_SN", "FREE_SN", "EXPRESSO_SN",
  "ORANGE_CI", "MTN_CI", "MOOV_CI",
];

/**
 * POST /api/checkout/paydunya/softpay
 * Body : { wallet, token, customerName, customerEmail, phone, otp? }
 * Charge un wallet PayDunya spécifique (Wave/Orange/Free/MTN/Moov/Expresso).
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    wallet?: string;
    token?: string;
    customerName?: string;
    customerEmail?: string;
    phone?: string;
    otp?: string;
  } | null;

  if (!body?.wallet || !body.token || !body.phone) {
    return NextResponse.json({ error: "wallet, token, phone requis" }, { status: 400 });
  }
  if (!VALID_WALLETS.includes(body.wallet as WalletId)) {
    return NextResponse.json({ error: `Wallet invalide : ${body.wallet}` }, { status: 400 });
  }

  // Normalise le numéro : enlève + et espaces (PayDunya attend "770000000")
  const phone = body.phone.replace(/[\s+]/g, "");

  const result = await softpay({
    wallet: body.wallet as WalletId,
    token: body.token,
    customerName: body.customerName ?? user.email ?? "Client",
    customerEmail: body.customerEmail ?? user.email ?? "",
    phone,
    otp: body.otp,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    message: result.message,
    redirectUrl: result.redirectUrl ?? null,
  });
}
