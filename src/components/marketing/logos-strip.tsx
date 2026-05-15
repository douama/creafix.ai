"use client";

import { useTranslations } from "next-intl";

export function LogosStrip() {
  const t = useTranslations("logos");

  const items = [
    "Facebook",
    "TikTok",
    "Instagram",
    "Wave",
    "Orange Money",
    "MTN MoMo",
    "Moov Money",
    "Stripe",
    "PayPal",
  ];

  return (
    <section className="border-y border-border/60 py-7">
      <div className="container">
        <p className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {t("headline")}
        </p>
        <div className="mt-4 grid grid-cols-3 items-center gap-y-3 sm:grid-cols-5 md:grid-cols-9">
          {items.map((i) => (
            <div
              key={i}
              className="text-center font-display text-sm font-semibold text-muted-foreground/80"
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
