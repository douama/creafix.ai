import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Sitemap automatique — généré à chaque build + revalidé toutes les heures.
 * Inclut :
 *   - Pages statiques (landing, légales, marketing)
 *   - Outils dynamiques (/tools/[slug])
 *   - Témoignages (count agrégé, pas individuel — pas indexable)
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://creafix-ai.vercel.app";

const STATIC_ROUTES: { path: string; changeFrequency: "daily" | "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "",                changeFrequency: "weekly",  priority: 1.0 },
  { path: "/pricing",        changeFrequency: "weekly",  priority: 0.9 },
  { path: "/features",       changeFrequency: "monthly", priority: 0.9 },
  { path: "/faq",            changeFrequency: "monthly", priority: 0.7 },
  { path: "/agency",         changeFrequency: "monthly", priority: 0.7 },
  { path: "/about",          changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact",        changeFrequency: "monthly", priority: 0.5 },
  { path: "/blog",           changeFrequency: "weekly",  priority: 0.6 },
  { path: "/guides/youtube", changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides/tiktok",  changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides/facebook",changeFrequency: "monthly", priority: 0.6 },
  { path: "/partners",       changeFrequency: "monthly", priority: 0.4 },
  { path: "/mobile",         changeFrequency: "monthly", priority: 0.4 },
  { path: "/help",           changeFrequency: "monthly", priority: 0.4 },
  { path: "/status",         changeFrequency: "daily",   priority: 0.3 },
  { path: "/press",          changeFrequency: "monthly", priority: 0.3 },
  { path: "/careers",        changeFrequency: "monthly", priority: 0.3 },
  { path: "/leaderboard",    changeFrequency: "weekly",  priority: 0.5 },
  { path: "/tools",          changeFrequency: "monthly", priority: 0.6 },
  { path: "/login",          changeFrequency: "yearly",  priority: 0.3 },
  { path: "/signup",         changeFrequency: "yearly",  priority: 0.5 },
  // Légal
  { path: "/legal/privacy",  changeFrequency: "yearly",  priority: 0.2 },
  { path: "/legal/terms",    changeFrequency: "yearly",  priority: 0.2 },
  { path: "/legal/cookies",  changeFrequency: "yearly",  priority: 0.2 },
  { path: "/legal/legal",    changeFrequency: "yearly",  priority: 0.2 },
];

// Outils dynamiques (slugs)
const TOOL_SLUGS = [
  "tiktok-monetization-checker",
  "facebook-shadowban-checker",
  "creator-rpm-calculator",
];

export const revalidate = 3600; // 1h

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Outils
  for (const slug of TOOL_SLUGS) {
    entries.push({
      url: `${SITE_URL}/tools/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Témoignages : lastModified basé sur la dernière modif DB
  try {
    const sb = supabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (sb.from("testimonials") as any)
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1);
    if (data?.[0]?.updated_at) {
      // Indique au crawler que la home s'est rafraîchie (testimonials inline)
      const homeIdx = entries.findIndex((e) => e.url === SITE_URL);
      if (homeIdx >= 0) entries[homeIdx].lastModified = new Date(data[0].updated_at);
    }
  } catch {
    // ignore : sitemap doit toujours répondre
  }

  return entries;
}
