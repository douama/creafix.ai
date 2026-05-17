import { TestimonialsMarquee, type Review } from "./testimonials-marquee";
import type { PlatformId } from "@/lib/platforms";

/**
 * Server component — fetch dynamiquement les témoignages depuis
 * public.testimonials (VIEW security_invoker=false vers monetiq.testimonials).
 * Fallback hardcoded 3 reviews si DB vide/erreur.
 * Éditable depuis /admin/testimonials.
 *
 * Pourquoi raw fetch et pas supabase-js : le client server avec
 * db.schema=monetiq + PostgREST Accept-Profile a un bug récurrent
 * qui retournait 0 row alors que la VIEW publique fonctionne.
 */
export const revalidate = 60; // ISR 1min : push admin → landing

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

async function fetchTestimonials(): Promise<Review[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[testimonials] env vars manquantes — fallback hardcoded");
    return FALLBACK_REVIEWS;
  }

  try {
    // Query la VIEW public.testimonials (security_invoker=false → bypass RLS via owner)
    // ?active=eq.true&order=sort_order.asc
    const res = await fetch(
      `${url}/rest/v1/testimonials?select=name,role,country,avatar_url,quote,rating,platforms,metric,active,sort_order&active=eq.true&order=sort_order.asc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.error(`[testimonials] PostgREST ${res.status}:`, await res.text());
      return FALLBACK_REVIEWS;
    }

    const rows = (await res.json()) as Row[];
    console.log(`[testimonials] fetched ${rows.length} rows from DB`);

    if (rows.length === 0) return FALLBACK_REVIEWS;

    return rows.map((r) => ({
      name: r.name,
      role: r.role,
      country: r.country,
      avatar: r.avatar_url ?? "",
      quote: r.quote,
      rating: r.rating,
      platforms: r.platforms as PlatformId[],
      metric: r.metric,
    }));
  } catch (e) {
    console.error("[testimonials] fetch error:", (e as Error).message);
    return FALLBACK_REVIEWS;
  }
}

export async function Testimonials() {
  const reviews = await fetchTestimonials();
  return <TestimonialsMarquee reviews={reviews} />;
}
