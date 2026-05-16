import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://creafix-ai.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/dashboard",
          "/dashboard/",
          "/checkout",
          "/checkout/",
          "/login",
          "/onboarding",
        ],
      },
      // Bloque les bots AI scrapers agressifs (configurable)
      { userAgent: "GPTBot",          disallow: ["/dashboard", "/admin"] },
      { userAgent: "CCBot",           disallow: ["/dashboard", "/admin"] },
      { userAgent: "ChatGPT-User",    disallow: ["/dashboard", "/admin"] },
      { userAgent: "Google-Extended", disallow: ["/dashboard", "/admin"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
