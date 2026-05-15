import Link from "next/link";
import {
  Bell,
  Camera,
  CheckCircle2,
  Globe,
  Smartphone,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "App mobile",
  description: "L'app CreaFix AI pour iOS et Android — bientôt disponible.",
};

const screens = [
  {
    icon: Camera,
    title: "Upload vidéo direct",
    desc: "Analyse instantanée de tes vidéos depuis ton smartphone.",
  },
  {
    icon: Bell,
    title: "Notifications push",
    desc: "Alertes anti-ban en temps réel, recommandations virales du jour.",
  },
  {
    icon: Zap,
    title: "Mode hors-ligne",
    desc: "Continue à travailler même sans connexion. Sync auto quand tu reviens en ligne.",
  },
  {
    icon: Wifi,
    title: "Optimisé 2G/3G",
    desc: "Pensé pour les zones à connexion limitée. Léger, rapide, économe en data.",
  },
];

export default function MobilePage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "App mobile", href: "/mobile" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Smartphone className="h-3 w-3" /> iOS + Android · Bientôt
            </>
          }
          title={
            <>
              CreaFix AI dans ta <span className="gradient-text">poche</span>.
            </>
          }
          subtitle="Audit, anti-ban, idées virales et notifications — directement depuis ton téléphone. Bêta privée ouverte pour les abonnés Pro et Agence."
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="lg" variant="brand">
              <Link href="/signup?source=mobile-beta">
                Rejoindre la bêta privée
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/features">Voir les fonctionnalités web</Link>
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
            <Badge variant="outline" className="gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" /> iOS 16+
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Android 11+
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Globe className="h-3 w-3 text-violet-500" /> FR · EN · Wolof (futur)
            </Badge>
          </div>
        </PageHero>
      }
    >
      {/* Mockup phone */}
      <section className="relative mx-auto mt-12 max-w-md">
        <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-radial-fade blur-3xl" />
        <div className="relative mx-auto aspect-[9/19] w-full rounded-[3rem] border-8 border-foreground/10 bg-gradient-to-b from-violet-950/40 to-background p-3 shadow-2xl">
          <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/10" />
          <div className="flex h-full flex-col gap-3 overflow-hidden rounded-[2rem] bg-background p-4 pt-10">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand text-xs font-bold text-white">
                M
              </div>
              <div className="text-xs font-semibold">CreaFix</div>
              <Badge variant="success" className="ml-auto h-5 px-1.5 text-[10px]">
                Live
              </Badge>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Score IA
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold">72</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[72%] gradient-brand" />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Revenus 30 j
              </div>
              <div className="mt-1 font-display text-lg font-bold">
                423K <span className="text-xs text-muted-foreground">FCFA</span>
              </div>
              <div className="mt-2 flex h-8 items-end gap-0.5">
                {[30, 45, 52, 58, 65, 72, 78, 85, 90, 95].map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-violet-500/70"
                    style={{ height: `${v}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-[11px]">
              <div className="flex items-center gap-1.5 font-medium text-rose-500">
                <Bell className="h-3 w-3" /> Alerte anti-ban
              </div>
              <div className="mt-1 text-muted-foreground">
                3 vidéos avec audio copyright détecté.
              </div>
            </div>
            <div className="mt-auto rounded-2xl bg-gradient-to-br from-violet-500 to-orange-500 p-3 text-[11px] font-medium text-white">
              <Sparkles className="mb-1 h-3 w-3" />
              <div>Nouvelle idée virale pour ta niche</div>
              <div className="opacity-80">Tap pour générer le script</div>
            </div>
          </div>
        </div>
      </section>

      <PageSection title="Ce qui rend l'app puissante" subtitle="Construite pour la réalité africaine.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {screens.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg">
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-3 font-display font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Roadmap publique">
        <ul className="space-y-3">
          {[
            { v: "Bêta privée Pro/Agence", d: "T2 2026", done: true },
            { v: "Bêta publique iOS", d: "T3 2026", done: false },
            { v: "Bêta publique Android", d: "T3 2026", done: false },
            { v: "Mode hors-ligne complet", d: "T4 2026", done: false },
            { v: "Notifications IA personnalisées", d: "T4 2026", done: false },
          ].map((m) => (
            <li
              key={m.v}
              className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${m.done ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
              />
              <span className="text-sm font-medium">{m.v}</span>
              <span className="ml-auto text-xs text-muted-foreground">{m.d}</span>
            </li>
          ))}
        </ul>
      </PageSection>
    </PageShell>
  );
}
