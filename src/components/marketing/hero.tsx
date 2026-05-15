"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-32">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-radial-fade blur-3xl" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge variant="outline" className="mb-6 gap-1.5 border-white/15 bg-white/[0.04] px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs">Construit pour l'Afrique · Disponible FR & EN</span>
          </Badge>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-balance md:text-7xl">
            L'IA qui débloque
            <br />
            la <span className="gradient-text">monétisation</span> de
            <br />
            tes pages & comptes.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            Connecte tes pages Facebook et tes comptes TikTok. Monetiq AI les analyse en
            profondeur, détecte ce qui bloque tes revenus et te livre un plan d'action
            ultra précis — adapté au marché africain.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" variant="brand" className="group w-full sm:w-auto">
              <Link href="/signup">
                Démarrer mon audit gratuit
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
              <Link href="#how">Voir une démo</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Aucune carte requise
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Audit complet en 60s
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-violet-400" /> +2 300 créateurs accompagnés
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-6xl"
        >
          <div className="absolute -inset-12 -z-10 rounded-[3rem] bg-radial-fade blur-3xl" />
          <DashboardPreview />
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          {[
            { v: "10M+", l: "Vidéos analysées" },
            { v: "94%", l: "Précision IA" },
            { v: "+340%", l: "Revenus moyens" },
            { v: "9 pays", l: "Couverts en Afrique" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-4">
              <div className="font-display text-2xl font-bold md:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
