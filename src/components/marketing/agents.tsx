"use client";

import { motion } from "framer-motion";
import { Bot, ShieldAlert, Flame, Coins, TrendingUp, ImageIcon, FileText } from "lucide-react";

const agents = [
  { icon: Bot, name: "Audit Agent", desc: "Analyse les 40+ signaux de conformité Facebook & TikTok." },
  { icon: Flame, name: "Viral Agent", desc: "Détecte les patterns viraux par pays et niche." },
  { icon: Coins, name: "Monetization Agent", desc: "Optimise RPM, CPM, et éligibilité aux programmes." },
  { icon: ShieldAlert, name: "Anti-Ban Agent", desc: "Prédit et neutralise les risques de bannissement." },
  { icon: TrendingUp, name: "Trend Agent", desc: "Tendances africaines en temps réel — sons, hashtags, formats." },
  { icon: ImageIcon, name: "Thumbnail Agent", desc: "Génère des miniatures qui maximisent le CTR." },
  { icon: FileText, name: "Script Agent", desc: "Hooks, scripts courts, CTA et légendes optimisées SEO." },
];

export function AgentsShowcase() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
            <Bot className="h-3 w-3" /> Multi-agents IA
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            7 agents IA spécialisés.
            <br />
            Une seule mission : <span className="gradient-text">tes revenus</span>.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-md transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.04]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-violet-500/15 to-orange-500/10">
                <a.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{a.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
