import { supabaseAdmin } from "@/lib/supabase/admin";
import { CouponsClient, type CouponRow } from "./coupons-client";

export const dynamic = "force-dynamic";

async function load(): Promise<CouponRow[]> {
  const sb = supabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (sb.from("coupons") as any)
    .select("id, code, kind, value, currency, max_uses, used_count, applies_to_plan, expires_at, active, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map((c) => ({
    id: c.id,
    code: c.code,
    kind: c.kind,
    value: Number(c.value),
    currency: c.currency ?? "USD",
    max_uses: c.max_uses,
    used_count: c.used_count ?? 0,
    applies_to_plan: c.applies_to_plan,
    expires_at: c.expires_at,
    active: c.active,
    created_at: c.created_at,
  }));
}

export default async function CouponsAdminPage() {
  const coupons = await load();
  return <CouponsClient initialCoupons={coupons} />;
}
