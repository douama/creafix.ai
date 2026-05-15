"use client";

import { useTranslations } from "next-intl";
import { platformList } from "@/lib/platforms";

export function LogosStrip() {
  const t = useTranslations("logos");

  // 9 plateformes monétisables supportées + agrégateurs paiement majeurs
  const items = [
    ...platformList.map((p) => p.name),
    "Wave",
    "Stripe",
    "Mobile Money",
  ];

  return (
    <section className="border-y border-border/60 py-8">
      <div className="container">
        <p className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {t("headline")}
        </p>
        <div className="mt-5 grid grid-cols-3 items-center gap-y-3 sm:grid-cols-6 md:grid-cols-12">
          {items.map((i) => (
            <div
              key={i}
              className="text-center font-display text-sm font-semibold text-muted-foreground/85 transition-colors hover:text-foreground"
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
