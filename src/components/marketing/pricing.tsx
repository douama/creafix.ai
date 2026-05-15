"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Plan = {
  name: string;
  price: string;
  priceUnit?: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    priceUnit: "/forever",
    desc: "Try CreaFix AI without risk.",
    features: [
      "3 free audits",
      "1 Facebook page + 1 TikTok account",
      "Basic Viral Score",
      "Limited Trend Engine (1 country)",
      "Community support",
    ],
    cta: "Start free",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "$29",
    priceUnit: "/month",
    desc: "For creators ready to scale.",
    features: [
      "Unlimited audits",
      "5 connected accounts",
      "Shadowban Detector + RPM Predictor",
      "Full African Trend Engine (9 countries)",
      "AI Content Repair (50 fixes / month)",
      "Viral Score AI before publish",
      "PDF reports exportable",
      "Priority email support",
    ],
    cta: "Start 7-day free trial",
    href: "/signup?plan=pro",
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Agency",
    price: "$99",
    priceUnit: "/month",
    desc: "Manage multiple creators in white-label.",
    features: [
      "Unlimited accounts & creators",
      "White-label & custom subdomain",
      "Shareable client links",
      "API + Webhooks",
      "Unlimited AI Content Repair",
      "WhatsApp priority support",
      "Ambassador program (30% lifetime)",
      "Dedicated account manager",
    ],
    cta: "Start 7-day free trial",
    href: "/signup?plan=agency",
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For media groups and platforms.",
    features: [
      "Unlimited everything",
      "SLA contract & 24/7 support",
      "Custom integrations",
      "On-premise option",
      "Dedicated infrastructure",
      "Custom AI models training",
      "Quarterly business reviews",
      "Multi-region compliance",
    ],
    cta: "Contact sales",
    href: "/contact?topic=enterprise",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-14 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
            Simple, <span className="gradient-text">transparent pricing</span>.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Pay in USD, EUR or African Mobile Money (Wave, Orange Money, MTN MoMo). Cancel
            anytime.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-500 dark:text-emerald-300">
            <Sparkles className="h-3 w-3" /> -50% for the first 1,000 creators
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-xl transition-all ${
                p.highlight
                  ? "border-[#7B61FF]/50 bg-gradient-to-b from-[#7B61FF]/[0.08] to-transparent shadow-2xl shadow-[#7B61FF]/20"
                  : "border-border bg-card/40"
              }`}
            >
              {p.badge && (
                <Badge variant="brand" className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {p.badge}
                </Badge>
              )}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold leading-none">{p.price}</span>
                {p.priceUnit && (
                  <span className="text-sm text-muted-foreground">{p.priceUnit}</span>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                variant={p.highlight ? "brand" : "outline"}
                className="mt-7 w-full"
              >
                <Link href={p.href}>{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Payments accepted:</span>
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
