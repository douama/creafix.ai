import { supabaseAdmin } from "@/lib/supabase/admin";
import { AnalyticsClient } from "./analytics-client";

export const dynamic = "force-dynamic";

async function load() {
  const sb = supabaseAdmin();

  const [usersRes, paymentsRes, subsRes, auditsRes, countriesRes, plansRes] = await Promise.all([
    sb.from("user_profiles").select("created_at, country, plan, role", { count: "exact" }),
    sb.from("payments").select("amount, currency, status, paid_at", { count: "exact" }).eq("status", "SUCCEEDED"),
    sb.from("subscriptions").select("plan, status, current_period_end", { count: "exact" }).eq("status", "active"),
    sb.from("audits").select("started_at, status, score_global", { count: "exact" }),
    sb.from("user_profiles").select("country"),
    sb.from("user_profiles").select("plan"),
  ]);

  // Croissance users 30j
  const dailyUsers = bucketByDay(usersRes.data ?? [], "created_at", 30);
  const dailyAudits = bucketByDay(auditsRes.data ?? [], "started_at", 30);
  const dailyRevenue = bucketByDay(
    (paymentsRes.data ?? []).map((p) => ({ ...p, _value: Number(p.amount) })),
    "paid_at",
    30,
    "_value",
  );

  // Distribution par pays
  const byCountry = aggregate(countriesRes.data ?? [], "country");
  // Distribution par plan
  const byPlan = aggregate(plansRes.data ?? [], "plan");

  // MRR approximé (paiements 30 derniers jours)
  const thirtyDaysAgo = Date.now() - 30 * 86400 * 1000;
  const mrr = (paymentsRes.data ?? [])
    .filter((p) => p.paid_at && new Date(p.paid_at).getTime() >= thirtyDaysAgo)
    .reduce((s, p) => s + Number(p.amount ?? 0), 0);

  return {
    totals: {
      users: usersRes.count ?? 0,
      audits: auditsRes.count ?? 0,
      subs: subsRes.count ?? 0,
      payments: paymentsRes.count ?? 0,
      mrr,
    },
    dailyUsers,
    dailyAudits,
    dailyRevenue,
    byCountry,
    byPlan,
  };
}

function bucketByDay(rows: { [key: string]: unknown }[], dateField: string, days: number, valueField?: string) {
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
    if (bucket) {
      bucket.v += valueField ? Number(r[valueField] ?? 0) : 1;
    }
  }
  return buckets;
}

function aggregate(rows: { [key: string]: unknown }[], field: string) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const v = (r[field] as string | null) ?? "—";
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function AnalyticsPage() {
  const data = await load();
  return <AnalyticsClient data={data} />;
}
