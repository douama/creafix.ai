"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-10 md:pt-24 md:pb-14">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[1100px] -translate-x-1/2 rounded-full bg-radial-fade blur-3xl" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="outline" className="mb-4 gap-1.5 border-border bg-card/60 px-3 py-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="text-[11px]">Construit pour l'Afrique · FR & EN</span>
          </Badge>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-6xl">
            L'IA qui débloque la <span className="gradient-text">monétisation</span> de tes pages.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-balance text-sm text-muted-foreground md:text-base">
            Connecte tes pages Facebook et tes comptes TikTok. Monetiq AI les analyse,
            détecte ce qui bloque tes revenus et te livre un plan d'action en 60 secondes.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Button asChild size="lg" variant="brand" className="group w-full sm:w-auto">
              <Link href="/signup">
                Démarrer mon audit gratuit
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="#how">Voir une démo</Link>
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Aucune carte requise
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-amber-400" /> 60s par audit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-violet-400" /> +2 300 créateurs
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-8 max-w-6xl"
        >
          <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-radial-fade blur-3xl" />
          <DashboardPreview />
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          {[
            { v: "10M+", l: "Vidéos analysées" },
            { v: "94%", l: "Précision IA" },
            { v: "+340%", l: "Revenus moyens" },
            { v: "9 pays", l: "Couverts" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-xl p-3">
              <div className="font-display text-xl font-bold md:text-2xl">{s.v}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground md:text-xs">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
