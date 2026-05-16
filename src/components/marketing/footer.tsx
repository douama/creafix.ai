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
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-6">
          <div className="col-span-2 md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Twitter,   href: "https://twitter.com/creafixai",            label: "Twitter / X" },
                { Icon: Instagram, href: "https://instagram.com/creafix.ai",          label: "Instagram" },
                { Icon: Youtube,   href: "https://youtube.com/@creafixai",            label: "YouTube" },
                { Icon: Github,    href: "https://github.com/creafix-ai",             label: "GitHub" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
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

        <div className="mt-8 flex flex-row items-center justify-between gap-3 border-t border-border pt-6 text-[10.5px] text-muted-foreground md:text-xs">
          <span>© {new Date().getFullYear()} CreaFix AI</span>
          <span className="text-right">Dakar · Abidjan · Lagos · Casablanca</span>
        </div>
      </div>
    </footer>
  );
}
