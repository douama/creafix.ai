import { supabaseAdmin } from "@/lib/supabase/admin";
import { AuditsClient, type AuditRow } from "./audits-client";

export const dynamic = "force-dynamic";

async function load(): Promise<AuditRow[]> {
  const sb = supabaseAdmin();
  const { data: auditsData } = await sb
    .from("audits")
    .select("id, user_id, social_account_id, status, mode, score_global, score_monetization, score_viral, score_risk, score_engagement, started_at, completed_at")
    .order("started_at", { ascending: false })
    .limit(200);

  const audits = auditsData ?? [];
  const userIds = Array.from(new Set(audits.map((a) => a.user_id).filter(Boolean) as string[]));
  const accountIds = Array.from(new Set(audits.map((a) => a.social_account_id).filter(Boolean) as string[]));

  const [usersRes, accountsRes] = await Promise.all([
    userIds.length > 0
      ? sb.from("user_profiles").select("id, email, full_name, country").in("id", userIds)
      : Promise.resolve({ data: [] }),
    accountIds.length > 0
      ? sb.from("social_accounts").select("id, platform, handle, followers").in("id", accountIds)
      : Promise.resolve({ data: [] }),
  ]);

  const usersMap = Object.fromEntries(
    (usersRes.data ?? []).map((u) => [u.id, u]),
  );
  const accountsMap = Object.fromEntries(
    (accountsRes.data ?? []).map((a) => [a.id, a]),
  );

  return audits.map((a) => ({
    id: a.id,
    user_id: a.user_id,
    user_email: usersMap[a.user_id]?.email ?? null,
    user_name: usersMap[a.user_id]?.full_name ?? null,
    user_country: usersMap[a.user_id]?.country ?? null,
    platform: accountsMap[a.social_account_id]?.platform ?? null,
    handle: accountsMap[a.social_account_id]?.handle ?? null,
    followers: accountsMap[a.social_account_id]?.followers ?? null,
    status: a.status,
    mode: a.mode,
    score_global: a.score_global,
    score_monetization: a.score_monetization,
    score_viral: a.score_viral,
    score_risk: a.score_risk,
    score_engagement: a.score_engagement,
    started_at: a.started_at,
    completed_at: a.completed_at,
  }));
}

export default async function AuditsAdminPage() {
  const audits = await load();
  return <AuditsClient initialAudits={audits} />;
}
