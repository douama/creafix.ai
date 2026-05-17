import { Bot, Coins, FileText, Flame, ImageIcon, ShieldAlert, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptySection } from "@/components/dashboard/empty-section";
import { getUserState } from "@/lib/dashboard/user-state";

export const dynamic = "force-dynamic";

const agents = [
  { icon: Bot,         name: "Audit Agent",        color: "violet" },
  { icon: Flame,       name: "Viral Agent",        color: "orange" },
  { icon: Coins,       name: "Monetization Agent", color: "emerald" },
  { icon: ShieldAlert, name: "Anti-Ban Agent",     color: "rose" },
  { icon: TrendingUp,  name: "Trend Agent",        color: "sky" },
  { icon: ImageIcon,   name: "Thumbnail Agent",    color: "fuchsia" },
  { icon: FileText,    name: "Script Agent",       color: "amber" },
];

export default async function AgentsPage() {
  const state = await getUserState();

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Agents IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Les 7 cerveaux qui travaillent pour toi en arrière-plan, 24/7.
        </p>
      </div>

      {!state.hasData && (
        <EmptySection
          icon={Bot}
          title="Active tes agents IA en connectant tes comptes"
          description="Les 7 agents démarrent automatiquement dès que tu connectes ta première plateforme. Aucun n'a encore tourné sur ton compte."
          primaryCta={{ label: "Connecter mes comptes", href: "/dashboard/settings?tab=connections" }}
          accent="#EC4899"
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => (
          <Card key={a.name} className="overflow-hidden">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-violet-500/15 to-orange-500/10">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Modèle propriétaire CreaFix
                    </div>
                  </div>
                </div>
                <Badge variant={state.hasData ? "success" : "outline"}>
                  {state.hasData ? "Actif" : "En attente"}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground">
                {state.hasData
                  ? "Prêt à analyser ton contenu."
                  : "Démarre dès que tu connectes une plateforme."}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
