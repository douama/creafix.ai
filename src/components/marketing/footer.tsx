import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Github, Instagram, Twitter, Youtube } from "lucide-react";

const cols = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "/features" },
      { label: "Tarifs", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
      { label: "Mode Agence", href: "/agency" },
      { label: "App mobile", href: "/mobile" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Blog créateurs", href: "/blog" },
      { label: "Guide monétisation FB", href: "/guides/facebook" },
      { label: "Guide TikTok Afrique", href: "/guides/tiktok" },
      { label: "Centre d'aide", href: "/help" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/about" },
      { label: "Carrières", href: "/careers" },
      { label: "Partenaires", href: "/partners" },
      { label: "Presse", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "CGU", href: "/legal/terms" },
      { label: "Politique de confidentialité", href: "/legal/privacy" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Mentions légales", href: "/legal/legal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-6">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              La plateforme IA d'audit de monétisation sociale pensée pour les créateurs africains.
            </p>
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

          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-semibold">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} CreaFix AI · Built with ❤ for Africa</span>
          <span>Dakar · Abidjan · Lagos · Casablanca</span>
        </div>
      </div>
    </footer>
  );
}
