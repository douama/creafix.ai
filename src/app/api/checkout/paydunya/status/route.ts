import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { confirmInvoice } from "@/lib/payments/paydunya";

/**
 * GET /api/checkout/paydunya/status?token=XXX
 * Polling endpoint pour suivre l'état d'une invoice PayDunya pendant que
 * l'utilisateur confirme sur son téléphone.
 */
export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token requis" }, { status: 400 });
  }

  const result = await confirmInvoice(token);
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Erreur" }, { status: 502 });
  }

  return NextResponse.json({
    status: result.status,         // "completed" | "pending" | "cancelled" | "failed"
    rawStatus: result.rawStatus,
    amount: result.amount,
  });
}
