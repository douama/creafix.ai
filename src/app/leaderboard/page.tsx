import type { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  TrendingUp,
  Flame,
  Crown,
  Medal,
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { AuroraBg } from "@/components/marketing/aurora-bg";

export const metadata: Metadata = {
  title: "Leaderboard créateurs Afrique 2026 · CreaFix AI",
  description:
    "Classement live des top créateurs africains par pays. Score CreaFix : viral, RPM, engagement, croissance. Mise à jour hebdomadaire.",
  keywords: [
    "top créateurs Afrique",
    "leaderboard TikTok Afrique",
    "meilleurs créateurs Sénégal",
    "classement YouTubers Nigeria",
    "influenceurs Maroc 2026",
  ],
};

type Creator = {
  rank: number;
  handle: string;
  initials: string;
  country: string;
  flag: string;
  platform: string;
  followers: string;
  score: number;
  growth: string;
  niche: string;
  highlight?: string;
  color: string;
};

const LEADERBOARD: Creator[] = [
  { rank: 1, handle: "@davido", initials: "DV", country: "Nigeria", flag: "🇳🇬", platform: "TikTok", followers: "8.2M", score: 96, growth: "+12%", niche: "Musique", highlight: "Album viral", color: "#10B981" },
  { rank: 2, handle: "@tyla", initials: "TY", country: "Afrique du Sud", flag: "🇿🇦", platform: "TikTok", followers: "6.8M", score: 94, growth: "+18%", niche: "Musique", highlight: "Hit Water", color: "#FBBF24" },
  { rank: 3, handle: "@didi_b", initials: "DB", country: "Côte d'Ivoire", flag: "🇨🇮", platform: "TikTok", followers: "4.1M", score: 92, growth: "+24%", niche: "Musique", highlight: "Lou Pra", color: "#FF8A00" },
  { rank: 4, handle: "@elgrandetoto", initials: "ET", country: "Maroc", flag: "🇲🇦", platform: "Instagram", followers: "3.8M", score: 90, growth: "+9%", niche: "Musique", color: "#7B61FF" },
  { rank: 5, handle: "@asake", initials: "AS", country: "Nigeria", flag: "🇳🇬", platform: "YouTube", followers: "3.2M", score: 89, growth: "+15%", niche: "Musique", color: "#10B981" },
  { rank: 6, handle: "@wally_b_seck", initials: "WS", country: "Sénégal", flag: "🇸🇳", platform: "TikTok", followers: "2.4M", score: 87, growth: "+11%", niche: "Musique", color: "#FF8A00" },
  { rank: 7, handle: "@dj_maphorisa", initials: "DM", country: "Afrique du Sud", flag: "🇿🇦", platform: "TikTok", followers: "2.1M", score: 86, growth: "+8%", niche: "Musique", color: "#FBBF24" },
  { rank: 8, handle: "@locko_official", initials: "LK", country: "Cameroun", flag: "🇨🇲", platform: "Instagram", followers: "1.8M", score: 84, growth: "+13%", niche: "Musique", color: "#F43F5E" },
  { rank: 9, handle: "@suspect_95", initials: "S9", country: "Côte d'Ivoire", flag: "🇨🇮", platform: "TikTok", followers: "1.6M", score: 83, growth: "+19%", niche: "Musique", color: "#FF8A00" },
  { rank: 10, handle: "@iss_814", initials: "I8", country: "Sénégal", flag: "🇸🇳", platform: "TikTok", followers: "1.4M", score: 82, growth: "+22%", niche: "Musique", color: "#FF8A00" },
  { rank: 11, handle: "@inkonnu", initials: "IK", country: "Maroc", flag: "🇲🇦", platform: "YouTube", followers: "1.3M", score: 81, growth: "+6%", niche: "Musique", color: "#7B61FF" },
  { rank: 12, handle: "@kabza_de_small", initials: "KS", country: "Afrique du Sud", flag: "🇿🇦", platform: "TikTok", followers: "1.2M", score: 80, growth: "+14%", niche: "Musique", color: "#FBBF24" },
];

const COUNTRIES_FILTER = [
  { code: "all", label: "Tous les pays", flag: "🌍" },
  { code: "sn", label: "Sénégal", flag: "🇸🇳" },
  { code: "ci", label: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "ng", label: "Nigeria", flag: "🇳🇬" },
  { code: "ma", label: "Maroc", flag: "🇲🇦" },
  { code: "za", label: "Afrique du Sud", flag: "🇿🇦" },
];

export default function LeaderboardPage() {
  const podium = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  return (
    <>
      <AuroraBg />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-[100px] pb-10 md:pt-[116px] md:pb-14">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FBBF24]">
                <Trophy className="h-3 w-3" />
                Leaderboard live · mai 2026
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">
                Les <span className="gradient-text">top créateurs</span>{" "}
                africains du mois
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
                Classement live des 100 meilleurs créateurs africains, scoré par
                l&apos;IA CreaFix sur 6 critères : viral, RPM, engagement,
                croissance, consistency, monétisation.
              </p>
            </div>
          </div>
        </section>

        <section className="relative py-6">
          <div className="container">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2">
              {COUNTRIES_FILTER.map((c, i) => (
                <button
                  key={c.code}
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    i === 0
                      ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                      : "border-border bg-card/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Podium */}
        <section className="relative py-10">
          <div className="container">
            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
              {podium.map((c, i) => {
                const PodiumIcon = i === 0 ? Crown : i === 1 ? Medal : Award;
                return (
                  <div
                    key={c.handle}
                    className={`relative overflow-hidden rounded-3xl border bg-card/40 p-6 backdrop-blur-xl ${
                      i === 0
                        ? "border-[#FBBF24]/40 md:order-2 md:-mt-4 md:scale-105"
                        : i === 1
                        ? "border-zinc-400/40 md:order-1"
                        : "border-amber-700/40 md:order-3"
                    }`}
                  >
                    <div
                      className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl"
                      style={{ backgroundColor: c.color }}
                    />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <PodiumIcon
                          className={`h-7 w-7 ${
                            i === 0 ? "text-[#FBBF24]" : i === 1 ? "text-zinc-400" : "text-amber-700"
                          }`}
                        />
                        <span
                          className="inline-flex items-center gap-1 rounded-full border bg-background/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            color: c.color,
                            borderColor: `${c.color}55`,
                          }}
                        >
                          #{c.rank}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center gap-3">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl text-base font-bold text-white shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)`,
                            boxShadow: `0 10px 24px -8px ${c.color}66`,
                          }}
                        >
                          {c.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-display text-base font-bold">
                            {c.handle}
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">
                            {c.flag} {c.country} · {c.platform}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <Stat label="Score" value={`${c.score}`} sub="/100" />
                        <Stat label="Abos" value={c.followers} />
                        <Stat
                          label="Growth"
                          value={c.growth}
                          color="#10B981"
                        />
                      </div>

                      {c.highlight && (
                        <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#7B61FF]">
                          <Flame className="h-2.5 w-2.5" />
                          {c.highlight}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Rest of leaderboard */}
        <section className="relative py-6">
          <div className="container">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
              <div className="hidden grid-cols-[60px_1.5fr_1fr_0.8fr_0.8fr_0.8fr] items-center gap-3 border-b border-border bg-background/40 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
                <div>Rang</div>
                <div>Créateur</div>
                <div>Pays · Plateforme</div>
                <div className="text-center">Score</div>
                <div className="text-center">Abos</div>
                <div className="text-right">Growth</div>
              </div>

              <ul>
                {rest.map((c, i) => (
                  <li
                    key={c.handle}
                    className={`grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-card/30 md:grid-cols-[60px_1.5fr_1fr_0.8fr_0.8fr_0.8fr] md:px-5 md:py-3 last:border-0 ${
                      i % 2 === 0 ? "" : "bg-background/20"
                    }`}
                  >
                    <div className="font-display text-sm font-bold text-muted-foreground">
                      #{c.rank}
                    </div>

                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)`,
                        }}
                      >
                        {c.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-display text-sm font-bold">
                          {c.handle}
                        </div>
                        <div className="truncate text-[10px] text-muted-foreground md:hidden">
                          {c.flag} {c.country} · {c.followers}
                        </div>
                      </div>
                    </div>

                    <div className="hidden text-xs text-muted-foreground md:block">
                      {c.flag} {c.country} · {c.platform}
                    </div>

                    <div className="hidden text-center md:block">
                      <span
                        className="font-display text-sm font-bold"
                        style={{ color: c.color }}
                      >
                        {c.score}
                      </span>
                      <span className="text-[10px] text-muted-foreground">/100</span>
                    </div>

                    <div className="hidden text-center text-xs font-semibold md:block">
                      {c.followers}
                    </div>

                    <div className="text-right text-xs font-bold text-emerald-500 dark:text-emerald-300">
                      <TrendingUp className="mr-0.5 inline h-3 w-3" />
                      {c.growth}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Top 100 mis à jour chaque lundi · Scoring IA propriétaire CreaFix
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-10 md:py-14">
          <div className="container">
            <div className="mx-auto max-w-4xl rounded-3xl border border-[#7B61FF]/30 bg-gradient-to-br from-[#7B61FF]/[0.08] via-card/40 to-card/40 p-8 text-center backdrop-blur-2xl md:p-12">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FF8A00]">
                <Sparkles className="h-3 w-3" />
                Entre dans le classement
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                Ton score CreaFix ?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-muted-foreground md:text-base">
                Connecte ton compte et reçois ton score IA (sur les 6 critères du
                classement). Apparais dans le leaderboard si tu es dans le top 100
                de ton pays.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7B61FF] via-[#FF8A00] to-[#FF8A00] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7B61FF]/30"
              >
                Obtenir mon score CreaFix
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2 text-center">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-sm font-bold" style={color ? { color } : undefined}>
        {value}
        {sub && <span className="text-[9px] text-muted-foreground/60">{sub}</span>}
      </div>
    </div>
  );
}
