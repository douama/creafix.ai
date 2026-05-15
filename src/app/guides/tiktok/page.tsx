import Link from "next/link";
import { ArrowRight, CheckCircle2, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Guide TikTok Afrique",
  description:
    "Le guide complet TikTok pour les créateurs africains : Creator Rewards, lives, brand deals, hashtags qui marchent.",
};

const eligibility = [
  { c: "10 000 followers", details: "Critère d'entrée Creator Rewards Program." },
  { c: "100 000 vues sur 30 derniers jours", details: "Vidéos > 1 min uniquement." },
  { c: "Âge 18+", details: "Compte vérifié obligatoire." },
  { c: "Vidéos originales > 1 min", details: "Vidéos courtes (< 1 min) non éligibles." },
  { c: "Pays éligible TikTok", details: "RSA, Maroc, Nigeria, Égypte… (liste en expansion)." },
  { c: "Respect des Community Guidelines", details: "0 violation sur 90 derniers jours." },
];

const sources = [
  { name: "Creator Rewards Program", desc: "Programme officiel pour les vidéos longues qualitatives." },
  { name: "TikTok LIVE Gifts", desc: "Tes fans t'envoient des diamants pendant tes lives." },
  { name: "Series", desc: "Vends des séries de contenu premium directement sur TikTok." },
  { name: "Brand Deals (Creator Marketplace)", desc: "Partenariats sponsorisés via la plateforme officielle." },
  { name: "Affiliation TikTok Shop", desc: "Vends des produits e-commerce dans tes vidéos (selon pays)." },
];

const tactics = [
  { t: "Hook visuel choc dans 0-2s", d: "Sinon swipe garanti. Test l'A/B avec notre Hook Agent." },
  { t: "Format vertical natif 9:16", d: "Pas de bandes noires. Tournage smartphone OK." },
  { t: "Hashtags locaux + niche", d: "#DakarMood + #FoodHack > juste #fyp générique." },
  { t: "Sons trending récents", d: "Privilégier les sons dans les 7 derniers jours." },
  { t: "Captions courtes + question", d: "Stimule les commentaires (signal algo)." },
  { t: "Publier 1-2× par jour", d: "Régularité > volume pour le FYP." },
];

export default function TikTokGuidePage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Guides", href: "/blog" },
        { label: "TikTok Afrique", href: "/guides/tiktok" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Music2 className="h-3 w-3 text-pink-500" /> Guide complet · 10 min
            </>
          }
          title={
            <>
              Maîtriser <span className="gradient-text">TikTok en Afrique</span> en 2026.
            </>
          }
          subtitle="Le guide actionnable pour passer de spectateur à créateur monétisé. Tactiques FYP, Creator Rewards, lives, brand deals."
        />
      }
    >
      <PageSection title="1. Critères Creator Rewards Program">
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

      <PageSection title="2. 5 sources de revenus TikTok">
        <div className="space-y-3">
          {sources.map((s, i) => (
            <div
              key={s.name}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 font-display text-sm font-bold text-white">
                {i + 1}
              </div>
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="3. Les 6 tactiques FYP qui marchent vraiment"
        subtitle="Validées sur les profils de nos +2 300 créateurs africains."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {tactics.map((tac) => (
            <div
              key={tac.t}
              className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur"
            >
              <div className="font-medium">{tac.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{tac.d}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="4. Les meilleures niches africaines TikTok 2026">
        <div className="flex flex-wrap gap-2">
          {[
            "Cuisine africaine",
            "Humour local",
            "Football africain",
            "Mode & beauté afro",
            "Finance & Mobile Money",
            "Gossip célébrités",
            "Religion & spiritualité",
            "Tech & IA",
            "Crypto débutants",
            "Education express",
            "Cars & lifestyle",
            "Sport & fitness",
          ].map((n) => (
            <span
              key={n}
              className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm"
            >
              {n}
            </span>
          ))}
        </div>
      </PageSection>

      <section className="mt-14 rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-violet-500/5 p-8 text-center md:p-12">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          Connecte ton TikTok à CreaFix AI.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Audit FYP, score viral, hashtags optimisés et idées personnalisées en 60 secondes.
        </p>
        <div className="mt-5">
          <Button asChild size="lg" variant="brand">
            <Link href="/signup">
              Auditer mon TikTok gratuitement <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
