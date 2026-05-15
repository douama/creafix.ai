"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Facebook, Music2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const steps = ["Profil", "Plateforme", "Niche", "Pays", "Connexion"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const pct = Math.round(((step + 1) / steps.length) * 100);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="absolute -top-32 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-radial-fade blur-3xl" />

      <header className="container py-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <main className="container max-w-2xl py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Étape {step + 1} sur {steps.length} · {steps[step]}
            </span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="mt-2" />
        </div>

        <Card>
          <CardContent className="p-7">
            {step === 0 && <Profile />}
            {step === 1 && <Platform />}
            {step === 2 && <Niche />}
            {step === 3 && <Country />}
            {step === 4 && <Connect />}

            <div className="mt-7 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                Précédent
              </Button>
              {step < steps.length - 1 ? (
                <Button variant="brand" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
                  Suivant <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button asChild variant="brand">
                  <Link href="/dashboard">
                    Accéder à mon dashboard <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Profile() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Qui es-tu ?</h2>
      <p className="text-sm text-muted-foreground">
        On va personnaliser ton expérience selon ton profil.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {["Créateur solo", "Influenceur", "Page Facebook", "TikTokeur", "Média digital", "Agence"].map(
          (r) => (
            <button
              key={r}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left text-sm hover:bg-white/[0.05] hover:border-violet-500/30"
            >
              <div className="font-medium">{r}</div>
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function Platform() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Quelle plateforme veux-tu auditer ?</h2>
      <p className="text-sm text-muted-foreground">
        Tu pourras en ajouter d'autres plus tard.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {[
          { icon: Facebook, label: "Facebook", cls: "blue" },
          { icon: Music2, label: "TikTok", cls: "pink" },
        ].map(({ icon: Icon, label, cls }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center hover:bg-white/[0.05]"
          >
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl ring-1",
                cls === "blue" ? "bg-blue-500/15 text-blue-400 ring-blue-400/30" : "bg-pink-500/15 text-pink-400 ring-pink-400/30",
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="font-medium">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Niche() {
  const niches = ["Humour", "Foot", "Lifestyle", "Business", "Finance", "Mode", "Cuisine", "Tech", "Religion", "Musique"];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Quelle est ta niche principale ?</h2>
      <p className="text-sm text-muted-foreground">
        On adaptera nos recommandations IA en fonction.
      </p>
      <div className="flex flex-wrap gap-2">
        {niches.map((n) => (
          <button
            key={n}
            className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-sm hover:border-violet-500/30 hover:bg-violet-500/[0.06]"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function Country() {
  const countries = [
    { name: "Sénégal", flag: "🇸🇳" },
    { name: "Côte d'Ivoire", flag: "🇨🇮" },
    { name: "Cameroun", flag: "🇨🇲" },
    { name: "Mali", flag: "🇲🇱" },
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "Afrique du Sud", flag: "🇿🇦" },
    { name: "Maroc", flag: "🇲🇦" },
    { name: "RD Congo", flag: "🇨🇩" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Quel est ton pays principal ?</h2>
      <p className="text-sm text-muted-foreground">
        Utilisé pour les estimations de revenus et les tendances locales.
      </p>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {countries.map((c) => (
          <button
            key={c.name}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm hover:bg-white/[0.05] hover:border-violet-500/30"
          >
            <span className="text-base">{c.flag}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Connect() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold">On y est presque !</h2>
      <p className="text-sm text-muted-foreground">
        Connecte ton premier compte pour lancer l'audit IA en 30s. Tu peux aussi le faire plus tard.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.05]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 ring-1 ring-blue-400/30">
            <Facebook className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-left">
            <div className="font-medium">Connecter Facebook</div>
            <div className="text-xs text-muted-foreground">OAuth Meta</div>
          </div>
        </button>
        <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.05]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/15 ring-1 ring-pink-400/30">
            <Music2 className="h-5 w-5 text-pink-400" />
          </div>
          <div className="text-left">
            <div className="font-medium">Connecter TikTok</div>
            <div className="text-xs text-muted-foreground">OAuth TikTok</div>
          </div>
        </button>
      </div>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 text-sm">
        <div className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
          <span>
            Connexion OAuth officielle · Aucun mot de passe stocké · Tu peux révoquer à tout moment.
          </span>
        </div>
      </div>
    </div>
  );
}
