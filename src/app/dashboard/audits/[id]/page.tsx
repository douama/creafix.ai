import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Download,
  Eye,
  Facebook,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/dashboard/score-ring";

const dimensions = [
  { name: "Conformité politiques", score: 88, tone: "emerald" as const },
  { name: "Qualité vidéo & rétention", score: 74, tone: "amber" as const },
  { name: "Engagement authentique", score: 81, tone: "emerald" as const },
  { name: "Watch time / CTR", score: 66, tone: "amber" as const },
  { name: "Copyright & musique", score: 42, tone: "rose" as const },
  { name: "Fréquence & calendrier", score: 78, tone: "amber" as const },
  { name: "SEO & métadonnées", score: 70, tone: "amber" as const },
  { name: "Qualité audience", score: 92, tone: "emerald" as const },
];

export default function AuditDetailPage({ params }: { params: { id: string } }) {
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
            Audit <span className="text-muted-foreground">#{params.id}</span>
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Facebook className="h-3.5 w-3.5 text-blue-400" /> @afroviral.media · Sénégal · Il y a 3
            min
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-1 h-4 w-4" /> Rapport PDF
        </Button>
        <Button variant="brand">
          <Sparkles className="mr-1 h-4 w-4" /> Plan d'action IA
        </Button>
      </div>

      {/* Hero scores */}
      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <ScoreRing value={72} label="Score global IA" sublabel="Bon — peut être excellent" tone="amber" />
            <Badge variant="warning" className="mt-3">Niveau : Bon</Badge>
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Problèmes critiques</CardTitle>
            <p className="text-sm text-muted-foreground">
              À régler en priorité pour éviter démonétisation ou ban.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Issue
              severity="high"
              title="3 vidéos avec audio sous copyright"
              desc="Détecté sur les vidéos #218, #224 et #231. Remplacer par des sons commerciaux."
            />
            <Issue
              severity="high"
              title="Engagement suspect détecté"
              desc="Pic anormal de likes le 12/05 — Meta pourrait flagger ton compte."
            />
            <Issue
              severity="medium"
              title="Watch time insuffisant (-12 min / 60 j)"
              desc="Critère manquant pour activer les In-Stream Ads."
            />
            <Issue
              severity="low"
              title="Hashtags génériques sur 8 vidéos"
              desc="Préfère #DakarMood au lieu de #love pour cibler le marché local."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opportunités IA</CardTitle>
            <p className="text-sm text-muted-foreground">
              Actions à fort impact pour booster tes revenus.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Opportunity
              icon={TrendingUp}
              title="Activer In-Stream Ads (+~180K FCFA/mois)"
              desc="Tu es à 96% des critères. 87 min de watch time manquent."
            />
            <Opportunity
              icon={Sparkles}
              title="Niche 'finance mobile money' (CPM ×2.4)"
              desc="Audience à forte valeur. 12 idées vidéos prêtes dans le générateur."
            />
            <Opportunity
              icon={Eye}
              title="Optimiser miniatures (+22% CTR estimé)"
              desc="Tester visages + texte en gros — notre Thumbnail Agent peut générer 6 variantes."
            />
            <Opportunity
              icon={CheckCircle2}
              title="Publier 4×/semaine entre 19h–21h"
              desc="Créneau le plus performant pour ton audience de Dakar."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan d'action 30 jours</CardTitle>
          <p className="text-sm text-muted-foreground">Roadmap IA personnalisée pour ton compte.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                w: "Semaine 1",
                items: ["Remplacer les 3 sons copyright", "Connecter Anti-Ban Agent", "Publier 4 vidéos"],
              },
              {
                w: "Semaine 2-3",
                items: ["Tester niche finance MM (4 vidéos)", "Régénérer 6 miniatures", "Mesurer watch time"],
              },
              {
                w: "Semaine 4",
                items: ["Activer In-Stream Ads", "Lancer campagne pays Sénégal+CI", "Reporting client"],
              },
            ].map((b) => (
              <div key={b.w} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
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
        : "border-white/10 bg-white/[0.02]";
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
