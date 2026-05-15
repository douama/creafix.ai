import { AuroraBg } from "@/components/marketing/aurora-bg";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { SocialProof } from "@/components/marketing/social-proof";
import { LiveActivity } from "@/components/marketing/live-activity";
import { SampleAudit } from "@/components/marketing/sample-audit";
import { LiveDashboard } from "@/components/marketing/live-dashboard";
import { RevenueLeakScanner } from "@/components/marketing/revenue-leak";
import { PlatformsSection } from "@/components/marketing/platforms-section";
import { WowFeatures } from "@/components/marketing/wow-features";
import { AfricanTrendEngine } from "@/components/marketing/african-trend-engine";
import { Demonetized } from "@/components/marketing/demonetized";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { BeforeAfter } from "@/components/marketing/before-after";
import { AgentsShowcase } from "@/components/marketing/agents";
import { Testimonials } from "@/components/marketing/testimonials";
import { Comparison } from "@/components/marketing/comparison";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <>
      <AuroraBg />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <LiveActivity />
        <SampleAudit />
        <LiveDashboard />
        <RevenueLeakScanner />
        <PlatformsSection />
        <WowFeatures />
        <AfricanTrendEngine />
        <Demonetized />
        <Features />
        <HowItWorks />
        <BeforeAfter />
        <AgentsShowcase />
        <Testimonials />
        <Comparison />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
