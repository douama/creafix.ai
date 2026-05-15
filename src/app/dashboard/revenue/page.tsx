"use client";

import { useState } from "react";
import { Coins, Facebook, Music2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { COUNTRIES, NICHE_MULTIPLIER, estimateMonthlyRevenue, type AfricanCountry } from "@/lib/africa-cpm";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const niches = Object.keys(NICHE_MULTIPLIER) as (keyof typeof NICHE_MULTIPLIER)[];

export default function RevenuePage() {
  const [country, setCountry] = useState<AfricanCountry>("SN");
  const [platform, setPlatform] = useState<"facebook" | "tiktok">("facebook");
  const [views, setViews] = useState(12_400_000);
  const [niche, setNiche] = useState<keyof typeof NICHE_MULTIPLIER>("lifestyle");
  const [watch, setWatch] = useState(1.2);

  const est = estimateMonthlyRevenue({ country, platform, monthlyViews: views, niche, watchTimeMin: watch });

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Estimateur de revenus IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Données CPM/RPM réelles pour 9 pays africains, corrigées par niche et watch time.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Paramètres de simulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Field label="Plateforme">
              <div className="flex gap-2">
                <Pill active={platform === "facebook"} onClick={() => setPlatform("facebook")}>
                  <Facebook className="mr-1.5 h-3.5 w-3.5" /> Facebook
                </Pill>
                <Pill active={platform === "tiktok"} onClick={() => setPlatform("tiktok")}>
                  <Music2 className="mr-1.5 h-3.5 w-3.5" /> TikTok
                </Pill>
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
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-orange-500/5 p-5">
              <div className="text-xs uppercase tracking-wider text-violet-200">
                {est.flag} {est.country}
              </div>
              <div className="mt-2 font-display text-4xl font-bold leading-none">
                {formatCurrency(est.local, est.currency)}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                ≈ {formatCurrency(est.usd, "USD", "en-US")} · /mois
              </div>
              <Badge variant="success" className="mt-3 gap-1">
                <TrendingUp className="h-3 w-3" /> Estimation IA ±15%
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <Stat
                label="Sponsoring"
                value={formatCurrency(est.local * 0.4, est.currency)}
              />
              <Stat
                label="Affiliation"
                value={formatCurrency(est.local * 0.2, est.currency)}
              />
              <Stat
                label="Adsense"
                value={formatCurrency(est.local, est.currency)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparaison pays · {platform === "facebook" ? "Facebook" : "TikTok"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pour les mêmes vues, voici ce que tu gagnerais selon le pays cible.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(COUNTRIES) as AfricanCountry[]).map((c) => {
              const r = estimateMonthlyRevenue({
                country: c,
                platform,
                monthlyViews: views,
                niche,
                watchTimeMin: watch,
              });
              return (
                <div
                  key={c}
                  className={cn(
                    "rounded-xl border bg-white/[0.02] p-4",
                    c === country ? "border-violet-500/40 bg-violet-500/[0.06]" : "border-white/10",
                  )}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <span>{r.flag}</span>
                      <span className="font-medium">{r.country}</span>
                    </span>
                    <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="mt-2 font-display text-xl font-bold">
                    {formatCurrency(r.local, r.currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ≈ {formatCurrency(r.usd, "USD", "en-US")}
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
          ? "border-violet-500/50 bg-violet-500/15 text-violet-100"
          : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05]",
      )}
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
