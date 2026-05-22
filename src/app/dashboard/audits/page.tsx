import Link from "next/link";
import { Plus, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptySection } from "@/components/dashboard/empty-section";
import { getUserState } from "@/lib/dashboard/user-state";
import { createClient } from "@/lib/supabase/server";
import { PlatformIcon, PLATFORM_BRAND_COLORS } from "@/components/brand/platform-icon";
import { Badge } from "@/components/ui/badge";
import type { PlatformId } from "@/lib/platforms";

export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const state = await getUserState();

  const supabase = createClient();
  const { data: audits } = await supabase
    .from("audits")
    .select(`
      *,
      social_account:social_accounts(*)
    `)
    .order("started_at", { ascending: false });

  const hasAudits = audits && audits.length > 0;

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

      {hasAudits ? (
        <div className="grid gap-4">
          {audits.map((audit: any) => {
            const platform = audit.social_account?.platform as PlatformId;
            const handle = audit.social_account?.handle || "";
            const score = audit.score_global;

            let statusBadge = null;
            if (audit.status === "RUNNING") {
              statusBadge = <Badge variant="warning">Analyse en cours</Badge>;
            } else if (audit.status === "FAILED") {
              statusBadge = <Badge variant="destructive">Échoué</Badge>;
            } else {
              statusBadge = <Badge variant="success">Complété</Badge>;
            }

            const brandBgColor = PLATFORM_BRAND_COLORS[platform] || "#9146FF";
            const isWhiteBrand = brandBgColor === "#FFFFFF";

            return (
              <div
                key={audit.id}
                className="group relative flex items-center justify-between gap-4 rounded-xl border border-border bg-card/40 p-4 transition-all hover:bg-card/70"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm text-white"
                    style={{
                      backgroundColor: brandBgColor,
                      border: isWhiteBrand ? "1px solid rgba(255,255,255,0.2)" : undefined,
                    }}
                  >
                    <PlatformIcon
                      id={platform}
                      className="h-5 w-5"
                      style={{ color: isWhiteBrand ? "#000000" : undefined }}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-[#EC4899] transition-colors">
                      {handle}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{platform.toLowerCase()}</span>
                      <span>•</span>
                      <span>
                        {new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(audit.started_at))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {score !== null && (
                    <div className="text-right mr-2">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score global</div>
                      <div className="text-lg font-bold leading-tight">{score}/100</div>
                    </div>
                  )}
                  <div className="hidden sm:block">{statusBadge}</div>
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/dashboard/audits/${audit.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
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
      )}
    </div>
  );
}
