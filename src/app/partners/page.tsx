import Link from "next/link";
import { ArrowRight, Coins, Globe, Handshake, Megaphone, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Partenaires",
  description: "Devenir partenaire CreaFix AI : ambassadeurs, agences certifiées, intégrations.",
};

const programs = [
  {
    icon: Star,
    title: "Programme ambassadeur",
    desc: "Recommande CreaFix, gagne 30% de commission récurrente sur chaque abonnement actif.",
    perks: ["30% à vie", "Dashboard temps réel", "Liens trackés", "Paiement Wave/OM/USD"],
    color: "from-amber-500 to-orange-600",
    cta: "Rejoindre le programme",
  },
  {
    icon: Handshake,
    title: "Agence certifiée",
    desc: "Agences sociales sénégalaises, ivoiriennes, nigerianes — accédez à des tarifs préférentiels et un manager dédié.",
    perks: ["Prix dégressifs", "Manager dédié", "Co-marketing", "Onboarding sur site"],
    color: "from-violet-500 to-fuchsia-600",
    cta: "Devenir agence certifiée",
  },
  {
    icon: Users,
    title: "Intégrations technologiques",
    desc: "Ton SaaS bénéficie de nos API ? Devenons partenaires officiels.",
    perks: ["API priorisée", "Logo sur la home", "Cas d'usage commun", "Webinar joint"],
    color: "from-sky-500 to-blue-600",
    cta: "Discuter d'une intégration",
  },
];

const partners = [
  "Wave", "Orange Money", "MTN MoMo", "PayDunya", "CinetPay",
  "Meta", "TikTok", "Stripe", "PayPal",
];

export default function PartnersPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Partenaires", href: "/partners" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Handshake className="h-3 w-3" /> Programme partenaires
            </>
          }
          title={
            <>
              Construisons l'écosystème <span className="gradient-text">créateur africain</span> ensemble.
            </>
          }
          subtitle="Que tu sois influenceur, agence, ou éditeur de SaaS — il existe un programme partenaire fait pour toi."
        />
      }
    >
      <PageSection title="Trois programmes pour trois profils">
        <div className="grid gap-4 md:grid-cols-3">
          {programs.map((p) => (
            <div
              key={p.title}
              className="flex flex-col rounded-2xl border border-border bg-card/40 p-6 backdrop-blur"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.color} shadow-lg`}
              >
                <p.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    {perk}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6 w-full">
                <Link href={`/contact?topic=${encodeURIComponent(p.title)}`}>
                  {p.cta} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Ils nous font déjà confiance">
        <div className="grid grid-cols-3 items-center gap-y-4 md:grid-cols-9">
          {partners.map((p) => (
            <div
              key={p}
              className="text-center font-display text-sm font-semibold text-muted-foreground/90"
            >
              {p}
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Quelques chiffres du programme">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { v: "147", l: "Ambassadeurs actifs" },
            { v: "30%", l: "Commission à vie" },
            { v: "9 mois", l: "Durée moyenne client" },
            { v: "+18M FCFA", l: "Distribués en 2025" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-border bg-card/40 p-4 text-center backdrop-blur"
            >
              <div className="font-display text-2xl font-bold md:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <section className="mt-14 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-orange-500/5 p-8 text-center md:p-12">
        <Megaphone className="mx-auto h-7 w-7 text-violet-500" />
        <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
          Prêt à devenir partenaire ?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Un humain te répond sous 48h ouvrées. Échangeons sur ton projet.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button asChild size="lg" variant="brand">
            <Link href="/contact?topic=partners">
              Candidater <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="mailto:partners@creafix.ai">
              <Coins className="mr-1 h-4 w-4" /> partners@creafix.ai
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
