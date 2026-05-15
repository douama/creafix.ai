"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Monetiq AI fonctionne-t-il pour les pages avec peu d'abonnés ?",
    a: "Oui. Même avec 0 abonné, Monetiq AI analyse ton contenu, ta niche et ton audience cible pour t'indiquer exactement quoi changer afin de devenir éligible à la monétisation Facebook et au Creator Rewards TikTok.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "100%. Nous utilisons OAuth officiel Meta et TikTok. Nous ne stockons jamais ton mot de passe. Tu peux révoquer les accès à tout moment depuis ton dashboard Facebook ou TikTok.",
  },
  {
    q: "Puis-je payer en FCFA ou Mobile Money ?",
    a: "Oui. Nous acceptons Wave, Orange Money, MTN MoMo, Moov Money, Free Money, ainsi que cartes bancaires (Stripe), PayPal et virements. Les prix sont affichés en FCFA, Naira et USD.",
  },
  {
    q: "Comment l'IA estime-t-elle mes revenus ?",
    a: "Nous combinons les données réelles de CPM/RPM par pays africain (Sénégal, Côte d'Ivoire, Cameroun, Mali, Nigeria, Ghana, Maroc, RDC, RSA), ton watch time, ton CTR, ta rétention et la qualité de ton audience pour produire une estimation à ±15%.",
  },
  {
    q: "Est-ce que ça marche pour mon agence ?",
    a: "Le plan Agence te permet de gérer un nombre illimité de clients, d'exporter des rapports PDF en marque blanche, de partager des liens privés et d'utiliser ton propre branding. Idéal pour les agences médias et social media managers.",
  },
  {
    q: "Y a-t-il une app mobile ?",
    a: "Oui — une app Flutter (Android + iOS) est en cours de finalisation avec notifications push, upload vidéo et analyse temps réel. Disponible aux abonnés Pro et Agence en accès anticipé.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="container max-w-3xl">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Questions <span className="gradient-text">fréquentes</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tout ce que tu dois savoir avant de te lancer.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-md"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-card/50"
              >
                <span className="font-medium">{f.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    open === i && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300",
                  open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
