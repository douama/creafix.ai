import { Download, FileBarChart2, Filter, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const reports = [
  { id: "rep_01", title: "Rapport mensuel · @afroviral.media", date: "01/05/2026", pages: 18, type: "Audit complet" },
  { id: "rep_02", title: "Roadmap monétisation · @ndiaye.fashion", date: "29/04/2026", pages: 12, type: "Roadmap 30j" },
  { id: "rep_03", title: "Audit risque ban · AbidjanMedia", date: "25/04/2026", pages: 7,  type: "Anti-Ban" },
  { id: "rep_04", title: "Compétiteurs Sénégal · benchmark", date: "20/04/2026", pages: 24, type: "Benchmark" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-7">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Rapports IA</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            PDF premium, marque blanche, prêts à envoyer à un client.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-1 h-4 w-4" /> Filtrer
          </Button>
          <Button variant="brand">
            <FileBarChart2 className="mr-1 h-4 w-4" /> Nouveau rapport
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-10 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/30 to-orange-500/20 text-xs font-bold text-white">
                  PDF
                </div>
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{r.type}</Badge>
                    <span>{r.pages} pages</span>
                    <span>·</span>
                    <span>{r.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
