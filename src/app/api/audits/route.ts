import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runFullAudit } from "@/lib/ai/agents";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { fetchProfileSnapshot } from "@/lib/social/scraper";

const schema = z.object({
  platform: z.enum([
    "FACEBOOK", "TIKTOK", "INSTAGRAM", "YOUTUBE",
    "X", "SNAPCHAT", "TWITCH", "PINTEREST", "LINKEDIN",
  ]),
  handle: z.string().min(1),
  country: z.string().length(2).default("SN"),
  niche: z.string().optional(),
  followers: z.number().optional(),
  mode: z.enum(["QUICK", "COMPLETE", "AGENCY"]).default("COMPLETE"),
  socialAccountId: z.string().uuid().optional(),
});

/**
 * Lance un audit IA et persiste le résultat dans Supabase.
 *
 * Flux :
 *   1. Auth check (user connecté)
 *   2. Crée la ligne `audits` avec status=RUNNING
 *   3. Lance les 5 agents en parallèle
 *   4. Met à jour la ligne avec les scores + JSON
 *   5. Retourne l'audit complet
 */
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Rate limit : 10 audits/min par user (ou par IP si anonyme)
  const rlId = user?.id ?? getClientIp(req);
  const rl = await rateLimit("audits", rlId);
  if (!rl.success) return rateLimitResponse(rl);

  // Mode démo : si pas de session, on retourne l'audit en mémoire
  if (!user) {
    // 1. Récupère les vraies données publiques du profil (Apify si configuré)
    const scrape = await fetchProfileSnapshot(parsed.data.platform, parsed.data.handle);
    // 2. Lance les 7 agents en utilisant le snapshot réel comme contexte
    const result = await runFullAudit({
      platform: parsed.data.platform,
      handle: parsed.data.handle,
      country: parsed.data.country,
      niche: parsed.data.niche,
      followers: scrape.snapshot?.followers ?? parsed.data.followers,
      snapshot: scrape.snapshot,
    });
    return NextResponse.json({
      ok: true,
      mode: "demo",
      audit: {
        id: `demo_${Date.now()}`,
        status: "COMPLETED",
        ...result,
        scrape: { dataSource: scrape.dataSource, error: scrape.error?.code, snapshot: scrape.snapshot },
      },
    });
  }

  // Mode authentifié : persistance Supabase
  const { socialAccountId, platform, handle, country, niche, followers, mode } = parsed.data;

  // 1. Trouver ou créer le social_account
  let accountId = socialAccountId;
  if (!accountId) {
    const { data: existing } = await supabase
      .from("social_accounts")
      .select("id")
      .eq("user_id", user.id)
      .eq("platform", platform)
      .eq("handle", handle)
      .maybeSingle();

    if (existing) {
      accountId = existing.id;
    } else {
      const { data: created, error } = await supabase
        .from("social_accounts")
        .insert({
          user_id: user.id,
          platform,
          external_id: handle,
          handle,
          country,
          niche,
        })
        .select("id")
        .single();
      if (error || !created) {
        return NextResponse.json({ error: error?.message ?? "create social_account failed" }, { status: 500 });
      }
      accountId = created.id;
    }
  }

  // 2. Insert audit RUNNING
  const { data: audit, error: insertErr } = await supabase
    .from("audits")
    .insert({
      user_id: user.id,
      social_account_id: accountId,
      status: "RUNNING",
      mode,
    })
    .select("id")
    .single();

  if (insertErr || !audit) {
    return NextResponse.json({ error: insertErr?.message ?? "insert failed" }, { status: 500 });
  }

  // 3a. Scrape les vraies données publiques du profil (Apify / fallback simulé)
  const scrape = await fetchProfileSnapshot(platform, handle);

  // 3b. Run agents en parallèle avec le snapshot réel comme contexte
  const result = await runFullAudit({
    platform,
    handle,
    country,
    niche,
    followers: scrape.snapshot?.followers ?? followers,
    snapshot: scrape.snapshot,
  });

  // 4. Update with results (on stocke le snapshot dans estimates.profileSnapshot
  //    pour que la page de détail puisse afficher les vraies données)
  const { error: updateErr } = await supabase
    .from("audits")
    .update({
      status: "COMPLETED",
      score_global: result.audit.data.scoreGlobal,
      score_viral: result.viral.data?.[0]?.score ?? null,
      score_risk: result.antiBan.data.riskScore,
      dimensions: result.audit.data.dimensions,
      issues: result.audit.data.issues,
      recommendations: result.monetization.data.actions,
      estimates: {
        ...result.monetization.data,
        dataSource: scrape.dataSource,
        scrapeError: scrape.error?.code ?? null,
        profileSnapshot: scrape.snapshot,
      },
      completed_at: new Date().toISOString(),
    } as any)
    .eq("id", audit.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: "live",
    audit: { id: audit.id, status: "COMPLETED", ...result },
  });
}
