"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const ITEMS = [
  {
    q: "Comment fonctionne l'audit IA ?",
    a: "Tu connectes tes comptes via OAuth (lecture seule, jamais de mot de passe). L'IA analyse 47 signaux par plateforme : retention, RPM, hooks, thumbnails, fréquence, niche fit. Tu reçois un rapport actionnable en 2 minutes.",
  },
  {
    q: "Est-ce que CreaFix peut me faire shadowban ?",
    a: "Non. Nous utilisons uniquement les APIs officielles des plateformes (YouTube Data API, TikTok Display API, Meta Graph API, etc.). Aucune automation, aucun scraping. Ton compte reste 100% safe.",
  },
  {
    q: "Quelles plateformes sont supportées ?",
    a: "9 plateformes : YouTube, Facebook, Instagram, TikTok, X (Twitter), Snapchat, Twitch, Pinterest, LinkedIn. Plus Threads et BlueSky en beta.",
  },
  {
    q: "Combien de comptes je peux connecter ?",
    a: "Starter : 1 plateforme. Pro : 9 plateformes illimitées. Agency : 9 plateformes × jusqu'à 20 créateurs gérés.",
  },
  {
    q: "Le RPM predictor est-il fiable ?",
    a: "Nous avons entraîné notre modèle sur 480K vidéos africaines. La marge d'erreur moyenne est de ±18% pour YouTube et ±24% pour TikTok Creator Rewards. C'est largement suffisant pour prendre des décisions.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, 1 clic dans Settings → Subscription. Pas de période d'engagement. Tu gardes accès jusqu'à la fin de la période payée.",
  },
  {
    q: "Vous prenez les paiements en CFA / Naira / Cedis ?",
    a: "Pour l'instant USD via Stripe (Visa/MC/Amex). Q3 2026 : Orange Money, MTN MoMo, Wave, Flutterwave Naira, Cedis, Rand.",
  },
  {
    q: "Y a-t-il un support en français ?",
    a: "Oui. L'interface est multilingue (FR, EN, AR) et le support 24/7 répond en français, anglais et arabe.",
  },
];

export function CfxFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-28">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <span className="cfx-pill mb-5">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </span>
          <h2 className="font-cfx text-[36px] md:text-[48px] leading-[1.05] font-bold tracking-[-0.02em] text-white">
            Questions{" "}
            <span className="cfx-text-gradient">fréquentes</span>.
          </h2>
        </div>

        <div className="cfx-glass rounded-2xl divide-y divide-white/[0.06]">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[15px] font-semibold text-white">
                    {it.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#A5B4CC] flex-shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-[14px] text-[#A5B4CC] leading-relaxed">
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
