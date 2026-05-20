"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Eye,
  Flame,
  ShieldOff,
  Sparkles,
  TrendingDown,
  ArrowRight,
  Zap,
  RotateCw,
  Loader2,
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
            <AlertTriangle className="h-3 w-3" /> Détection à chaque audit IA
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
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [scanKey, setScanKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function runScan() {
    setPhase("scanning");
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const start = Date.now();
    const SCAN_MS = 1800;
    intervalRef.current = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / SCAN_MS) * 100);
      setProgress(p);
      if (p >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPhase("done");
        setScanKey((k) => k + 1);
      }
    }, 40);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      onViewportEnter={() => {
        if (phase === "idle") runScan();
      }}
      className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/[0.06] via-card/40 to-card/40 p-6 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl" />

      {/* Scan line overlay pendant scanning */}
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "200%", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "linear" }}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-transparent via-rose-500/30 to-transparent"
          />
        )}
      </AnimatePresence>

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

        {phase === "done" ? (
          <button
            type="button"
            onClick={runScan}
            className="group inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 transition-colors hover:bg-rose-500/25 dark:text-rose-300"
          >
            <RotateCw className="h-2.5 w-2.5 transition-transform group-hover:rotate-180" />
            Re-scan
          </button>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
            {phase === "scanning" ? (
              <>
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                Scan…
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Prêt
              </>
            )}
          </span>
        )}
      </div>

      {/* Progress bar pendant scanning */}
      <AnimatePresence mode="wait">
        {phase === "scanning" && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative mt-5"
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Analyse en cours…</span>
              <span className="font-display font-bold text-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
              <ScanLog stepProgress={progress} threshold={20}>
                Inspection de 312 vidéos
              </ScanLog>
              <ScanLog stepProgress={progress} threshold={45}>
                Détection des signatures de shadowban
              </ScanLog>
              <ScanLog stepProgress={progress} threshold={70}>
                Comparaison portée vs référence 30 j
              </ScanLog>
              <ScanLog stepProgress={progress} threshold={92}>
                Calcul des revenus perdus
              </ScanLog>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Résultats — visibles quand done */}
      <AnimatePresence mode="wait">
        {phase === "done" && (
          <motion.div
            key={`results-${scanKey}`}
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.05 },
              },
            }}
            className="relative mt-6 space-y-4"
          >
            <RevealItem>
              <MetricBar
                icon={Eye}
                label="Reach Health"
                value={42}
                color="#F43F5E"
                suffix="%"
              />
            </RevealItem>
            <RevealItem>
              <MetricBar
                icon={Flame}
                label="Viral Potential"
                value={88}
                color="#10B981"
                suffix="%"
              />
            </RevealItem>

            <RevealItem>
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
            </RevealItem>

            <RevealItem>
              <div className="border-t border-border pt-4">
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
            </RevealItem>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RevealItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
    >
      {children}
    </motion.div>
  );
}

function ScanLog({
  stepProgress,
  threshold,
  children,
}: {
  stepProgress: number;
  threshold: number;
  children: React.ReactNode;
}) {
  const reached = stepProgress >= threshold;
  return (
    <div
      className={`flex items-center gap-2 transition-opacity duration-300 ${
        reached ? "opacity-100" : "opacity-30"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors ${
          reached ? "bg-emerald-500" : "bg-muted-foreground/30"
        }`}
      />
      <span className={reached ? "text-foreground" : ""}>{children}</span>
    </div>
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
      className="relative overflow-hidden rounded-2xl border border-[#EC4899]/30 bg-gradient-to-br from-[#EC4899]/[0.06] via-card/40 to-card/40 p-6 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#EC4899]/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#EC4899]/40 bg-[#EC4899]/15">
            <Zap className="h-5 w-5 text-[#EC4899]" />
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
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#EC4899]/40 bg-[#EC4899]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EC4899]">
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
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted/30 accent-[#EC4899]"
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
                      ? "border-[#EC4899] bg-[#EC4899]/15 text-foreground"
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
