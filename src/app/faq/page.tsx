import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHero } from "@/components/marketing/page-shell";
import { FAQ } from "@/components/marketing/faq";

export const metadata = {
  title: "Questions fréquentes",
  description: "Tout ce que tu dois savoir avant de te lancer sur Monetiq AI.",
};

export default function FAQPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "FAQ", href: "/faq" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <HelpCircle className="h-3 w-3" /> Support
            </>
          }
          title={
            <>
              Questions <span className="gradient-text">fréquentes</span>.
            </>
          }
          subtitle="Réponses aux questions les plus posées par nos créateurs et agences."
        />
      }
    >
      <FAQ />
      <section className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-card/40 p-6 text-center backdrop-blur md:p-8">
        <MessageCircle className="mx-auto h-6 w-6 text-violet-500" />
        <h2 className="mt-3 font-display text-xl font-bold">Toujours une question ?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Notre équipe répond en moins d'une heure, en français, wolof, anglais ou pidgin.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button asChild variant="brand">
            <Link href="/contact">Contacter l'équipe</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/help">Centre d'aide</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
