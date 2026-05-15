import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Contact",
  description: "Une question, un partenariat, un test média ? Écrivez-nous.",
};

const offices = [
  { city: "Dakar (HQ)", flag: "🇸🇳", address: "Almadies, Dakar — Sénégal" },
  { city: "Abidjan", flag: "🇨🇮", address: "Cocody II Plateaux — Côte d'Ivoire" },
  { city: "Lagos", flag: "🇳🇬", address: "Victoria Island — Nigeria" },
  { city: "Casablanca", flag: "🇲🇦", address: "Maarif — Maroc" },
];

const channels = [
  { icon: Mail, label: "hello@monetiq.ai", href: "mailto:hello@monetiq.ai", note: "Général · 24h" },
  { icon: Phone, label: "+221 77 000 00 00", href: "tel:+221770000000", note: "WhatsApp · 9h-21h" },
  { icon: Send, label: "press@monetiq.ai", href: "mailto:press@monetiq.ai", note: "Presse" },
  { icon: MessageCircle, label: "support@monetiq.ai", href: "mailto:support@monetiq.ai", note: "Support technique" },
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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {offices.map((o) => (
            <div
              key={o.city}
              className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur"
            >
              <div className="text-2xl">{o.flag}</div>
              <div className="mt-2 font-display font-semibold">{o.city}</div>
              <div className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{o.address}</span>
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </PageShell>
  );
}
