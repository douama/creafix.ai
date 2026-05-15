"use client";

import { useMemo, useState } from "react";
import { Coins, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  COUNTRIES,
  NICHE_MULTIPLIER,
  estimateMonthlyRevenue,
  type AfricanCountry,
} from "@/lib/africa-cpm";
import {
  platformList,
  type PlatformId,
  COUNTRY_RPM_MULTIPLIER,
  PLATFORMS,
} from "@/lib/platforms";
import { formatCurrency, cn } from "@/lib/utils";

const niches = Object.keys(NICHE_MULTIPLIER) as (keyof typeof NICHE_MULTIPLIER)[];

const PLATFORM_GLYPHS: Record<PlatformId, string> = {
  YOUTUBE: "▶",
  FACEBOOK: "f",
  INSTAGRAM: "◎",
  TIKTOK: "♪",
  X: "𝕏",
  SNAPCHAT: "👻",
  TWITCH: "▰",
  PINTEREST: "P",
  LINKEDIN: "in",
};

export default function RevenuePage() {
  const [country, setCountry] = useState<AfricanCountry>("SN");
  const [platform, setPlatform] = useState<PlatformId>("YOUTUBE");
  const [views, setViews] = useState(12_400_000);
  const [niche, setNiche] = useState<keyof typeof NICHE_MULTIPLIER>("lifestyle");
  const [watch, setWatch] = useState(1.2);

  // Estimation universelle multi-plateforme :
  // RPM = baseRpmUsd(platform) × multCountry × multNiche × watchBoost
  const est = useMemo(() => {
    const p = PLATFORMS[platform];
    const c = COUNTRIES[country];
    const mNiche = NICHE_MULTIPLIER[niche] ?? 1;
    const mCountry = COUNTRY_RPM_MULTIPLIER[country] ?? 0.3;
    const watchBoost = Math.min(1.6, watch / 1.0);
    const rpm = p.baseRpmUsd * mCountry * mNiche * watchBoost;
    const usd = (views / 1000) * rpm;
    return {
      rpm,
      usd,
      local: usd * c.fxToUsd,
      currency: c.currency,
      country: c.name,
      flag: c.flag,
    };
  }, [platform, country, views, niche, watch]);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Estimateur de revenus IA
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          9 plateformes monétisables × 9 pays africains × niches. RPM réel ± 15 %.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Paramètres de simulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Field label="Plateforme">
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {platformList.map((p) => (
                  <PlatformPill
                    key={p.id}
                    active={platform === p.id}
                    onClick={() => setPlatform(p.id)}
                    platform={p}
                  />
                ))}
              </div>
            </Field>

            <Field label="Pays cible">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(COUNTRIES) as AfricanCountry[]).map((c) => (
                  <Pill key={c} active={country === c} onClick={() => setCountry(c)}>
                    <span className="mr-1">{COUNTRIES[c].flag}</span>
                    {COUNTRIES[c].name}
                  </Pill>
                ))}
              </div>
            </Field>

            <Field label="Niche">
              <div className="flex flex-wrap gap-2">
                {niches.map((n) => (
                  <Pill key={n} active={niche === n} onClick={() => setNiche(n)}>
                    {n}
                    <span className="ml-1.5 text-[10px] opacity-70">
                      ×{NICHE_MULTIPLIER[n]}
                    </span>
                  </Pill>
                ))}
              </div>
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Vues mensuelles">
                <Input
                  type="number"
                  value={views}
                  onChange={(e) => setViews(Number(e.target.value))}
                />
              </Field>
              <Field label="Watch time moyen (min)">
                <Input
                  type="number"
                  step="0.1"
                  value={watch}
                  onChange={(e) => setWatch(Number(e.target.value))}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimation</CardTitle>
            <p className="text-sm text-muted-foreground">Revenu publicitaire mensuel net.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-[#7B61FF]/30 bg-gradient-to-br from-[#7B61FF]/10 to-[#FF8A00]/5 p-5">
              <div className="text-xs uppercase tracking-wider text-[#7B61FF]">
                {est.flag} {est.country} · {PLATFORMS[platform].name}
              </div>
              <div className="mt-2 font-display text-4xl font-bold leading-none">
                {formatCurrency(est.local, est.currency)}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                ≈ {formatCurrency(est.usd, "USD", "en-US")} · /mois
              </div>
              <Badge variant="success" className="mt-3 gap-1">
                <TrendingUp className="h-3 w-3" /> RPM ≈ ${est.rpm.toFixed(2)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <Stat label="Sponsoring" value={formatCurrency(est.local * 0.4, est.currency)} />
              <Stat label="Affiliation" value={formatCurrency(est.local * 0.2, est.currency)} />
              <Stat label="Ads" value={formatCurrency(est.local, est.currency)} />
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-3 text-xs">
              <div className="font-medium">
                Programmes monétisation actifs sur {PLATFORMS[platform].name}
              </div>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {PLATFORMS[platform].programs.slice(0, 4).map((prog) => (
                  <li key={prog.name} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                    {prog.name}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Comparaison plateformes · {est.country} {est.flag}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pour les mêmes vues ({views.toLocaleString("fr-FR")}/mois), voici ce que tu
            gagnerais sur chaque plateforme.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {platformList.map((p) => {
              const mCountry = COUNTRY_RPM_MULTIPLIER[country] ?? 0.3;
              const mNiche = NICHE_MULTIPLIER[niche] ?? 1;
              const watchBoost = Math.min(1.6, watch / 1.0);
              const rpm = p.baseRpmUsd * mCountry * mNiche * watchBoost;
              const usd = (views / 1000) * rpm;
              const local = usd * COUNTRIES[country].fxToUsd;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-xl border bg-card/40 p-4",
                    p.id === platform
                      ? "border-[#7B61FF]/50 bg-[#7B61FF]/[0.06]"
                      : "border-border",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md",
                        p.bgGradient,
                      )}
                    >
                      <span className="font-display text-sm font-extrabold">
                        {PLATFORM_GLYPHS[p.id]}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <div className="mt-2 font-display text-lg font-bold leading-none">
                    {formatCurrency(local, COUNTRIES[country].currency)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    ≈ {formatCurrency(usd, "USD", "en-US")} · RPM ${rpm.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparaison pays · {PLATFORMS[platform].name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pour la même plateforme et niche, voici les revenus par pays africain.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(COUNTRIES) as AfricanCountry[]).map((c) => {
              const mNiche = NICHE_MULTIPLIER[niche] ?? 1;
              const mCountry = COUNTRY_RPM_MULTIPLIER[c] ?? 0.3;
              const watchBoost = Math.min(1.6, watch / 1.0);
              const rpm = PLATFORMS[platform].baseRpmUsd * mCountry * mNiche * watchBoost;
              const usd = (views / 1000) * rpm;
              const local = usd * COUNTRIES[c].fxToUsd;
              return (
                <div
                  key={c}
                  className={cn(
                    "rounded-xl border bg-card/40 p-4",
                    c === country
                      ? "border-[#7B61FF]/40 bg-[#7B61FF]/[0.06]"
                      : "border-border",
                  )}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <span>{COUNTRIES[c].flag}</span>
                      <span className="font-medium">{COUNTRIES[c].name}</span>
                    </span>
                    <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="mt-2 font-display text-xl font-bold">
                    {formatCurrency(local, COUNTRIES[c].currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ≈ {formatCurrency(usd, "USD", "en-US")}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs transition-colors",
        active
          ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
          : "border-border bg-card/40 text-muted-foreground hover:bg-card/70",
      )}
    >
      {children}
    </button>
  );
}

function PlatformPill({
  active,
  onClick,
  platform,
}: {
  active: boolean;
  onClick: () => void;
  platform: (typeof platformList)[number];
}) {
  return (
    <button
      onClick={onClick}
      disabled={platform.status === "soon"}
      className={cn(
        "flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-colors",
        active
          ? "border-[#7B61FF]/50 bg-[#7B61FF]/[0.06]"
          : "border-border bg-card/40 hover:bg-card/70",
        platform.status === "soon" && "opacity-50",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-white",
          platform.bgGradient,
        )}
      >
        <span className="font-display text-xs font-extrabold">
          {PLATFORM_GLYPHS[platform.id]}
        </span>
      </span>
      <span className="font-medium">{platform.name}</span>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
