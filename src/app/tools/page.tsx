import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, TrendingUp, Flame } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { AuroraBg } from "@/components/marketing/aurora-bg";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Outils IA gratuits pour créateurs · CreaFix AI",
  description:
    "Tous les outils IA gratuits CreaFix : TikTok Monetization Checker, Facebook Shadowban Checker, RPM Calculator Africa, TikTok Trends 2026.",
  keywords: [
    "outils créateurs Afrique",
    "TikTok checker",
    "Facebook shadowban",
    "RPM Africa",
    "TikTok trends",
  ],
};

const CATEGORY_ICONS = {
  shadowban: Shield,
  monetization: Sparkles,
  rpm: TrendingUp,
  trends: Flame,
};

const CATEGORY_COLORS = {
  shadowban: "#F43F5E",
  monetization: "#EC4899",
  rpm: "#10B981",
  trends: "#FF8A00",
};

export default function ToolsIndexPage() {
  return (
    <>
      <AuroraBg />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-[100px] pb-12 md:pt-[116px] md:pb-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#EC4899]">
                <Sparkles className="h-3 w-3" />
                Outils gratuits
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">
                {TOOLS.length} outils IA pour <span className="gradient-text">créateurs africains</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
                Tous les checkers, calculateurs et scanners CreaFix AI. 100%
                gratuits, sans inscription, résultats en 60 secondes.
              </p>
            </div>
          </div>
        </section>

        <section className="relative py-10 md:py-14">
          <div className="container">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool) => {
                const Icon = CATEGORY_ICONS[tool.category];
                const color = CATEGORY_COLORS[tool.category];
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-xl"
                  >
                    <div
                      className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-40"
                      style={{ backgroundColor: color }}
                    />
                    <div className="relative">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-xl border text-2xl"
                          style={{
                            backgroundColor: `${color}1A`,
                            borderColor: `${color}55`,
                          }}
                        >
                          {tool.emoji}
                        </div>
                        <span
                          className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            color,
                            borderColor: `${color}55`,
                            backgroundColor: `${color}1A`,
                          }}
                        >
                          <Icon className="h-2.5 w-2.5" />
                          {tool.category}
                        </span>
                      </div>
                      <h2 className="mt-4 font-display text-base font-bold leading-tight">
                        {tool.title}
                      </h2>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {tool.description}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-foreground transition-colors group-hover:text-[#EC4899]">
                        Lancer l&apos;outil
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
