import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runFullAudit } from "@/lib/ai/agents";

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

  // Mode démo : si pas de session, on retourne l'audit en mémoire
  if (!user) {
    const result = await runFullAudit({
      platform: parsed.data.platform,
      handle: parsed.data.handle,
      country: parsed.data.country,
      niche: parsed.data.niche,
      followers: parsed.data.followers,
    });
    return NextResponse.json({
      ok: true,
      mode: "demo",
      audit: { id: `demo_${Date.now()}`, status: "COMPLETED", ...result },
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

  // 3. Run agents (5 en parallèle, ~3-8s avec Claude Sonnet 4.6)
  const result = await runFullAudit({ platform, handle, country, niche, followers });

  // 4. Update with results
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
      estimates: result.monetization.data,
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
