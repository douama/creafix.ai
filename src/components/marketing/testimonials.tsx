import { createClient } from "@/lib/supabase/server";
import { TestimonialsMarquee, type Review } from "./testimonials-marquee";
import type { PlatformId } from "@/lib/platforms";

/**
 * Server component — fetch dynamiquement les témoignages depuis
 * monetiq.testimonials, fallback hardcoded si vide ou erreur.
 * Éditable depuis /admin/testimonials.
 */
export const revalidate = 60; // ISR : refresh toutes les 60s

type Row = {
  name: string;
  role: string;
  country: string;
  avatar_url: string | null;
  quote: string;
  rating: number;
  platforms: string[];
  metric: string;
  active: boolean;
  sort_order: number;
};

const FALLBACK_REVIEWS: Review[] = [
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
];

export async function Testimonials() {
  let reviews: Review[] = FALLBACK_REVIEWS;
  try {
    const sb = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (sb.from("testimonials") as any)
      .select("name, role, country, avatar_url, quote, rating, platforms, metric, active, sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      reviews = (data as Row[]).map((r) => ({
        name: r.name,
        role: r.role,
        country: r.country,
        avatar: r.avatar_url ?? "",
        quote: r.quote,
        rating: r.rating,
        platforms: r.platforms as PlatformId[],
        metric: r.metric,
      }));
    }
  } catch {
    // fallback silencieux
  }

  return <TestimonialsMarquee reviews={reviews} />;
}
