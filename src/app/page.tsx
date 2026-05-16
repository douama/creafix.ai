import { CfxNavbar } from "@/components/marketing/cfx/navbar";
import { CfxHero } from "@/components/marketing/cfx/hero";
import { CfxAIDashboard } from "@/components/marketing/cfx/ai-dashboard";
import { CfxPlatforms } from "@/components/marketing/cfx/platforms";
import { CfxFeatures } from "@/components/marketing/cfx/features";
import { CfxAfricanEngine } from "@/components/marketing/cfx/african-engine";
import { CfxTestimonials } from "@/components/marketing/cfx/testimonials";
import { CfxPricing } from "@/components/marketing/cfx/pricing";
import { CfxFaq } from "@/components/marketing/cfx/faq";
import { CfxCta } from "@/components/marketing/cfx/cta";
import { CfxFooter } from "@/components/marketing/cfx/footer";

/**
 * Landing CreaFix AI — Fintech navy + AI cyan/purple (2026 redesign).
 * Inspirations : Stripe · Linear · Vercel · Framer · CinetPay.
 */
export default function HomePage() {
  return (
    <div className="cfx-shell min-h-screen">
      <CfxNavbar />
      <main>
        <CfxHero />
        <CfxPlatforms />
        <CfxAIDashboard />
        <CfxFeatures />
        <CfxAfricanEngine />
        <CfxTestimonials />
        <CfxPricing />
        <CfxFaq />
        <CfxCta />
      </main>
      <CfxFooter />
    </div>
  );
}
