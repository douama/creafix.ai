import { NextResponse } from "next/server";
import { isValidCurrency } from "@/lib/pricing";

/**
 * POST /api/currency  { currency: "USD" | "XOF" | "MAD" | ... }
 * Persiste le choix utilisateur dans NEXT_CURRENCY.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const currency = body?.currency;

  if (!isValidCurrency(currency)) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, currency });
  response.cookies.set("NEXT_CURRENCY", currency, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  return response;
}
