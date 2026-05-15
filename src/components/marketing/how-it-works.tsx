"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link2, Brain, Rocket } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("how");

  const steps = [
    { n: "01", icon: Link2, title: t("step1Title"), desc: t("step1Desc") },
    { n: "02", icon: Brain, title: t("step2Title"), desc: t("step2Desc") },
    { n: "03", icon: Rocket, title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <section id="how" className="relative py-14 md:py-20">
      <div className="absolute inset-0 -z-10 bg-radial-fade opacity-40" />
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-balance md:text-4xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>
            {t("titlePart2")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("subtitle")}</p>
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
              <div className="absolute right-5 top-5 font-display text-4xl font-bold text-foreground/5">
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
