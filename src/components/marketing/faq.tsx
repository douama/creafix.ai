"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HelpCircle, Plus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    { q: t("items.q7"), a: t("items.a7") },
    { q: t("items.q8"), a: t("items.a8") },
  ];

  const leftCol = faqs.filter((_, i) => i % 2 === 0);
  const rightCol = faqs.filter((_, i) => i % 2 === 1);

  return (
    <section id="faq" className="relative py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#7B61FF]">
            <HelpCircle className="h-3 w-3" /> FAQ
          </div>
          <h2 className="mt-2.5 font-display text-2xl font-bold tracking-tight md:text-3xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>
            {t("titlePart2")}
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground md:text-sm">{t("subtitle")}</p>
        </div>

        <div className="mt-7 grid gap-2.5 md:grid-cols-2">
          {[leftCol, rightCol].map((col, colIdx) => (
            <div key={colIdx} className="space-y-2.5">
              {col.map((f, i) => {
                const globalIdx = colIdx + i * 2;
                const isOpen = open === globalIdx;
                return (
                  <FAQItem
                    key={f.q}
                    question={f.q}
                    answer={f.a}
                    isOpen={isOpen}
                    onToggle={() => setOpen(isOpen ? null : globalIdx)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 px-4 py-3 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-[#FF8A00]" />
          <span className="text-muted-foreground">
            Pas trouvé ta réponse ?{" "}
            <a href="/contact" className="font-medium text-foreground underline-offset-4 hover:underline">
              Demande à notre équipe
            </a>{" "}
            — réponse moyenne 47 min.
          </span>
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  question, answer, isOpen, onToggle,
}: {
  question: string; answer: string; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl border bg-card/40 backdrop-blur-md transition-all",
        isOpen
          ? "border-[#7B61FF]/40 bg-card/70 shadow-md shadow-[#7B61FF]/10"
          : "border-border hover:border-foreground/15",
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-medium leading-tight">{question}</span>
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-background/60 transition-all duration-200",
            isOpen && "rotate-45 border-[#7B61FF]/40 bg-[#7B61FF]/15 text-[#7B61FF]",
          )}
        >
          <Plus className="h-3.5 w-3.5" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
