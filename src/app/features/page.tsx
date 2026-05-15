import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero } from "@/components/marketing/page-shell";
import { Features } from "@/components/marketing/features";
import { AgentsShowcase } from "@/components/marketing/agents";
import { HowItWorks } from "@/components/marketing/how-it-works";

export const metadata = {
  title: "Fonctionnalités",
  description:
    "9 outils IA réunis dans une seule plateforme : audit, anti-ban, viral, monétisation, génération de contenu, estimateur revenus.",
};

export default function FeaturesPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Fonctionnalités", href: "/features" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Sparkles className="h-3 w-3 text-amber-400" /> Tout l'arsenal CreaFix AI
            </>
          }
          title={
            <>
              Tout ce qu'il te faut pour{" "}
              <span className="gradient-text">débloquer ta monétisation</span>.
            </>
          }
          subtitle="9 outils IA conçus pour les créateurs africains, 7 agents IA orchestrés, des estimations CPM/RPM réelles dans 9 pays. Une seule plateforme."
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="lg" variant="brand">
              <Link href="/signup">
                Démarrer mon audit gratuit <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">Voir les tarifs</Link>
            </Button>
          </div>
        </PageHero>
      }
    >
      <Features />
      <HowItWorks />
      <AgentsShowcase />
    </PageShell>
  );
}
