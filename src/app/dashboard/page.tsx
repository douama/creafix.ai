import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Coins,
  Eye,
  Facebook,
  Music2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";

export default function DashboardHomePage() {
  return (
    <div className="space-y-7">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Bonjour Sobé 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Voici ta vue d'ensemble Monetiq AI — mise à jour il y a 3 minutes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="mr-1 h-4 w-4" /> Synchroniser
          </Button>
          <Button variant="brand">
            <Sparkles className="mr-1 h-4 w-4" /> Nouvel audit IA
          </Button>
        </div>
      </div>

      {/* Scores */}
      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <ScoreRing value={72} label="Score monétisation" sublabel="Niveau : Bon" tone="amber" />
            <div className="mt-5 grid w-full grid-cols-2 gap-2 text-xs">
              <Detail label="Eligibilité FB" value="96%" tone="emerald" />
              <Detail label="Eligibilité TikTok" value="68%" tone="amber" />
              <Detail label="Watch time" value="3 min 12" tone="emerald" />
              <Detail label="CTR moyen" value="4.8%" tone="brand" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:col-span-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Vues 30 j"
            value="12,4M"
            delta="+38%"
            trend="up"
            icon={Eye}
            hint="vs mois précédent"
          />
          <StatCard
            label="Abonnés"
            value="184K"
            delta="+5.2K"
            trend="up"
            icon={Users}
            hint="cette semaine"
          />
          <StatCard
            label="Revenus estimés"
            value="423K FCFA"
            delta="+38%"
            trend="up"
            icon={Coins}
            hint="ce mois-ci"
          />
          <StatCard
            label="Score viral"
            value="84/100"
            delta="+12 pts"
            trend="up"
            icon={TrendingUp}
            hint="dernier audit"
          />
        </div>
      </div>

      {/* Revenue + connected */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Revenus estimés (30 jours)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Estimation IA basée sur CPM Sénégal, watch time et niche.
              </p>
            </div>
            <Badge variant="success" className="gap-1">
              <TrendingUp className="h-3 w-3" /> +38%
            </Badge>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comptes connectés</CardTitle>
            <p className="text-sm text-muted-foreground">Reconnecte tes accès si besoin.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <ConnectedAccount
              platform="facebook"
              name="@afroviral.media"
              meta="184K abonnés · Sénégal"
              health={92}
            />
            <ConnectedAccount
              platform="tiktok"
              name="@afroviral"
              meta="98K abonnés · Sénégal"
              health={64}
            />
            <Button variant="outline" className="w-full">
              + Connecter un compte
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations + risks */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recommandations IA prioritaires</CardTitle>
              <p className="text-sm text-muted-foreground">
                Top 5 actions pour booster tes revenus cette semaine.
              </p>
            </div>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                tone: "emerald" as const,
                icon: CheckCircle2,
                title: "Activer In-Stream Ads sur Facebook",
                desc: "Tu es à 96% des critères. Il manque 87 min de watch time / 60 j.",
              },
              {
                tone: "amber" as const,
                icon: AlertTriangle,
                title: "Remplacer 3 sons sous copyright TikTok",
                desc: "Risque de démonétisation détecté sur 3 vidéos récentes.",
              },
              {
                tone: "brand" as const,
                icon: Sparkles,
                title: "Tester la niche 'finance mobile money'",
                desc: "CPM ×2.4 vs ta niche actuelle. 12 idées prêtes.",
              },
              {
                tone: "emerald" as const,
                icon: CheckCircle2,
                title: "Publier 4x / semaine entre 19h–21h",
                desc: "Créneau le plus performant pour ton audience de Dakar.",
              },
            ].map((r) => (
              <div
                key={r.title}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 hover:bg-white/[0.04]"
              >
                <r.icon
                  className={
                    r.tone === "emerald"
                      ? "mt-0.5 h-4 w-4 text-emerald-400"
                      : r.tone === "amber"
                        ? "mt-0.5 h-4 w-4 text-amber-400"
                        : "mt-0.5 h-4 w-4 text-violet-400"
                  }
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.desc}</div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Risques détectés</CardTitle>
              <p className="text-sm text-muted-foreground">Surveillance Anti-Ban en temps réel.</p>
            </div>
            <Badge variant="warning">3 alertes</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <RiskRow severity="high" label="Audio copyright (3 vidéos)" />
            <RiskRow severity="medium" label="Vidéo recyclée détectée" />
            <RiskRow severity="low" label="Hashtags trop génériques" />

            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Bonne nouvelle
              </div>
              <div className="mt-1 text-sm">
                Aucune violation grave détectée sur les 30 derniers jours.
              </div>
            </div>

            <Link
              href="/dashboard/anti-ban"
              className="mt-1 inline-flex items-center gap-1 text-sm text-violet-300 hover:underline"
            >
              Voir tous les risques <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "brand" | "emerald" | "amber" | "rose";
}) {
  const toneCls =
    tone === "emerald"
      ? "text-emerald-300 bg-emerald-500/10"
      : tone === "amber"
        ? "text-amber-300 bg-amber-500/10"
        : tone === "rose"
          ? "text-rose-300 bg-rose-500/10"
          : "text-violet-300 bg-violet-500/10";
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 inline-flex items-center rounded px-1.5 py-0.5 text-xs ${toneCls}`}>
        {value}
      </div>
    </div>
  );
}

function ConnectedAccount({
  platform,
  name,
  meta,
  health,
}: {
  platform: "facebook" | "tiktok";
  name: string;
  meta: string;
  health: number;
}) {
  const Icon = platform === "facebook" ? Facebook : Music2;
  const cls = platform === "facebook" ? "bg-blue-500/15 text-blue-400 ring-blue-400/30" : "bg-pink-500/15 text-pink-400 ring-pink-400/30";
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${cls}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{meta}</div>
        </div>
        <Badge variant={health >= 80 ? "success" : health >= 60 ? "warning" : "destructive"}>
          {health}%
        </Badge>
      </div>
      <Progress
        value={health}
        tone={health >= 80 ? "emerald" : health >= 60 ? "amber" : "rose"}
        className="mt-3"
      />
    </div>
  );
}

function RiskRow({
  severity,
  label,
}: {
  severity: "low" | "medium" | "high";
  label: string;
}) {
  const cls =
    severity === "high"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
      : severity === "medium"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
        : "border-white/10 bg-white/[0.03] text-muted-foreground";
  const dot =
    severity === "high"
      ? "bg-rose-400"
      : severity === "medium"
        ? "bg-amber-400"
        : "bg-white/30";
  return (
    <div className={`flex items-center justify-between rounded-xl border px-3.5 py-3 ${cls}`}>
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-xs uppercase tracking-wider opacity-70">{severity}</span>
    </div>
  );
}
