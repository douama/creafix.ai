"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Github, Instagram, Twitter, Youtube } from "lucide-react";
import { Logo } from "@/components/brand/logo";

type LinkKey =
  | "features" | "pricing" | "faq" | "agency" | "mobile"
  | "blog" | "guideFb" | "guideTt" | "help" | "status"
  | "about" | "careers" | "partners" | "press" | "contact"
  | "terms" | "privacy" | "cookies" | "legalNotice";

const colsSchema: { titleKey: "product" | "resources" | "company" | "legal"; links: { key: LinkKey; href: string }[] }[] = [
  {
    titleKey: "product",
    links: [
      { key: "features", href: "/features" },
      { key: "pricing", href: "/pricing" },
      { key: "faq", href: "/faq" },
      { key: "agency", href: "/agency" },
      { key: "mobile", href: "/mobile" },
    ],
  },
  {
    titleKey: "resources",
    links: [
      { key: "blog", href: "/blog" },
      { key: "guideFb", href: "/guides/facebook" },
      { key: "guideTt", href: "/guides/tiktok" },
      { key: "help", href: "/help" },
      { key: "status", href: "/status" },
    ],
  },
  {
    titleKey: "company",
    links: [
      { key: "about", href: "/about" },
      { key: "careers", href: "/careers" },
      { key: "partners", href: "/partners" },
      { key: "press", href: "/press" },
      { key: "contact", href: "/contact" },
    ],
  },
  {
    titleKey: "legal",
    links: [
      { key: "terms", href: "/legal/terms" },
      { key: "privacy", href: "/legal/privacy" },
      { key: "cookies", href: "/legal/cookies" },
      { key: "legalNotice", href: "/legal/legal" },
    ],
  },
];

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border py-10">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-6">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {colsSchema.map((c) => (
            <div key={c.titleKey}>
              <div className="text-sm font-semibold">{t(c.titleKey)}</div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.key}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t(`links.${l.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} CreaFix AI · {t("tagline2")}</span>
          <span>Dakar · Abidjan · Lagos · Casablanca</span>
        </div>
      </div>
    </footer>
  );
}
