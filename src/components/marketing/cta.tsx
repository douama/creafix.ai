"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function CTA() {
  const t = useTranslations("cta");

  return (
    <section className="relative py-14 md:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] border border-border p-8 md:p-12">
          <div className="absolute inset-0 -z-10 gradient-brand opacity-90" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-[#FF8A00]/40 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight text-white text-balance md:text-4xl">
                {t("title1")}
                <br />
                {t("title2")}
              </h2>
              <p className="mt-4 max-w-md text-white/85">{t("subtitle")}</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button asChild size="xl" className="group bg-black text-white hover:bg-black/90">
                <Link href="/signup">
                  {t("button")}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <span className="text-xs text-white/70">{t("trust")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
