import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Facebook,
  Music2,
  Plus,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const audits = [
  {
    id: "aud_01",
    platform: "facebook",
    account: "@afroviral.media",
    country: "Sénégal",
    score: 72,
    risk: "low",
    status: "completed",
    date: "Il y a 3 min",
  },
  {
    id: "aud_02",
    platform: "tiktok",
    account: "@afroviral",
    country: "Sénégal",
    score: 64,
    risk: "medium",
    status: "completed",
    date: "Il y a 1 h",
  },
  {
    id: "aud_03",
    platform: "facebook",
    account: "@ndiaye.fashion",
    country: "Côte d'Ivoire",
    score: 38,
    risk: "high",
    status: "completed",
    date: "Hier",
  },
  {
    id: "aud_04",
    platform: "tiktok",
    account: "@chefmoussa",
    country: "Cameroun",
    score: 0,
    risk: "low",
    status: "running",
    date: "En cours",
  },
];

export default function AuditsPage() {
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

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 border-b border-border px-5 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Rechercher un audit, un compte, un pays…"
              className="h-9 w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div className="divide-y divide-border/60">
            {audits.map((a) => {
              const Icon = a.platform === "facebook" ? Facebook : Music2;
              const platCls =
                a.platform === "facebook"
                  ? "bg-blue-500/15 text-blue-400 ring-blue-400/30"
                  : "bg-pink-500/15 text-pink-400 ring-pink-400/30";
              return (
                <Link
                  key={a.id}
                  href={`/dashboard/audits/${a.id}`}
                  className="grid grid-cols-12 items-center gap-3 px-5 py-4 transition-colors hover:bg-card/50"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${platCls}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{a.account}</div>
                      <div className="text-xs text-muted-foreground">{a.country}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    {a.status === "running" ? (
                      <Badge variant="warning" className="gap-1">
                        <Clock className="h-3 w-3 animate-pulse" /> En cours
                      </Badge>
                    ) : (
                      <span className="font-display text-lg font-semibold">
                        {a.score}
                        <span className="text-xs text-muted-foreground">/100</span>
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Badge
                      variant={a.risk === "low" ? "success" : a.risk === "medium" ? "warning" : "destructive"}
                    >
                      Risque {a.risk}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground">{a.date}</div>
                  <div className="col-span-1 text-right">
                    {a.status === "completed" ? (
                      <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
                    ) : (
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
