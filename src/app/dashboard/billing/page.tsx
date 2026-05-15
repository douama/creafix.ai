import { CheckCircle2, CreditCard, Smartphone, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function BillingPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gère ton abonnement et tes paiements.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Plan actuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Créateur · Gratuit</div>
                <div className="text-sm text-muted-foreground">Renouvelé automatiquement</div>
              </div>
              <Button variant="brand">
                <Sparkles className="mr-1 h-4 w-4" /> Passer au Pro
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <Usage label="Audits IA" used={3} total={5} />
              <Usage label="Idées virales générées" used={42} total={100} />
              <Usage label="Crédits IA (images / voix)" used={120} total={500} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moyens de paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Method
              icon={Smartphone}
              brand="Wave"
              desc="+221 77 ••• 04 12"
              badge="Mobile Money"
              active
            />
            <Method icon={Smartphone} brand="Orange Money" desc="+225 07 ••• 32 91" badge="Mobile Money" />
            <Method icon={CreditCard} brand="Carte Visa" desc="•••• 4242 · 12/27" badge="Stripe" />
            <Button variant="outline" className="w-full">
              + Ajouter un moyen
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique de paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60 text-sm">
            {[
              { d: "01/05/2026", a: "0 FCFA",     m: "Plan Créateur" },
              { d: "01/04/2026", a: "9 900 FCFA", m: "Pro · Wave" },
              { d: "01/03/2026", a: "9 900 FCFA", m: "Pro · Wave" },
            ].map((p) => (
              <div key={p.d} className="grid grid-cols-3 gap-3 py-3">
                <span>{p.d}</span>
                <span className="text-muted-foreground">{p.m}</span>
                <span className="text-right font-medium">{p.a}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Usage({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = Math.round((used / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {used} / {total}
        </span>
      </div>
      <Progress value={pct} tone={pct >= 80 ? "amber" : "brand"} className="mt-2" />
    </div>
  );
}

function Method({
  icon: Icon,
  brand,
  desc,
  badge,
  active,
}: {
  icon: any;
  brand: string;
  desc: string;
  badge: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-3 ${
        active ? "border-violet-500/40 bg-violet-500/[0.06]" : "border-border bg-card/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/60">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-medium">{brand}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">{badge}</Badge>
        {active && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
      </div>
    </div>
  );
}
