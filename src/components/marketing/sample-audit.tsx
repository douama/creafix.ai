"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Eye,
  Flame,
  ShieldOff,
  Music2,
  Clock,
  DollarSign,
  ArrowRight,
  Hash,
  Image as ImageIcon,
  Users,
} from "lucide-react";

type Severity = "critical" | "warning" | "success";
type Issue = {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  count: number;
  severity: Severity;
};
type Score = {
  label: string;
  value: number;
  color: string;
  trend: string;
  invert?: boolean;
};

type Profile = {
  id: string;
  handle: string;
  initials: string;
  flag: string;
  country: string;
  platform: string;
  followers: string;
  globalScore: number;
  badgeColor: string;
  badgeFrom: string;
  badgeTo: string;
  revenue: { current: number; projected: number };
  scores: Score[];
  issues: Issue[];
  recommendations: string[];
};

const PROFILES: Profile[] = [
  {
    id: "sn",
    handle: "@fatou_tv",
    initials: "FT",
    flag: "🇸🇳",
    country: "Dakar",
    platform: "TikTok",
    followers: "184K abonnés",
    globalScore: 61,
    badgeColor: "#7B61FF",
    badgeFrom: "#7B61FF",
    badgeTo: "#00C2FF",
    revenue: { current: 240, projected: 840 },
    scores: [
      { label: "Score viral", value: 64, color: "#FF8A00", trend: "+12" },
      { label: "Score RPM", value: 38, color: "#F43F5E", trend: "-18" },
      { label: "Risque shadowban", value: 71, color: "#F43F5E", trend: "+9", invert: true },
      { label: "Engagement", value: 82, color: "#10B981", trend: "+24" },
    ],
    issues: [
      { icon: Music2, label: "Musique sous copyright", count: 3, severity: "critical" },
      { icon: Clock, label: "Watch time sous le seuil", count: 7, severity: "warning" },
      { icon: ShieldOff, label: "Portée -68% vs ref. 30j", count: 1, severity: "critical" },
      { icon: Eye, label: "Hooks faibles détectés", count: 5, severity: "warning" },
      { icon: Flame, label: "Opportunités virales", count: 4, severity: "success" },
    ],
    recommendations: [
      "Remplace l'audio des 3 vidéos en copyright par des sons trending Sénégal 🇸🇳",
      "Ajoute un hook de 3s sur les vidéos > 15s pour passer le watch time à 52%",
      "Active Reels Play Bonus avant le 25 mai (fenêtre éligibilité)",
      "Republie les 4 contenus à fort potentiel viral à 20h–22h GMT",
    ],
  },
  {
    id: "ng",
    handle: "@tunde_lagos",
    initials: "TL",
    flag: "🇳🇬",
    country: "Lagos",
    platform: "YouTube",
    followers: "412K abonnés",
    globalScore: 78,
    badgeColor: "#10B981",
    badgeFrom: "#10B981",
    badgeTo: "#FF8A00",
    revenue: { current: 1280, projected: 3640 },
    scores: [
      { label: "Score viral", value: 81, color: "#10B981", trend: "+19" },
      { label: "Score RPM", value: 72, color: "#10B981", trend: "+8" },
      { label: "Risque shadowban", value: 22, color: "#10B981", trend: "-14", invert: true },
      { label: "Engagement", value: 68, color: "#FF8A00", trend: "+6" },
    ],
    issues: [
      { icon: ImageIcon, label: "Miniatures sous-optimisées", count: 11, severity: "warning" },
      { icon: Clock, label: "CTR < seuil monétisation", count: 6, severity: "warning" },
      { icon: Hash, label: "Tags non-pertinents", count: 8, severity: "warning" },
      { icon: Flame, label: "Vidéos virales potentielles", count: 7, severity: "success" },
      { icon: TrendingUp, label: "Niches sous-exploitées", count: 3, severity: "success" },
    ],
    recommendations: [
      "Re-thumbnail tes 11 vidéos low-CTR avec visages + texte gros (test A/B inclus)",
      "Cible la niche finance Naira — CPM ×2.8 sur ton audience Nigeria",
      "Programme tes uploads 21h–23h Lagos (peak ad spend ton segment)",
      "Convertis tes 7 best shorts en formats long pour activer mid-roll ads",
    ],
  },
  {
    id: "ma",
    handle: "@karim.rabat",
    initials: "KR",
    flag: "🇲🇦",
    country: "Rabat",
    platform: "Instagram",
    followers: "96K abonnés",
    globalScore: 54,
    badgeColor: "#FF8A00",
    badgeFrom: "#FF8A00",
    badgeTo: "#F43F5E",
    revenue: { current: 480, projected: 1320 },
    scores: [
      { label: "Score viral", value: 58, color: "#FF8A00", trend: "+4" },
      { label: "Score RPM", value: 49, color: "#FF8A00", trend: "-7" },
      { label: "Risque shadowban", value: 63, color: "#F43F5E", trend: "+11", invert: true },
      { label: "Engagement", value: 74, color: "#10B981", trend: "+15" },
    ],
    issues: [
      { icon: Hash, label: "Hashtags bannés détectés", count: 4, severity: "critical" },
      { icon: ImageIcon, label: "Reels < 90s sous-monétisés", count: 12, severity: "warning" },
      { icon: Users, label: "Audience fantôme (-engagement)", count: 1, severity: "warning" },
      { icon: Flame, label: "Sons trending non utilisés", count: 6, severity: "success" },
      { icon: TrendingUp, label: "Carousels haute conv. dispo", count: 3, severity: "success" },
    ],
    recommendations: [
      "Retire les 4 hashtags bannés (#explorepage, #fyp côté Reels MENA)",
      "Allonge tes 12 Reels au-dessus de 90s pour activer Bonus Programme",
      "Active Subscriptions IG — éligibilité 96% atteinte avec ton engagement",
      "Lance 3 carousels sur ta niche lifestyle Maroc — RPM x1.9 vs Reels",
    ],
  },
];

export function SampleAudit() {
  const [selectedId, setSelectedId] = useState(PROFILES[0].id);
  const profile = PROFILES.find((p) => p.id === selectedId) ?? PROFILES[0];

  return (
    <section className="relative py-12 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-30 blur-3xl" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00C2FF]"
          >
            <Sparkles className="h-3 w-3" /> Audits réels
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Voilà ce que tu reçois{" "}
            <span className="gradient-text">en 60 secondes</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            3 audits réels générés pour des créateurs africains. Switche entre
            les profils pour voir comment l&apos;IA s&apos;adapte à chaque pays
            et plateforme.
          </motion.p>
        </div>

        {/* Tabs profils */}
        <div className="mx-auto mt-7 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          {PROFILES.map((p) => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`group relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all md:px-4 md:py-2 md:text-sm ${
                  active
                    ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground shadow-lg shadow-[#7B61FF]/15"
                    : "border-border bg-card/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                <span className="text-base leading-none">{p.flag}</span>
                <span>{p.handle}</span>
                <span className="hidden text-muted-foreground/70 sm:inline">
                  · {p.platform}
                </span>
                {active && (
                  <motion.span
                    layoutId="profile-active-dot"
                    className="ml-1 h-1.5 w-1.5 rounded-full bg-[#7B61FF]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-7 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/60 via-card/40 to-card/40 backdrop-blur-2xl"
          >
            <div
              className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[800px] -translate-x-1/2 rounded-full blur-3xl"
              style={{ backgroundColor: `${profile.badgeColor}26` }}
            />

            {/* Header bar */}
            <div className="relative flex items-center justify-between border-b border-border/60 bg-background/40 px-5 py-4 md:px-7">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${profile.badgeFrom}, ${profile.badgeTo})`,
                    boxShadow: `0 10px 24px -8px ${profile.badgeColor}66`,
                  }}
                >
                  {profile.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-bold md:text-base">
                      {profile.handle}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {profile.platform} · {profile.followers} · {profile.country}{" "}
                    {profile.flag} · audit 15 mai 2026
                  </p>
                </div>
              </div>
              <div className="hidden text-right md:block">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Score global
                </div>
                <div className="mt-0.5 font-display text-2xl font-bold">
                  <span className="gradient-text">{profile.globalScore}</span>
                  <span className="text-muted-foreground/60">/100</span>
                </div>
              </div>
            </div>

            {/* Body : 3 columns */}
            <div className="relative grid gap-5 p-5 md:p-7 lg:grid-cols-[1.1fr_1fr_1fr]">
              {/* Col 1: Scores */}
              <div className="space-y-3">
                <SectionTitle>Scores clés</SectionTitle>
                <div className="grid grid-cols-2 gap-2.5">
                  {profile.scores.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-border bg-background/40 p-3"
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <span className="truncate">{s.label}</span>
                        <TrendBadge value={s.trend} invert={s.invert} />
                      </div>
                      <div
                        className="mt-1 font-display text-2xl font-bold"
                        style={{ color: s.color }}
                      >
                        {s.value}
                        <span className="text-xs text-muted-foreground/60">
                          /100
                        </span>
                      </div>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/30">
                        <motion.div
                          key={`${profile.id}-${s.label}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-xl border border-[#7B61FF]/30 bg-gradient-to-br from-[#7B61FF]/[0.08] to-transparent p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <DollarSign className="h-3 w-3 text-[#7B61FF]" />
                    Revenus estimés (30 j)
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold">
                      ${profile.revenue.current}
                    </span>
                    <span className="text-xs text-muted-foreground">actuels</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2 text-emerald-500 dark:text-emerald-300">
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-display text-2xl font-bold">
                      ${profile.revenue.projected}
                    </span>
                    <span className="text-xs">après corrections IA</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Issues */}
              <div className="space-y-3">
                <SectionTitle>Problèmes détectés</SectionTitle>
                <ul className="space-y-2">
                  {profile.issues.map((iss) => {
                    const Icon = iss.icon;
                    const styles = {
                      critical: {
                        iconColor: "#F43F5E",
                        bg: "bg-rose-500/10",
                        border: "border-rose-500/30",
                      },
                      warning: {
                        iconColor: "#FF8A00",
                        bg: "bg-amber-500/10",
                        border: "border-amber-500/30",
                      },
                      success: {
                        iconColor: "#10B981",
                        bg: "bg-emerald-500/10",
                        border: "border-emerald-500/30",
                      },
                    }[iss.severity];

                    return (
                      <li
                        key={iss.label}
                        className={`flex items-center gap-3 rounded-xl border bg-background/40 p-2.5 ${styles.border}`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.bg}`}
                        >
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: styles.iconColor }}
                          />
                        </div>
                        <div className="min-w-0 flex-1 text-xs">{iss.label}</div>
                        <span
                          className="inline-flex shrink-0 items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: `${styles.iconColor}1A`,
                            color: styles.iconColor,
                          }}
                        >
                          ×{iss.count}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Col 3: Recommendations */}
              <div className="space-y-3">
                <SectionTitle>Recommandations IA</SectionTitle>
                <ol className="space-y-2">
                  {profile.recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-border bg-background/40 p-3 text-xs"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{rec}</span>
                    </li>
                  ))}
                </ol>

                <a
                  href="/signup"
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#7B61FF]/50 bg-gradient-to-r from-[#7B61FF]/15 to-[#00C2FF]/15 px-4 py-2.5 text-xs font-semibold transition-colors hover:from-[#7B61FF]/25 hover:to-[#00C2FF]/25"
                >
                  Lancer mon audit personnalisé
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:text-[11px]">
      {children}
    </div>
  );
}

function TrendBadge({ value, invert }: { value: string; invert?: boolean }) {
  const isPositive = value.startsWith("+");
  const good = invert ? !isPositive : isPositive;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1 py-0 text-[9px] font-bold ${
        good
          ? "text-emerald-500 dark:text-emerald-300"
          : "text-rose-500 dark:text-rose-300"
      }`}
    >
      {good ? (
        <TrendingUp className="h-2.5 w-2.5" />
      ) : (
        <TrendingDown className="h-2.5 w-2.5" />
      )}
      {value}
    </span>
  );
}
