"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    icon: Zap,
    price: { mo: 0, yr: 0 },
    desc: "Pour tester l'outil et auditer tes 3 premiers comptes.",
    features: [
      "3 audits IA par mois",
      "1 plateforme connectée",
      "Anti-shadowban basique",
      "Trends Afrique de l'Ouest",
      "Support communauté",
    ],
    cta: "Commencer gratuit",
    href: "/signup",
  },
  {
    name: "Pro",
    icon: Sparkles,
    price: { mo: 29, yr: 290 },
    desc: "Pour les créateurs qui scalent activement leur revenu.",
    features: [
      "Audits illimités",
      "9 plateformes connectées",
      "Anti-shadowban premium + alertes",
      "Trends 24 pays africains",
      "AI Content Repair illimité",
      "RPM predictor multi-plateforme",
      "Support prioritaire 24/7",
    ],
    cta: "Démarrer Pro",
    href: "/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Agency",
    icon: Crown,
    price: { mo: 99, yr: 990 },
    desc: "Pour les agences média et collectifs de créateurs.",
    features: [
      "Tout Pro inclus",
      "Jusqu'à 20 créateurs gérés",
      "White-label dashboard",
      "API + Webhooks",
      "Multi-team + permissions",
      "Account manager dédié",
      "SLA 99.9% uptime",
    ],
    cta: "Contacter l'équipe",
    href: "/signup?plan=agency",
  },
];

export function CfxPricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="relative py-28">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="cfx-pill cfx-pill-purple mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            Pricing transparent
          </span>
          <h2 className="font-cfx text-[36px] md:text-[48px] leading-[1.05] font-bold tracking-[-0.02em] text-white">
            Choisis ton{" "}
            <span className="cfx-text-gradient">plan</span>.
          </h2>
          <p className="mt-4 text-[16px] text-[#A5B4CC]">
            Sans carte. Annule en 1 clic. 14 jours essai sur Pro.
          </p>

          {/* Toggle */}
          <div className="mt-7 inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-all ${
                !yearly ? "bg-white/10 text-white" : "text-[#A5B4CC]"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-all flex items-center gap-1.5 ${
                yearly ? "bg-white/10 text-white" : "text-[#A5B4CC]"
              }`}
            >
              Annuel
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00D1FF]/15 text-[#00D1FF]">
                -17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {PLANS.map((p) => {
            const price = yearly ? Math.round(p.price.yr / 12) : p.price.mo;
            const wrapperClass = p.highlight
              ? "cfx-border-glow rounded-2xl"
              : "";
            return (
              <div key={p.name} className={wrapperClass}>
                <div
                  className={`relative rounded-2xl p-6 h-full flex flex-col ${
                    p.highlight
                      ? "bg-[#0B1220]"
                      : "cfx-glass cfx-card-lift"
                  }`}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 cfx-pill !py-1 !text-[10px]">
                      <Sparkles className="h-3 w-3" />
                      Plus populaire
                    </span>
                  )}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6C63FF]/20 to-[#00D1FF]/15 border border-white/10 grid place-items-center">
                      <p.icon className="h-4 w-4 text-[#00D1FF]" />
                    </div>
                    <span className="font-cfx text-[18px] font-bold text-white">
                      {p.name}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#A5B4CC] min-h-[40px]">{p.desc}</p>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="font-cfx text-[44px] font-bold text-white leading-none">
                      ${price}
                    </span>
                    <span className="text-[13px] text-[#6C7A91]">
                      / mois{yearly && price > 0 ? " · facturé annuel" : ""}
                    </span>
                  </div>

                  <ul className="mt-6 space-y-2.5 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#E6EEF9]">
                        <span className="mt-0.5 h-4 w-4 rounded-full bg-[#00D1FF]/15 grid place-items-center flex-shrink-0">
                          <Check className="h-2.5 w-2.5 text-[#00D1FF]" strokeWidth={3} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={p.href}
                    className={
                      p.highlight
                        ? "cfx-btn-primary w-full mt-7 !justify-center"
                        : "cfx-btn-ghost w-full mt-7 !justify-center"
                    }
                  >
                    {p.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
