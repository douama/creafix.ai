"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CURRENCIES, formatPrice, type CurrencyCode, type Plan } from "@/lib/pricing";

const PLAN_KEYS: { key: Plan; href: string; highlight?: boolean; enterpriseBadge?: boolean; features: number }[] = [
  { key: "free",       href: "/signup",                        features: 5 },
  { key: "pro",        href: "/checkout?plan=PRO",              highlight: true, features: 8 },
  { key: "agency",     href: "/checkout?plan=AGENCY",           features: 8 },
  { key: "enterprise", href: "/checkout?plan=ENTERPRISE",       enterpriseBadge: true, features: 8 },
];

type Period = "month" | "year";

export function PricingTable({ currency }: { currency: CurrencyCode }) {
  const t = useTranslations("pricing");
  const [period, setPeriod] = useState<Period>("month");

  return (
    <section id="pricing" className="relative py-10 md:py-14">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>
            {t("titlePart2")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("subtitle")}</p>

          {/* Promo badge */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-500 dark:text-emerald-300">
              <Sparkles className="h-3 w-3" /> {t("promo")}
            </div>
          </div>

          {/* ─── Toggle Mensuel / Annuel ─── */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setPeriod("month")}
              className={[
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                period === "month"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              aria-pressed={period === "month"}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setPeriod("year")}
              className={[
                "relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                period === "year"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              aria-pressed={period === "year"}
            >
              Annuel
              <span
                className={[
                  "ml-1.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider",
                  period === "year"
                    ? "bg-[#FCD34D] text-[#0F0F0F]"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
                ].join(" ")}
              >
                −2 mois
              </span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLAN_KEYS.map((plan) => {
            const isFreePlan = plan.key === "free";

            // ── Calcul prix selon period ──
            // Annuel = mensuel × 10 (2 mois offerts sur 12)
            const monthlyAmount = CURRENCIES[currency].pricing[plan.key];
            const yearlyAmount = monthlyAmount * 10;
            const displayAmount = isFreePlan
              ? 0
              : period === "year"
                ? yearlyAmount
                : monthlyAmount;

            const price = isFreePlan
              ? formatPrice(0, currency)
              : formatPrice(displayAmount, currency);

            const unit = isFreePlan
              ? t("free.unit")
              : period === "year"
                ? "/an"
                : "/mois";

            // ── Sous-ligne sous le prix ──
            const subPrice = period === "year" && !isFreePlan
              ? `Soit ${formatPrice(Math.round(yearlyAmount / 12), currency)} / mois`
              : !isFreePlan && period === "month"
                ? "Essai 7 jours · Sans carte"
                : null;

            // ── CTA href avec période ──
            const ctaHref =
              !isFreePlan && period === "year"
                ? `${plan.href}&period=year`
                : plan.href;

            const features = Array.from({ length: plan.features }, (_, i) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              t(`${plan.key}.f${i + 1}` as any),
            );

            return (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-xl transition-all ${
                  plan.highlight
                    ? "border-[#EC4899]/50 bg-gradient-to-b from-[#EC4899]/[0.08] to-transparent shadow-2xl shadow-[#EC4899]/20"
                    : plan.enterpriseBadge
                      ? "border-[#1FBEAF]/40 bg-gradient-to-b from-[#1FBEAF]/[0.07] to-transparent shadow-xl shadow-[#1FBEAF]/10"
                      : "border-border bg-card/40"
                }`}
              >
                {plan.highlight && (
                  <Badge
                    variant="brand"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    {t("mostPopular")}
                  </Badge>
                )}
                {plan.enterpriseBadge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap inline-flex items-center gap-1 rounded-full border border-[#1FBEAF]/50 bg-[#1FBEAF]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1FBEAF]">
                    <Star className="h-2.5 w-2.5 fill-current" /> Médias & Plateformes
                  </div>
                )}
                <h3 className="font-display text-xl font-bold">{t(`${plan.key}.name`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`${plan.key}.desc`)}</p>

                <div className="mt-5">
                  <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                    <span className="font-display text-2xl font-bold leading-none md:text-3xl">
                      {price}
                    </span>
                    {unit && (
                      <span className="text-xs text-muted-foreground md:text-sm">
                        {unit}
                      </span>
                    )}
                  </div>
                  {subPrice && (
                    <div className={`mt-1 text-[11px] ${period === "month" && !isFreePlan ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                      {subPrice}
                    </div>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.enterpriseBadge ? "text-[#1FBEAF]" : "text-emerald-500"}`} />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={plan.highlight ? "brand" : "outline"}
                  className={`mt-7 w-full ${plan.enterpriseBadge ? "border-[#1FBEAF]/50 text-[#1FBEAF] hover:bg-[#1FBEAF]/10" : ""}`}
                >
                  <Link href={ctaHref}>{t(`${plan.key}.cta`)}</Link>
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>{t("paymentsAccepted")}</span>
          {["Stripe", "PayPal", "Wave", "Orange Money", "MTN MoMo", "Moov Money"].map((m) => (
            <span
              key={m}
              className="rounded-full border border-border bg-card/50 px-2.5 py-1"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
