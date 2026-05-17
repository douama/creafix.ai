import { supabaseAdmin } from "@/lib/supabase/admin";
import { PaymentsClient, type PaymentRow } from "./payments-client";

export const dynamic = "force-dynamic";

async function load(): Promise<PaymentRow[]> {
  const sb = supabaseAdmin();
  const { data: paymentsData } = await sb
    .from("payments")
    .select("id, user_id, provider, external_id, amount, currency, status, description, created_at, paid_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const payments = paymentsData ?? [];
  const userIds = Array.from(new Set(payments.map((p) => p.user_id).filter(Boolean) as string[]));

  let usersMap: Record<string, { email: string; full_name: string | null; country: string | null }> = {};
  if (userIds.length > 0) {
    const { data: users } = await sb
      .from("user_profiles")
      .select("id, email, full_name, country")
      .in("id", userIds);
    usersMap = Object.fromEntries(
      (users ?? []).map((u) => [u.id, { email: u.email, full_name: u.full_name, country: u.country }]),
    );
  }

  return payments.map((p) => ({
    id: p.id,
    user_id: p.user_id,
    user_email: usersMap[p.user_id]?.email ?? null,
    user_country: usersMap[p.user_id]?.country ?? null,
    provider: p.provider,
    external_id: p.external_id,
    amount: Number(p.amount),
    currency: p.currency,
    status: p.status,
    description: p.description,
    created_at: p.created_at,
    paid_at: p.paid_at,
  }));
}

export default async function PaymentsAdminPage() {
  const payments = await load();
  return <PaymentsClient initialPayments={payments} />;
}
