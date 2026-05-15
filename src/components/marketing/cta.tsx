"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  const t = useTranslations("cta");

  return (
    <section className="relative py-10 md:py-14">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Background gradient animé */}
          <div className="absolute inset-0 gradient-brand" />

          {/* Mesh patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.3),transparent_55%)]" />

          {/* Grid pattern subtle */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Glow blobs */}
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FF8A00]/50 blur-3xl" />
          <div className="pointer-events-none absolute -top-24 right-1/4 h-56 w-56 rounded-full bg-[#00C2FF]/40 blur-3xl" />

          {/* Content compact */}
          <div className="relative flex flex-col items-center gap-5 px-6 py-10 text-center md:flex-row md:justify-between md:gap-8 md:px-12 md:text-left">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                <Sparkles className="h-3 w-3" /> Audit IA · 60 s · 0 carte
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold leading-[1.1] text-white text-balance md:text-3xl lg:text-4xl">
                {t("title1")}{" "}
                <span className="block md:inline">{t("title2")}</span>
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/85 md:text-base">
                {t("subtitle")}
              </p>

              {/* Trust pills */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-white/90 md:justify-start">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                  <b className="ml-0.5">4.9</b>
                </span>
                <span>·</span>
                <span>
                  <b>2 300+</b> créateurs
                </span>
                <span>·</span>
                <span>
                  <b>9 plateformes</b>
                </span>
                <span>·</span>
                <span>
                  <b>9 pays</b>
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-2 md:items-end">
              <Button
                asChild
                size="lg"
                className="group h-12 bg-black px-6 text-base font-semibold text-white shadow-2xl hover:bg-black/90 hover:shadow-black/40"
              >
                <Link href="/signup">
                  {t("button")}
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <span className="text-[10px] text-white/75">
                Aucune carte · annulable à tout moment
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
