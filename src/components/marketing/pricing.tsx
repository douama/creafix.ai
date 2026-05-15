"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PlanKey = "free" | "pro" | "agency" | "enterprise";

const PLAN_DATA: Record<PlanKey, {
  price: string;
  href: string;
  highlight?: boolean;
  badge?: string;
  features: number;
}> = {
  free: { price: "$0", href: "/signup", features: 5 },
  pro: { price: "$29", href: "/signup?plan=pro", highlight: true, badge: "Most popular", features: 8 },
  agency: { price: "$99", href: "/signup?plan=agency", features: 8 },
  enterprise: { price: "Custom", href: "/contact?topic=enterprise", features: 8 },
};

export function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="relative py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>
            {t("titlePart2")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("subtitle")}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-500 dark:text-emerald-300">
            <Sparkles className="h-3 w-3" /> {t("promo")}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PLAN_DATA) as PlanKey[]).map((key) => {
            const data = PLAN_DATA[key];
            const price = key === "enterprise" ? t(`enterprise.price`) : data.price;
            const features = Array.from({ length: data.features }, (_, i) =>
              t(`${key}.f${i + 1}` as any),
            );
            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-xl transition-all ${
                  data.highlight
                    ? "border-[#7B61FF]/50 bg-gradient-to-b from-[#7B61FF]/[0.08] to-transparent shadow-2xl shadow-[#7B61FF]/20"
                    : "border-border bg-card/40"
                }`}
              >
                {data.highlight && (
                  <Badge variant="brand" className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {t("mostPopular")}
                  </Badge>
                )}
                <h3 className="font-display text-xl font-bold">{t(`${key}.name`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`${key}.desc`)}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold leading-none">{price}</span>
                  <span className="text-sm text-muted-foreground">{t(`${key}.unit`)}</span>
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
                  variant={data.highlight ? "brand" : "outline"}
                  className="mt-7 w-full"
                >
                  <Link href={data.href}>{t(`${key}.cta`)}</Link>
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
