import { Building2 } from "lucide-react";
import { EmptySection } from "@/components/dashboard/empty-section";

export const dynamic = "force-dynamic";

export default function AgencyPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Mode Agence</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gère tes clients créateurs en marque blanche.
        </p>
      </div>

      <EmptySection
        icon={Building2}
        title="Aucun client agence pour l'instant"
        description="Ajoute tes premiers clients créateurs et gère leurs audits, rapports et alertes depuis une seule interface en marque blanche."
        primaryCta={{ label: "Ajouter un client", href: "/dashboard/agency?new=1" }}
        secondaryCta={{ label: "Voir la doc agence →", href: "/help" }}
        accent="#FF8A00"
      />
    </div>
  );
}
