import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Contact",
  description: "Une question, un partenariat, un test média ? Écrivez-nous.",
};

const offices = [
  {
    city: "Dakar",
    badge: "HQ",
    flag: "🇸🇳",
    country: "Sénégal",
    address: "Almadies, Dakar",
    image: "/offices/dakar.jpg",
    team: "12 personnes",
  },
  {
    city: "Abidjan",
    flag: "🇨🇮",
    country: "Côte d'Ivoire",
    address: "Cocody II Plateaux",
    image: "/offices/abidjan.jpg",
    team: "8 personnes",
  },
  {
    city: "Lagos",
    flag: "🇳🇬",
    country: "Nigeria",
    address: "Victoria Island",
    image: "/offices/lagos.jpg",
    team: "10 personnes",
  },
  {
    city: "Casablanca",
    flag: "🇲🇦",
    country: "Maroc",
    address: "Maarif, Casablanca",
    image: "/offices/casablanca.jpg",
    team: "6 personnes",
  },
];

const channels = [
  { icon: Mail, label: "hello@creafix.ai", href: "mailto:hello@creafix.ai", note: "Général · 24h" },
  { icon: Phone, label: "+221 77 000 00 00", href: "tel:+221770000000", note: "WhatsApp · 9h-21h" },
  { icon: Send, label: "press@creafix.ai", href: "mailto:press@creafix.ai", note: "Presse" },
  { icon: MessageCircle, label: "support@creafix.ai", href: "mailto:support@creafix.ai", note: "Support technique" },
];

export default function ContactPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Contact", href: "/contact" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <MessageCircle className="h-3 w-3" /> Parlons.
            </>
          }
          title={
            <>
              On <span className="gradient-text">répond vite</span> et en plusieurs langues.
            </>
          }
          subtitle="Français, wolof, anglais et pidgin. Temps de réponse moyen : 47 minutes en heures ouvrées."
        />
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Formulaire */}
        <form className="space-y-3 rounded-2xl border border-border bg-card/40 p-5 backdrop-blur md:col-span-2 md:p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Nom complet
              </label>
              <input
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Mariam D."
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="ton@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sujet
            </label>
            <select
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            >
              <option value="">Choisis un sujet…</option>
              <option value="support">Support technique</option>
              <option value="sales">Question commerciale</option>
              <option value="agency">Démo mode Agence</option>
              <option value="partners">Partenariat / Affiliation</option>
              <option value="press">Presse</option>
              <option value="jobs">Carrière</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Message
            </label>
            <textarea
              rows={6}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Dis-nous tout — on lit chaque message en personne."
              required
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-xs text-muted-foreground">
              On ne te spammera jamais.{" "}
              <a href="/legal/privacy" className="underline">
                Confidentialité
              </a>
            </p>
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-500 to-orange-500 px-5 text-sm font-medium text-white shadow-lg transition-shadow hover:shadow-violet-500/40"
            >
              <Send className="h-4 w-4" /> Envoyer
            </button>
          </div>
        </form>

        {/* Channels */}
        <div className="space-y-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur transition-all hover:bg-card/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-lg">
                <c.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.note}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <PageSection title="Nos bureaux">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {offices.map((o) => (
            <article
              key={o.city}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={o.image}
                  alt={`Bureau CreaFix AI ${o.city}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Bottom-gradient overlay pour lisibilité du nom ville */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                {/* Badge HQ */}
                {o.badge && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#EC4899] to-[#FF8A00] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    {o.badge}
                  </span>
                )}

                {/* City name (sur l'image) */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl drop-shadow">{o.flag}</span>
                    <div>
                      <div className="font-display text-xl font-bold leading-none text-white drop-shadow">
                        {o.city}
                      </div>
                      <div className="mt-1 text-[11px] uppercase tracking-wider text-white/80">
                        {o.country}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-start gap-1.5 text-[12.5px] text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{o.address}</span>
                </div>
                <div className="mt-1.5 text-[11px] text-muted-foreground/80">
                  Équipe : <b className="text-foreground">{o.team}</b>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-[12px] text-muted-foreground">
          🌍 Présence sur 4 hubs créatifs africains · 36 personnes au total
        </p>
      </PageSection>
    </PageShell>
  );
}
