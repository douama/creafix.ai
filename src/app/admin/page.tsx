import { supabaseAdmin } from "@/lib/supabase/admin";
import { CockpitClient } from "./cockpit-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadKpis() {
  const sb = supabaseAdmin();

  const [users, audits, subs, payments, socials, countries] = await Promise.all([
    sb.from("user_profiles").select("*", { count: "exact", head: true }),
    sb.from("audits").select("*", { count: "exact", head: true }),
    sb.from("subscriptions").select("*", { count: "exact", head: true }),
    sb.from("payments").select("amount, status, currency", { count: "exact" }).eq("status", "SUCCEEDED"),
    sb.from("social_accounts").select("*", { count: "exact", head: true }).eq("is_connected", true),
    sb.from("country_cpm").select("*", { count: "exact", head: true }),
  ]);

  const totalRevenue = (payments.data ?? []).reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  const auditsToday = await sb
    .from("audits")
    .select("*", { count: "exact", head: true })
    .gte("started_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

  return {
    users: users.count ?? 0,
    audits: audits.count ?? 0,
    auditsToday: auditsToday.count ?? 0,
    subs: subs.count ?? 0,
    payments: payments.count ?? 0,
    revenue: totalRevenue,
    socials: socials.count ?? 0,
    countries: countries.count ?? 0,
  };
}

async function loadRecent() {
  const sb = supabaseAdmin();
  const [recentUsers, recentAudits] = await Promise.all([
    sb.from("user_profiles")
      .select("id, email, full_name, role, plan, country, created_at")
      .order("created_at", { ascending: false }).limit(5),
    sb.from("audits")
      .select("id, status, mode, score_global, started_at")
      .order("started_at", { ascending: false }).limit(5),
  ]);
  return {
    users: recentUsers.data ?? [],
    audits: recentAudits.data ?? [],
  };
}

/** Agrège des bucket par jour sur 30j à partir d'un dataset de rows + un champ date. */
function bucketByDay(
  rows: { [key: string]: unknown }[],
  dateField: string,
  days: number,
  valueField?: string,
) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const buckets: { d: string; v: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400 * 1000);
    buckets.push({ d: d.toISOString().slice(5, 10), v: 0 });
  }
  for (const r of rows) {
    const ts = r[dateField] as string | undefined;
    if (!ts) continue;
    const day = ts.slice(5, 10);
    const bucket = buckets.find((b) => b.d === day);
    if (bucket) bucket.v += valueField ? Number(r[valueField] ?? 0) : 1;
  }
  return buckets;
}

function aggregate(rows: { [key: string]: unknown }[], field: string, limit: number) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const v = (r[field] as string | null) ?? "—";
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

async function loadCharts() {
  const sb = supabaseAdmin();

  const [usersRows, auditsRows, paymentsRows, countriesRows, nichesRows, aiAgents] = await Promise.all([
    sb.from("user_profiles").select("created_at"),
    sb.from("audits").select("started_at"),
    sb.from("payments").select("amount, paid_at").eq("status", "SUCCEEDED"),
    sb.from("user_profiles").select("country"),
    sb.from("user_profiles").select("preferred_niches"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sb.from("ai_agents") as any).select("avg_cost_usd, runs_total, name"),
  ]);

  // Top niches : flatten preferred_niches arrays
  const allNiches: string[] = [];
  for (const r of nichesRows.data ?? []) {
    const arr = (r as { preferred_niches?: string[] }).preferred_niches;
    if (Array.isArray(arr)) allNiches.push(...arr);
  }
  const nicheMap = new Map<string, number>();
  for (const n of allNiches) nicheMap.set(n, (nicheMap.get(n) ?? 0) + 1);

  return {
    users30d: bucketByDay(usersRows.data ?? [], "created_at", 30),
    audits30d: bucketByDay(auditsRows.data ?? [], "started_at", 30),
    revenue30d: bucketByDay(
      (paymentsRows.data ?? []).map((p) => ({ ...p, _v: Number(p.amount) })),
      "paid_at", 30, "_v",
    ),
    topCountries: aggregate(countriesRows.data ?? [], "country", 8),
    topNiches: Array.from(nicheMap.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aiUsage: ((aiAgents.data ?? []) as any[]).map((a) => ({
      name: a.name as string,
      runs: a.runs_total ?? 0,
      cost: Number(a.avg_cost_usd ?? 0) * Number(a.runs_total ?? 0),
    })),
  };
}

export default async function AdminDashboardPage() {
  const [kpis, recent, charts] = await Promise.all([loadKpis(), loadRecent(), loadCharts()]);
  return <CockpitClient kpis={kpis} recent={recent} charts={charts} />;
}
