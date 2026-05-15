"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Créateur",
    priceXof: 0,
    priceUsd: 0,
    desc: "Pour démarrer ton audit IA en quelques secondes.",
    features: [
      "1 page Facebook + 1 compte TikTok",
      "Audit IA basique mensuel",
      "Score monétisation + viral",
      "5 idées virales IA / mois",
      "Estimation revenus basique",
    ],
    cta: "Commencer gratuit",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    priceXof: 9900,
    priceUsd: 19,
    desc: "Pour les créateurs qui veulent passer à l'échelle.",
    features: [
      "5 comptes (FB + TikTok)",
      "Audits IA illimités",
      "Anti-Ban + Trend Agent",
      "100 idées virales / mois",
      "Scripts, miniatures, voix-off IA",
      "Rapports PDF exportables",
      "Estimation revenus pays par pays",
    ],
    cta: "Démarrer 7 jours gratuits",
    href: "/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Agence",
    priceXof: 49900,
    priceUsd: 99,
    desc: "Gère plusieurs créateurs en marque blanche.",
    features: [
      "Comptes illimités",
      "Marque blanche + branding agence",
      "Liens partageables clients",
      "API + Webhooks",
      "Support prioritaire WhatsApp",
      "Programme ambassadeur",
      "Manager dédié",
    ],
    cta: "Contacter l'équipe",
    href: "/signup?plan=agency",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Des tarifs <span className="gradient-text">accessibles à l'Afrique</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Paie en FCFA, en Naira, en Dirham, en USD ou via Mobile Money — comme tu veux.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            <Sparkles className="h-3 w-3" /> -50% pour les 1 000 premiers créateurs
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-3xl border p-7 backdrop-blur-xl transition-all ${
                p.highlight
                  ? "border-violet-500/40 bg-gradient-to-b from-violet-500/[0.08] to-transparent shadow-2xl shadow-violet-500/20"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {p.highlight && (
                <Badge variant="brand" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Le + populaire
                </Badge>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold">
                  {p.priceXof.toLocaleString("fr-FR")}
                </span>
                <span className="text-muted-foreground">FCFA</span>
              </div>
              <div className="text-xs text-muted-foreground">
                ≈ ${p.priceUsd} USD · /mois · TVA incluse
              </div>

              <ul className="mt-7 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                variant={p.highlight ? "brand" : "outline"}
                className="mt-8 w-full"
              >
                <Link href={p.href}>{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span>Paiements acceptés :</span>
          {["Wave", "Orange Money", "MTN MoMo", "Moov", "Free Money", "Stripe", "PayPal"].map(
            (p) => (
              <span
                key={p}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1"
              >
                {p}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
