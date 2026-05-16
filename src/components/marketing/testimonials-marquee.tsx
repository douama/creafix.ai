"use client";

import Image from "next/image";
import { Quote, Star, TrendingUp, Verified } from "lucide-react";
import { useTranslations } from "next-intl";
import { PlatformIcon, PLATFORM_BRAND_COLORS } from "@/components/brand/platform-icon";
import type { PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/utils";

export type Review = {
  name: string;
  role: string;
  country: string;
  avatar: string;
  quote: string;
  rating: number;
  platforms: PlatformId[];
  metric: string;
};

/**
 * Marquee 3-colonnes (scroll infini) — partie client de Testimonials.
 * Reçoit les reviews depuis le server component (fetch DB).
 */
export function TestimonialsMarquee({ reviews }: { reviews: Review[] }) {
  const t = useTranslations("testimonials");

  // Distribue les reviews sur 3 colonnes
  const cols = [
    reviews.filter((_, i) => i % 3 === 0),
    reviews.filter((_, i) => i % 3 === 1),
    reviews.filter((_, i) => i % 3 === 2),
  ];

  // Si une colonne est vide ou très courte, on ne duplique pas (sinon trous).
  const safeCols = cols.map((c) => (c.length > 0 ? c : null));

  return (
    <section
      id="temoignages"
      className="relative isolate overflow-hidden py-10 md:py-14"
      style={{ background: "#FFFFFF" }}
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-300">
            <Star className="h-3 w-3 fill-amber-500" />
            4.9 / 5 · {reviews.length}+ créateurs
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>{" "}
            {t("titlePart2")}
          </h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
              <b className="ml-0.5 text-foreground">4.9/5</b>
            </span>
            <span>·</span>
            <span>
              <b className="text-foreground">9 pays</b> couverts
            </span>
            <span>·</span>
            <span>
              <b className="text-foreground">{reviews.length}</b> avis vérifiés
            </span>
          </div>
        </div>

        <div className="relative mt-10 h-[640px] overflow-hidden md:h-[720px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-background to-transparent" />

          <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {safeCols.map((col, i) =>
              col ? (
                <div key={i} className="relative h-full overflow-hidden">
                  <div
                    className={cn(
                      "marquee-pause flex flex-col gap-4 will-change-transform",
                      i === 1 ? "marquee-down marquee-slow" : "marquee-up",
                      i === 2 && "marquee-slow",
                      i === 1 && "hidden sm:flex",
                      i === 2 && "hidden lg:flex",
                    )}
                  >
                    {[...col, ...col].map((r, idx) => (
                      <ReviewCard key={`${r.name}-${idx}`} review={r} />
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const primaryColor = review.platforms[0] ? PLATFORM_BRAND_COLORS[review.platforms[0]] : "#EC4899";

  return (
    <article className="no-lg-glass group relative shrink-0 overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl dark:bg-card">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <Quote className="h-5 w-5 shrink-0 text-[#EC4899]/50" strokeWidth={2} />
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted/40 text-muted-foreground/30",
                )}
              />
            ))}
          </div>
        </div>

        <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/90">
          “{review.quote}”
        </p>

        <div className="mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 dark:text-emerald-300">
          <TrendingUp className="h-2.5 w-2.5" />
          {review.metric}
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-3">
          <div className="relative h-9 w-9 shrink-0">
            {review.avatar ? (
              <Image
                src={review.avatar}
                alt={review.name}
                fill
                sizes="36px"
                className="rounded-full object-cover ring-2 ring-background"
                unoptimized
              />
            ) : (
              <div className="grid h-full w-full place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground ring-2 ring-background">
                {review.name[0]}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 truncate text-xs font-semibold">
              {review.name}
              <Verified className="h-3 w-3 shrink-0 fill-[#FF8A00] text-background dark:text-background" />
            </div>
            <div className="truncate text-[10px] text-muted-foreground">
              {review.role} · {review.country}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {review.platforms.slice(0, 3).map((p) => (
              <PlatformIcon
                key={p}
                id={p}
                className="h-3 w-3"
                style={{ color: PLATFORM_BRAND_COLORS[p] }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
