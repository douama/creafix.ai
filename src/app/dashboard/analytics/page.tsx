import { Activity, Eye, Heart, MessageSquare, Share2, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue 360° de tes audiences, contenus et revenus — agrégée par plateforme.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Followers totaux" value="184K" delta="+5.2K" trend="up" icon={Users} hint="cette semaine" />
        <StatCard label="Vues 30 j" value="12.4M" delta="+38%" trend="up" icon={Eye} hint="vs mois précédent" />
        <StatCard label="Engagement" value="6.8%" delta="+0.4 pt" trend="up" icon={Heart} hint="moyenne" />
        <StatCard label="Score viral" value="84/100" delta="+12" trend="up" icon={TrendingUp} hint="dernier audit" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Performance dans le temps</CardTitle>
              <p className="text-sm text-muted-foreground">
                Revenus + vues + engagement sur les 30 derniers jours.
              </p>
            </div>
            <Badge variant="success" className="gap-1">
              <TrendingUp className="h-3 w-3" /> +38%
            </Badge>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 contenus</CardTitle>
            <p className="text-sm text-muted-foreground">Par score viral détecté.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "POV : tu es à Dakar et tu trouves Wave", score: 94, views: "2.4M" },
              { title: "3 erreurs entrepreneurs SN", score: 91, views: "1.8M" },
              { title: "Comment j'ai fait 100K abonnés", score: 89, views: "1.2M" },
              { title: "Mobile Money — le piège", score: 88, views: "980K" },
              { title: "5 hacks Canva miniatures", score: 86, views: "740K" },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-border bg-card/40 p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="line-clamp-1 font-medium">{c.title}</span>
                  <Badge variant="brand">{c.score}</Badge>
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {c.views}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Démographie audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { l: "Sénégal", v: 42 },
              { l: "Côte d'Ivoire", v: 18 },
              { l: "Mali", v: 12 },
              { l: "Cameroun", v: 9 },
              { l: "France", v: 8 },
              { l: "Autres", v: 11 },
            ].map((d) => (
              <div key={d.l}>
                <div className="flex justify-between text-xs">
                  <span>{d.l}</span>
                  <span className="font-medium">{d.v}%</span>
                </div>
                <Progress value={d.v} tone="brand" className="mt-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <div key={i}>
                  <div className="text-[10px] uppercase text-muted-foreground">{d}</div>
                  <div className="mt-1.5 h-20 overflow-hidden rounded-lg bg-muted/30">
                    <div
                      className="ml-0 h-full bg-gradient-to-t from-[#7B61FF]/30 to-[#7B61FF] origin-bottom"
                      style={{ height: `${[40, 55, 48, 62, 78, 92, 84][i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Best : samedi 20-22h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Heart, l: "Likes", v: "847K", c: "rose" },
              { icon: MessageSquare, l: "Commentaires", v: "92K", c: "sky" },
              { icon: Share2, l: "Partages", v: "38K", c: "emerald" },
              { icon: Activity, l: "Saves", v: "21K", c: "amber" },
            ].map((i) => (
              <div
                key={i.l}
                className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3"
              >
                <div className="flex items-center gap-2.5">
                  <i.icon className={`h-4 w-4 text-${i.c}-500`} />
                  <span className="text-sm">{i.l}</span>
                </div>
                <span className="font-display text-base font-bold">{i.v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
