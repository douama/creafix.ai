import Link from "next/link";
import { CreditCard, Plus, Receipt, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { getUserState } from "@/lib/dashboard/user-state";

export const dynamic = "force-dynamic";

/** Limites mensuelles par plan — alignées sur la grille pricing publique. */
const PLAN_LIMITS: Record<string, { audits: number | null; ideas: number | null; credits: number | null; label: string; price: string }> = {
  FREE:    { audits: 3,    ideas: 20,   credits: 100,  label: "Créateur · Gratuit", price: "0 FCFA / mois" },
  PRO:     { audits: 30,   ideas: 500,  credits: 5000, label: "Pro",                price: "9 900 FCFA / mois" },
  AGENCY:  { audits: null, ideas: null, credits: null, label: "Agency",             price: "29 900 FCFA / mois" },
};

export default async function BillingPage() {
  const state = await getUserState();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  // Période courante : début du mois en cours
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const monthStartIso = monthStart.toISOString();

  const planKey = (state.plan ?? "FREE").toUpperCase();
  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.FREE;

  const [{ count: monthAudits }, { count: monthIdeas }, { data: payments }] = await Promise.all([
    sb
      .from("audits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", state.userId)
      .gte("created_at", monthStartIso),
    sb
      .from("generated_contents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", state.userId)
      .gte("created_at", monthStartIso),
    sb
      .from("payments")
      .select("id, amount, currency, status, description, created_at, provider")
      .eq("user_id", state.userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const usedAudits = monthAudits ?? 0;
  const usedIdeas = monthIdeas ?? 0;
  const usedCredits = 0;
  const paymentsList = (payments ?? []) as Array<{
    id: string;
    amount: number | string;
    currency: string | null;
    status: string;
    description: string | null;
    created_at: string;
    provider: string | null;
  }>;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gère ton abonnement et tes paiements.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Plan actuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="text-lg font-semibold">{limits.label}</div>
                <div className="text-sm text-muted-foreground">{limits.price}</div>
              </div>
              {planKey === "FREE" && (
                <Button asChild variant="brand">
                  <Link href="/pricing">
                    <Sparkles className="mr-1 h-4 w-4" /> Passer au Pro
                  </Link>
                </Button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <Usage label="Audits IA ce mois" used={usedAudits} total={limits.audits} />
              <Usage label="Idées virales générées" used={usedIdeas} total={limits.ideas} />
              <Usage label="Crédits IA (images / voix)" used={usedCredits} total={limits.credits} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Moyens de paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-dashed border-border bg-card/30 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-card/60 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
              </div>
              <p className="mt-3 text-sm font-medium">Aucun moyen enregistré</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Ajoute Wave, Orange Money, MTN MoMo, Carte bancaire ou PayPal pour passer à un plan payant.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/pricing">
                <Plus className="mr-1 h-4 w-4" /> Ajouter un moyen
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Historique de paiements</CardTitle>
          {paymentsList.length > 0 && (
            <Badge variant="outline" className="text-[10px]">
              {paymentsList.length} transaction{paymentsList.length > 1 ? "s" : ""}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {paymentsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/30 p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card/60 text-muted-foreground">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Aucun paiement pour l&apos;instant</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tes factures apparaîtront ici dès que tu auras souscrit à un plan payant.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/60 text-sm">
              {paymentsList.map((p) => (
                <div key={p.id} className="grid grid-cols-4 gap-3 py-3">
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    {new Date(p.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="truncate text-muted-foreground sm:col-span-2">
                    {p.description ?? "Paiement"} {p.provider ? `· ${p.provider}` : ""}
                  </span>
                  <span className="text-right font-medium">
                    {Number(p.amount).toLocaleString("fr-FR")} {p.currency ?? "FCFA"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Usage({ label, used, total }: { label: string; used: number; total: number | null }) {
  const unlimited = total === null;
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / Math.max(total, 1)) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {used} / {unlimited ? "∞" : total}
        </span>
      </div>
      <Progress
        value={unlimited ? 0 : pct}
        tone={pct >= 80 ? "amber" : "brand"}
        className="mt-2"
      />
    </div>
  );
}
