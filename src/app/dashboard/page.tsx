import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock,
  Coins,
  Eye,
  Flame,
  Heart,
  Plus,
  ShieldOff,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { Sparkline } from "@/components/dashboard/sparkline";
import { PlatformIconBadge } from "@/components/brand/platform-icon";
import { platformList, type PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/utils";

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Bonjour Sobé 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}{" "}
            · Mis à jour il y a 3 minutes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="mr-1 h-4 w-4" /> Synchroniser
          </Button>
          <Button asChild variant="brand">
            <Link href="/dashboard/audits/new">
              <Sparkles className="mr-1 h-4 w-4" /> Nouvel audit
            </Link>
          </Button>
        </div>
      </header>

      {/* Banner IA Insight */}
      <Card className="relative overflow-hidden border-[#EC4899]/30 bg-gradient-to-br from-[#EC4899]/[0.08] via-card to-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#EC4899]/20 blur-3xl" />
        <CardContent className="relative flex flex-col items-start gap-4 p-5 md:flex-row md:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EC4899] to-[#FF8A00] shadow-lg shadow-[#EC4899]/30">
            <Wand2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="text-[10px]">Insight IA · aujourd&apos;hui</Badge>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                AI Content Repair
              </span>
            </div>
            <p className="mt-2 text-sm md:text-base">
              <b>3 de tes vidéos TikTok</b> ont un hook faible. Notre IA peut les ré-écrire en 1 clic — gain estimé{" "}
              <b className="text-emerald-500">+180K vues</b> sur 7 jours.
            </p>
          </div>
          <Button asChild size="sm" variant="brand">
            <Link href="/dashboard/generator">
              Réparer · 1 clic <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Hero + 6 KPIs */}
      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6">
            <ScoreRing value={72} label="Score global" sublabel="Bon · peut être excellent" tone="amber" />
            <div className="mt-5 grid w-full grid-cols-2 gap-2 text-xs">
              <DetailMini label="Conformité" value="88" tone="emerald" />
              <DetailMini label="Watch time" value="74" tone="amber" />
              <DetailMini label="Engagement" value="81" tone="emerald" />
              <DetailMini label="Copyright" value="42" tone="rose" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 lg:col-span-3 sm:grid-cols-2 xl:grid-cols-3">
          <KpiCard label="Vues 30 j" value="12,4M" delta="+38%" trend="up" icon={Eye}
            spark={[210, 240, 220, 260, 290, 310, 280, 330, 360, 400, 420, 480]} tone="violet" />
          <KpiCard label="Abonnés" value="184K" delta="+5.2K" trend="up" icon={Users}
            spark={[160, 162, 165, 168, 171, 173, 176, 178, 180, 182, 183, 184]} tone="electric" />
          <KpiCard label="Revenus 30 j" value="423K" unit="FCFA" delta="+38%" trend="up" icon={Coins}
            spark={[140, 155, 162, 178, 195, 220, 240, 270, 305, 345, 390, 423]} tone="orange" />
          <KpiCard label="Score viral" value="84" unit="/100" delta="+12 pts" trend="up" icon={Flame}
            spark={[58, 62, 60, 64, 70, 72, 75, 78, 80, 82, 83, 84]} tone="amber" />
          <KpiCard label="Engagement" value="6.8%" delta="+0.4 pt" trend="up" icon={Heart}
            spark={[5.8, 6.0, 5.9, 6.1, 6.3, 6.5, 6.4, 6.6, 6.7, 6.7, 6.8, 6.8]} tone="rose" />
          <KpiCard label="Watch time" value="3m12" delta="+22s" trend="up" icon={Clock}
            spark={[145, 152, 158, 165, 170, 178, 182, 185, 188, 190, 192, 192]} tone="sky" />
        </div>
      </div>

      {/* Chart + Plateformes */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Revenus consolidés (30 j)</CardTitle>
              <p className="text-sm text-muted-foreground">Toutes plateformes confondues · estimation ± 15%</p>
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
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Plateformes connectées</CardTitle>
              <p className="text-sm text-muted-foreground">3 / 9 actives</p>
            </div>
            <Button asChild variant="ghost" size="icon">
              <Link href="/dashboard/audits/new"><Plus className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <ConnectedPlatform id="FACEBOOK" handle="@afroviral.media" meta="184K · Sénégal" health={92} />
            <ConnectedPlatform id="TIKTOK" handle="@afroviral" meta="98K · Sénégal" health={64} />
            <ConnectedPlatform id="YOUTUBE" handle="@AfroViral" meta="42K · Sénégal" health={78} />
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/audits/new">+ Connecter (6 restantes)</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown plateforme */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Revenus par plateforme</CardTitle>
            <p className="text-sm text-muted-foreground">Performance side-by-side · 30 derniers jours</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/revenue">Détail <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: "YOUTUBE" as PlatformId, revenue: "248K", share: 58, delta: "+45%" },
              { id: "FACEBOOK" as PlatformId, revenue: "112K", share: 26, delta: "+12%" },
              { id: "TIKTOK" as PlatformId, revenue: "63K", share: 15, delta: "+82%" },
            ].map((p) => {
              const platform = platformList.find((pl) => pl.id === p.id)!;
              return (
                <div key={p.id} className="rounded-xl border border-border bg-card/40 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformIconBadge id={p.id} size={32} rounded="rounded-lg" />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </div>
                    <Badge variant="success" className="text-[10px]">{p.delta}</Badge>
                  </div>
                  <div className="mt-3 font-display text-2xl font-bold">
                    {p.revenue} <span className="text-xs font-normal text-muted-foreground">FCFA</span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-muted-foreground">{p.share}% des revenus totaux</div>
                  <Progress value={p.share} tone="brand" className="mt-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Audits + Activité */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Audits récents</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/audits">Tout voir <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { id: "FACEBOOK", account: "@afroviral.media", score: 72, time: "Il y a 3 min" },
              { id: "TIKTOK", account: "@afroviral", score: 64, time: "Il y a 1 h" },
              { id: "YOUTUBE", account: "@AfroViral", score: 78, time: "Hier" },
              { id: "FACEBOOK", account: "@ndiaye.fashion", score: 38, time: "Hier" },
            ].map((a, i) => {
              const platform = platformList.find((pl) => pl.id === a.id)!;
              return (
                <Link key={i} href={`/dashboard/audits/aud_${i + 1}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 transition-all hover:bg-card/70">
                  <PlatformIconBadge id={a.id as PlatformId} size={36} rounded="rounded-lg" className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.account}</div>
                    <div className="text-[11px] text-muted-foreground">{platform.name} · {a.time}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn("font-display text-lg font-bold leading-none",
                      a.score >= 75 ? "text-emerald-500" : a.score >= 55 ? "text-amber-500" : "text-rose-500")}>
                      {a.score}
                    </div>
                    <div className="text-[10px] text-muted-foreground">/100</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Activité récente</CardTitle>
            <Badge variant="warning">3 alertes</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <ActivityItem icon={ShieldOff} tone="rose" title="Shadowban détecté sur @afroviral (TikTok)" time="Il y a 12 min" action="Voir le diag" />
            <ActivityItem icon={Sparkles} tone="brand" title="Nouvelle tendance virale : #DakarMood (TikTok SN)" time="Il y a 1 h" action="Générer une vidéo" />
            <ActivityItem icon={CheckCircle2} tone="emerald" title="Audit IA YouTube terminé : 78 / 100" time="Il y a 2 h" action="Voir l'audit" />
            <ActivityItem icon={AlertTriangle} tone="amber" title="3 vidéos avec audio copyright à remplacer" time="Il y a 5 h" action="Corriger" />
            <ActivityItem icon={Coins} tone="emerald" title="Paiement Stripe reçu : abonnement Pro renouvelé" time="Hier" />
          </CardContent>
        </Card>
      </div>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#EC4899]" /> Objectifs monétisation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Étapes restantes pour débloquer chaque programme officiel
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <GoalCard platform="YOUTUBE" title="YouTube Partner Program" done={true} progress={100}
              detail="1 000 abonnés ✓ · 4 000h regardées ✓" eta="Atteint" />
            <GoalCard platform="FACEBOOK" title="In-Stream Ads éligibilité" done={false} progress={96}
              detail="513 / 600 min watch time · 60 j" eta="≈ 8 jours" />
            <GoalCard platform="TIKTOK" title="Creator Rewards Program" done={false} progress={62}
              detail="6 200 / 10 000 followers TikTok" eta="≈ 22 jours" />
            <GoalCard platform="INSTAGRAM" title="Reels Play Bonus" done={false} progress={45}
              detail="Audience non éligible — pivot Reels recommandé" eta="≈ 60 jours" />
            <GoalCard platform="TWITCH" title="Twitch Affiliate" done={false} progress={28}
              detail="14 / 50 followers · 2.3 / 8h stream" eta="≈ 30 jours" />
            <GoalCard platform="X" title="X Ads Revenue Share" done={false} progress={12}
              detail="500K / 5M impressions cumulées 3 mois" eta="≈ 90 jours" />
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#FF8A00]" /> Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <QuickAction href="/dashboard/audits/new" icon={Sparkles} title="Nouvel audit" tone="brand" />
            <QuickAction href="/dashboard/generator" icon={Flame} title="Idées virales" tone="orange" />
            <QuickAction href="/dashboard/anti-ban" icon={ShieldOff} title="Anti-Ban" tone="rose" />
            <QuickAction href="/dashboard/revenue" icon={TrendingUp} title="RPM Predictor" tone="emerald" />
            <QuickAction href="/dashboard/trends" icon={Activity} title="Trend Scanner" tone="sky" />
            <QuickAction href="/dashboard/ai-studio" icon={Wand2} title="AI Studio" tone="violet" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  label, value, unit, delta, trend, icon: Icon, spark, tone,
}: {
  label: string; value: string; unit?: string; delta?: string;
  trend?: "up" | "down" | "flat"; icon: LucideIcon; spark: number[];
  tone: "violet" | "electric" | "orange" | "amber" | "rose" | "sky";
}) {
  const colors: Record<typeof tone, { stroke: string; fill: string; bg: string }> = {
    violet:   { stroke: "#EC4899", fill: "rgba(236,72,153,0.15)", bg: "bg-violet-500/15 text-violet-500 dark:text-violet-300" },
    electric: { stroke: "#FF8A00", fill: "rgba(0,194,255,0.15)",  bg: "bg-sky-500/15 text-sky-500 dark:text-sky-300" },
    orange:   { stroke: "#FF8A00", fill: "rgba(255,138,0,0.15)",  bg: "bg-orange-500/15 text-orange-500 dark:text-orange-300" },
    amber:    { stroke: "#F59E0B", fill: "rgba(245,158,11,0.15)", bg: "bg-amber-500/15 text-amber-500 dark:text-amber-300" },
    rose:     { stroke: "#F43F5E", fill: "rgba(244,63,94,0.15)",  bg: "bg-rose-500/15 text-rose-500 dark:text-rose-300" },
    sky:      { stroke: "#0EA5E9", fill: "rgba(14,165,233,0.15)", bg: "bg-sky-500/15 text-sky-500 dark:text-sky-300" },
  };
  const c = colors[tone];
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", c.bg)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <Sparkline data={spark} stroke={c.stroke} fill={c.fill} width={64} height={22} />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold leading-none">{value}</span>
        {unit && <span className="text-[11px] text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        {delta && (
          <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-medium",
            trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground")}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}{delta}
          </span>
        )}
      </div>
    </div>
  );
}

function DetailMini({ label, value, tone }: {
  label: string; value: string; tone: "emerald" | "amber" | "rose" | "brand";
}) {
  const toneCls = tone === "emerald" ? "text-emerald-500 dark:text-emerald-300"
    : tone === "amber" ? "text-amber-500 dark:text-amber-300"
    : tone === "rose" ? "text-rose-500 dark:text-rose-300"
    : "text-[#EC4899]";
  return (
    <div className="rounded-lg border border-border bg-card/40 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 font-display text-sm font-bold", toneCls)}>{value}</div>
    </div>
  );
}

function ConnectedPlatform({ id, handle, meta, health }: {
  id: PlatformId; handle: string; meta: string; health: number;
}) {
  const platform = platformList.find((p) => p.id === id)!;
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <div className="flex items-center gap-3">
        <PlatformIconBadge id={id} size={36} rounded="rounded-lg" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{handle}</div>
          <div className="truncate text-[11px] text-muted-foreground">{platform.name} · {meta}</div>
        </div>
        <Badge variant={health >= 80 ? "success" : health >= 60 ? "warning" : "destructive"}>
          {health}%
        </Badge>
      </div>
      <Progress value={health} tone={health >= 80 ? "emerald" : health >= 60 ? "amber" : "rose"} className="mt-2.5" />
    </div>
  );
}

function ActivityItem({ icon: Icon, tone, title, time, action }: {
  icon: LucideIcon; tone: "brand" | "emerald" | "amber" | "rose";
  title: string; time: string; action?: string;
}) {
  const cls = {
    brand: "bg-[#EC4899]/15 text-[#EC4899]",
    emerald: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-300",
    amber: "bg-amber-500/15 text-amber-500 dark:text-amber-300",
    rose: "bg-rose-500/15 text-rose-500 dark:text-rose-300",
  }[tone];
  return (
    <div className="flex items-start gap-3">
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", cls)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm">{title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{time}</span>
          {action && (<><span>·</span><button className="text-[#EC4899] hover:underline">{action}</button></>)}
        </div>
      </div>
    </div>
  );
}

function GoalCard({ platform, title, done, progress, detail, eta }: {
  platform: PlatformId; title: string; done: boolean; progress: number; detail: string; eta: string;
}) {
  const p = platformList.find((pl) => pl.id === platform)!;
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card/40 p-4 backdrop-blur">
      {done && <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] to-transparent" />}
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PlatformIconBadge id={platform} size={28} rounded="rounded-lg" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.name}</span>
          </div>
          {done && (
            <Badge variant="success" className="gap-1 text-[10px]">
              <CheckCircle2 className="h-3 w-3" /> Atteint
            </Badge>
          )}
        </div>
        <h3 className="mt-2.5 text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
        <Progress value={progress} tone={done ? "emerald" : progress >= 70 ? "amber" : "brand"} className="mt-3" />
        <div className="mt-2 flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">{progress}%</span>
          {!done && <span className="font-medium text-foreground/80">{eta}</span>}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, title, tone }: {
  href: string; icon: LucideIcon; title: string;
  tone: "brand" | "orange" | "rose" | "emerald" | "sky" | "violet";
}) {
  const cls = {
    brand: "from-[#EC4899] to-[#5a3dff]",
    orange: "from-[#FF8A00] to-orange-600",
    rose: "from-rose-500 to-rose-700",
    emerald: "from-emerald-500 to-emerald-700",
    sky: "from-sky-500 to-blue-600",
    violet: "from-violet-500 to-purple-600",
  }[tone];
  return (
    <Link href={href}
      className="group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card/40 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-card/70 hover:shadow-lg">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-110", cls)}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium">{title}</span>
    </Link>
  );
}
