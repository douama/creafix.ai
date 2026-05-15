import { Flame, Music2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trends = [
  { tag: "#DakarMood",       country: "🇸🇳 Sénégal",        velocity: "+312%", uses: "1.2M" },
  { tag: "#NaijaJollof",     country: "🇳🇬 Nigeria",        velocity: "+248%", uses: "2.4M" },
  { tag: "#AbidjanNuit",     country: "🇨🇮 Côte d'Ivoire",  velocity: "+187%", uses: "640K" },
  { tag: "#CasaVibes",       country: "🇲🇦 Maroc",          velocity: "+156%", uses: "910K" },
  { tag: "#AccraToTheWorld", country: "🇬🇭 Ghana",          velocity: "+143%", uses: "510K" },
  { tag: "#YaoundéNight",    country: "🇨🇲 Cameroun",       velocity: "+132%", uses: "298K" },
  { tag: "#JoburgLife",      country: "🇿🇦 Afrique du Sud", velocity: "+118%", uses: "780K" },
  { tag: "#KinshasaSwag",    country: "🇨🇩 RDC",            velocity: "+109%", uses: "420K" },
];

const sounds = [
  { title: "Afro Drill #4127",         author: "@bouba.beats",    plays: "12.4M" },
  { title: "Amapiano Lagos 2025",      author: "@chinedu.afro",  plays: "8.9M"  },
  { title: "Coupé Décalé Bootleg",     author: "@didi225",        plays: "3.1M"  },
  { title: "Naija Voice Hook",         author: "@jamz.ng",        plays: "2.4M"  },
];

export default function TrendsPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Tendances Afrique</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trend Agent surveille en temps réel les hashtags et sons qui explosent par pays.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" /> Hashtags qui décollent (24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trends.map((t) => (
              <div
                key={t.tag}
                className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3"
              >
                <div>
                  <div className="font-medium">{t.tag}</div>
                  <div className="text-xs text-muted-foreground">{t.country}</div>
                </div>
                <div className="text-right">
                  <Badge variant="success" className="gap-1">
                    <TrendingUp className="h-3 w-3" /> {t.velocity}
                  </Badge>
                  <div className="mt-1 text-xs text-muted-foreground">{t.uses}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-4 w-4 text-pink-400" /> Sons TikTok tendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sounds.map((s) => (
              <div
                key={s.title}
                className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500/15 ring-1 ring-pink-400/30">
                    <Music2 className="h-4 w-4 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.author}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{s.plays}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
