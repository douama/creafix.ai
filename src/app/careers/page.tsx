import Link from "next/link";
import { ArrowRight, Briefcase, Globe, Heart, Rocket, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Carrières",
  description: "Rejoins l'équipe qui construit la plus grande plateforme créateur d'Afrique.",
};

const openings = [
  { dep: "Engineering", title: "Senior Full-Stack Engineer (Next.js + Postgres)", loc: "Dakar / Remote Afrique", type: "CDI" },
  { dep: "Engineering", title: "ML Engineer — Multi-agents IA", loc: "Remote Afrique", type: "CDI" },
  { dep: "Engineering", title: "Mobile Engineer Flutter (iOS + Android)", loc: "Dakar / Abidjan", type: "CDI" },
  { dep: "Produit", title: "Senior Product Designer", loc: "Remote Afrique", type: "CDI" },
  { dep: "Croissance", title: "Country Manager Nigeria", loc: "Lagos", type: "CDI" },
  { dep: "Croissance", title: "Content Manager (FR/EN)", loc: "Dakar / Casablanca", type: "CDI" },
  { dep: "Support", title: "Customer Success bilingue FR/EN", loc: "Remote Afrique", type: "CDI" },
];

const perks = [
  { icon: Globe, t: "Remote-first Afrique", d: "Travaille depuis n'importe quel pays africain." },
  { icon: Heart, t: "Mutuelle santé premium", d: "Pour toi et ta famille, dans tous nos pays." },
  { icon: Rocket, t: "Stock options", d: "Tu construis l'outil, tu en es propriétaire." },
  { icon: Zap, t: "Budget équipement", d: "MacBook Pro + écran + accessoires." },
  { icon: Users, t: "Off-site annuel", d: "On se retrouve une fois par an en personne." },
  { icon: Briefcase, t: "Formation continue", d: "Budget annuel pour livres, cours, confs." },
];

export default function CareersPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Carrières", href: "/careers" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Briefcase className="h-3 w-3" /> 7 offres ouvertes
            </>
          }
          title={
            <>
              Construis le futur des <span className="gradient-text">créateurs africains</span>.
            </>
          }
          subtitle="Une équipe ambitieuse, remote-first, qui croit que la prochaine vague de créateurs vient d'Afrique."
        />
      }
    >
      <PageSection title="Offres ouvertes">
        <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur">
          {openings.map((o, i) => (
            <Link
              key={o.title}
              href={`/contact?topic=jobs&role=${encodeURIComponent(o.title)}`}
              className={`group grid grid-cols-12 items-center gap-3 px-5 py-4 transition-colors hover:bg-card/60 ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="col-span-12 md:col-span-7">
                <div className="text-xs uppercase tracking-wider text-violet-500">{o.dep}</div>
                <div className="mt-0.5 font-medium">{o.title}</div>
              </div>
              <div className="col-span-6 text-sm text-muted-foreground md:col-span-3">
                {o.loc}
              </div>
              <div className="col-span-4 md:col-span-1">
                <Badge variant="outline">{o.type}</Badge>
              </div>
              <div className="col-span-2 flex justify-end md:col-span-1">
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </PageSection>

      <PageSection title="Pourquoi nous rejoindre">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {perks.map((p) => (
            <div
              key={p.t}
              className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-brand shadow-lg">
                <p.icon className="h-5 w-5 text-white" />
              </div>
              <div className="mt-3 font-display font-semibold">{p.t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.d}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <section className="mt-14 rounded-3xl border border-border bg-card/40 p-8 text-center backdrop-blur md:p-12">
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          Pas vu d'offre pour toi ?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Si tu penses pouvoir nous aider à atteindre 1M de créateurs accompagnés, écris-nous.
        </p>
        <div className="mt-5">
          <Button asChild variant="brand">
            <Link href="/contact?topic=jobs">
              Candidature spontanée <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
