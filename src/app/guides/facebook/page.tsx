import Link from "next/link";
import { ArrowRight, CheckCircle2, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Guide monétisation Facebook",
  description:
    "Le guide complet pour monétiser sa page Facebook en Afrique en 2026 : In-Stream Ads, Stars, Reels Play, Subscriptions.",
};

const eligibility = [
  { c: "10 000 abonnés sur la page", details: "Critère minimum d'entrée." },
  {
    c: "600 000 minutes de visionnage cumulées",
    details: "Sur les 60 derniers jours, vidéos > 1 min uniquement.",
  },
  { c: "5 vidéos In-Stream actives", details: "Publiées dans les 60 derniers jours." },
  { c: "Pays éligible Meta", details: "Sénégal, CI, Cameroun, Nigeria, Ghana, RSA, Maroc, etc." },
  { c: "Respect des Partner Monetization Policies", details: "Brand safety, contenu original." },
  {
    c: "Compte créateur professionnel",
    details: "Page Facebook + Meta Business Suite configurés.",
  },
];

const sources = [
  {
    name: "In-Stream Ads",
    desc: "Publicités diffusées avant ou pendant tes vidéos longues (≥ 1 min).",
    rpm: "0.80 – 2.10 USD",
  },
  {
    name: "Reels Play Bonus",
    desc: "Programme d'incitation Meta — montant fixe pour des reels qui performent.",
    rpm: "Variable",
  },
  {
    name: "Facebook Stars",
    desc: "Tes fans achètent des Stars qu'ils t'envoient pendant tes lives et reels.",
    rpm: "1 Star = 0.01 USD",
  },
  {
    name: "Subscriptions",
    desc: "Tes fans paient un abonnement mensuel pour du contenu exclusif.",
    rpm: "0.99 – 9.99 USD/mois",
  },
  {
    name: "Branded Content",
    desc: "Partenariats sponsorisés via Meta Brand Collabs Manager.",
    rpm: "À négocier",
  },
];

export default function FacebookGuidePage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Guides", href: "/blog" },
        { label: "Facebook", href: "/guides/facebook" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Facebook className="h-3 w-3 text-blue-500" /> Guide complet · 12 min
            </>
          }
          title={
            <>
              Monétiser ta page Facebook en{" "}
              <span className="gradient-text">Afrique en 2026</span>.
            </>
          }
          subtitle="Tout ce qu'il faut savoir : critères d'éligibilité, sources de revenus, pièges à éviter, optimisations qui marchent."
        />
      }
    >
      <PageSection title="1. Les critères d'éligibilité officiels Meta">
        <div className="grid gap-3 md:grid-cols-2">
          {eligibility.map((e) => (
            <div
              key={e.c}
              className="flex gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <div>
                <div className="font-medium">{e.c}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{e.details}</div>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="2. Les 5 sources de revenus disponibles"
        subtitle="Combine-les pour maximiser tes gains."
      >
        <div className="space-y-3">
          {sources.map((s, i) => (
            <div
              key={s.name}
              className="grid items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur md:grid-cols-[60px_1fr_auto]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand font-display text-sm font-bold text-white">
                {i + 1}
              </div>
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{s.desc}</div>
              </div>
              <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
                {s.rpm}
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="3. Les optimisations qui font vraiment la différence"
        subtitle="Données issues de 2 300 créateurs accompagnés par CreaFix."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { t: "Vidéos ≥ 3 minutes", d: "Maximise la durée de visionnage cumulée (critère clé)." },
            { t: "Hook fort dans les 3 premières secondes", d: "+45% de watch time moyen." },
            { t: "Publier 4-5×/semaine", d: "Sweet spot pour rester pertinent sans saturer l'algo." },
            { t: "Heures de pointe locales", d: "Au Sénégal : 19h-22h. À Lagos : 20h-23h." },
            { t: "Musique commerciale (Sound Collection Meta)", d: "Évite tout strike copyright." },
            { t: "Sous-titres burned-in", d: "+30% de complétion sur mobile sans son." },
          ].map((o) => (
            <div
              key={o.t}
              className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur"
            >
              <div className="font-medium">{o.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{o.d}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="4. Les erreurs à éviter absolument" className="mt-14">
        <ul className="space-y-3">
          {[
            "Contenu recyclé (sans valeur ajoutée) — démonétisation quasi assurée",
            "Audio copyrighté détecté par Meta Rights Manager",
            "Clickbait et titres mensongers — déclassement algorithme",
            "Publier depuis plusieurs comptes liés au même IP",
            "Engagement artificiel (likes/follows achetés)",
          ].map((e) => (
            <li
              key={e}
              className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
              <span className="text-sm">{e}</span>
            </li>
          ))}
        </ul>
      </PageSection>

      <section className="mt-14 rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-orange-500/5 p-8 text-center md:p-12">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          Découvre où tu en es vraiment.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Connecte ta page Facebook à CreaFix AI. En 60 secondes, on te dit combien il te
          manque pour devenir éligible aux In-Stream Ads.
        </p>
        <div className="mt-5">
          <Button asChild size="lg" variant="brand">
            <Link href="/signup">
              Lancer mon audit gratuit <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
