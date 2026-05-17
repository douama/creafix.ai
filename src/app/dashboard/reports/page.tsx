import { FileBarChart2 } from "lucide-react";
import { EmptySection } from "@/components/dashboard/empty-section";
import { getUserState } from "@/lib/dashboard/user-state";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const state = await getUserState();

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Rapports IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          PDF premium, marque blanche, prêts à envoyer à un client.
        </p>
      </div>

      <EmptySection
        icon={FileBarChart2}
        title="Aucun rapport généré pour l'instant"
        description="Les rapports IA sont générés automatiquement après chaque audit complet — score global, roadmap monétisation 30j, plan anti-ban, benchmark concurrents."
        primaryCta={{
          label: state.auditsCount > 0 ? "Générer un rapport" : "Lancer mon 1er audit",
          href: state.auditsCount > 0 ? "/dashboard/audits" : "/dashboard/audits/new",
        }}
        secondaryCta={
          !state.hasData
            ? { label: "Connecter mes comptes →", href: "/dashboard/settings?tab=connections" }
            : undefined
        }
        accent="#EC4899"
      />
    </div>
  );
}
