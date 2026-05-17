import { supabaseAdmin } from "@/lib/supabase/admin";
import { PlansClient, type PlanRow } from "./plans-client";

export const dynamic = "force-dynamic";

async function load(): Promise<PlanRow[]> {
  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (sb.from("plans_config") as any)
    .select("*")
    .order("sort_order", { ascending: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price_monthly_usd: Number(p.price_monthly_usd),
    price_yearly_usd: p.price_yearly_usd != null ? Number(p.price_yearly_usd) : null,
    features: Array.isArray(p.features) ? p.features : [],
    credits_included: p.credits_included,
    max_audits_monthly: p.max_audits_monthly,
    max_social_accounts: p.max_social_accounts,
    highlight: !!p.highlight,
    active: !!p.active,
    sort_order: p.sort_order,
    updated_at: p.updated_at,
  }));
}

export default async function PlansAdminPage() {
  const plans = await load();
  return <PlansClient initialPlans={plans} />;
}
