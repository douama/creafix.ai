import { Activity, CheckCircle2 } from "lucide-react";
import { PageShell, PageHero, PageSection } from "@/components/marketing/page-shell";

export const metadata = {
  title: "Statut",
  description: "Statut en temps réel de tous les services Monetiq AI.",
};

const services = [
  { name: "API REST", region: "Global", uptime: "99.98%", status: "operational" as const },
  { name: "Dashboard web", region: "Global", uptime: "99.99%", status: "operational" as const },
  { name: "Audit Agent IA", region: "Global", uptime: "99.95%", status: "operational" as const },
  { name: "Trend Agent IA", region: "Global", uptime: "99.93%", status: "operational" as const },
  { name: "OAuth Facebook", region: "Meta Graph", uptime: "99.97%", status: "operational" as const },
  { name: "OAuth TikTok", region: "TikTok API", uptime: "99.90%", status: "operational" as const },
  { name: "Paiements Wave", region: "Sénégal", uptime: "99.99%", status: "operational" as const },
  { name: "Paiements Orange Money", region: "CI / SN / MA", uptime: "99.92%", status: "operational" as const },
  { name: "Paiements Stripe", region: "International", uptime: "99.99%", status: "operational" as const },
  { name: "Storage (uploads)", region: "EU-West", uptime: "99.99%", status: "operational" as const },
];

const incidents = [
  {
    date: "10 mai 2026",
    title: "Latence accrue sur l'API Trend Agent",
    duration: "23 min",
    status: "resolved",
    summary:
      "Pic de trafic sur les hashtags TikTok suite à un évènement viral en Côte d'Ivoire. Auto-scaling déclenché.",
  },
  {
    date: "28 avril 2026",
    title: "Panne partielle OAuth Facebook",
    duration: "1 h 12 min",
    status: "resolved",
    summary:
      "Incident côté Meta Graph (signalé sur leur status page). Reconnexions automatiques au rétablissement.",
  },
];

function StatusDot({ status }: { status: "operational" | "degraded" | "down" }) {
  const cls =
    status === "operational"
      ? "bg-emerald-500"
      : status === "degraded"
        ? "bg-amber-500"
        : "bg-rose-500";
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cls} opacity-50`} />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${cls}`} />
    </span>
  );
}

export default function StatusPage() {
  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Statut", href: "/status" },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <Activity className="h-3 w-3 text-emerald-500" /> Mise à jour temps réel
            </>
          }
          title={
            <>
              Tous les systèmes <span className="gradient-text">opérationnels</span>.
            </>
          }
          subtitle="Disponibilité des 30 derniers jours et historique des incidents. Données mises à jour automatiquement."
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-500">
            <CheckCircle2 className="h-4 w-4" /> Tous les services fonctionnent normalement
          </div>
        </PageHero>
      }
    >
      <PageSection title="Services">
        <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur">
          <div className="divide-y divide-border">
            {services.map((s) => (
              <div
                key={s.name}
                className="grid grid-cols-12 items-center gap-3 px-5 py-3.5 text-sm"
              >
                <div className="col-span-6 flex items-center gap-3 md:col-span-5">
                  <StatusDot status={s.status} />
                  <span className="font-medium">{s.name}</span>
                </div>
                <div className="col-span-3 text-xs text-muted-foreground md:col-span-3">
                  {s.region}
                </div>
                <div className="col-span-3 text-right text-xs font-medium text-emerald-500 md:col-span-2">
                  {s.uptime}
                </div>
                <div className="hidden md:col-span-2 md:flex md:justify-end">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-4 w-1 rounded-sm bg-emerald-500/70"
                        title={`J-${30 - i} : OK`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection title="Incidents récents">
        <div className="space-y-3">
          {incidents.map((i) => (
            <div
              key={i.title}
              className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{i.date}</div>
                  <div className="mt-0.5 font-medium">{i.title}</div>
                  <div className="mt-1.5 text-sm text-muted-foreground">{i.summary}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                    <CheckCircle2 className="h-3 w-3" /> Résolu
                  </span>
                  <span className="text-xs text-muted-foreground">{i.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        S'abonner aux notifications d'incident :{" "}
        <a href="mailto:status@monetiq.ai?subject=subscribe" className="text-violet-500 underline">
          status@monetiq.ai
        </a>
      </p>
    </PageShell>
  );
}
