"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, Activity, Globe2 } from "lucide-react";

const STATS = [
  {
    icon: Users,
    value: "12 000+",
    label: "créateurs analysés",
    color: "#EC4899",
  },
  {
    icon: DollarSign,
    value: "$2.3M",
    label: "revenus récupérés",
    color: "#10B981",
  },
  {
    icon: Activity,
    value: "4 500+",
    label: "audits IA complétés",
    color: "#FF8A00",
  },
  {
    icon: Globe2,
    value: "9",
    label: "pays africains couverts",
    color: "#FF8A00",
  },
];

export function SocialProof() {
  return (
    <section className="relative border-y border-border/60 bg-card/20 py-6 md:py-8">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-3"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card/60"
                  style={{ boxShadow: `inset 0 0 24px ${s.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: s.color }} />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-lg font-bold leading-none md:text-xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground md:text-xs">
                    {s.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
