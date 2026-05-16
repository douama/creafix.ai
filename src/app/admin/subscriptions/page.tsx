import { supabaseAdmin } from "@/lib/supabase/admin";
import { SubscriptionsClient, type SubRow } from "./subscriptions-client";

export const dynamic = "force-dynamic";

const PLAN_PRICE_USD: Record<string, number> = { FREE: 0, PRO: 29, AGENCY: 99 };

async function load() {
  const sb = supabaseAdmin();

  const { data: subsData } = await sb
    .from("subscriptions")
    .select("id, user_id, plan, provider, external_id, status, current_period_end, cancel_at_period_end, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const subs = subsData ?? [];
  const userIds = Array.from(new Set(subs.map((s) => s.user_id).filter(Boolean) as string[]));

  let usersMap: Record<string, { email: string; full_name: string | null; country: string | null }> = {};
  if (userIds.length > 0) {
    const { data: users } = await sb
      .from("user_profiles")
      .select("id, email, full_name, country")
      .in("id", userIds);
    usersMap = Object.fromEntries(
      (users ?? []).map((u) => [u.id, u]),
    );
  }

  const enriched: SubRow[] = subs.map((s) => ({
    id: s.id,
    user_id: s.user_id,
    user_email: usersMap[s.user_id]?.email ?? null,
    user_country: usersMap[s.user_id]?.country ?? null,
    plan: s.plan,
    provider: s.provider,
    external_id: s.external_id,
    status: s.status,
    current_period_end: s.current_period_end,
    cancel_at_period_end: s.cancel_at_period_end,
    created_at: s.created_at,
    monthly_usd: PLAN_PRICE_USD[s.plan] ?? 0,
  }));

  // Stats MRR
  const active = enriched.filter((s) => s.status === "active");
  const mrr = active.reduce((sum, s) => sum + s.monthly_usd, 0);
  const arr = mrr * 12;

  // Plans breakdown (count only active)
  const planMap = new Map<string, number>();
  for (const s of active) {
    planMap.set(s.plan, (planMap.get(s.plan) ?? 0) + 1);
  }
  const byPlan = Array.from(planMap.entries()).map(([plan, count]) => ({
    plan,
    count,
    mrr: count * (PLAN_PRICE_USD[plan] ?? 0),
  }));

  // Pour pie chart : tous les users (pas que actives) groupés par plan
  const { data: allUsers } = await sb.from("user_profiles").select("plan");
  const planDistMap = new Map<string, number>();
  for (const u of allUsers ?? []) {
    planDistMap.set(u.plan, (planDistMap.get(u.plan) ?? 0) + 1);
  }
  const planDist = Array.from(planDistMap.entries()).map(([plan, count]) => ({ plan, count }));

  // Cancellations
  const cancelling = enriched.filter((s) => s.cancel_at_period_end).length;
  const churned = enriched.filter((s) => s.status === "cancelled" || s.status === "canceled").length;

  return {
    subs: enriched,
    stats: {
      total: enriched.length,
      active: active.length,
      mrr,
      arr,
      cancelling,
      churned,
      avgRev: active.length > 0 ? mrr / active.length : 0,
    },
    byPlan,
    planDist,
  };
}

export default async function SubscriptionsAdminPage() {
  const data = await load();
  return <SubscriptionsClient {...data} />;
}
