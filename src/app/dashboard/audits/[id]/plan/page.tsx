import {
  AlertTriangle,
  ChevronLeft,
  Flame,
  Hash,
  Image as ImageIcon,
  Lightbulb,
  Music2,
  ScrollText,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlatformIcon, PLATFORM_BRAND_COLORS } from "@/components/brand/platform-icon";
import { createClient } from "@/lib/supabase/server";
import { runFullAudit } from "@/lib/ai/agents";
import { getPlaybook } from "@/lib/ai/platform-playbooks";
import { fetchProfileSnapshot } from "@/lib/social/scraper";
import type { PlatformId } from "@/lib/platforms";

export const dynamic = "force-dynamic";

export default async function PlanPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { platform?: string; handle?: string };
}) {
  let platform: PlatformId;
  let handle: string;
  let country: string;
  let niche: string | undefined;
  let storedIssues: { severity: string; title: string; scope: string }[] = [];

  if (params.id.startsWith("demo_")) {
    platform = (searchParams.platform || "FACEBOOK") as PlatformId;
    handle = searchParams.handle || "moncompte";
    country = "SN";
    niche = undefined;
  } else {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("audits")
      .select("*, social_account:social_accounts(*)")
      .eq("id", params.id)
      .single();
    if (error || !data) notFound();

    const audit = data as Record<string, unknown> & {
      social_account?: { platform?: string; handle?: string; country?: string; niche?: string } | null;
      issues?: { severity: string; title: string; scope: string }[];
    };
    platform = (audit.social_account?.platform ?? "FACEBOOK") as PlatformId;
    handle = audit.social_account?.handle ?? "@compte";
    country = audit.social_account?.country ?? "SN";
    niche = audit.social_account?.niche ?? undefined;
    storedIssues = audit.issues ?? [];
  }

  const playbook = getPlaybook(platform);
  const issueTopic = storedIssues.map((i) => i.title).slice(0, 3).join(" · ") || playbook.actionPlan30d.week1[0];

  const scrape = await fetchProfileSnapshot(platform, handle);
  const existingHook = scrape.snapshot?.recentPosts?.[0]?.caption?.slice(0, 80);

  const result = await runFullAudit({
    platform,
    handle,
    country,
    niche,
    followers: scrape.snapshot?.followers,
    snapshot: scrape.snapshot,
    topic: issueTopic,
  });

  const issues = result.audit.data.issues ?? storedIssues;
  const monetActions = result.monetization.data.actions;
  const viralIdeas = result.viral.data ?? [];
  const trendData = result.trend.data;
  const thumbnails = (result.thumbnail.data ?? []).slice(0, 4);
  const scripts = (result.script.data ?? []).slice(0, 3);
  const antiBanRisks = result.antiBan.data.risks;

  // Pair each audit issue with the most relevant agent-generated fix
  const fixes: { issue: string; severity: string; scope: string; fix: string; fixAgent: string }[] = issues.map((issue, idx) => {
    const fixCandidates: { agent: string; text: string }[] = [
      monetActions[idx] && { agent: "Monetization IA", text: monetActions[idx] },
      scripts[idx]?.hookRewrite && { agent: "Script IA", text: `Hook réécrit : « ${scripts[idx].hookRewrite} »` },
      viralIdeas[idx]?.title && { agent: "Viral IA", text: `Idée vidéo : ${viralIdeas[idx].title}` },
    ].filter(Boolean) as { agent: string; text: string }[];
    const picked = fixCandidates[0] ?? { agent: "Plan IA", text: playbook.actionPlan30d.week1[idx % 3] ?? "Voir actions détaillées ci-dessous" };
    return {
      issue: issue.title,
      severity: issue.severity,
      scope: issue.scope,
      fix: picked.text,
      fixAgent: picked.agent,
    };
  });

  const brandColor = PLATFORM_BRAND_COLORS[platform] || "#9146FF";
  const isWhiteBrand = brandColor === "#FFFFFF";
  const cost = result.meta.totalCostUsd;
  const latencyS = Math.round(result.meta.totalLatencyMs / 100) / 10;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/dashboard/audits/${params.id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Plan d&apos;action IA <span className="text-muted-foreground">· {playbook.name}</span>
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <PlatformIcon id={platform} className="h-3.5 w-3.5" style={{ color: isWhiteBrand ? "currentColor" : brandColor }} />
            {handle} · {result.meta.agentsCount} agents IA · {latencyS}s · ${cost.toFixed(4)}
            {result.meta.anyMock && <Badge variant="warning">Mode démo (1 agent en fallback)</Badge>}
          </div>
        </div>
      </div>

      {/* Top: Issues paired with IA fixes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Tes problèmes critiques · solutions IA personnalisées
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pour chaque problème identifié dans l&apos;audit, voici l&apos;action concrète générée par nos agents IA.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {fixes.map((f, idx) => (
            <div key={idx} className="grid gap-3 rounded-2xl border border-border bg-card/40 p-4 md:grid-cols-[1fr_auto_2fr]">
              <div className="flex items-start gap-2">
                <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${
                  f.severity === "high" ? "text-rose-400" : f.severity === "medium" ? "text-amber-400" : "text-muted-foreground"
                }`} />
                <div>
                  <div className="text-sm font-semibold">{f.issue}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{f.scope}</div>
                </div>
              </div>
              <div className="hidden md:flex items-center text-muted-foreground">→</div>
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#EC4899]" />
                <div>
                  <div className="text-sm">{f.fix}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-emerald-400">{f.fixAgent}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Viral ideas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              Idées de contenus viraux · {playbook.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">3 concepts générés par Viral IA, calibrés sur ta niche et ton pays.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {viralIdeas.slice(0, 3).map((idea, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">{idea.title}</div>
                  <Badge variant={idea.score >= 90 ? "success" : idea.score >= 75 ? "warning" : "default"}>
                    {idea.score}/100
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {idea.duration} · {idea.niche}
                </div>
                <div className="mt-2 space-y-1 text-xs">
                  {idea.hooks.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-300" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Script rewrites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-violet-400" />
              Hooks réécrits · Scripts complets
            </CardTitle>
            <p className="text-sm text-muted-foreground">3 variantes prêtes à tourner, générées par Script IA{existingHook ? " sur ton hook actuel" : ""}.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {scripts.map((s, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">« {s.hookRewrite} »</div>
                  <Badge variant="default">{s.ttsTone}</Badge>
                </div>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {s.beats.slice(0, 3).map((b, i) => (
                    <div key={i}>
                      <span className="font-mono text-foreground/70">{b.ts}</span> — {b.line}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground italic">{s.cta}</span>
                  <span className="text-emerald-400">Rétention ~{s.estimatedRetention}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Tendances à exploiter · {country}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Hashtags et sons en croissance cette semaine, détectés par Trend IA.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hashtags</div>
              <div className="flex flex-wrap gap-2">
                {trendData.hashtags.map((h, idx) => (
                  <div key={idx} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1 text-xs">
                    <Hash className="h-3 w-3 text-cyan-400" />
                    <span className="font-semibold">{h.tag.replace(/^#/, "")}</span>
                    <span className="text-muted-foreground">· {h.velocity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sons trending</div>
              <div className="space-y-1.5">
                {trendData.sounds.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Music2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    <div>
                      <div>{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.uses.toLocaleString("fr-FR")} utilisations</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail concepts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-pink-400" />
              Concepts de thumbnails A/B
            </CardTitle>
            <p className="text-sm text-muted-foreground">4 concepts générés par Thumbnail IA avec CTR estimé.</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {thumbnails.map((t, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-xl border border-border p-3 text-center"
                  style={{ background: `linear-gradient(135deg, ${t.bgColor}, ${t.accentColor})` }}
                >
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="mt-1 text-sm font-bold uppercase tracking-tight text-white drop-shadow-md">
                    {t.headline}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-white/85">
                    <span>{t.archetype}</span>
                    <span>+{t.estimatedCtrLift}% CTR</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anti-ban quick check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            Risques à neutraliser cette semaine · Anti-Ban IA
          </CardTitle>
          <p className="text-sm text-muted-foreground">Score de risque global : {result.antiBan.data.riskScore}/100.</p>
        </CardHeader>
        <CardContent>
          <Progress value={result.antiBan.data.riskScore} tone={result.antiBan.data.riskScore > 60 ? "rose" : result.antiBan.data.riskScore > 30 ? "amber" : "emerald"} className="mb-3" />
          <div className="space-y-2">
            {antiBanRisks.map((r, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <span className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${
                  r.severity === "high" ? "bg-rose-400" : r.severity === "medium" ? "bg-amber-400" : "bg-emerald-400"
                }`} />
                <div>
                  <div>{r.message}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{r.type.replace("_", " ")}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Final CTA */}
      <Card className="border-[#EC4899]/30 bg-gradient-to-br from-[#EC4899]/[0.06] to-[#F97316]/[0.06]">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <Sparkles className="h-8 w-8 text-[#EC4899]" />
          <div>
            <h3 className="font-display text-xl font-bold">Plan d&apos;action prêt à exécuter</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tu peux télécharger ce plan en PDF ou lancer un nouvel audit dans 30 jours pour mesurer les progrès.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/dashboard/audits/${params.id}`}>Retour à l&apos;audit</Link>
            </Button>
            <Button variant="brand">
              <Sparkles className="mr-1 h-4 w-4" /> Régénérer le plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
