import { Activity } from "lucide-react";
import { EmptySection } from "@/components/dashboard/empty-section";
import { getUserState } from "@/lib/dashboard/user-state";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const state = await getUserState();

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue 360° de tes audiences, contenus et revenus — agrégée par plateforme.
        </p>
      </div>

      {!state.hasData ? (
        <EmptySection
          icon={Activity}
          title="Aucune donnée à afficher pour l'instant"
          description="Connecte tes comptes TikTok, Facebook, YouTube ou Instagram pour voir tes followers, vues, engagement et score viral en temps réel."
          primaryCta={{ label: "Connecter mes comptes", href: "/dashboard/settings?tab=connections" }}
          secondaryCta={{ label: "Lancer un audit IA →", href: "/dashboard/audits/new" }}
          accent="#EC4899"
        />
      ) : state.auditsCount === 0 ? (
        <EmptySection
          icon={Activity}
          title="Lance ton premier audit pour activer les analytics"
          description="L'audit IA scanne tes plateformes connectées et alimente toutes les métriques (engagement, viralité, watch time, démographie audience)."
          primaryCta={{ label: "Lancer mon 1er audit", href: "/dashboard/audits/new" }}
          accent="#FF8A00"
        />
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card/30 p-12 text-center text-sm text-muted-foreground">
          Tes métriques sont en cours de calcul — reviens dans quelques minutes.
        </div>
      )}
    </div>
  );
}
