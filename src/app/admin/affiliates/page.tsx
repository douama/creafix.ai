import { supabaseAdmin } from "@/lib/supabase/admin";
import { AffiliatesClient, type ReferralRow } from "./affiliates-client";

export const dynamic = "force-dynamic";

async function load() {
  const sb = supabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: refsData } = await (sb.from("affiliate_referrals") as any)
    .select("id, affiliate_id, referred_id, code, commission_pct, earned_usd, paid_usd, status, created_at, paid_at")
    .order("earned_usd", { ascending: false })
    .limit(200);

  type RawRef = {
    id: string; affiliate_id: string; referred_id: string | null; code: string;
    commission_pct: string | number; earned_usd: string | number; paid_usd: string | number;
    status: string; created_at: string; paid_at: string | null;
  };
  const refs: RawRef[] = (refsData ?? []) as RawRef[];
  const userIds = Array.from(
    new Set([
      ...refs.map((r) => r.affiliate_id),
      ...refs.map((r) => r.referred_id).filter(Boolean) as string[],
    ]),
  );

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

  const enriched: ReferralRow[] = refs.map((r) => ({
    id: r.id,
    code: r.code,
    affiliate_id: r.affiliate_id,
    affiliate_email: usersMap[r.affiliate_id]?.email ?? null,
    affiliate_name: usersMap[r.affiliate_id]?.full_name ?? null,
    referred_id: r.referred_id,
    referred_email: r.referred_id ? usersMap[r.referred_id]?.email ?? null : null,
    referred_country: r.referred_id ? usersMap[r.referred_id]?.country ?? null : null,
    commission_pct: Number(r.commission_pct),
    earned_usd: Number(r.earned_usd),
    paid_usd: Number(r.paid_usd),
    status: r.status,
    created_at: r.created_at,
    paid_at: r.paid_at,
  }));

  // Stats
  const totalEarned = enriched.reduce((s, r) => s + r.earned_usd, 0);
  const totalPaid = enriched.reduce((s, r) => s + r.paid_usd, 0);
  const pendingPayout = totalEarned - totalPaid;

  // Leaderboard top affiliates
  const affiliateMap = new Map<string, { affiliate_id: string; email: string | null; name: string | null; earned: number; referrals: number }>();
  for (const r of enriched) {
    const existing = affiliateMap.get(r.affiliate_id);
    if (existing) {
      existing.earned += r.earned_usd;
      existing.referrals += 1;
    } else {
      affiliateMap.set(r.affiliate_id, {
        affiliate_id: r.affiliate_id,
        email: r.affiliate_email,
        name: r.affiliate_name,
        earned: r.earned_usd,
        referrals: 1,
      });
    }
  }
  const leaderboard = Array.from(affiliateMap.values())
    .sort((a, b) => b.earned - a.earned)
    .slice(0, 10);

  return {
    referrals: enriched,
    stats: {
      total: enriched.length,
      uniqueAffiliates: affiliateMap.size,
      totalEarned,
      totalPaid,
      pendingPayout,
    },
    leaderboard,
  };
}

export default async function AffiliatesAdminPage() {
  const data = await load();
  return <AffiliatesClient {...data} />;
}
