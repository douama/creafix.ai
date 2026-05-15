import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  MessageCircle,
  Phone,
  Search,
  Send,
} from "lucide-react";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Centre d'aide",
  description: "Trouve rapidement la réponse à ta question, ou contacte notre équipe.",
};

const categories = [
  {
    icon: BookOpen,
    title: "Démarrage",
    desc: "Créer un compte, connecter une plateforme, comprendre l'audit IA.",
    color: "from-violet-500 to-purple-600",
    items: [
      { q: "Connecter YouTube, Facebook, Instagram, TikTok…", href: "/help/connect" },
      { q: "Mon premier audit en 60 secondes", href: "/help/first-audit" },
      { q: "Comprendre le score IA", href: "/help/score" },
      { q: "Choisir la bonne plateforme pour ma niche", href: "/help/choose-platform" },
    ],
  },
  {
    icon: HelpCircle,
    title: "Monétisation",
    desc: "Critères d'éligibilité pour les 9 programmes de monétisation.",
    color: "from-emerald-500 to-teal-600",
    items: [
      { q: "YouTube Partner Program (YPP)", href: "/help/yt-ypp" },
      { q: "Facebook In-Stream Ads", href: "/help/fb-monetization" },
      { q: "TikTok Creator Rewards", href: "/help/tiktok-rewards" },
      { q: "Instagram Reels Play Bonus", href: "/help/ig-reels-play" },
      { q: "Twitch Affiliate & Partner", href: "/help/twitch-affiliate" },
      { q: "Pourquoi mon RPM est-il bas ?", href: "/help/low-rpm" },
    ],
  },
  {
    icon: Send,
    title: "Paiements",
    desc: "Wave, Orange Money, MTN MoMo, Stripe, PayPal.",
    color: "from-orange-500 to-amber-600",
    items: [
      { q: "Payer avec Wave", href: "/help/pay-wave" },
      { q: "Payer avec Orange Money", href: "/help/pay-om" },
      { q: "Carte bancaire internationale", href: "/help/pay-card" },
      { q: "Annuler mon abonnement", href: "/help/cancel" },
    ],
  },
  {
    icon: MessageCircle,
    title: "Agences",
    desc: "Marque blanche, multi-clients, API, branding.",
    color: "from-fuchsia-500 to-pink-600",
    items: [
      { q: "Configurer la marque blanche", href: "/help/whitelabel" },
      { q: "Ajouter un client", href: "/help/add-client" },
      { q: "Utiliser l'API + Webhooks", href: "/help/api" },
      { q: "Programme ambassadeur", href: "/help/ambassador" },
    ],
  },
];

const channels = [
  { icon: MessageCircle, name: "Chat IA", desc: "24/7 · réponse instantanée", cta: "Ouvrir le chat", href: "#" },
  { icon: Phone, name: "WhatsApp", desc: "+221 77 000 00 00", cta: "Écrire sur WhatsApp", href: "https://wa.me/221770000000" },
  { icon: Send, name: "Email", desc: "hello@creafix.ai", cta: "Envoyer un email", href: "mailto:hello@creafix.ai" },
];

export default function HelpPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Centre d'aide", href: "/help" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <HelpCircle className="h-3 w-3" /> Support multilingue
            </>
          }
          title={
            <>
              Comment pouvons-nous <span className="gradient-text">t'aider</span> aujourd'hui ?
            </>
          }
          subtitle="Plus de 200 articles, support humain en français, wolof, anglais et pidgin. Temps de réponse moyen : 47 minutes."
        >
          <div className="relative mx-auto mt-2 max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Rechercher : connexion Facebook, paiement Wave, anti-ban…"
              className="h-12 w-full rounded-2xl border border-border bg-card/60 pl-11 pr-4 text-sm shadow-lg backdrop-blur placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </PageHero>
      }
    >
      <PageSection title="Parcourir par catégorie">
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} shadow-lg`}
                >
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5">
                {c.items.map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card/70 hover:text-foreground"
                    >
                      <span>{i.q}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Contacter l'équipe">
        <div className="grid gap-4 md:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-card/60 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-brand shadow-lg">
                <c.icon className="h-5 w-5 text-white" />
              </div>
              <div className="mt-3 font-display font-semibold">{c.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-500">
                {c.cta} <ArrowRight className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </PageSection>
    </PageShell>
  );
}
