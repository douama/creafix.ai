import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Download,
  Eye,
  Sparkles,
  TrendingUp,
  Database,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { createClient } from "@/lib/supabase/server";
import { PlatformIcon, PLATFORM_BRAND_COLORS } from "@/components/brand/platform-icon";
import type { PlatformId } from "@/lib/platforms";
import { runFullAudit } from "@/lib/ai/agents";
import { getPlaybook } from "@/lib/ai/platform-playbooks";
import { fetchProfileSnapshot } from "@/lib/social/scraper";
import type { ProfileSnapshot } from "@/lib/social/types";

function getCountryName(code: string | null) {
  if (!code) return "Afrique";
  const names: Record<string, string> = {
    SN: "Sénégal",
    CI: "Côte d'Ivoire",
    CM: "Cameroun",
    ML: "Mali",
    NG: "Nigeria",
    GH: "Ghana",
    ZA: "Afrique du Sud",
    MA: "Maroc",
    CD: "RD Congo",
    KE: "Kenya",
  };
  return names[code.toUpperCase()] ?? code;
}

function timeSince(dateString: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.round(diffHours / 24);
  return `Il y a ${diffDays} j`;
}

function getTone(score: number) {
  if (score >= 80) return "emerald" as const;
  if (score >= 50) return "amber" as const;
  return "rose" as const;
}

function buildActionPlan(audit: any, platform: PlatformId | undefined) {
  const playbook = getPlaybook(platform);
  const issues = (audit.issues as { title: string }[]) || [];
  const recs = (audit.recommendations as string[]) || [];

  // Semaine 1 : on prend en priorité les issues IA-générées (ce sont déjà des
  // problèmes spécifiques à la plateforme grâce au prompt platform-aware),
  // complétées par le playbook si moins de 3 items.
  const week1Items = [
    ...issues.map(i => i.title),
    ...playbook.actionPlan30d.week1,
  ].slice(0, 3);

  // Semaines 2-3 : mix recommandation IA #1 + actions plateforme du playbook.
  const week23Items = [
    recs[0] ?? playbook.actionPlan30d.week23[0],
    ...playbook.actionPlan30d.week23,
  ].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 3);

  // Semaine 4 : mix recommandations IA #2/#3 + actions monétisation du playbook.
  const week4Items = [
    recs[1] ?? playbook.actionPlan30d.week4[0],
    recs[2] ?? playbook.actionPlan30d.week4[1],
    ...playbook.actionPlan30d.week4,
  ].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 3);

  return [
    { w: "Semaine 1", items: week1Items },
    { w: "Semaine 2-3", items: week23Items },
    { w: "Semaine 4", items: week4Items },
  ];
}

export default async function AuditDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { platform?: string; handle?: string };
}) {
  let audit: any = null;

  if (params.id.startsWith("demo_")) {
    const platform = (searchParams.platform || "FACEBOOK") as PlatformId;
    const handle = searchParams.handle || "moncompte";

    const scrape = await fetchProfileSnapshot(platform, handle);
    const mockData = await runFullAudit({
      platform,
      handle,
      country: "SN",
      followers: scrape.snapshot?.followers,
      snapshot: scrape.snapshot,
    });

    audit = {
      id: params.id,
      status: "COMPLETED",
      mode: "COMPLETE",
      score_global: mockData.audit.data.scoreGlobal,
      score_viral: mockData.viral.data?.[0]?.score ?? null,
      score_risk: mockData.antiBan.data.riskScore,
      dimensions: mockData.audit.data.dimensions,
      issues: mockData.audit.data.issues,
      recommendations: mockData.monetization.data.actions,
      estimates: {
        ...mockData.monetization.data,
        dataSource: scrape.dataSource,
        scrapeError: scrape.error?.code ?? null,
        profileSnapshot: scrape.snapshot,
      },
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      social_account: {
        platform,
        handle,
        country: "SN",
        followers: scrape.snapshot?.followers ?? 12500,
        niche: scrape.snapshot?.category ?? "lifestyle",
      },
    };
  } else {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("audits")
      .select(`
        *,
        social_account:social_accounts(*)
      `)
      .eq("id", params.id)
      .single();

    if (error || !data) {
      notFound();
    }
    audit = data;
  }

  if (audit.status === "RUNNING" || audit.status === "PENDING") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#EC4899] border-t-transparent" />
        <h2 className="text-xl font-bold">Audit en cours d'analyse par l'IA...</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Nos 7 agents spécialisés analysent actuellement votre compte. Cela prend généralement entre 5 et 10 secondes.
        </p>
      </div>
    );
  }

  const platform = audit.social_account?.platform as PlatformId;
  const handle = audit.social_account?.handle || "@compte";
  const country = audit.social_account?.country || "SN";
  const completedAt = audit.completed_at || audit.started_at;

  const score = audit.score_global ?? 50;
  let levelLabel = "Moyen";
  let globalTone: "emerald" | "amber" | "rose" = "amber";

  if (score >= 85) {
    levelLabel = "Excellent";
    globalTone = "emerald";
  } else if (score >= 70) {
    levelLabel = "Très Bon";
    globalTone = "emerald";
  } else if (score >= 50) {
    levelLabel = "Bon";
    globalTone = "amber";
  } else {
    levelLabel = "Risqué";
    globalTone = "rose";
  }

  const rawDimensions = (audit.dimensions as { name: string; score: number }[]) || [];
  const dimensions = rawDimensions.map((d) => ({
    name: d.name,
    score: d.score,
    tone: getTone(d.score),
  }));

  const rawIssues = (audit.issues as { severity: "high" | "medium" | "low"; title: string; scope: string }[]) || [];
  const recommendations = (audit.recommendations as string[]) || [];
  const actionPlan = buildActionPlan(audit, platform);
  const platformName = getPlaybook(platform).name;

  const estimates = (audit.estimates as Record<string, any> | null) ?? {};
  const dataSource: "real" | "partial" | "simulated" = estimates.dataSource ?? "simulated";
  const scrapeError: string | null = estimates.scrapeError ?? null;
  const snapshot: ProfileSnapshot | null = estimates.profileSnapshot ?? null;

  const brandColor = PLATFORM_BRAND_COLORS[platform] || "#9146FF";
  const isWhiteBrand = brandColor === "#FFFFFF";

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/audits">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Audit <span className="text-muted-foreground">#{params.id.slice(0, 8)}</span>
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <PlatformIcon
              id={platform}
              className="h-3.5 w-3.5"
              style={{ color: isWhiteBrand ? "currentColor" : brandColor }}
            />{" "}
            {handle} · {getCountryName(country)} · {timeSince(completedAt)}
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-1 h-4 w-4" /> Rapport PDF
        </Button>
        <Button variant="brand">
          <Sparkles className="mr-1 h-4 w-4" /> Plan d'action IA
        </Button>
      </div>

      <DataSourceBanner dataSource={dataSource} scrapeError={scrapeError} snapshot={snapshot} />

      {snapshot?.warnings && snapshot.warnings.length > 0 && (
        <div className="space-y-2">
          {snapshot.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3.5 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {snapshot && <SnapshotPanel snapshot={snapshot} />}

      {/* Hero scores */}
      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <ScoreRing value={score} label="Score global IA" sublabel={`${levelLabel} — peut être amélioré`} tone={globalTone} />
            <Badge variant={globalTone === "emerald" ? "success" : globalTone === "amber" ? "warning" : "destructive"} className="mt-3">
              Niveau : {levelLabel}
            </Badge>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Analyse des 8 dimensions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Chaque dimension est notée sur 100 par notre Audit Agent IA.
            </p>
          </CardHeader>
          <CardContent>
            {dimensions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {dimensions.map((d) => (
                  <div key={d.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{d.name}</span>
                      <span className="font-medium">{d.score}/100</span>
                    </div>
                    <Progress value={d.score} tone={d.tone} className="mt-2" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune analyse dimensionnelle disponible.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Problèmes critiques · {platformName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              À régler en priorité pour éviter démonétisation ou ban sur {platformName}.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {rawIssues.length > 0 ? (
              rawIssues.map((issue, idx) => (
                <Issue
                  key={idx}
                  severity={issue.severity}
                  title={issue.title}
                  desc={`Catégorie impactée : ${issue.scope}`}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun problème critique détecté !</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opportunités IA · {platformName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Actions à fort impact pour booster tes revenus sur {platformName}.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.map((rec, idx) => {
                const icons = [TrendingUp, Sparkles, Eye, CheckCircle2];
                const Icon = icons[idx % icons.length];
                return (
                  <Opportunity
                    key={idx}
                    icon={Icon}
                    title={rec}
                    desc="Action générée pour augmenter la visibilité et la monétisation."
                  />
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune recommandation disponible.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan d'action 30 jours · {platformName}</CardTitle>
          <p className="text-sm text-muted-foreground">Roadmap IA personnalisée pour ton compte {platformName}.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {actionPlan.map((b) => (
              <div key={b.w} className="rounded-xl border border-border bg-card/40 p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                  {b.w}
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Issue({
  severity,
  title,
  desc,
}: {
  severity: "low" | "medium" | "high";
  title: string;
  desc: string;
}) {
  const cls =
    severity === "high"
      ? "border-rose-500/30 bg-rose-500/[0.06]"
      : severity === "medium"
        ? "border-amber-500/30 bg-amber-500/[0.06]"
        : "border-border bg-card/40";
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3.5 ${cls}`}>
      <AlertTriangle
        className={
          severity === "high"
            ? "mt-0.5 h-4 w-4 shrink-0 text-rose-400"
            : severity === "medium"
              ? "mt-0.5 h-4 w-4 shrink-0 text-amber-400"
              : "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
        }
      />
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function Opportunity({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function DataSourceBanner({
  dataSource,
  scrapeError,
  snapshot,
}: {
  dataSource: "real" | "partial" | "simulated";
  scrapeError: string | null;
  snapshot: ProfileSnapshot | null;
}) {
  if (dataSource === "real") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-3.5">
        <Database className="h-4 w-4 shrink-0 text-emerald-400" />
        <div className="flex-1 text-sm">
          <span className="font-semibold text-emerald-300">Audit basé sur des données réelles</span>{" "}
          <span className="text-muted-foreground">
            — {snapshot?.recentPosts.length ?? 0} posts récents analysés via {snapshot?.source ?? "scraper"}.
          </span>
        </div>
        <Badge variant="success">Live</Badge>
      </div>
    );
  }
  if (dataSource === "partial") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3.5">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
        <div className="flex-1 text-sm">
          <span className="font-semibold text-amber-300">Données partielles</span>{" "}
          <span className="text-muted-foreground">
            — quelques champs n'ont pas pu être récupérés. L'audit reste indicatif.
          </span>
        </div>
        <Badge variant="warning">Partiel</Badge>
      </div>
    );
  }
  // simulated
  const reason =
    scrapeError === "NO_KEY"
      ? "Aucun scraper configuré (set APIFY_TOKEN pour activer les vraies données)."
      : scrapeError === "NOT_FOUND"
        ? "Profil introuvable, privé ou bloqué par la plateforme."
        : scrapeError === "RATE_LIMIT"
          ? "Le scraper a été rate-limité — réessaie dans quelques minutes."
          : scrapeError === "TIMEOUT"
            ? "Le scraper a expiré — la plateforme a peut-être bloqué la requête."
            : "Connecte le compte via OAuth ou configure APIFY_TOKEN pour obtenir un audit réel.";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/[0.06] p-3.5">
      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
      <div className="flex-1 text-sm">
        <span className="font-semibold text-rose-300">Audit basé sur des estimations</span>{" "}
        <span className="text-muted-foreground">— {reason}</span>
      </div>
      <Badge variant="destructive">Simulé</Badge>
    </div>
  );
}

function SnapshotPanel({ snapshot }: { snapshot: ProfileSnapshot }) {
  const a = snapshot.aggregates;
  const fmt = (n: number | undefined) =>
    n === undefined ? "—" : n.toLocaleString("fr-FR");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Données analysées sur ce compte</CardTitle>
        <p className="text-sm text-muted-foreground">
          Récupérées en direct depuis {snapshot.url}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Followers" value={fmt(snapshot.followers)} />
          <Metric label="Posts" value={fmt(snapshot.postsCount)} />
          <Metric label="Engagement" value={a?.engagementRatePct !== undefined ? `${a.engagementRatePct}%` : "—"} />
          <Metric label="Fréquence" value={a?.postFrequencyPerWeek !== undefined ? `${a.postFrequencyPerWeek}/sem` : "—"} />
          <Metric label="Vues moy/post" value={fmt(a?.avgViews)} />
          <Metric label="Likes moy/post" value={fmt(a?.avgLikes)} />
          <Metric label="Commentaires moy" value={fmt(a?.avgComments)} />
          <Metric label="Total likes" value={fmt(snapshot.totalLikes)} />
        </div>

        {snapshot.bio && (
          <div className="rounded-xl border border-border bg-card/40 p-3.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</div>
            <p className="mt-1 text-sm">{snapshot.bio}</p>
          </div>
        )}

        {a?.topHashtags && a.topHashtags.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hashtags les plus utilisés
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {a.topHashtags.map((h) => (
                <Badge key={h.tag} variant="outline" className="font-normal">
                  {h.tag} <span className="ml-1 text-muted-foreground">×{h.count}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {snapshot.recentPosts.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Derniers posts ({snapshot.recentPosts.length})
            </div>
            <div className="mt-2 space-y-2">
              {snapshot.recentPosts.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{p.caption || "(sans légende)"}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {[
                        p.views !== undefined ? `${p.views.toLocaleString("fr-FR")} vues` : null,
                        p.likes !== undefined ? `${p.likes.toLocaleString("fr-FR")} likes` : null,
                        p.comments !== undefined ? `${p.comments.toLocaleString("fr-FR")} comm.` : null,
                        p.mediaType && p.mediaType !== "unknown" ? p.mediaType : null,
                      ].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs text-violet-400 hover:underline"
                    >
                      voir →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}
