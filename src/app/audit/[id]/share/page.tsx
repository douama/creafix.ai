import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Flame,
  Eye,
  DollarSign,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { AuroraBg } from "@/components/marketing/aurora-bg";
import { ShareButtons } from "@/components/marketing/share-buttons";

// Mock data — en prod : récupérer depuis Supabase via id
async function getAuditById(_id: string) {
  return {
    handle: "@fatou_tv",
    initials: "FT",
    flag: "🇸🇳",
    country: "Sénégal",
    platform: "TikTok",
    followers: "184K",
    scoreGlobal: 78,
    scores: {
      viral: 82,
      rpm: 64,
      shadowban: 28,
      engagement: 81,
    },
    revenue: { current: 240, projected: 840 },
    highlight: "Top 8% des comptes Sénégal ce mois",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAuditById(id);
  const title = `${audit.handle} a un score CreaFix de ${audit.scoreGlobal}/100`;
  const description = `${audit.highlight} · Score viral ${audit.scores.viral}/100 · RPM ${audit.scores.rpm}/100 · Revenus estimés $${audit.revenue.current} → $${audit.revenue.projected}/mois.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og/audit?id=${id}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/audit?id=${id}`],
    },
  };
}

export default async function AuditSharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const audit = await getAuditById(id);
  const shareUrl = `https://creafix.ai/audit/${id}/share`;
  const shareText = `Mon score CreaFix : ${audit.scoreGlobal}/100 🚀 ${audit.highlight}. Découvre le tien :`;

  return (
    <>
      <AuroraBg />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-[100px] pb-12 md:pt-[116px] md:pb-16">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              {/* Hero card — partageable */}
              <div className="relative overflow-hidden rounded-3xl border border-[#EC4899]/40 bg-gradient-to-br from-[#EC4899]/[0.12] via-card/40 to-card/40 p-8 backdrop-blur-2xl md:p-12">
                <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[800px] -translate-x-1/2 rounded-full bg-[#EC4899]/25 blur-3xl" />

                <div className="relative grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FBBF24]">
                      <Trophy className="h-3 w-3" />
                      {audit.highlight}
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#FF8A00] font-display text-base font-bold text-white shadow-lg shadow-[#EC4899]/30">
                        {audit.initials}
                      </div>
                      <div>
                        <h1 className="font-display text-2xl font-bold md:text-3xl">
                          {audit.handle}
                        </h1>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {audit.flag} {audit.country} · {audit.platform} ·{" "}
                          {audit.followers} abonnés
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
                      <ScoreMini icon={Flame} label="Viral" value={audit.scores.viral} color="#FF8A00" />
                      <ScoreMini icon={DollarSign} label="RPM" value={audit.scores.rpm} color="#10B981" />
                      <ScoreMini icon={Eye} label="Shadowban" value={audit.scores.shadowban} color="#F43F5E" invert />
                      <ScoreMini icon={TrendingUp} label="Engagement" value={audit.scores.engagement} color="#FF8A00" />
                    </div>

                    <div className="mt-5 rounded-xl border border-[#EC4899]/30 bg-[#EC4899]/[0.06] p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Revenus estimés
                      </div>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        <span className="font-display text-xl font-bold">
                          ${audit.revenue.current}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="font-display text-xl font-bold text-emerald-500 dark:text-emerald-300">
                          ${audit.revenue.projected}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          /mois avec CreaFix
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score circle */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative h-[180px] w-[180px]">
                      <svg viewBox="0 0 100 100" className="-rotate-90">
                        <defs>
                          <linearGradient id="score-stroke" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#EC4899" />
                            <stop offset="50%" stopColor="#FF8A00" />
                            <stop offset="100%" stopColor="#FF8A00" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="hsl(var(--muted) / 0.3)"
                          strokeWidth="6"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="url(#score-stroke)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${(audit.scoreGlobal / 100) * 264} 264`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-display text-5xl font-bold">
                          {audit.scoreGlobal}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Score CreaFix /100
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
                      <Sparkles className="h-2.5 w-2.5" />
                      Audit IA · 60s
                    </div>
                  </div>
                </div>
              </div>

              {/* Share buttons */}
              <div className="mt-6 rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-base font-bold">
                      Partage ton score
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Défie tes amis créateurs · gagne 1 audit Pro par partage
                    </p>
                  </div>
                  <ShareButtons url={shareUrl} text={shareText} />
                </div>
              </div>

              {/* CTA visiteur */}
              <div className="mt-8 rounded-3xl border border-[#EC4899]/30 bg-gradient-to-br from-[#EC4899]/[0.08] via-card/40 to-card/40 p-8 text-center backdrop-blur-2xl md:p-12">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FF8A00]">
                  <Sparkles className="h-3 w-3" />
                  Ton tour
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                  Découvre ton score CreaFix
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-muted-foreground md:text-base">
                  Audit IA en 60 secondes. 100% gratuit. Sans carte bancaire.
                </p>
                <Link
                  href={`/signup?ref=audit-${id}`}
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#EC4899] via-[#FF8A00] to-[#FF8A00] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EC4899]/30"
                >
                  Lancer mon audit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ScoreMini({
  icon: Icon,
  label,
  value,
  color,
  invert,
}: {
  icon: typeof Flame;
  label: string;
  value: number;
  color: string;
  invert?: boolean;
}) {
  const display = invert ? 100 - value : value;
  return (
    <div
      className="rounded-xl border bg-background/40 p-3"
      style={{ borderColor: `${color}55` }}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-2.5 w-2.5" style={{ color }} />
        {label}
      </div>
      <div className="mt-1 font-display text-base font-bold" style={{ color }}>
        {display}
        <span className="text-[10px] text-muted-foreground/60">/100</span>
      </div>
    </div>
  );
}
