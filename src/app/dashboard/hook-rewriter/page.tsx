"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Loader2,
  RefreshCcw,
  Flame,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variant = {
  text: string;
  viralScore: number;
  length: number;
  strengths: string[];
  tone: string;
};

const STYLES = [
  { id: "punchy", label: "Punchy", desc: "Court, percutant, FYP" },
  { id: "curiosity", label: "Curiosity Gap", desc: "Provoque l'envie de regarder" },
  { id: "controversy", label: "Controverse", desc: "Polarise, génère engagement" },
  { id: "story", label: "Storytelling", desc: "Accroche émotionnelle" },
];

const PLATFORMS = ["TikTok", "YouTube Shorts", "Instagram Reels", "Facebook Reels"];

const MOCK_VARIANTS: Record<string, Variant[]> = {
  default: [
    {
      text: "Tu vas pas croire combien j'ai perdu en 30 jours sur TikTok…",
      viralScore: 89,
      length: 56,
      strengths: ["Curiosity gap", "Personnel", "Chiffré"],
      tone: "Punchy",
    },
    {
      text: "Personne te le dira mais 80% des créateurs perdent ÇA chaque mois.",
      viralScore: 84,
      length: 64,
      strengths: ["Secret révélé", "Stat choc", "Polarisant"],
      tone: "Controverse",
    },
    {
      text: "POV : tu découvres que ton compte est shadowban depuis 3 semaines.",
      viralScore: 81,
      length: 62,
      strengths: ["POV format", "Peur de manquer", "Relatable"],
      tone: "Story",
    },
    {
      text: "J'ai testé l'IA qui détecte les fuites de revenus. Résultat : choquant.",
      viralScore: 76,
      length: 71,
      strengths: ["Réveal angle", "Mention IA", "Cliffhanger"],
      tone: "Curiosity Gap",
    },
    {
      text: "Stop. Ton hook actuel te coûte $400 par mois. Voici pourquoi.",
      viralScore: 73,
      length: 58,
      strengths: ["CTA fort", "Chiffre net", "Promesse"],
      tone: "Punchy",
    },
  ],
};

export default function HookRewriterPage() {
  const [input, setInput] = useState(
    "POV : tu es un créateur africain qui galère à monétiser",
  );
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [style, setStyle] = useState(STYLES[0].id);
  const [phase, setPhase] = useState<"idle" | "rewriting" | "done">("idle");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  function rewrite() {
    setPhase("rewriting");
    setVariants([]);
    setTimeout(() => {
      setVariants(MOCK_VARIANTS.default);
      setPhase("done");
    }, 1400);
  }

  function copyToClipboard(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              AI Hook Rewriter
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF8A00]">
              <Flame className="h-2.5 w-2.5" />
              WOW IA
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Colle ton hook actuel. L&apos;IA génère 5 variantes optimisées avec score viral.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-5 md:p-6">
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Ton hook actuel
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex : POV : tu es un créateur qui galère à monétiser…"
                rows={3}
                maxLength={180}
                className="mt-1.5 w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#7B61FF]/50"
              />
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{input.length}/180 caractères</span>
                <span>Hook actuel : {scoreHook(input)}/100 estimé</span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Plateforme cible
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                        platform === p
                          ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                          : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Style de réécriture
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      title={s.desc}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                        style === s.id
                          ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                          : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="brand"
              size="lg"
              onClick={rewrite}
              disabled={phase === "rewriting" || !input.trim()}
              className="w-full md:w-auto"
            >
              {phase === "rewriting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération de 5 variantes…
                </>
              ) : phase === "done" ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Re-générer
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Réécrire avec l&apos;IA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF8A00]" />
              <h2 className="font-display text-lg font-bold">Variantes IA</h2>
              <span className="text-xs text-muted-foreground">
                · {variants.length || "génération en cours"}
              </span>
            </div>

            {phase === "rewriting" && (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-2xl border border-border bg-card/30"
                  />
                ))}
              </div>
            )}

            {phase === "done" && (
              <div className="space-y-2">
                {variants.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-4 transition-all hover:border-foreground/20 hover:bg-card/60"
                  >
                    <div className="flex items-start gap-3">
                      <ScoreBadge value={v.viralScore} />

                      <div className="min-w-0 flex-1">
                        <p className="font-display text-base font-semibold leading-tight md:text-lg">
                          “{v.text}”
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5">
                            <Flame className="h-2.5 w-2.5" />
                            {v.tone}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5">
                            {v.length} car.
                          </span>
                          {v.strengths.map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-500 dark:text-emerald-300"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(v.text, i)}
                        className={cn(
                          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          copied === i
                            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-500 dark:text-emerald-300"
                            : "border-border bg-background/60 hover:bg-background",
                        )}
                        aria-label="Copier"
                      >
                        {copied === i ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreBadge({ value }: { value: number }) {
  const color =
    value >= 85 ? "#10B981" : value >= 70 ? "#FF8A00" : "#F43F5E";
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border bg-background/60"
      style={{ borderColor: `${color}55`, backgroundColor: `${color}1A` }}
    >
      <span className="font-display text-lg font-bold leading-none" style={{ color }}>
        {value}
      </span>
      <span className="mt-0.5 text-[8px] uppercase tracking-wider text-muted-foreground">
        viral
      </span>
    </div>
  );
}

function scoreHook(text: string): number {
  // Heuristique simple côté front : longueur, mots punchy, ponctuation
  if (!text.trim()) return 0;
  let score = 40;
  if (text.length >= 30 && text.length <= 80) score += 15;
  if (/\?|\!/.test(text)) score += 10;
  if (/(POV|stop|jamais|secret|attention|pourquoi|comment|combien)/i.test(text)) score += 15;
  if (/\b\d+/.test(text)) score += 10;
  return Math.min(100, score);
}
