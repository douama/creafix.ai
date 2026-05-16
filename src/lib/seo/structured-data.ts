/**
 * Helpers JSON-LD pour structured data (Schema.org).
 * Injectés via le composant <JsonLd> dans les pages clés.
 */

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://creafix-ai.vercel.app";
const SITE_NAME = "CreaFix AI";
const LOGO_URL = `${SITE_URL}/logos/logo-light.svg`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "CreaFix AI",
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      "Plateforme IA d'audit et d'optimisation de monétisation pour créateurs de contenu africains (TikTok, Facebook, YouTube, Instagram).",
    foundingDate: "2026",
    sameAs: [
      "https://twitter.com/creafixai",
      "https://instagram.com/creafix.ai",
      "https://youtube.com/@creafixai",
      "https://linkedin.com/company/creafix-ai",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@creafix.ai",
      availableLanguage: ["French", "English"],
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        category: "Subscription",
      },
      {
        "@type": "Offer",
        name: "Creator Pro",
        price: "29",
        priceCurrency: "USD",
        category: "Subscription",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "29.00",
          priceCurrency: "USD",
          unitText: "month",
        },
      },
      {
        "@type": "Offer",
        name: "Agency",
        price: "99",
        priceCurrency: "USD",
        category: "Subscription",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "99.00",
          priceCurrency: "USD",
          unitText: "month",
        },
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "30",
      bestRating: "5",
    },
  };
}

export function faqPageLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export function productLd(args: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    image: args.image ?? LOGO_URL,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: String(args.price),
      priceCurrency: args.currency ?? "USD",
      availability: "https://schema.org/InStock",
      url: SITE_URL,
    },
  };
}
