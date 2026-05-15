"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  const t = useTranslations("cta");

  return (
    <section className="relative py-10 md:py-14">
      {/* Container par défaut 1280px (Tailwind container) */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/30"
        >
          {/* 1. Image de fond ultra réaliste — studio créateur Africain au crépuscule */}
          <Image
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=2000&q=85&auto=format&fit=crop"
            alt=""
            fill
            priority={false}
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />

          {/* 2. Overlay sombre uniforme pour la lisibilité (40% en haut, 65% en bas) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/75" />

          {/* 3. Gradient brand teinté (multiply) — apporte la signature couleur sans masquer */}
          <div
            className="absolute inset-0 mix-blend-soft-light"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #7B61FF 0%, #00C2FF 50%, #FF8A00 100%)",
            }}
          />

          {/* 4. Glow blobs colorés (atmosphère) */}
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#FF8A00]/30 blur-3xl" />
          <div className="pointer-events-none absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-[#00C2FF]/30 blur-3xl" />

          {/* 5. Vignette pour focus central (dégradé radial sombre sur les coins) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />

          {/* 6. Grid pattern très subtle */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* ─── Contenu ─── */}
          <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center md:flex-row md:justify-between md:gap-10 md:px-14 md:py-14 md:text-left">
            <div className="flex-1">
              {/* Badge eyebrow */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                <Sparkles className="h-3 w-3" /> Audit IA · 60 s · 0 carte
              </div>

              {/* Titre — drop-shadow pour la lisibilité sur l'image */}
              <h2
                className="mt-3 font-display text-3xl font-bold leading-[1.05] text-white text-balance md:text-4xl lg:text-5xl"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}
              >
                {t("title1")}{" "}
                <span className="block md:inline">{t("title2")}</span>
              </h2>

              {/* Subtitle */}
              <p
                className="mt-3 max-w-md text-sm text-white/95 md:text-base"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
              >
                {t("subtitle")}
              </p>

              {/* Trust pills */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-white md:justify-start">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <b className="ml-1 text-sm">4.9</b>
                </span>
                <span className="text-white/60">·</span>
                <span>
                  <b>2 300+</b> créateurs
                </span>
                <span className="text-white/60">·</span>
                <span>
                  <b>9</b> plateformes
                </span>
                <span className="text-white/60">·</span>
                <span>
                  <b>9</b> pays
                </span>
              </div>
            </div>

            {/* CTA bouton + rassurance */}
            <div className="flex shrink-0 flex-col items-center gap-2 md:items-end">
              <Button
                asChild
                size="lg"
                className="group h-13 bg-black px-7 py-4 text-base font-semibold text-white shadow-2xl shadow-black/40 transition-all hover:scale-105 hover:bg-black/90"
              >
                <Link href="/signup">
                  {t("button")}
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <span
                className="text-[11px] text-white/85"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
              >
                Aucune carte · annulable à tout moment
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
