"use client";

import { useState } from "react";
import {
  Copy,
  Flame,
  ImageIcon,
  Loader2,
  Mic,
  Music2,
  RefreshCw,
  Sparkles,
  Video,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Idea = {
  title: string;
  score: number;
  duration: string;
  niche: string;
  hooks?: string[];
};

const niches = [
  "Humour",
  "Motivation",
  "Business",
  "Religion",
  "Lifestyle",
  "Football",
  "Gossip",
  "Actualité",
  "Finance",
  "Crypto",
  "IA",
];

const seedIdeas = [
  {
    title: "POV : tu es un jeune Dakarois et tu découvres Wave pour la première fois",
    score: 94,
    duration: "0:45",
    niche: "Finance · Humour",
  },
  {
    title: "3 erreurs que font 90% des entrepreneurs au Sénégal",
    score: 91,
    duration: "1:10",
    niche: "Business",
  },
  {
    title: "Comment je suis passé de 0 à 100K abonnés en parlant de foot africain",
    score: 89,
    duration: "0:58",
    niche: "Football",
  },
  {
    title: "Le piège du Mobile Money que personne ne te dit",
    score: 88,
    duration: "1:00",
    niche: "Finance",
  },
  {
    title: "5 hacks Canva pour créer une miniature qui buzz",
    score: 86,
    duration: "0:52",
    niche: "Lifestyle",
  },
  {
    title: "Si tu vis en Afrique, regarde cette vidéo avant 2026",
    score: 85,
    duration: "1:15",
    niche: "Motivation",
  },
];

export default function GeneratorPage() {
  const [niche, setNiche] = useState("Humour");
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<Idea[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generator/ideas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          niche,
          topic: topic.trim() || undefined,
          platform: "TIKTOK",
          country: "SN",
        }),
      });
      const json = (await res.json()) as { ok?: boolean; data?: Idea[]; error?: unknown; isMock?: boolean };
      if (!res.ok) {
        const msg = res.status === 429
          ? "Trop de requêtes — réessaie dans une minute"
          : typeof json.error === "string"
            ? json.error
            : "Erreur lors de la génération";
        toast.error(msg);
        return;
      }
      if (Array.isArray(json.data) && json.data.length > 0) {
        setIdeas(json.data);
        if (json.isMock) {
          toast.message("Mode démo : clé IA non configurée, idées générées localement");
        } else {
          toast.success(`${json.data.length} idées générées`);
        }
      } else {
        toast.error("Aucune idée renvoyée par l'agent");
      }
    } catch (err) {
      toast.error((err as Error).message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  // Idées affichées : API si dispo, sinon seed pour ne pas montrer une page vide
  const displayIdeas: Idea[] = ideas ?? seedIdeas;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Générateur IA viral</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Idées, hooks, scripts, miniatures et voix-off — calibrés pour l&apos;Afrique.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-5 p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input
              placeholder="Décris ton angle : 'argent', 'sortir d'Afrique', 'mariage Dakar'…"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <Button variant="brand" size="lg" onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-1 h-4 w-4" />
              )}
              {loading ? "Génération…" : "Générer des idées"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {niches.map((n) => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  niche === n
                    ? "border-violet-500/50 bg-violet-500/15 text-violet-200"
                    : "border-border bg-card/40 text-muted-foreground hover:bg-card/70",
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ideas">
        <TabsList>
          <TabsTrigger value="ideas">
            <Flame className="mr-1 h-3.5 w-3.5" /> Idées virales
          </TabsTrigger>
          <TabsTrigger value="scripts">
            <Video className="mr-1 h-3.5 w-3.5" /> Hooks & scripts
          </TabsTrigger>
          <TabsTrigger value="thumb">
            <ImageIcon className="mr-1 h-3.5 w-3.5" /> Miniatures
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Mic className="mr-1 h-3.5 w-3.5" /> Voix-off
          </TabsTrigger>
          <TabsTrigger value="sounds">
            <Music2 className="mr-1 h-3.5 w-3.5" /> Sons tendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ideas">
          {ideas === null && (
            <p className="mb-3 text-xs text-muted-foreground">
              Exemples ci-dessous — clique sur « Générer des idées » pour les remplacer par des idées IA en temps réel.
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayIdeas.map((idea, i) => (
              <Card key={`${idea.title}-${i}`} className="group transition-colors hover:bg-card/70">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand">{idea.score} viral</Badge>
                    <span className="text-xs text-muted-foreground">{idea.duration}</span>
                  </div>
                  <p className="font-medium leading-snug">{idea.title}</p>
                  <div className="text-xs text-muted-foreground">{idea.niche}</div>
                  {idea.hooks && idea.hooks.length > 0 && (
                    <ul className="space-y-1 text-xs text-muted-foreground/90">
                      {idea.hooks.slice(0, 2).map((h, idx) => (
                        <li key={idx} className="line-clamp-2">→ {h}</li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Sparkles className="mr-1 h-3.5 w-3.5" /> Script
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        void navigator.clipboard.writeText(idea.title);
                        toast.success("Titre copié");
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scripts">
          <Card>
            <CardHeader>
              <CardTitle>Script généré · POV Wave Dakar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hook (0–3s) — variantes IA
                </div>
                <ul className="mt-2 space-y-2">
                  {[
                    "Tu as Wave ? Regarde ça avant de payer encore une fois.",
                    "Personne ne te dit ça sur Wave… mais moi je vais le faire.",
                    "Le truc fou que j'ai découvert sur Wave la semaine dernière 👇",
                  ].map((h) => (
                    <li
                      key={h}
                      className="flex items-center justify-between rounded-xl border border-border bg-card/40 px-4 py-2.5 text-sm"
                    >
                      <span>{h}</span>
                      <button className="text-muted-foreground hover:text-foreground">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Script complet
                </div>
                <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-border bg-card/40 p-4 text-sm leading-relaxed">{`[0–3s · Hook]
Tu as Wave ? Regarde ça avant de payer encore une fois.

[3–10s · Promesse]
Je vais te montrer 3 astuces que la majorité des Dakarois ignorent — la 3e va te choquer.

[10–35s · Valeur]
1. Active les notifications de paiement instantané pour éviter les arnaques.
2. Utilise les codes marchands officiels (cherche le ✓ bleu).
3. Configure ton plafond personnalisé pour bloquer les retraits suspects.

[35–45s · CTA]
Like si t'as appris quelque chose, abonne-toi pour les 5 prochaines astuces.`}</pre>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <RefreshCw className="mr-1 h-3.5 w-3.5" /> Régénérer
                </Button>
                <Button variant="brand">
                  <Mic className="mr-1 h-3.5 w-3.5" /> Générer la voix-off
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thumb">
          <Card>
            <CardHeader>
              <CardTitle>Miniatures IA</CardTitle>
              <p className="text-sm text-muted-foreground">
                Notre Thumbnail Agent génère 6 variantes optimisées CTR.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="group relative aspect-video overflow-hidden rounded-xl border border-border"
                  >
                    <div className="absolute inset-0 gradient-brand opacity-90" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),transparent_60%)]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                      <span className="font-display text-lg font-extrabold uppercase leading-tight">
                        Wave : 3 ASTUCES
                      </span>
                      <span className="mt-1 text-xs opacity-80">Variante {i + 1}</span>
                    </div>
                    <Badge variant="success" className="absolute right-2 top-2">
                      {86 + i}% CTR
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="text-sm text-muted-foreground">
                Choisis une voix africaine francophone, anglophone ou bilingue.
                Synthèse haute fidélité en moins de 5 secondes.
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { name: "Amina", lang: "FR · Sénégal", tone: "Chaleureuse" },
                  { name: "Kwame", lang: "EN · Ghana", tone: "Énergique" },
                  { name: "Sadio", lang: "FR · Côte d'Ivoire", tone: "Conversationnelle" },
                  { name: "Zara", lang: "EN · Nigeria", tone: "Pro / News" },
                  { name: "Hamza", lang: "FR · Maroc", tone: "Profonde" },
                  { name: "Lily", lang: "FR · Cameroun", tone: "Jeune & punchy" },
                ].map((v) => (
                  <button
                    key={v.name}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 text-left hover:bg-card/70"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-brand text-white">
                      {v.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{v.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {v.lang} · {v.tone}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sounds">
          <Card>
            <CardContent className="space-y-3 p-5">
              {[
                { title: "Afro Drill instrumental #4127", views: "12.4M", risk: "safe" },
                { title: "Coupé Décalé bootleg 2025", views: "3.1M", risk: "warn" },
                { title: "Amapiano Lagos trending", views: "8.9M", risk: "safe" },
                { title: "Naija Voice viral hook", views: "2.4M", risk: "risk" },
              ].map((s) => (
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
                      <div className="text-xs text-muted-foreground">{s.views} d'utilisations</div>
                    </div>
                  </div>
                  <Badge
                    variant={s.risk === "safe" ? "success" : s.risk === "warn" ? "warning" : "destructive"}
                  >
                    {s.risk === "safe" ? "Safe" : s.risk === "warn" ? "Prudence" : "Copyright"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
