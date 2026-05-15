"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: t("items.q1"), a: t("items.a1") },
    { q: t("items.q2"), a: t("items.a2") },
    { q: t("items.q3"), a: t("items.a3") },
    { q: t("items.q4"), a: t("items.a4") },
    { q: t("items.q5"), a: t("items.a5") },
    { q: t("items.q6"), a: t("items.a6") },
  ];

  return (
    <section id="faq" className="relative py-14 md:py-20">
      <div className="container max-w-3xl">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>
            {t("titlePart2")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-9 space-y-3">
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
