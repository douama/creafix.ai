import { Building2, Eye, FileBarChart2, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const clients = [
  { name: "Diop Studio",        accounts: 6,  score: 78, country: "🇸🇳" },
  { name: "AbidjanMedia",       accounts: 12, score: 64, country: "🇨🇮" },
  { name: "NaijaCreators Co.",  accounts: 18, score: 81, country: "🇳🇬" },
  { name: "Casa Buzz",          accounts: 4,  score: 70, country: "🇲🇦" },
  { name: "Yaoundé Vibes",      accounts: 7,  score: 58, country: "🇨🇲" },
];

export default function AgencyPage() {
  return (
    <div className="space-y-7">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Mode Agence</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gère tes clients créateurs en marque blanche.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileBarChart2 className="mr-1 h-4 w-4" /> Rapports clients
          </Button>
          <Button variant="brand">
            <Plus className="mr-1 h-4 w-4" /> Ajouter un client
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard icon={Users} label="Clients actifs" value="14" hint="+2 ce mois" />
        <SummaryCard icon={Building2} label="Comptes gérés" value="87" hint="FB + TikTok" />
        <SummaryCard icon={FileBarChart2} label="Rapports envoyés" value="142" hint="cette saison" />
        <SummaryCard icon={Eye} label="Vues cumulées" value="38M" hint="30 derniers jours" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes clients</CardTitle>
          <p className="text-sm text-muted-foreground">Score IA global agrégé par client.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {clients.map((c) => (
            <div
              key={c.name}
              className="grid grid-cols-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04]"
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-brand text-white">
                  {c.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {c.name} <span className="ml-1">{c.country}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{c.accounts} comptes connectés</div>
                </div>
              </div>
              <div className="col-span-3">
                <Badge variant={c.score >= 75 ? "success" : c.score >= 55 ? "warning" : "destructive"}>
                  Score {c.score}/100
                </Badge>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">Actif il y a 2h</div>
              <div className="col-span-2 text-right">
                <Button variant="ghost" size="sm">
                  Ouvrir
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding marque blanche</CardTitle>
          <p className="text-sm text-muted-foreground">Personnalise les rapports envoyés à tes clients.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Logo</div>
              <div className="mt-2">Upload PNG/SVG · max 2MB</div>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Importer un logo
              </Button>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Couleur primaire
              </div>
              <div className="mt-2 h-10 w-full rounded-lg bg-gradient-to-r from-violet-500 to-orange-500" />
              <div className="mt-2 text-xs text-muted-foreground">#7C3AED → #F97316</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Sous-domaine</div>
              <div className="mt-2 font-mono text-xs">tonagence.monetiq.ai</div>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Personnaliser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: any;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-violet-300" />
      </div>
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
