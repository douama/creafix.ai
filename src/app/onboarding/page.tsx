"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { platformList } from "@/lib/platforms";
import { PlatformIconBadge } from "@/components/brand/platform-icon";
import { cn } from "@/lib/utils";

const STEPS = ["Profil", "Plateformes", "Niches", "Pays", "Objectifs", "Récap"];

const PROFILES = [
  "Créateur solo",
  "Influenceur",
  "YouTubeur",
  "TikTokeur",
  "Streamer Twitch",
  "Page Facebook",
  "Compte Instagram",
  "Média digital",
  "Agence",
];

const NICHES = [
  "Humour", "Foot", "Lifestyle", "Business", "Finance",
  "Mode", "Cuisine", "Tech", "Religion", "Musique",
  "Sport", "Voyage", "Beauté", "Gaming", "Éducation",
];

const COUNTRIES = [
  { code: "SN", name: "Sénégal", flag: "🇸🇳", rpm: 1.8 },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", rpm: 1.6 },
  { code: "CM", name: "Cameroun", flag: "🇨🇲", rpm: 1.4 },
  { code: "ML", name: "Mali", flag: "🇲🇱", rpm: 1.2 },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", rpm: 2.4 },
  { code: "GH", name: "Ghana", flag: "🇬🇭", rpm: 1.9 },
  { code: "ZA", name: "Afrique du Sud", flag: "🇿🇦", rpm: 2.9 },
  { code: "MA", name: "Maroc", flag: "🇲🇦", rpm: 3.1 },
  { code: "CD", name: "RD Congo", flag: "🇨🇩", rpm: 1.1 },
];

const REVENUE_TIERS = [
  { id: "100", label: "$100", desc: "Compléter mes revenus" },
  { id: "500", label: "$500", desc: "Side income solide" },
  { id: "1500", label: "$1 500", desc: "Vivre de la création" },
  { id: "5000", label: "$5 000+", desc: "Scaler en pro / agence" },
];

type State = {
  profile: string | null;
  platforms: string[];
  niches: string[];
  country: string | null;
  revenueTarget: string | null;
  horizon: "3" | "6" | "12";
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<State>({
    profile: null,
    platforms: [],
    niches: [],
    country: null,
    revenueTarget: null,
    horizon: "6",
  });

  const pct = Math.round(((step + 1) / STEPS.length) * 100);
  const canNext = canAdvance(step, state);

  async function handleFinish() {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          country: state.country,
          preferred_niches: state.niches,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // 401 = pas connecté : on bascule sur le dashboard quand même
        // (le middleware/layout redirigera vers /login).
        if (res.status !== 401) {
          toast.error(typeof data.error === "string" ? data.error : "Sauvegarde impossible");
          setSaving(false);
          return;
        }
      }
      // Le reste du state (profile, platforms, revenueTarget, horizon) reste
      // local pour l'instant — pas de colonnes dédiées dans user_profiles.
      router.push("/dashboard");
    } catch {
      toast.error("Erreur réseau");
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="absolute -top-32 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-radial-fade blur-3xl" />

      <header className="container py-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <main className="container max-w-2xl py-4 md:py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Étape {step + 1} sur {STEPS.length} ·{" "}
              <b className="text-foreground">{STEPS[step]}</b>
            </span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="mt-2" />
          <div className="mt-3 flex gap-1 overflow-x-auto">
            {STEPS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                  i === step
                    ? "border-[#EC4899]/50 bg-[#EC4899]/15 text-[#EC4899]"
                    : i < step
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 dark:text-emerald-300"
                    : "border-border bg-card/40 text-muted-foreground/60",
                )}
              >
                {i < step && <Check className="mr-1 inline h-2.5 w-2.5" />}
                {s}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-5 md:p-7">
            {step === 0 && <ProfileStep state={state} setState={setState} />}
            {step === 1 && <PlatformStep state={state} setState={setState} />}
            {step === 2 && <NicheStep state={state} setState={setState} />}
            {step === 3 && <CountryStep state={state} setState={setState} />}
            {step === 4 && <RevenueStep state={state} setState={setState} />}
            {step === 5 && <Recap state={state} />}

            <div className="mt-7 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                Précédent
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  variant="brand"
                  onClick={() => canNext && setStep((s) => s + 1)}
                  disabled={!canNext}
                >
                  Suivant <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button variant="brand" onClick={handleFinish} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : null}
                  {saving ? "Sauvegarde…" : "Accéder à mon dashboard"}
                  {!saving && <ArrowRight className="ml-1 h-4 w-4" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function canAdvance(step: number, s: State): boolean {
  switch (step) {
    case 0: return !!s.profile;
    case 1: return s.platforms.length > 0;
    case 2: return s.niches.length > 0;
    case 3: return !!s.country;
    case 4: return !!s.revenueTarget;
    default: return true;
  }
}

type StepProps = { state: State; setState: React.Dispatch<React.SetStateAction<State>> };

function ProfileStep({ state, setState }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Qui es-tu ?</h2>
      <p className="text-sm text-muted-foreground">
        On va personnaliser ton expérience selon ton profil.
      </p>
      <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
        {PROFILES.map((p) => {
          const active = state.profile === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setState((s) => ({ ...s, profile: p }))}
              className={cn(
                "relative rounded-xl border p-4 text-left text-sm transition-all",
                active
                  ? "border-[#EC4899]/50 bg-[#EC4899]/10 shadow-lg shadow-[#EC4899]/10"
                  : "border-border bg-card/40 hover:border-foreground/20 hover:bg-card/70",
              )}
            >
              <div className="font-medium">{p}</div>
              {active && (
                <span className="absolute right-2 top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#EC4899]">
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlatformStep({ state, setState }: StepProps) {
  function toggle(id: string) {
    setState((s) => ({
      ...s,
      platforms: s.platforms.includes(id)
        ? s.platforms.filter((p) => p !== id)
        : [...s.platforms, id],
    }));
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Tes plateformes</h2>
      <p className="text-sm text-muted-foreground">
        Sélectionne celles que tu veux auditer.{" "}
        <b className="text-foreground">{state.platforms.length} sélectionnée{state.platforms.length > 1 ? "s" : ""}</b>.
      </p>
      <div className="grid gap-2.5 sm:grid-cols-3 md:grid-cols-5">
        {platformList.map((p) => {
          const active = state.platforms.includes(p.id);
          const soon = p.status === "soon";
          return (
            <button
              key={p.id}
              type="button"
              disabled={soon}
              onClick={() => !soon && toggle(p.id)}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
                active
                  ? "border-[#EC4899]/50 bg-[#EC4899]/10 shadow-lg shadow-[#EC4899]/10"
                  : "border-border bg-card/40 hover:border-foreground/15 hover:bg-card/70",
                soon && "opacity-50",
              )}
            >
              <PlatformIconBadge id={p.id} size={36} rounded="rounded-xl" />
              <div className="text-xs font-medium">{p.name}</div>
              {p.status !== "live" && (
                <span className="absolute -top-1.5 right-1 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-500">
                  {p.status === "beta" ? "Bêta" : "Bientôt"}
                </span>
              )}
              {active && (
                <span className="absolute -top-1.5 -left-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#EC4899]">
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NicheStep({ state, setState }: StepProps) {
  const MAX = 3;
  function toggle(n: string) {
    setState((s) => {
      if (s.niches.includes(n)) {
        return { ...s, niches: s.niches.filter((x) => x !== n) };
      }
      if (s.niches.length >= MAX) return s;
      return { ...s, niches: [...s.niches, n] };
    });
  }
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Tes niches</h2>
      <p className="text-sm text-muted-foreground">
        Choisis jusqu&apos;à {MAX} niches principales · {state.niches.length}/{MAX}{" "}
        sélectionnées.
      </p>
      <div className="flex flex-wrap gap-2">
        {NICHES.map((n) => {
          const active = state.niches.includes(n);
          const disabled = !active && state.niches.length >= MAX;
          return (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => toggle(n)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-all",
                active
                  ? "border-[#EC4899]/50 bg-[#EC4899]/15 text-foreground"
                  : disabled
                  ? "border-border bg-card/20 text-muted-foreground/50"
                  : "border-border bg-card/40 hover:border-foreground/30 hover:bg-card/70",
              )}
            >
              {active && <Check className="mr-1 inline h-3 w-3" />}
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CountryStep({ state, setState }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Ton pays principal</h2>
      <p className="text-sm text-muted-foreground">
        Utilisé pour les estimations RPM et les tendances locales.
      </p>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {COUNTRIES.map((c) => {
          const active = state.country === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => setState((s) => ({ ...s, country: c.code }))}
              className={cn(
                "relative flex items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition-all",
                active
                  ? "border-[#EC4899]/50 bg-[#EC4899]/10 shadow-lg shadow-[#EC4899]/10"
                  : "border-border bg-card/40 hover:border-foreground/20 hover:bg-card/70",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{c.flag}</span>
                <span className="font-medium">{c.name}</span>
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground">
                RPM ${c.rpm}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RevenueStep({ state, setState }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Ton objectif revenus</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          On va calculer un plan d&apos;action pour atteindre cet objectif.
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {REVENUE_TIERS.map((r) => {
          const active = state.revenueTarget === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setState((s) => ({ ...s, revenueTarget: r.id }))}
              className={cn(
                "relative rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-[#EC4899]/50 bg-[#EC4899]/10 shadow-lg shadow-[#EC4899]/10"
                  : "border-border bg-card/40 hover:border-foreground/20 hover:bg-card/70",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold">
                  {r.label}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">
                    /mois
                  </span>
                </span>
                {active && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EC4899]">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{r.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card/40 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-[#EC4899]" />
            <span className="font-medium">Horizon</span>
          </div>
          <div className="flex gap-1.5">
            {(["3", "6", "12"] as const).map((h) => {
              const active = state.horizon === h;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, horizon: h }))}
                  className={cn(
                    "rounded-lg border px-3 py-1 text-xs font-semibold transition-all",
                    active
                      ? "border-[#EC4899]/50 bg-[#EC4899]/15 text-foreground"
                      : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {h} mois
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Recap({ state }: { state: State }) {
  const country = COUNTRIES.find((c) => c.code === state.country);
  const target = parseInt(state.revenueTarget ?? "0", 10);
  const horizon = parseInt(state.horizon, 10);

  const milestones = useMemo(() => {
    if (!target || !horizon) return [];
    const steps = Math.min(horizon, 4);
    return Array.from({ length: steps }, (_, i) => {
      const monthIdx = Math.round(((i + 1) / steps) * horizon);
      const value = Math.round((target * (i + 1)) / steps);
      return { month: monthIdx, value };
    });
  }, [target, horizon]);

  return (
    <div className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
          <Sparkles className="h-3 w-3" />
          Plan personnalisé
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold">
          Voilà ton plan d&apos;attaque.
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Récap de ton profil + projection IA basée sur tes choix.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <RecapItem label="Profil" value={state.profile ?? "—"} />
        <RecapItem label="Pays" value={country ? `${country.flag} ${country.name}` : "—"} />
        <RecapItem
          label="Plateformes"
          value={state.platforms.length > 0 ? `${state.platforms.length} actives` : "—"}
        />
        <RecapItem
          label="Niches"
          value={state.niches.length > 0 ? state.niches.join(" · ") : "—"}
        />
      </div>

      <div className="rounded-2xl border border-[#EC4899]/30 bg-gradient-to-br from-[#EC4899]/[0.08] to-transparent p-5">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#EC4899]">
          <TrendingUp className="h-3 w-3" />
          Projection revenus
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="font-display text-3xl font-bold">${target}</span>
          <span className="text-xs text-muted-foreground">
            objectif en {horizon} mois
          </span>
        </div>
        {milestones.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="w-14 shrink-0 text-muted-foreground">
                  Mois {m.month}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#EC4899] to-[#FF8A00]"
                    style={{ width: `${((i + 1) / milestones.length) * 100}%` }}
                  />
                </div>
                <span className="w-20 shrink-0 text-right font-semibold">
                  ${m.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function RecapItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}
