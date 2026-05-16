import { Coins } from "lucide-react";
import { PageShell, PageHero } from "@/components/marketing/page-shell";
import { Pricing } from "@/components/marketing/pricing";
import { PaymentMethods } from "@/components/marketing/payment-methods";
import { FAQ } from "@/components/marketing/faq";

export const metadata = {
  title: "Tarifs",
  description:
    "Plans Créateur, Pro et Agence à des prix pensés pour l'Afrique — en FCFA, Naira, USD ou Mobile Money.",
};

export default function PricingPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Tarifs", href: "/pricing" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Coins className="h-3 w-3 text-amber-400" /> Tarifs accessibles
            </>
          }
          title={
            <>
              Des tarifs <span className="gradient-text">accessibles à l'Afrique</span>.
            </>
          }
          subtitle="Paie en FCFA, en Naira, en Dirham, en USD ou via Mobile Money. Aucun engagement, annulable à tout moment."
        />
      }
    >
      <Pricing />
      <PaymentMethods />
      <FAQ />
    </PageShell>
  );
}
