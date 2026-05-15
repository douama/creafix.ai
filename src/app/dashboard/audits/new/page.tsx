"use client";

import { useState } from "react";
import { Facebook, Music2, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function NewAuditPage() {
  const [platform, setPlatform] = useState<"facebook" | "tiktok">("facebook");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    window.location.href = "/dashboard/audits/aud_01";
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Lancer un audit IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connecte un compte Facebook ou TikTok pour démarrer une analyse IA complète.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choisis la plateforme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <PlatformCard
              active={platform === "facebook"}
              onClick={() => setPlatform("facebook")}
              icon={Facebook}
              label="Facebook Page"
              desc="Audit complet via Meta Graph API"
              tone="blue"
            />
            <PlatformCard
              active={platform === "tiktok"}
              onClick={() => setPlatform("tiktok")}
              icon={Music2}
              label="TikTok Account"
              desc="Audit via TikTok Display API"
              tone="pink"
            />
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium">URL ou nom d'utilisateur</label>
            <Input
              placeholder={
                platform === "facebook"
                  ? "https://facebook.com/macreatorpage  ou  @macreatorpage"
                  : "@moncompte ou https://tiktok.com/@moncompte"
              }
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Tu peux aussi connecter directement via OAuth — recommandé pour un audit plus profond.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <OptionCard icon={ShieldCheck} title="Mode rapide" desc="Audit en 30s" />
            <OptionCard icon={Sparkles} title="Mode complet" desc="Anti-Ban + IA" active />
            <OptionCard icon={Sparkles} title="Mode agence" desc="Multi-comptes" />
          </div>

          <div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Connexion OAuth chiffrée · Aucune donnée vendue
            </div>
            <Button variant="brand" size="lg" disabled={loading} onClick={start}>
              {loading ? "Analyse en cours…" : "Démarrer l'audit IA"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ce que l'IA va analyser</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            {[
              "Conformité aux politiques de monétisation",
              "Contenu réutilisé / dupliqué",
              "Engagement authentique vs fake",
              "Spam, copyright, contenu sensible",
              "Qualité vidéo et watch time",
              "CTR et taux de rétention",
              "Fréquence de publication optimale",
              "Catégories les plus rentables",
              "Shadowban et restrictions",
              "Score viral FYP TikTok",
              "Hashtags et SEO TikTok",
              "Audience cible et géographie",
            ].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Badge variant="success" className="h-1.5 w-1.5 rounded-full p-0" />
                {i}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PlatformCard({
  active,
  onClick,
  icon: Icon,
  label,
  desc,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  desc: string;
  tone: "blue" | "pink";
}) {
  const ring = tone === "blue" ? "ring-blue-400/40 bg-blue-500/10" : "ring-pink-400/40 bg-pink-500/10";
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-violet-500/50 bg-violet-500/5 shadow-lg shadow-violet-500/15"
          : "border-border bg-card/40 hover:bg-card/60",
      )}
    >
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl ring-1", ring)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}

function OptionCard({
  icon: Icon,
  title,
  desc,
  active = false,
}: {
  icon: any;
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 text-sm",
        active
          ? "border-violet-500/40 bg-violet-500/[0.06]"
          : "border-border bg-card/40",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{title}</span>
        {active && <Badge variant="brand" className="ml-auto">Choisi</Badge>}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}
