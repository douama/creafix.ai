"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { PlatformIcon, PLATFORM_BRAND_COLORS } from "@/components/brand/platform-icon";
import type { PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/utils";

type Review = {
  name: string;
  role: string;
  country: string;       // 🇸🇳 Dakar
  avatar: string;        // URL Unsplash
  quote: string;
  rating: number;
  platforms: PlatformId[];
  metric: string;
};

const reviews: Review[] = [
  {
    name: "Aïssata Diop",
    role: "TikTokeuse cuisine",
    country: "🇨🇮 Abidjan",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces&q=80",
    quote: "En 2 semaines, mon RPM a triplé. CreaFix AI m'a dit exactement quels sons éviter et quels hooks utiliser.",
    rating: 5,
    platforms: ["TIKTOK", "INSTAGRAM"],
    metric: "RPM ×3 en 14 jours",
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
    quote: "Je publie sur 4 plateformes à la fois. CreaFix me dit où je gagne le plus — j'ai pivoté vers YouTube et tripler mes revenus.",
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

export function Testimonials() {
  const t = useTranslations("testimonials");
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[activeIndex] as HTMLElement | undefined;
    if (card) {
      el.scrollTo({
        left: card.offsetLeft - el.offsetLeft - 16,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <section
      className="relative overflow-hidden py-14 md:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Halo d'ambiance */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-50 blur-3xl" />

      <div className="container">
        {/* Header premium */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-300">
            <Star className="h-3 w-3 fill-amber-500" />
            4.9 / 5 — Trusted by creators
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>{" "}
            {t("titlePart2")}
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <b className="text-foreground">4.9/5</b>
            </span>
            <span>·</span>
            <span><b className="text-foreground">2 300+</b> créateurs</span>
            <span>·</span>
            <span><b className="text-foreground">9 pays</b> couverts</span>
            <span>·</span>
            <span><b className="text-foreground">10</b> témoignages récents</span>
          </div>
        </div>

        <div className="relative mt-12">
          {/* Boutons navigation flottants */}
          <button
            onClick={() => setActiveIndex((i) => (i - 1 + reviews.length) % reviews.length)}
            aria-label="Précédent"
            className="absolute -left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-lg backdrop-blur transition-all hover:scale-110 hover:bg-card hover:shadow-xl md:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setActiveIndex((i) => (i + 1) % reviews.length)}
            aria-label="Suivant"
            className="absolute -right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-lg backdrop-blur transition-all hover:scale-110 hover:bg-card hover:shadow-xl md:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Fade edges (gauche + droite) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-24" />

          {/* Slider */}
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:px-8"
          >
            {reviews.map((r, i) => (
              <ReviewCard key={r.name} review={r} isActive={i === activeIndex} />
            ))}
          </div>

          {/* Progress dots */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Aller au témoignage ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeIndex === i
                    ? "w-10 bg-gradient-to-r from-[#7B61FF] to-[#FF8A00]"
                    : "w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="mt-2 text-center text-xs text-muted-foreground">
            <span className="font-mono">
              <b className="text-foreground">{String(activeIndex + 1).padStart(2, "0")}</b> / {String(reviews.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, isActive }: { review: Review; isActive: boolean }) {
  const primaryColor = PLATFORM_BRAND_COLORS[review.platforms[0]];

  return (
    <article
      className={cn(
        "group relative flex w-[90%] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border bg-card/40 backdrop-blur transition-all duration-500 sm:w-[65%] md:w-[48%] lg:w-[36%]",
        isActive
          ? "border-foreground/30 bg-card/70 shadow-2xl shadow-[#7B61FF]/10 scale-100"
          : "border-border opacity-75 scale-95 hover:opacity-100",
      )}
    >
      {/* Halo de couleur primaire de la plateforme principale */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Top accent bar gradient */}
      <div className="h-1 w-full gradient-brand" />

      <div className="flex flex-col gap-4 p-6">
        {/* Header : guillemet + étoiles + plateformes */}
        <div className="flex items-start justify-between gap-3">
          <Quote className="h-7 w-7 shrink-0 text-[#7B61FF]/40" strokeWidth={1.5} />
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted/40 text-muted-foreground/30",
                )}
              />
            ))}
          </div>
        </div>

        {/* Quote */}
        <p className="flex-1 text-[15px] leading-relaxed text-foreground/90">
          &ldquo;{review.quote}&rdquo;
        </p>

        {/* Metric chip */}
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500 dark:text-emerald-300">
          <TrendingUp className="h-3 w-3" />
          {review.metric}
        </div>

        {/* Footer : profil + plateformes officielles */}
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <div className="relative h-12 w-12 shrink-0">
            <div
              className="absolute -inset-0.5 rounded-full opacity-60 blur-sm"
              style={{ backgroundColor: primaryColor }}
            />
            <Image
              src={review.avatar}
              alt={review.name}
              fill
              sizes="48px"
              className="relative rounded-full object-cover ring-2 ring-background"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{review.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {review.role} · {review.country}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              {review.platforms.map((p) => (
                <PlatformIcon
                  key={p}
                  id={p}
                  className="h-3.5 w-3.5"
                  style={{ color: PLATFORM_BRAND_COLORS[p] }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
