import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { SevenAgents } from "@/components/marketing/seven-agents";
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
 * Wrapper .lg-shell : applique le langage Liquid Glass (Apple Sequoia)
 * — ambient orbs colorés + glass refractif sur toutes les cards.
 *
 * 7 sections aérées :
 * 1. Hero (surligneur orange incliné + glass)
 * 2. SocialProof
 * 3. Features
 * 4. HowItWorks
 * 5. AfricanTrendEngine (différenciateur)
 * 6. Testimonials
 * 7. Pricing
 * 8. FAQ
 * 9. CTA + Footer
 */
export default function HomePage() {
  return (
    <div className="lg-shell relative overflow-hidden">
      {/* Floating ambient orbs — pure deco */}
      <div className="lg-orb lg-orb-orange left-[-8%] top-[6%] h-[420px] w-[420px]" style={{ animationDelay: "0s" }} />
      <div className="lg-orb lg-orb-purple right-[-6%] top-[18%] h-[380px] w-[380px]" style={{ animationDelay: "-5s" }} />
      <div className="lg-orb lg-orb-cyan left-[40%] top-[55%] h-[460px] w-[460px]" style={{ animationDelay: "-10s" }} />
      <div className="lg-orb lg-orb-orange right-[-4%] top-[78%] h-[340px] w-[340px]" style={{ animationDelay: "-3s" }} />

      <Navbar />
      <main className="relative">
        <Hero />
        <SevenAgents />
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
    </div>
  );
}
