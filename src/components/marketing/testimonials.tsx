"use client";

import Image from "next/image";
import { Quote, Star, TrendingUp, Verified } from "lucide-react";
import { useTranslations } from "next-intl";
import { PlatformIcon, PLATFORM_BRAND_COLORS } from "@/components/brand/platform-icon";
import type { PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/utils";

type Review = {
  name: string;
  role: string;
  country: string;
  avatar: string;
  quote: string;
  rating: number;
  platforms: PlatformId[];
  metric: string;
};

const REVIEWS: Review[] = [
  {
    name: "Aïssata Diop",
    role: "TikTokeuse cuisine",
    country: "🇨🇮 Abidjan",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "En 2 semaines, mon RPM a triplé. CreaFix AI m'a dit exactement quels sons éviter et quels hooks utiliser.",
    rating: 5,
    platforms: ["TIKTOK", "INSTAGRAM"],
    metric: "RPM ×3 en 14 j",
  },
  {
    name: "Ibrahim Sow",
    role: "Page Facebook actualité",
    country: "🇸🇳 Dakar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "On était démonétisés à cause du copyright. Le rapport IA a identifié 14 vidéos à corriger. Réactivé sous 9 jours.",
    rating: 5,
    platforms: ["FACEBOOK"],
    metric: "Démonétisation levée en 9 j",
  },
  {
    name: "Chinedu Okeke",
    role: "Agency owner",
    country: "🇳🇬 Lagos",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "White-label mode is a game changer. Our client reports went 10× more pro. We signed 5 new contracts because of it.",
    rating: 5,
    platforms: ["YOUTUBE", "TIKTOK", "INSTAGRAM"],
    metric: "+5 contrats agence",
  },
  {
    name: "Fatou Ndiaye",
    role: "Beauty creator",
    country: "🇸🇳 Dakar",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "Le Shadowban Detector m'a sauvée. J'ai compris que TikTok bloquait mes vidéos à cause de hashtags interdits.",
    rating: 5,
    platforms: ["TIKTOK", "INSTAGRAM"],
    metric: "Reach +280% post-fix",
  },
  {
    name: "Kwame Mensah",
    role: "YouTube tech reviewer",
    country: "🇬🇭 Accra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "RPM Predictor nailed my YouTube earnings within 8%. I now know which thumbnails to A/B test before publishing.",
    rating: 5,
    platforms: ["YOUTUBE"],
    metric: "CTR +47% avec auto-fix",
  },
  {
    name: "Mariam Traoré",
    role: "Fashion influencer",
    country: "🇲🇱 Bamako",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "Le Trend Engine africain est le seul qui propose vraiment des hashtags de chez nous. Ma niche mode locale explose.",
    rating: 5,
    platforms: ["INSTAGRAM", "TIKTOK"],
    metric: "+85K abonnés en 60 j",
  },
  {
    name: "Zara Adesanya",
    role: "Lifestyle vlogger",
    country: "🇳🇬 Lagos",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "AI Content Repair rewrote my weak hooks. The new versions went viral — 2.4M views on a single Reel.",
    rating: 5,
    platforms: ["INSTAGRAM", "YOUTUBE"],
    metric: "2.4M vues sur 1 Reel",
  },
  {
    name: "Sadio Diallo",
    role: "Football content",
    country: "🇸🇳 Dakar",
    avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "Je publie sur 4 plateformes à la fois. CreaFix me dit où je gagne le plus — j'ai pivoté vers YouTube et triplé mes revenus.",
    rating: 5,
    platforms: ["YOUTUBE", "TIKTOK", "FACEBOOK", "X"],
    metric: "Revenus ×3 après pivot",
  },
  {
    name: "Hamza Benali",
    role: "Crypto creator",
    country: "🇲🇦 Casablanca",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "Le Viral Score AI me donne le go/no-go avant de publier. Plus jamais de vidéo morte. Mon ratio passe à 70%.",
    rating: 5,
    platforms: ["TIKTOK", "X", "YOUTUBE"],
    metric: "70% de vidéos virales",
  },
  {
    name: "Lily Mbarga",
    role: "Comedy & sketches",
    country: "🇨🇲 Yaoundé",
    avatar: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "Mode Agence ouvert pour gérer mon mari + mes 3 cousines créatrices. Un seul abonnement pour la famille entière.",
    rating: 5,
    platforms: ["TIKTOK", "FACEBOOK", "INSTAGRAM"],
    metric: "4 créateurs gérés",
  },
];

// Distribue les reviews sur 3 colonnes
const COLS = [
  REVIEWS.filter((_, i) => i % 3 === 0),
  REVIEWS.filter((_, i) => i % 3 === 1),
  REVIEWS.filter((_, i) => i % 3 === 2),
];

export function Testimonials() {
  const t = useTranslations("testimonials");

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
            4.9 / 5 · 2 300+ créateurs
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
              <b className="text-foreground">{REVIEWS.length}</b> avis vérifiés
            </span>
          </div>
        </div>

        <div className="relative mt-10 h-[640px] overflow-hidden md:h-[720px]">
          {/* Fade haut + bas pour effet infini */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-background to-transparent" />

          <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLS.map((col, i) => (
              <div key={i} className="relative h-full overflow-hidden">
                <div
                  className={cn(
                    "marquee-pause flex flex-col gap-4 will-change-transform",
                    i === 1 ? "marquee-down marquee-slow" : "marquee-up",
                    i === 2 && "marquee-slow",
                    // Cache la 2e/3e colonne sur mobile (1 seule colonne)
                    i === 1 && "hidden sm:flex",
                    i === 2 && "hidden lg:flex",
                  )}
                >
                  {/* Duplique pour boucle infinie */}
                  {[...col, ...col].map((r, idx) => (
                    <ReviewCard key={`${r.name}-${idx}`} review={r} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const primaryColor = PLATFORM_BRAND_COLORS[review.platforms[0]];

  return (
    <article className="no-lg-glass group relative shrink-0 overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl dark:bg-card">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <Quote className="h-5 w-5 shrink-0 text-[#7B61FF]/50" strokeWidth={2} />
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
            <Image
              src={review.avatar}
              alt={review.name}
              fill
              sizes="36px"
              className="rounded-full object-cover ring-2 ring-background"
            />
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
