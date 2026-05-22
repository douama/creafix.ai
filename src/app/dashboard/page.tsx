import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Coins,
  Eye,
  Flame,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyOnboarding } from "@/components/dashboard/empty-onboarding";
import { ConnectAccountsCard } from "@/components/dashboard/connect-accounts-card";
import { getUserState } from "@/lib/dashboard/user-state";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const state = await getUserState();

  // ── Nouvel inscrit ou aucune connexion → onboarding empty state ──
  if (!state.hasData) {
    return (
      <EmptyOnboarding
        fullName={state.fullName}
        socialConnected={state.socialAccountsCount > 0}
        paymentConfigured={state.paymentMethodConfigured}
        firstAuditDone={state.auditsCount > 0}
      />
    );
  }

  // ── Utilisateur avec comptes connectés → dashboard réel (vide tant que les jobs ne sont pas câblés) ──
  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {state.fullName ? `Bonjour ${state.fullName.split(" ")[0]} 👋` : "Bonjour 👋"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
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

      {/* KPI placeholders — branchés sur DB plus tard */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiPlaceholder label="Vues 30 j" icon={Eye} />
        <KpiPlaceholder label="Abonnés" icon={Users} />
        <KpiPlaceholder label="Revenus 30 j" icon={Coins} />
        <KpiPlaceholder label="Score viral" icon={Flame} />
        <KpiPlaceholder label="Engagement" icon={Heart} />
        <KpiPlaceholder label="Watch time" icon={Activity} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenus consolidés</CardTitle>
            <p className="text-sm text-muted-foreground">
              Toutes plateformes confondues — agrégation en cours…
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/30 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Tes graphes apparaîtront ici dès le 1er audit IA terminé.
              </p>
              <Button asChild size="sm" variant="brand">
                <Link href="/dashboard/audits/new">
                  Lancer mon audit <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <ConnectAccountsCard socialAccountsCount={state.socialAccountsCount} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audits récents</CardTitle>
          <p className="text-sm text-muted-foreground">
            {state.auditsCount === 0
              ? "Tu n'as encore lancé aucun audit IA."
              : `${state.auditsCount} audit${state.auditsCount > 1 ? "s" : ""} au total.`}
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild variant="brand">
            <Link href="/dashboard/audits/new">
              <Sparkles className="mr-1 h-4 w-4" />
              {state.auditsCount === 0 ? "Lancer mon 1er audit" : "Nouvel audit"}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/40 p-4 text-xs text-muted-foreground">
        <span>Plan actuel : <b className="text-foreground">{state.plan ?? "FREE"}</b></span>
        <Badge variant="outline" className="text-[10px]">
          <Link href="/dashboard/billing" className="hover:underline">
            Gérer mon plan →
          </Link>
        </Badge>
      </div>
    </div>
  );
}

function KpiPlaceholder({ label, icon: Icon }: { label: string; icon: typeof Eye }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-card/60 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          —
        </span>
      </div>
      <div className="mt-3 font-display text-2xl font-bold leading-none text-muted-foreground/60">
        —
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
