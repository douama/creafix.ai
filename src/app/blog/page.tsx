import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Blog créateurs",
  description:
    "Conseils, études de cas et tendances pour monétiser ton audience africaine sur Facebook et TikTok.",
};

const articles = [
  {
    cat: "Monétisation",
    title: "Comment activer In-Stream Ads sur ta page Facebook en 2026",
    excerpt:
      "Le guide complet pour passer la barre des critères Meta, même depuis le Sénégal ou le Cameroun.",
    minutes: 8,
    date: "12 mai 2026",
    slug: "/blog/in-stream-ads-2026",
    accent: "from-violet-500/30 to-violet-500/0",
  },
  {
    cat: "Étude de cas",
    title: "De 0 à 1 million de vues en 30 jours : le playbook d'Aïssata D.",
    excerpt:
      "Comment une créatrice de Dakar a transformé sa niche cuisine en machine virale.",
    minutes: 12,
    date: "8 mai 2026",
    slug: "/blog/aissata-playbook",
    accent: "from-orange-500/30 to-orange-500/0",
  },
  {
    cat: "TikTok",
    title: "Les 10 hashtags TikTok qui explosent en Afrique francophone",
    excerpt:
      "Mise à jour hebdomadaire des tendances par pays — détectées par notre Trend Agent.",
    minutes: 5,
    date: "5 mai 2026",
    slug: "/blog/hashtags-tiktok-afrique",
    accent: "from-sky-500/30 to-sky-500/0",
  },
  {
    cat: "Anti-Ban",
    title: "5 erreurs qui font shadowban ton compte TikTok (et comment les corriger)",
    excerpt:
      "Notre Anti-Ban Agent a analysé 12 000 comptes. Voici les patterns les plus communs.",
    minutes: 6,
    date: "1 mai 2026",
    slug: "/blog/shadowban-tiktok",
    accent: "from-rose-500/30 to-rose-500/0",
  },
  {
    cat: "Revenus",
    title: "Combien gagne réellement un créateur sénégalais avec 100K abonnés ?",
    excerpt:
      "Étude basée sur 247 comptes sénégalais. Médiane, fourchettes, sources de revenus détaillées.",
    minutes: 10,
    date: "25 avril 2026",
    slug: "/blog/revenus-createur-senegal",
    accent: "from-emerald-500/30 to-emerald-500/0",
  },
  {
    cat: "Agence",
    title: "Lancer son agence sociale en Afrique : le guide complet 2026",
    excerpt:
      "Modèle économique, pricing, acquisition client, outils. Tout ce qu'il faut savoir.",
    minutes: 15,
    date: "20 avril 2026",
    slug: "/blog/lancer-agence-sociale",
    accent: "from-fuchsia-500/30 to-fuchsia-500/0",
  },
];

export default function BlogPage() {
  const [first, ...rest] = articles;
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Blog", href: "/blog" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <BookOpen className="h-3 w-3" /> Blog créateurs
            </>
          }
          title={
            <>
              Les ressources pour <span className="gradient-text">faire passer ton audience à l'échelle</span>.
            </>
          }
          subtitle="Études de cas, guides pratiques et tendances — uniquement sur le marché africain."
        />
      }
    >
      {/* Article featured */}
      <Link
        href={first.slug}
        className="group relative block overflow-hidden rounded-3xl border border-border bg-card/40 p-6 backdrop-blur transition-all hover:bg-card/60 hover:shadow-xl md:p-10"
      >
        <div className={`pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br ${first.accent} blur-3xl opacity-50 transition-opacity group-hover:opacity-100`} />
        <div className="relative">
          <Badge variant="brand">{first.cat}</Badge>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
            {first.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            {first.excerpt}
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> {first.minutes} min de lecture
            </span>
            <span>·</span>
            <span>{first.date}</span>
            <span className="ml-auto inline-flex items-center gap-1 text-violet-500 transition-transform group-hover:translate-x-0.5">
              Lire l'article <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>

      <PageSection title="Tous les articles">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={a.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-card/60 hover:shadow-lg"
            >
              <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${a.accent} blur-2xl opacity-40 transition-opacity group-hover:opacity-80`} />
              <div className="relative">
                <Badge variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" /> {a.cat}
                </Badge>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug md:text-lg">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {a.minutes} min
                  </span>
                  <span>·</span>
                  <span>{a.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PageSection>

      <section className="mt-14 rounded-2xl border border-border bg-card/40 p-6 text-center backdrop-blur md:p-10">
        <h2 className="font-display text-xl font-bold md:text-2xl">
          Newsletter hebdo · 1 conseil actionnable / semaine
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reçois chaque lundi les tendances africaines et un conseil concret pour ta croissance.
        </p>
        <form className="mx-auto mt-5 flex max-w-md gap-2">
          <input
            type="email"
            placeholder="ton@email.com"
            required
            className="h-10 flex-1 rounded-xl border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="h-10 rounded-xl bg-gradient-to-br from-violet-500 to-orange-500 px-4 text-sm font-medium text-white shadow-lg hover:shadow-violet-500/40"
          >
            M'inscrire
          </button>
        </form>
      </section>
    </PageShell>
  );
}
