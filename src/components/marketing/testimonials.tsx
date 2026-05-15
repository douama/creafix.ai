"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    name: "Mariam D.",
    role: "TikTokeuse · 380K · Côte d'Ivoire",
    quote:
      "En 2 semaines, mon RPM a triplé. Monetiq AI m'a dit exactement quels sons éviter et quels hooks utiliser pour mon audience d'Abidjan.",
  },
  {
    name: "Ibou & The Crew",
    role: "Page Facebook · 1.2M · Sénégal",
    quote:
      "On était démonétisés à cause de copyright. Le rapport IA nous a fait identifier 14 vidéos à corriger. Réactivé sous 9 jours.",
  },
  {
    name: "Agence Hype Lagos",
    role: "Agence média · 24 clients · Nigeria",
    quote:
      "Le mode marque blanche est game changer. Nos rapports clients sont devenus 10× plus pro. On a signé 5 nouveaux contrats grâce à ça.",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Ils ont <span className="gradient-text">débloqué</span> leur monétisation.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass relative flex flex-col rounded-2xl p-6"
            >
              <Quote className="h-6 w-6 text-violet-400" />
              <p className="mt-3 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-brand font-semibold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
