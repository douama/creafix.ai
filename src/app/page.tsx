import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { SocialProof } from "@/components/marketing/social-proof";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { AfricanTrendEngine } from "@/components/marketing/african-trend-engine";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

/**
 * Landing CinetPay-style — clean, light, structuré.
 *
 * 7 sections aérées au lieu de 19 sections empilées :
 * 1. Hero (avec surligneur orange incliné)
 * 2. SocialProof (logos clients + chiffres trust)
 * 3. Features (3-4 features iconiques)
 * 4. HowItWorks (4 étapes simples)
 * 5. AfricanTrendEngine (différenciateur)
 * 6. Testimonials (avis créateurs)
 * 7. Pricing
 * 8. FAQ
 * 9. CTA + Footer
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <AfricanTrendEngine />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
