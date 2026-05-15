"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Eye,
  Flame,
  ShieldOff,
  Sparkles,
  TrendingDown,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Section "Revenue Leak Scanner" — combine deux features WOW :
 * 1. Shadowban AI Detector (mockup résultats)
 * 2. Revenue Loss Calculator (interactif)
 */
export function RevenueLeakScanner() {
  return (
    <section
      id="revenue-leak"
      className="relative overflow-hidden py-12 md:py-16"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-30 blur-3xl" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-300"
          >
            <AlertTriangle className="h-3 w-3" /> Détection en temps réel
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Combien d&apos;argent{" "}
            <span className="gradient-text">tu perds chaque mois</span> sans le
            savoir ?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            Notre IA détecte shadowbans, contenus low RPM et pertes de revenus
            invisibles. Estime ton manque à gagner mensuel en 5 secondes.
          </motion.p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <ShadowbanDetectorCard />
          <RevenueCalculatorCard />
        </div>
      </div>
    </section>
  );
}

function ShadowbanDetectorCard() {
  // Animation des barres au scroll
  const [reach, setReach] = useState(0);
  const [viral, setViral] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      onViewportEnter={() => {
        setReach(42);
        setViral(88);
      }}
      className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/[0.06] via-card/40 to-card/40 p-6 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-500/40 bg-rose-500/15">
            <ShieldOff className="h-5 w-5 text-rose-500 dark:text-rose-300" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold leading-tight">
              Détecteur de Shadowban IA
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Analyse @creator_sn · TikTok · 124K abonnés
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
          </span>
          Risque élevé
        </span>
      </div>

      <div className="relative mt-6 space-y-4">
        <MetricBar
          icon={Eye}
          label="Reach Health"
          value={reach}
          color="#F43F5E"
          suffix="%"
        />
        <MetricBar
          icon={Flame}
          label="Viral Potential"
          value={viral}
          color="#10B981"
          suffix="%"
        />

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-rose-500" />
              Monetization Risk
            </div>
            <div className="mt-1 font-display text-lg font-bold text-rose-500 dark:text-rose-300">
              HIGH
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-rose-500" />
              Lost Revenue
            </div>
            <div className="mt-1 font-display text-lg font-bold text-rose-500 dark:text-rose-300">
              -$430/mo
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-5 border-t border-border pt-4">
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
            3 vidéos avec musique sous copyright détectées
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            Portée -68% vs ta moyenne 30 jours
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            Watch time sous le seuil de monétisation (47%)
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

function MetricBar({
  icon: Icon,
  label,
  value,
  color,
  suffix = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-display font-bold" style={{ color }}>
          {value}
          {suffix}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function RevenueCalculatorCard() {
  const [views, setViews] = useState(500_000);
  const [country, setCountry] = useState<"sn" | "ci" | "ng" | "ma">("sn");

  const COUNTRY_RPM: Record<
    typeof country,
    { flag: string; name: string; rpm: number; actualRpm: number }
  > = {
    sn: { flag: "🇸🇳", name: "Sénégal", rpm: 1.8, actualRpm: 0.4 },
    ci: { flag: "🇨🇮", name: "Côte d'Ivoire", rpm: 1.6, actualRpm: 0.35 },
    ng: { flag: "🇳🇬", name: "Nigeria", rpm: 2.4, actualRpm: 0.6 },
    ma: { flag: "🇲🇦", name: "Maroc", rpm: 3.1, actualRpm: 0.9 },
  };

  const data = COUNTRY_RPM[country];

  const { potential, actual, loss } = useMemo(() => {
    const potentialRev = (views / 1000) * data.rpm;
    const actualRev = (views / 1000) * data.actualRpm;
    return {
      potential: Math.round(potentialRev),
      actual: Math.round(actualRev),
      loss: Math.round(potentialRev - actualRev),
    };
  }, [views, data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-[#7B61FF]/30 bg-gradient-to-br from-[#7B61FF]/[0.06] via-card/40 to-card/40 p-6 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#7B61FF]/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#7B61FF]/40 bg-[#7B61FF]/15">
            <Zap className="h-5 w-5 text-[#7B61FF]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold leading-tight">
              Revenue Leak Calculator
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Simule ton manque à gagner mensuel
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#7B61FF]/40 bg-[#7B61FF]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7B61FF]">
          <Sparkles className="h-2.5 w-2.5" /> Interactif
        </span>
      </div>

      <div className="relative mt-6 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="views-slider" className="text-muted-foreground">
              Vues mensuelles
            </label>
            <span className="font-display font-bold">
              {views.toLocaleString("fr-FR")}
            </span>
          </div>
          <input
            id="views-slider"
            type="range"
            min={50_000}
            max={5_000_000}
            step={50_000}
            value={views}
            onChange={(e) => setViews(Number(e.target.value))}
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted/30 accent-[#7B61FF]"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Pays</label>
          <div className="mt-1.5 grid grid-cols-4 gap-1.5">
            {(Object.keys(COUNTRY_RPM) as Array<keyof typeof COUNTRY_RPM>).map(
              (key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCountry(key)}
                  className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-all ${
                    country === key
                      ? "border-[#7B61FF] bg-[#7B61FF]/15 text-foreground"
                      : "border-border bg-background/40 text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  <span className="mr-1">{COUNTRY_RPM[key].flag}</span>
                  {COUNTRY_RPM[key].name.split(" ")[0]}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="rounded-xl border border-border bg-background/60 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Actuel
            </div>
            <div className="mt-0.5 font-display text-base font-bold">
              ${actual}
            </div>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
              Potentiel
            </div>
            <div className="mt-0.5 font-display text-base font-bold text-emerald-500 dark:text-emerald-300">
              ${potential}
            </div>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-rose-500 dark:text-rose-300">
              Tu perds
            </div>
            <div className="mt-0.5 font-display text-base font-bold text-rose-500 dark:text-rose-300">
              -${loss}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-5 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          <b className="text-foreground">
            ${loss.toLocaleString("fr-FR")}/mois
          </b>{" "}
          de revenus laissés sur la table avec ce profil. CreaFix AI te montre
          comment les récupérer.
        </p>
        <Button asChild size="sm" variant="brand" className="group mt-3 w-full">
          <Link href="/signup">
            Lancer mon audit gratuit
            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
