import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  Shield,
  TrendingUp,
  Flame,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { AuroraBg } from "@/components/marketing/aurora-bg";
import { TOOLS, getTool, type Tool } from "@/lib/tools";

export const dynamicParams = false;

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.metaTitle,
      description: tool.metaDescription,
    },
  };
}

const CATEGORY_ICONS = {
  shadowban: Shield,
  monetization: Sparkles,
  rpm: TrendingUp,
  trends: Flame,
};

const CATEGORY_COLORS = {
  shadowban: "#F43F5E",
  monetization: "#7B61FF",
  rpm: "#10B981",
  trends: "#FF8A00",
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const Icon = CATEGORY_ICONS[tool.category];
  const color = CATEGORY_COLORS[tool.category];

  // JSON-LD pour SEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <AuroraBg />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-[100px] pb-12 md:pt-[116px] md:pb-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Link
                href="/tools"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                ← Tous les outils CreaFix
              </Link>

              <div
                className="mx-auto mt-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl"
                style={{
                  backgroundColor: `${color}1A`,
                  borderColor: `${color}55`,
                  boxShadow: `0 12px 32px -8px ${color}55`,
                }}
              >
                {tool.emoji}
              </div>

              <div
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  color,
                  borderColor: `${color}55`,
                  backgroundColor: `${color}1A`,
                }}
              >
                <Icon className="h-3 w-3" />
                Outil gratuit · sans inscription
              </div>

              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">
                {tool.h1}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
                {tool.description}
              </p>

              <form className="mx-auto mt-6 w-full max-w-xl">
                <label className="sr-only">{tool.inputLabel}</label>
                <div className="group relative flex items-center gap-1 rounded-full border border-border bg-card/60 p-1.5 backdrop-blur-xl focus-within:border-[#7B61FF]/60 focus-within:shadow-[0_0_0_4px_rgba(123,97,255,0.15)]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/60">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder={tool.inputPlaceholder}
                    className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground/70 md:text-base"
                  />
                  <Link
                    href="/signup"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7B61FF] via-[#00C2FF] to-[#FF8A00] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/30 transition-transform hover:scale-[1.02] md:px-5 md:text-sm"
                  >
                    {tool.ctaLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  100% gratuit · résultat en 60s · données mises à jour 2026
                </p>
              </form>
            </div>
          </div>
        </section>

        <section className="relative py-10 md:py-14">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Ce que tu obtiens
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {tool.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color }}
                      />
                      <div>
                        <h3 className="font-display text-base font-bold">{b.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-10 md:py-14">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-2xl font-bold md:text-3xl">FAQ</h2>
              <div className="mt-6 space-y-3">
                {tool.faq.map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl [&[open]>summary>svg]:rotate-90"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-3 text-left">
                      <h3 className="font-display text-base font-bold">{f.q}</h3>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-10 md:py-14">
          <div className="container">
            <div className="mx-auto max-w-4xl rounded-3xl border border-[#7B61FF]/30 bg-gradient-to-br from-[#7B61FF]/[0.08] via-card/40 to-card/40 p-8 text-center backdrop-blur-2xl md:p-12">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Audit IA complet CreaFix
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-muted-foreground md:text-base">
                Vas plus loin que cet outil : audit IA complet de tes 9
                plateformes, plan d&apos;action 30/60/90 jours, sons trending par
                pays, prédictions revenus.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7B61FF] via-[#00C2FF] to-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#7B61FF]/30"
                >
                  Créer mon compte gratuit
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card/70"
                >
                  Voir les autres outils
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
