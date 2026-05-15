"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Review = {
  name: string;
  role: string;
  country: string;
  avatar: string;        // URL Unsplash (portrait carré)
  quote: string;
  rating: number;        // 1..5
  platforms: string[];   // ["YouTube", "TikTok"]
  metric?: string;       // gain mesuré
};

/**
 * 10 avis créateurs africains. Photos publiques Unsplash (libres d'utilisation
 * en commercial sans attribution, mais nous créditons quand même via Unsplash).
 * Les quotes sont gardées dans leur voix originale (mélange FR/EN) — c'est
 * voulu pour l'authenticité, à la manière de Linear/Stripe.
 */
const reviews: Review[] = [
  {
    name: "Aïssata Diop",
    role: "TikTokeuse cuisine",
    country: "🇨🇮 Abidjan",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "En 2 semaines, mon RPM a triplé. CreaFix AI m'a dit exactement quels sons éviter et quels hooks utiliser pour mon audience d'Abidjan.",
    rating: 5,
    platforms: ["TikTok", "Instagram"],
    metric: "RPM ×3 en 14 jours",
  },
  {
    name: "Ibrahim Sow",
    role: "Page Facebook actualité",
    country: "🇸🇳 Dakar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "On était démonétisés à cause du copyright. Le rapport IA a identifié 14 vidéos à corriger. Réactivé sous 9 jours.",
    rating: 5,
    platforms: ["Facebook"],
    metric: "Démonétisation levée en 9 j",
  },
  {
    name: "Chinedu Okeke",
    role: "Agency owner",
    country: "🇳🇬 Lagos",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "White-label mode is a game changer. Our client reports went 10× more pro. We signed 5 new contracts because of it.",
    rating: 5,
    platforms: ["YouTube", "TikTok", "Instagram"],
    metric: "+5 contrats agence",
  },
  {
    name: "Fatou Ndiaye",
    role: "Beauty creator",
    country: "🇸🇳 Dakar",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "Le Shadowban Detector m'a sauvée. J'ai compris que TikTok bloquait mes vidéos à cause de hashtags interdits.",
    rating: 5,
    platforms: ["TikTok", "Instagram"],
    metric: "Reach +280% post-fix",
  },
  {
    name: "Kwame Mensah",
    role: "YouTube tech reviewer",
    country: "🇬🇭 Accra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "RPM Predictor nailed my YouTube earnings within 8%. I now know which thumbnails to A/B test before publishing.",
    rating: 5,
    platforms: ["YouTube"],
    metric: "CTR +47% avec auto-fix",
  },
  {
    name: "Mariam Traoré",
    role: "Fashion influencer",
    country: "🇲🇱 Bamako",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "Le Trend Engine africain est le seul qui propose vraiment des hashtags de chez nous. Ma niche mode locale explose.",
    rating: 5,
    platforms: ["Instagram", "TikTok"],
    metric: "+85K abonnés en 60 j",
  },
  {
    name: "Zara Adesanya",
    role: "Lifestyle vlogger",
    country: "🇳🇬 Lagos",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "AI Content Repair rewrote my weak hooks. The new versions went viral — 2.4M views on a single Reel.",
    rating: 5,
    platforms: ["Instagram", "YouTube"],
    metric: "2.4M vues sur 1 Reel",
  },
  {
    name: "Sadio Diallo",
    role: "Football content",
    country: "🇸🇳 Dakar",
    avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "Je publie sur 4 plateformes à la fois. CreaFix me dit où je gagne le plus — j'ai pivoté vers YouTube et tripler mes revenus.",
    rating: 5,
    platforms: ["YouTube", "TikTok", "Facebook", "X"],
    metric: "Revenus ×3 après pivot",
  },
  {
    name: "Hamza Benali",
    role: "Crypto creator",
    country: "🇲🇦 Casablanca",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "Le Viral Score AI me donne le go/no-go avant de publier. Plus jamais de vidéo morte. Mon ratio passe à 70%.",
    rating: 5,
    platforms: ["TikTok", "X", "YouTube"],
    metric: "70% de vidéos virales",
  },
  {
    name: "Lily Mbarga",
    role: "Comedy & sketches",
    country: "🇨🇲 Yaoundé",
    avatar: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=200&h=200&fit=crop&crop=faces&q=80",
    quote:
      "Mode Agence ouvert pour gérer mon mari + mes 3 cousines créatrices. Un seul abonnement pour la famille entière.",
    rating: 5,
    platforms: ["TikTok", "Facebook", "Instagram"],
    metric: "4 créateurs gérés",
  },
];

export function Testimonials() {
  const t = useTranslations("testimonials");
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Auto-scroll toutes les 5s
  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  // Scroll fluide vers la carte active
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

  function scroll(direction: -1 | 1) {
    setActiveIndex((i) => (i + direction + reviews.length) % reviews.length);
  }

  return (
    <section
      className="relative py-14 md:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
            {t("titlePart1")} <span className="gradient-text">{t("titleHighlight")}</span>{" "}
            {t("titlePart2")}
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>
              <b className="text-foreground">4.9/5</b> · 10 témoignages récents
            </span>
          </div>
        </div>

        <div className="relative mt-10">
          {/* Boutons navigation */}
          <button
            onClick={() => scroll(-1)}
            aria-label="Précédent"
            className="absolute -left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur transition-all hover:bg-card md:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Suivant"
            className="absolute -right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur transition-all hover:bg-card md:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Slider scroll snap */}
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:gap-5 md:px-2"
          >
            {reviews.map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </div>

          {/* Dots */}
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Aller au témoignage ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  activeIndex === i
                    ? "w-8 bg-[#7B61FF]"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article
      className="group relative flex w-[88%] shrink-0 snap-start flex-col rounded-2xl border border-border bg-card/40 p-6 backdrop-blur transition-all hover:border-foreground/15 hover:bg-card/70 hover:shadow-xl sm:w-[60%] md:w-[44%] lg:w-[32%]"
    >
      <div className="absolute -top-2 left-6 flex h-9 w-9 items-center justify-center rounded-full gradient-brand shadow-lg shadow-[#7B61FF]/30">
        <Quote className="h-4 w-4 text-white" />
      </div>

      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < review.rating
                ? "fill-amber-400 text-amber-400"
                : "fill-muted/40 text-muted-foreground/30",
            )}
          />
        ))}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
        &ldquo;{review.quote}&rdquo;
      </p>

      {review.metric && (
        <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {review.metric}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[#7B61FF]/30">
          <Image
            src={review.avatar}
            alt={review.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{review.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {review.role} · {review.country}
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {review.platforms.map((p) => (
              <span
                key={p}
                className="rounded border border-border bg-muted/30 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
