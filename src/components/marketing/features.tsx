"use client";

import { motion } from "framer-motion";
import {
  ShieldAlert,
  Brain,
  TrendingUp,
  Sparkles,
  PlayCircle,
  Building2,
  FileBarChart2,
  Smartphone,
  Globe,
  Coins,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Audit IA Facebook & TikTok",
    desc:
      "Analyse profonde de chaque page : conformité, qualité vidéo, watch time, CTR, rétention, fraîcheur, copyright, contenu recyclé.",
    accent: "from-violet-500/20 to-violet-500/0",
  },
  {
    icon: ShieldAlert,
    title: "IA Anti-Ban",
    desc:
      "Prédiction des risques de bannissement et démonétisation. Détection des sons risqués et violations copyright avant publication.",
    accent: "from-rose-500/20 to-rose-500/0",
  },
  {
    icon: TrendingUp,
    title: "Score monétisation IA",
    desc:
      "Un score sur 100 alimenté par 40+ signaux. Compare ta page aux meilleurs créateurs de ton pays et de ta niche.",
    accent: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    icon: Sparkles,
    title: "Idées virales adaptées Afrique",
    desc:
      "Hooks, scripts, légendes, miniatures et tendances locales. Modes humour, foot, lifestyle, business, finance, crypto…",
    accent: "from-amber-500/20 to-amber-500/0",
  },
  {
    icon: PlayCircle,
    title: "Générateur IA de contenu",
    desc:
      "Images, voix-off, sous-titres, miniatures et reels TikTok générés en quelques secondes avec notre stack IA propriétaire.",
    accent: "from-sky-500/20 to-sky-500/0",
  },
  {
    icon: Coins,
    title: "Estimation revenus FCFA",
    desc:
      "Estimation précise CPM/RPM par pays africain : Sénégal, Côte d'Ivoire, Cameroun, Mali, Nigeria, Ghana, Maroc, RDC, RSA.",
    accent: "from-orange-500/20 to-orange-500/0",
  },
  {
    icon: Building2,
    title: "Mode Agence & marque blanche",
    desc:
      "Gère plusieurs clients, exporte des rapports PDF en marque blanche, partage via liens privés, branding personnalisé.",
    accent: "from-fuchsia-500/20 to-fuchsia-500/0",
  },
  {
    icon: FileBarChart2,
    title: "Rapports IA premium",
    desc:
      "Roadmap de croissance, checklist d'éligibilité monétisation, graphiques exportables — prêts à envoyer à un client.",
    accent: "from-indigo-500/20 to-indigo-500/0",
  },
  {
    icon: Smartphone,
    title: "Optimisé mobile & low data",
    desc:
      "Conçu pour les créateurs mobiles et les connexions faibles. App Flutter à venir avec upload + analyse temps réel.",
    accent: "from-teal-500/20 to-teal-500/0",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" /> Pensé pour l'Afrique
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-balance md:text-4xl">
            Tout ce qu'il te faut pour <span className="gradient-text">débloquer ta monétisation</span>.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            9 outils IA réunis dans une seule plateforme — conçus avec et pour les créateurs africains.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md transition-all hover:border-border hover:bg-card/60"
            >
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${f.accent} blur-2xl transition-opacity group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/60">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
