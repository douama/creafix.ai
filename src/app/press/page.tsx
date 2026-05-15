import Link from "next/link";
import { ArrowRight, Download, FileText, Mail, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Presse",
  description: "Press kit, communiqués, et contact média de Monetiq AI.",
};

const press = [
  {
    source: "Jeune Afrique",
    date: "Mai 2026",
    title: "Cette startup sénégalaise veut faire vivre 1 million de créateurs africains",
    href: "#",
  },
  {
    source: "Techpoint Africa",
    date: "Avril 2026",
    title: "Monetiq AI raises pre-seed to bring AI to African creator economy",
    href: "#",
  },
  {
    source: "BBC Afrique",
    date: "Mars 2026",
    title: "Reportage : comment l'IA aide les TikTokeurs de Dakar à percer",
    href: "#",
  },
  {
    source: "Forbes Afrique",
    date: "Février 2026",
    title: "Top 30 startups africaines à suivre en 2026",
    href: "#",
  },
];

const assets = [
  { name: "Logo principal (PNG)", size: "120 KB" },
  { name: "Logo principal (SVG)", size: "8 KB" },
  { name: "Wordmark blanc (PNG)", size: "95 KB" },
  { name: "Wordmark noir (PNG)", size: "95 KB" },
  { name: "Captures dashboard (ZIP)", size: "12 MB" },
  { name: "Photos équipe (ZIP)", size: "28 MB" },
];

export default function PressPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Presse", href: "/press" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Newspaper className="h-3 w-3" /> Espace presse
            </>
          }
          title={
            <>
              Notre histoire dans <span className="gradient-text">les médias</span>.
            </>
          }
          subtitle="Couvertures presse, communiqués officiels, kit média et contact direct."
        >
          <div>
            <Button asChild variant="brand">
              <Link href="mailto:press@monetiq.ai">
                <Mail className="mr-1 h-4 w-4" /> press@monetiq.ai
              </Link>
            </Button>
          </div>
        </PageHero>
      }
    >
      <PageSection title="Ils ont parlé de nous">
        <div className="grid gap-3 md:grid-cols-2">
          {press.map((p) => (
            <a
              key={p.title}
              href={p.href}
              className="group rounded-2xl border border-border bg-card/40 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-card/60 hover:shadow-lg"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-violet-500">
                  {p.source}
                </span>
                <span className="text-muted-foreground">{p.date}</span>
              </div>
              <h3 className="mt-3 font-display text-base font-semibold leading-snug md:text-lg">
                {p.title}
              </h3>
              <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                Lire l'article <ArrowRight className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </PageSection>

      <PageSection title="Press kit · à télécharger">
        <div className="grid gap-2">
          {assets.map((a) => (
            <button
              key={a.name}
              className="group flex items-center justify-between rounded-xl border border-border bg-card/40 px-4 py-3 text-left backdrop-blur transition-colors hover:bg-card/60"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{a.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{a.size}</span>
                <Download className="h-4 w-4 transition-colors group-hover:text-foreground" />
              </div>
            </button>
          ))}
        </div>
      </PageSection>

      <PageSection title="Facts & figures (mise à jour mensuelle)">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { v: "Mai 2024", l: "Création" },
            { v: "+2 300", l: "Créateurs" },
            { v: "9", l: "Pays" },
            { v: "Dakar", l: "Siège" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-border bg-card/40 p-4 text-center backdrop-blur"
            >
              <div className="font-display text-xl font-bold md:text-2xl">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Demandes presse :{" "}
        <a href="mailto:press@monetiq.ai" className="text-violet-500 underline">
          press@monetiq.ai
        </a>{" "}
        · Réponse sous 24h ouvrées
      </p>
    </PageShell>
  );
}
