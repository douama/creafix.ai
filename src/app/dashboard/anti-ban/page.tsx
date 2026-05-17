import { ShieldOff, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptySection } from "@/components/dashboard/empty-section";
import { getUserState } from "@/lib/dashboard/user-state";

export const dynamic = "force-dynamic";

const RULES = [
  "Politiques de monétisation Facebook",
  "Politiques de communauté TikTok",
  "Détection d'audio copyrighté",
  "Détection de contenu recyclé",
  "Engagement artificiel (fake likes)",
  "Spam et clickbait excessif",
  "Contenu sensible (violence, nudité)",
  "Désinformation et fake news",
  "Brand safety advertiser-friendly",
  "Hashtags interdits ou flag",
  "Comptes liés à risque",
  "Fréquence de publication anormale",
];

export default async function AntiBanPage() {
  const state = await getUserState();

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Anti-Ban Agent</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Surveillance permanente des risques de bannissement et démonétisation.
        </p>
      </div>

      {!state.hasData ? (
        <EmptySection
          icon={ShieldOff}
          title="Aucun compte surveillé pour l'instant"
          description="Connecte un compte TikTok, Facebook, YouTube ou Instagram pour activer la surveillance 24/7 (copyright, shadowban, brand safety, contenu sensible)."
          primaryCta={{ label: "Connecter mes comptes", href: "/dashboard/settings?tab=connections" }}
          accent="#F43F5E"
        />
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card/30 p-12 text-center text-sm text-muted-foreground">
          Scan en cours sur tes comptes connectés — les premiers résultats arrivent sous 24h.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Règles surveillées en continu</CardTitle>
          <p className="text-sm text-muted-foreground">
            Notre Anti-Ban Agent scanne ces critères 24/7 dès que tu publies.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {RULES.map((r) => (
              <div
                key={r}
                className="flex items-center gap-2 rounded-xl border border-border bg-card/40 px-3 py-2 text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
