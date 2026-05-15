"use client";

import { motion } from "framer-motion";
import { Link2, Brain, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Link2,
    title: "Connecte tes comptes",
    desc:
      "Connexion sécurisée via OAuth Meta (Facebook) et TikTok. Aucun mot de passe partagé. Révoquable à tout moment.",
  },
  {
    n: "02",
    icon: Brain,
    title: "L'IA scanne tout",
    desc:
      "Nos 7 agents IA analysent ton contenu, ton audience, ta conformité, ton risque de ban et tes opportunités revenus.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Reçois ton plan d'action",
    desc:
      "Score IA, recommandations précises, idées virales, scripts, miniatures et roadmap monétisation prête à exécuter.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-14 md:py-20">
      <div className="absolute inset-0 -z-10 bg-radial-fade opacity-40" />
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-balance md:text-4xl">
            3 étapes. <span className="gradient-text">60 secondes</span>.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Pas besoin d'être expert. Monetiq AI fait le travail à ta place.
          </p>
        </div>

        <div className="relative mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass relative rounded-2xl p-5"
            >
              <div className="absolute right-5 top-5 font-display text-4xl font-bold text-white/5">
                {s.n}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-primary/30">
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
