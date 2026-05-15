"use client";

import { useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { platformList, type PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/utils";

const placeholderByPlatform: Partial<Record<PlatformId, string>> = {
  FACEBOOK: "https://facebook.com/macreatorpage  ou  @macreatorpage",
  TIKTOK: "@moncompte ou https://tiktok.com/@moncompte",
  YOUTUBE: "https://youtube.com/@machaine ou ID UCxxxx",
  INSTAGRAM: "@moncompte ou https://instagram.com/moncompte",
  X: "@monpseudo ou https://x.com/monpseudo",
  SNAPCHAT: "@monsnap",
  TWITCH: "@monchannel ou https://twitch.tv/monchannel",
  PINTEREST: "@monpinterest",
  LINKEDIN: "URL profil ou page LinkedIn",
};

export default function NewAuditPage() {
  const [platform, setPlatform] = useState<PlatformId>("FACEBOOK");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = platformList.find((p) => p.id === platform)!;

  async function start() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    window.location.href = "/dashboard/audits/aud_01";
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Lancer un audit IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connecte un compte sur l'une des 9 plateformes monétisables supportées.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choisis la plateforme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {platformList.map((p) => (
              <PlatformChoice
                key={p.id}
                active={platform === p.id}
                onClick={() => setPlatform(p.id)}
                platform={p}
              />
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium">
              URL ou nom d'utilisateur sur {selected.name}
            </label>
            <Input
              placeholder={placeholderByPlatform[platform] ?? "@moncompte"}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Pour un audit en profondeur, connecte aussi ton compte via OAuth officiel.
            </p>
          </div>

          {selected.programs.length > 0 && (
            <div className="mt-5 rounded-xl border border-border bg-card/60 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Programmes de monétisation audités
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selected.programs.map((prog) => (
                  <Badge key={prog.name} variant="outline" className="font-normal">
                    {prog.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <OptionCard icon={ShieldCheck} title="Mode rapide" desc="Audit en 30s" />
            <OptionCard icon={Sparkles} title="Mode complet" desc="Anti-Ban + IA" active />
            <OptionCard icon={Sparkles} title="Mode agence" desc="Multi-comptes" />
          </div>

          <div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> OAuth chiffré · Tokens jamais en clair
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
              "Conformité aux politiques de la plateforme",
              "Contenu réutilisé / dupliqué",
              "Engagement authentique vs fake",
              "Spam, copyright, contenu sensible",
              "Qualité vidéo, watch time, rétention",
              "CTR, taux de complétion",
              "Fréquence de publication optimale",
              "Catégories les plus rentables",
              "Shadowban et restrictions",
              "Score viral / FYP",
              "Hashtags et SEO",
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

function PlatformChoice({
  active,
  onClick,
  platform,
}: {
  active: boolean;
  onClick: () => void;
  platform: (typeof platformList)[number];
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
        active
          ? "border-[#7B61FF]/50 bg-[#7B61FF]/[0.06] shadow-md shadow-[#7B61FF]/20"
          : "border-border bg-card/40 hover:border-foreground/15 hover:bg-card/70",
        platform.status === "soon" && "opacity-60",
      )}
      disabled={platform.status === "soon"}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md ring-1",
          platform.bgGradient,
          platform.ringClass,
        )}
      >
        <span className="font-display text-base font-extrabold leading-none">
          {glyphOf(platform.id)}
        </span>
      </div>
      <div className="text-xs font-medium">{platform.name}</div>
      {platform.status !== "live" && (
        <Badge
          variant={platform.status === "beta" ? "warning" : "outline"}
          className="absolute -top-1.5 right-1 h-4 px-1 text-[9px]"
        >
          {platform.status === "beta" ? "Bêta" : "Bientôt"}
        </Badge>
      )}
    </button>
  );
}

function glyphOf(id: PlatformId): string {
  return ({
    YOUTUBE: "▶",
    FACEBOOK: "f",
    INSTAGRAM: "◎",
    TIKTOK: "♪",
    X: "𝕏",
    SNAPCHAT: "👻",
    TWITCH: "▰",
    PINTEREST: "P",
    LINKEDIN: "in",
  } as Record<PlatformId, string>)[id];
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
          ? "border-[#7B61FF]/40 bg-[#7B61FF]/[0.06]"
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
