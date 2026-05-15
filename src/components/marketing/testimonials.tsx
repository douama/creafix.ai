"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const items = [
  {
    name: "Mariam D.",
    role: "TikToker · 380K · Côte d'Ivoire",
    quote:
      "In 2 weeks, my RPM tripled. CreaFix AI told me exactly which sounds to avoid and which hooks to use for my Abidjan audience.",
  },
  {
    name: "Ibou & The Crew",
    role: "Facebook Page · 1.2M · Senegal",
    quote:
      "We were demonetized for copyright. The AI report identified 14 videos to fix. Reactivated within 9 days.",
  },
  {
    name: "Hype Lagos Agency",
    role: "Media agency · 24 clients · Nigeria",
    quote:
      "White-label mode is a game changer. Our client reports went 10× more pro. We signed 5 new contracts because of it.",
  },
];

export function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="relative py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>{" "}
            {t("titlePart2")}
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass relative flex flex-col rounded-2xl p-6"
            >
              <Quote className="h-6 w-6 text-[#7B61FF]" />
              <p className="mt-3 text-sm leading-relaxed">&ldquo;{it.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-brand font-semibold text-white">
                  {it.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
