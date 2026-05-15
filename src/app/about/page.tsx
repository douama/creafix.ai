import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Heart,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "À propos",
  description:
    "Notre mission : permettre à 1 million de créateurs africains de vivre de leur passion.",
};

const values = [
  {
    icon: Heart,
    title: "L'Afrique d'abord",
    desc: "Pas un outil occidental adapté : un outil pensé, conçu et construit depuis l'Afrique.",
  },
  {
    icon: Target,
    title: "Résultats mesurables",
    desc: "Chaque feature doit faire gagner du temps ou des FCFA. Sinon on la retire.",
  },
  {
    icon: ShieldCheck,
    title: "Données respectées",
    desc: "OAuth officiel, RLS Postgres, chiffrement E2E. Tes tokens ne sont jamais lus en clair.",
  },
  {
    icon: Lightbulb,
    title: "Apprendre en public",
    desc: "Notre roadmap, nos chiffres et nos décisions tech sont partagés ouvertement.",
  },
];

const timeline = [
  { y: "2024", e: "Idée première autour d'un café à Dakar : pourquoi aucun outil ne parle FCFA, Wave ou Mobile Money ?" },
  { y: "Q1 2025", e: "Prototype interne testé sur 12 créateurs sénégalais et ivoiriens." },
  { y: "Q3 2025", e: "Levée pré-amorçage. Premier produit public en bêta privée." },
  { y: "Q1 2026", e: "Lancement officiel. +2 300 créateurs et 14 agences accompagnés." },
  { y: "Aujourd'hui", e: "9 pays couverts, multi-agents IA, mobile app en bêta privée." },
];

export default function AboutPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "À propos", href: "/about" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Sparkles className="h-3 w-3 text-amber-400" /> Notre histoire
            </>
          }
          title={
            <>
              On veut que <span className="gradient-text">1 million de créateurs africains</span> vivent de leur passion.
            </>
          }
          subtitle="CreaFix AI a été créé à Dakar par des créateurs, pour des créateurs. On parle de tes problèmes parce qu'on les a vécus."
        />
      }
    >
      <PageSection title="Notre mission">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-violet-500/[0.08] via-card to-card p-8 backdrop-blur md:p-12">
          <p className="font-display text-xl leading-relaxed text-balance md:text-2xl">
            « Quand on a commencé à créer du contenu en 2022 à Dakar, on s'est pris une porte
            après l'autre : démonétisation Facebook, FYP TikTok illisible, paiements
            internationaux compliqués, outils étrangers qui ne parlent pas FCFA.
            <br />
            <br />
            On a construit CreaFix AI pour que personne d'autre n'ait à le subir. »
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-brand text-sm font-bold text-white">
              D
            </div>
            <div>
              <div className="text-sm font-medium">Sobé Kandé</div>
              <div className="text-xs text-muted-foreground">Cofondateur · Dakar</div>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection title="Nos valeurs" subtitle="Ce qui guide chaque décision produit.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-brand shadow-lg">
                <v.icon className="h-5 w-5 text-white" />
              </div>
              <div className="mt-3 font-display font-semibold">{v.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{v.desc}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Quelques étapes clés">
        <ol className="relative space-y-6 border-l border-border pl-6">
          {timeline.map((t) => (
            <li key={t.y} className="relative">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full gradient-brand shadow-lg" />
              <div className="text-xs font-semibold uppercase tracking-wider text-violet-500">
                {t.y}
              </div>
              <div className="mt-1 text-sm md:text-base">{t.e}</div>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection title="Quelques chiffres">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { v: "+2 300", l: "Créateurs" },
            { v: "9", l: "Pays africains" },
            { v: "14", l: "Agences clientes" },
            { v: "10M+", l: "Vidéos auditées" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card/40 p-4 text-center backdrop-blur">
              <div className="font-display text-2xl font-bold md:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Présence">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          {[
            "🇸🇳 Dakar (HQ)",
            "🇨🇮 Abidjan",
            "🇳🇬 Lagos",
            "🇲🇦 Casablanca",
            "🇨🇲 Yaoundé",
            "🇨🇩 Kinshasa",
          ].map((l) => (
            <span key={l} className="rounded-full border border-border bg-card/40 px-4 py-1.5">
              {l}
            </span>
          ))}
        </div>
      </PageSection>

      <section className="mt-14 rounded-3xl border border-border bg-card/40 p-8 text-center backdrop-blur md:p-12">
        <Rocket className="mx-auto h-8 w-8 text-violet-500" />
        <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
          On embauche.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Tu veux construire la plus grande communauté de créateurs africains ? Viens nous parler.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button asChild variant="brand">
            <Link href="/careers">
              Voir les offres <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact?topic=jobs">Candidature spontanée</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
