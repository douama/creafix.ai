import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AntiBanPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Anti-Ban Agent</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Surveillance permanente des risques de bannissement et démonétisation.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>État de santé général</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-6 w-6 text-emerald-300" />
                <div>
                  <div className="text-lg font-semibold">Risque global : Faible</div>
                  <p className="mt-1 text-sm text-emerald-100/80">
                    Aucun risque grave détecté sur les 30 derniers jours. Continue ainsi.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Bar label="Copyright" value={42} tone="rose" />
              <Bar label="Spam / fake engagement" value={18} tone="emerald" />
              <Bar label="Contenu sensible" value={24} tone="amber" />
              <Bar label="Politique communautaire" value={12} tone="emerald" />
              <Bar label="Contenu recyclé" value={36} tone="amber" />
              <Bar label="Risque shadowban" value={22} tone="amber" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes actives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert
              severity="high"
              title="3 vidéos avec audio copyright"
              action="Remplacer par sons commerciaux"
            />
            <Alert
              severity="medium"
              title="Vidéo recyclée détectée"
              action="Ajouter narration originale"
            />
            <Alert
              severity="low"
              title="Hashtags trop génériques"
              action="Utiliser SEO local"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Règles surveillées en continu</CardTitle>
          <p className="text-sm text-muted-foreground">
            Notre Anti-Ban Agent scanne ces critères 24/7 dès que tu publies.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {[
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
            ].map((r) => (
              <div
                key={r}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm"
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

function Bar({ label, value, tone }: { label: string; value: number; tone: "emerald" | "amber" | "rose" }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} tone={tone} className="mt-2" />
    </div>
  );
}

function Alert({
  severity,
  title,
  action,
}: {
  severity: "low" | "medium" | "high";
  title: string;
  action: string;
}) {
  const cls =
    severity === "high"
      ? "border-rose-500/30 bg-rose-500/[0.06]"
      : severity === "medium"
        ? "border-amber-500/30 bg-amber-500/[0.06]"
        : "border-white/10 bg-white/[0.02]";
  const icon =
    severity === "high" ? (
      <ShieldAlert className="h-4 w-4 text-rose-400" />
    ) : (
      <AlertTriangle className={severity === "medium" ? "h-4 w-4 text-amber-400" : "h-4 w-4 text-muted-foreground"} />
    );
  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1">
          <div className="text-sm font-medium">{title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{action}</div>
        </div>
        <Badge variant={severity === "high" ? "destructive" : severity === "medium" ? "warning" : "outline"}>
          {severity}
        </Badge>
      </div>
    </div>
  );
}
