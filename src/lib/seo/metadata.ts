import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://creafix-ai.vercel.app";
const SITE_NAME = "CreaFix AI";
const DEFAULT_DESC =
  "CreaFix AI scanne tes comptes TikTok, Facebook, YouTube et Instagram en 60 secondes. Détecte shadowbans, contenus low RPM, fuites de revenus et opportunités virales — taillé pour créateurs africains.";

export type SeoArgs = {
  /** Titre de la page (sera suffixé par "· CreaFix AI" via template) */
  title?: string;
  /** Description meta (160 chars max idéal) */
  description?: string;
  /** Path relatif (ex: "/pricing"). Sert pour canonical + OG URL. */
  path?: string;
  /** Image OG (URL absolue ou relative à /). Si absente, OG image dynamique générée via /og?title=... */
  image?: string;
  /** Type OG (default: website) */
  type?: "website" | "article" | "product";
  /** Mots-clés (5-10 max, gardés pour DDG/Bing même si Google ignore) */
  keywords?: string[];
  /** Date publication (article) */
  publishedTime?: string;
  /** Auteur (article) */
  author?: string;
  /** noindex (pages techniques, brouillons) */
  noindex?: boolean;
};

/**
 * Génère un objet `Metadata` complet pour Next.js : OpenGraph + Twitter +
 * canonical + robots + JSON-LD structured data. Utilise les fallbacks
 * intelligents pour minimiser le boilerplate par page.
 *
 * Usage :
 *   export const metadata = generateSeoMetadata({
 *     title: "Tarifs",
 *     description: "Plans Creator, Pro, Agency...",
 *     path: "/pricing",
 *   });
 */
export function generateSeoMetadata(args: SeoArgs = {}): Metadata {
  const {
    title,
    description = DEFAULT_DESC,
    path = "/",
    image,
    type = "website",
    keywords,
    publishedTime,
    author,
    noindex = false,
  } = args;

  const url = `${SITE_URL}${path}`;
  const ogImage = image
    ? image.startsWith("http") ? image : `${SITE_URL}${image}`
    : `${SITE_URL}/og?title=${encodeURIComponent(title ?? SITE_NAME)}`;

  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — L'OS IA de revenu des créateurs africains`;

  const meta: Metadata = {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: type === "product" ? "website" : type,
      locale: "fr_FR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title ?? SITE_NAME }],
      ...(publishedTime && type === "article" ? { publishedTime } : {}),
      ...(author && type === "article" ? { authors: [author] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: "@creafixai",
      site: "@creafixai",
      images: [ogImage],
    },
    ...(keywords && keywords.length ? { keywords } : {}),
  };

  return meta;
}
