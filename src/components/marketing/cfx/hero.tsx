"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, TrendingUp, DollarSign } from "lucide-react";

/**
 * Hero CreaFix AI Fintech (2026)
 * Layout : split — copy left, dashboard mockup right.
 * Vibe : Linear / Vercel / CinetPay × Stripe.
 */
export function CfxHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background orbs */}
      <div className="cfx-orb cfx-orb-purple -left-20 top-20 h-[420px] w-[420px]" style={{ animationDelay: "0s" }} />
      <div className="cfx-orb cfx-orb-cyan right-0 top-40 h-[380px] w-[380px]" style={{ animationDelay: "-4s" }} />
      <div className="cfx-orb cfx-orb-blue left-1/2 bottom-0 h-[500px] w-[500px]" style={{ animationDelay: "-8s" }} />

      {/* Grid backdrop */}
      <div className="absolute inset-0 cfx-grid-bg" />

      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* ─── Left : copy + CTA ─── */}
          <div className="lg:col-span-6">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="cfx-pill">
                <span className="cfx-live-dot" />
                IA en temps réel · 9 plateformes
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-cfx text-[44px] md:text-[56px] lg:text-[64px] leading-[1.02] font-bold tracking-[-0.02em] text-white">
              L'OS{" "}
              <span className="cfx-text-gradient">IA de revenu</span>
              <br />
              des créateurs{" "}
              <span className="relative inline-block">
                africains
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9 Q 60 2, 100 6 T 198 4"
                    stroke="url(#cfx-underline)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="cfx-underline" x1="0" y1="0" x2="1" y2="0">
                      <stop stopColor="#6C63FF" />
                      <stop offset="0.5" stopColor="#0D6EFD" />
                      <stop offset="1" stopColor="#00D1FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              .
            </h1>

            {/* Sub */}
            <p className="mt-7 text-[17px] md:text-[19px] leading-[1.55] text-[#A5B4CC] max-w-[560px]">
              Audit IA temps réel, score viral, RPM predictor, anti-shadowban et
              orchestration de contenu sur YouTube, TikTok, Facebook, Instagram, X,
              Snapchat, Twitch, Pinterest et LinkedIn — en un seul cockpit.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="cfx-btn-primary">
                Lancer un audit gratuit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#dashboard" className="cfx-btn-ghost">
                <Sparkles className="h-4 w-4" />
                Voir le dashboard
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] text-[#6C7A91]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00D1FF]" />
                Sans carte bancaire
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#00D1FF]" />
                Premier audit en 2 min
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00D1FF] shadow-[0_0_6px_rgba(0,209,255,0.8)]" />
                +12 000 créateurs
              </div>
            </div>
          </div>

          {/* ─── Right : floating dashboard mockup ─── */}
          <div className="lg:col-span-6 relative">
            <HeroDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Hero dashboard mockup — floating glass cards (Linear/Vercel style).
 */
function HeroDashboard() {
  return (
    <div className="relative aspect-[5/4] lg:aspect-[6/5]">
      {/* Main card (audit summary) */}
      <div
        className="absolute inset-0 cfx-glass-strong rounded-2xl p-5 overflow-hidden"
        style={{
          transform: "perspective(1400px) rotateY(-6deg) rotateX(2deg)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#0D6EFD] grid place-items-center text-white font-bold text-sm">
              AI
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">Audit Temps réel</div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-[#A5B4CC]">
                <span className="cfx-live-dot scale-75" />
                Analyse en cours · @creator_lagos
              </div>
            </div>
          </div>
          <span className="cfx-pill cfx-pill-blue !text-[10px] !py-1">
            +24% revenue
          </span>
        </div>

        {/* KPI grid */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <KpiTile label="Score viral" value="87" hint="+12" icon={TrendingUp} />
          <KpiTile label="RPM prédit" value="$2.4" hint="USD" icon={DollarSign} />
          <KpiTile label="Risque ban" value="Low" hint="Safe" icon={ShieldCheck} />
        </div>

        {/* Chart */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] uppercase tracking-wider text-[#6C7A91]">
              Revenue 30j
            </div>
            <div className="text-[11px] font-mono text-[#00D1FF]">$3 840</div>
          </div>
          <div className="h-28 flex items-end gap-1">
            {[42, 58, 38, 64, 48, 72, 55, 80, 68, 88, 75, 95, 82, 70].map((h, i) => (
              <div
                key={i}
                className="cfx-bar flex-1"
                style={{
                  ["--bar-h" as string]: `${h}%`,
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Activity row */}
        <div className="mt-4 space-y-1.5">
          <ActivityRow color="#00D1FF" text="Hook reformulé → +18% retention" />
          <ActivityRow color="#6C63FF" text="Description optimisée SEO YouTube" />
          <ActivityRow color="#0D6EFD" text="Thumbnail A/B test lancé" />
        </div>
      </div>

      {/* Floating side card 1 (top-right, anti-shadowban) */}
      <div
        className="absolute -right-4 -top-6 cfx-glass rounded-xl p-3 w-[170px] hidden sm:block"
        style={{
          transform: "perspective(1400px) rotateY(-10deg) translateZ(40px)",
          animation: "float 7s ease-in-out infinite",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#0D6EFD]/20 grid place-items-center">
            <ShieldCheck className="h-3.5 w-3.5 text-[#00D1FF]" />
          </div>
          <div className="text-[11px] font-semibold text-white">Shadowban</div>
        </div>
        <div className="mt-2 text-[20px] font-bold text-white font-cfx">
          0 <span className="text-[12px] font-normal text-[#A5B4CC]">détectés</span>
        </div>
        <div className="text-[10px] text-[#00D1FF] mt-0.5">3 comptes scannés</div>
      </div>

      {/* Floating side card 2 (bottom-left, viral score) */}
      <div
        className="absolute -left-4 bottom-4 cfx-glass rounded-xl p-3 w-[190px] hidden sm:block"
        style={{
          transform: "perspective(1400px) rotateY(8deg) translateZ(30px)",
          animation: "float 9s ease-in-out infinite",
          animationDelay: "-3s",
        }}
      >
        <div className="text-[10.5px] uppercase tracking-wider text-[#6C7A91]">
          Viral score · @lagos.tv
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-[28px] font-bold text-white font-cfx">94</span>
          <span className="text-[11px] text-[#00D1FF] font-medium">↑ +17</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] via-[#0D6EFD] to-[#00D1FF]" style={{ width: "94%" }} />
        </div>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider text-[#6C7A91]">
        <Icon className="h-3 w-3 text-[#00D1FF]" />
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-[22px] font-bold text-white font-cfx leading-none">{value}</span>
        <span className="text-[10px] text-[#00D1FF]">{hint}</span>
      </div>
    </div>
  );
}

function ActivityRow({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-[#A5B4CC]">
      <span
        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      {text}
    </div>
  );
}
