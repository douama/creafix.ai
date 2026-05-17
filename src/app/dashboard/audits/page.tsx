import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptySection } from "@/components/dashboard/empty-section";
import { getUserState } from "@/lib/dashboard/user-state";

export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const state = await getUserState();

  return (
    <div className="space-y-7">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Audits IA</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Historique de tous tes audits multi-plateformes (9 plateformes monétisables).
          </p>
        </div>
        <Button asChild variant="brand">
          <Link href="/dashboard/audits/new">
            <Plus className="mr-1 h-4 w-4" /> Nouvel audit
          </Link>
        </Button>
      </div>

      <EmptySection
        icon={Search}
        title={state.auditsCount === 0 ? "Tu n'as encore lancé aucun audit" : "Aucun audit récent"}
        description="Un audit IA scanne ta page en 60 secondes : score global, conformité monétisation, détection shadowban, score viral, et plan de récupération personnalisé."
        primaryCta={{ label: "Lancer mon 1er audit", href: "/dashboard/audits/new" }}
        secondaryCta={
          !state.hasData
            ? { label: "Connecter un compte d'abord →", href: "/dashboard/settings?tab=connections" }
            : undefined
        }
        accent="#1FBEAF"
      />
    </div>
  );
}
