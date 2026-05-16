import { supabaseAdmin } from "@/lib/supabase/admin";
import { CockpitClient } from "./cockpit-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadKpis() {
  const sb = supabaseAdmin();

  // Count helpers — head:true ne retourne pas les rows, juste le count
  const [users, audits, subs, payments, socials, countries] = await Promise.all([
    sb.from("user_profiles").select("*", { count: "exact", head: true }),
    sb.from("audits").select("*", { count: "exact", head: true }),
    sb.from("subscriptions").select("*", { count: "exact", head: true }),
    sb.from("payments").select("amount, status, currency", { count: "exact" }).eq("status", "SUCCEEDED"),
    sb.from("social_accounts").select("*", { count: "exact", head: true }).eq("is_connected", true),
    sb.from("country_cpm").select("*", { count: "exact", head: true }),
  ]);

  const totalRevenue = (payments.data ?? []).reduce(
    (sum, p) => sum + Number(p.amount ?? 0),
    0,
  );

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
    sb
      .from("user_profiles")
      .select("id, email, full_name, role, plan, country, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    sb
      .from("audits")
      .select("id, status, mode, score_global, started_at")
      .order("started_at", { ascending: false })
      .limit(5),
  ]);
  return {
    users: recentUsers.data ?? [],
    audits: recentAudits.data ?? [],
  };
}

export default async function AdminDashboardPage() {
  const [kpis, recent] = await Promise.all([loadKpis(), loadRecent()]);
  return <CockpitClient kpis={kpis} recent={recent} />;
}
