"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CurrencySwitch } from "@/components/currency-switch";
import { CURRENCIES, getPrice, type CurrencyCode, type Plan } from "@/lib/pricing";

const PLAN_KEYS: { key: Plan; href: string; highlight?: boolean; features: number }[] = [
  { key: "free",       href: "/signup",                  features: 5 },
  { key: "pro",        href: "/signup?plan=pro",         highlight: true, features: 8 },
  { key: "agency",     href: "/signup?plan=agency",      features: 8 },
  { key: "enterprise", href: "/contact?topic=enterprise", features: 8 },
];

export function PricingTable({ currency }: { currency: CurrencyCode }) {
  const t = useTranslations("pricing");
  const c = CURRENCIES[currency];

  return (
    <section id="pricing" className="relative py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>
            {t("titlePart2")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("subtitle")}</p>

          {/* Promo + selector devise */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-500 dark:text-emerald-300">
              <Sparkles className="h-3 w-3" /> {t("promo")}
            </div>
            <CurrencySwitch currency={currency} />
          </div>

          {/* Indicateur devise détectée */}
          <p className="mt-2 text-[11px] text-muted-foreground">
            Prix affichés en <b className="text-foreground">{c.label}</b> ({c.code}){" "}
            {c.flag} · ajusté à ton marché
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PLAN_KEYS.map((plan) => {
            const price =
              plan.key === "enterprise" ? t(`enterprise.price`) : getPrice(plan.key, currency);
            const features = Array.from({ length: plan.features }, (_, i) =>
              t(`${plan.key}.f${i + 1}` as any),
            );

            return (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-xl transition-all ${
                  plan.highlight
                    ? "border-[#7B61FF]/50 bg-gradient-to-b from-[#7B61FF]/[0.08] to-transparent shadow-2xl shadow-[#7B61FF]/20"
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
                <h3 className="font-display text-xl font-bold">{t(`${plan.key}.name`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`${plan.key}.desc`)}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-bold leading-none md:text-4xl">
                    {price}
                  </span>
                  {plan.key !== "enterprise" && (
                    <span className="text-sm text-muted-foreground">
                      {t(`${plan.key}.unit`)}
                    </span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={plan.highlight ? "brand" : "outline"}
                  className="mt-7 w-full"
                >
                  <Link href={plan.href}>{t(`${plan.key}.cta`)}</Link>
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
