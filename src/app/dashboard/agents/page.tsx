import { Bot, Coins, FileText, Flame, ImageIcon, ShieldAlert, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const agents = [
  { icon: Bot,         name: "Audit Agent",        status: "Actif",  conf: 96, color: "violet" },
  { icon: Flame,       name: "Viral Agent",        status: "Actif",  conf: 91, color: "orange" },
  { icon: Coins,       name: "Monetization Agent", status: "Actif",  conf: 88, color: "emerald" },
  { icon: ShieldAlert, name: "Anti-Ban Agent",     status: "Actif",  conf: 94, color: "rose" },
  { icon: TrendingUp,  name: "Trend Agent",        status: "Actif",  conf: 86, color: "sky" },
  { icon: ImageIcon,   name: "Thumbnail Agent",    status: "En attente", conf: 78, color: "fuchsia" },
  { icon: FileText,    name: "Script Agent",       status: "Actif",  conf: 92, color: "amber" },
];

export default function AgentsPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Agents IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Les 7 cerveaux qui travaillent pour toi en arrière-plan, 24/7.
        </p>
      </div>

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
                      Powered by Claude · GPT-4o · Gemini
                    </div>
                  </div>
                </div>
                <Badge variant={a.status === "Actif" ? "success" : "outline"}>{a.status}</Badge>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Niveau de confiance</span>
                  <span className="font-medium">{a.conf}%</span>
                </div>
                <Progress
                  value={a.conf}
                  tone={a.conf >= 90 ? "emerald" : a.conf >= 75 ? "brand" : "amber"}
                  className="mt-2"
                />
              </div>

              <div className="text-xs text-muted-foreground">
                Dernière exécution : il y a 4 minutes · 1 247 tokens
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
