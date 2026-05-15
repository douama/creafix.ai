import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileBarChart2,
  Palette,
  Share2,
  Sparkles,
  Users,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Mode Agence",
  description:
    "Marque blanche, multi-clients, rapports PDF personnalisés. Outil n°1 pour les agences médias africaines.",
};

const perks = [
  {
    icon: Users,
    title: "Comptes clients illimités",
    desc: "Ajoute autant de créateurs que tu gères, organisés par workspace.",
  },
  {
    icon: Palette,
    title: "Marque blanche complète",
    desc: "Ton logo, tes couleurs, ton sous-domaine. Les clients ne voient pas CreaFix.",
  },
  {
    icon: FileBarChart2,
    title: "Rapports PDF brandés",
    desc: "Exports automatiques, prêts à envoyer en moins de 30 secondes.",
  },
  {
    icon: Share2,
    title: "Liens partageables",
    desc: "Partage un dashboard sécurisé à un client via lien privé expiré.",
  },
  {
    icon: Webhook,
    title: "API + Webhooks",
    desc: "Intègre CreaFix dans tes outils internes (Notion, Slack, Linear, etc.).",
  },
  {
    icon: Sparkles,
    title: "Manager dédié",
    desc: "Un humain joignable sur WhatsApp pour ton onboarding et tes pics d'activité.",
  },
];

const clients = [
  { name: "Diop Studio", country: "🇸🇳 Sénégal", accounts: 6, score: 78 },
  { name: "AbidjanMedia", country: "🇨🇮 Côte d'Ivoire", accounts: 12, score: 64 },
  { name: "NaijaCreators Co.", country: "🇳🇬 Nigeria", accounts: 18, score: 81 },
  { name: "Casa Buzz", country: "🇲🇦 Maroc", accounts: 4, score: 70 },
  { name: "Yaoundé Vibes", country: "🇨🇲 Cameroun", accounts: 7, score: 58 },
  { name: "Accra Wave", country: "🇬🇭 Ghana", accounts: 9, score: 73 },
];

export default function AgencyPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Mode Agence", href: "/agency" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Building2 className="h-3 w-3" /> Pour les agences médias africaines
            </>
          }
          title={
            <>
              Gère tes <span className="gradient-text">clients créateurs</span> en marque blanche.
            </>
          }
          subtitle="L'outil n°1 des agences sociales africaines : ajouts illimités de comptes, rapports PDF brandés, API ouverte, manager dédié."
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="lg" variant="brand">
              <Link href="/signup?plan=agency">
                Essayer 7 jours gratuits <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Réserver une démo</Link>
            </Button>
          </div>
        </PageHero>
      }
    >
      <PageSection
        title="Tout ce dont une agence média a besoin"
        subtitle="Conçu avec les meilleures agences de Dakar, Abidjan, Lagos et Casablanca."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {perks.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur transition-all hover:bg-card/60 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg">
                <p.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="Quelques agences qui nous font confiance"
        subtitle="Aperçu (anonymisé) des workspaces actifs."
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-brand font-display text-sm font-bold text-white">
                {c.name[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {c.name} <span className="ml-1">{c.country}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {c.accounts} comptes connectés
                </div>
              </div>
              <Badge
                variant={c.score >= 75 ? "success" : c.score >= 55 ? "warning" : "destructive"}
              >
                {c.score}/100
              </Badge>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Workflow type" subtitle="De l'ajout du client à la livraison du rapport en 4 étapes.">
        <ol className="grid gap-4 md:grid-cols-4">
          {[
            { n: 1, t: "Ajoute un client", d: "Email + niche. Création workspace instantanée." },
            { n: 2, t: "Connecte ses comptes", d: "FB + TikTok via OAuth. Tokens chiffrés." },
            { n: 3, t: "Lance l'audit IA", d: "60 secondes. Scores + opportunités + risques." },
            { n: 4, t: "Envoie le rapport", d: "PDF brandé exporté, lien privé partageable." },
          ].map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur"
            >
              <div className="font-display text-2xl font-bold text-violet-500">
                {String(s.n).padStart(2, "0")}
              </div>
              <div className="mt-2 font-medium">{s.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection title="Inclus dans le plan Agence" className="mt-14">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Comptes clients illimités",
            "Marque blanche + sous-domaine personnalisé",
            "Liens partageables avec expiration",
            "API REST + Webhooks (Slack, Notion…)",
            "Rapports PDF illimités",
            "Crédits IA mutualisés entre clients",
            "Support prioritaire WhatsApp < 1h",
            "Manager d'agence dédié",
            "Programme ambassadeur (commission 30%)",
            "Onboarding personnalisé",
          ].map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{p}</span>
            </div>
          ))}
        </div>
      </PageSection>

      <section className="mt-14 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-orange-500/5 p-8 text-center md:p-12">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          Ton agence mérite un outil à sa taille.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Essai 7 jours gratuits, sans carte. Démo personnalisée en 30 min avec un fondateur.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild size="lg" variant="brand">
            <Link href="/signup?plan=agency">
              Démarrer l'essai <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact?topic=agency">Réserver une démo</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
