import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Search, CheckCircle2, AlertCircle, Clock, Activity,
  Eye, Flame, ShieldOff, DollarSign, TrendingUp,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function load(id: string) {
  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: audit } = await (sb.from("audits") as any)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!audit) return null;

  const [userRes, accountRes] = await Promise.all([
    sb.from("user_profiles").select("id, email, full_name, country, plan").eq("id", audit.user_id).maybeSingle(),
    sb.from("social_accounts").select("id, platform, handle, followers, niche").eq("id", audit.social_account_id).maybeSingle(),
  ]);

  return { audit, user: userRes.data, account: accountRes.data };
}

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await load(id);
  if (!data) notFound();
  const { audit, user, account } = data;

  const duration = audit.completed_at
    ? Math.round((new Date(audit.completed_at).getTime() - new Date(audit.started_at).getTime()) / 1000)
    : null;

  const dimensions: { name: string; score: number }[] = Array.isArray(audit.dimensions) ? audit.dimensions : [];
  const issues: { severity: string; title: string; scope: string }[] = Array.isArray(audit.issues) ? audit.issues : [];
  const recommendations: string[] = Array.isArray(audit.recommendations) ? audit.recommendations : [];

  const statusMeta = {
    PENDING:   { icon: Clock,         color: "#94A3B8", label: "En attente" },
    RUNNING:   { icon: Activity,      color: "#FF8A00", label: "En cours" },
    COMPLETED: { icon: CheckCircle2,  color: "#10B981", label: "Terminé" },
    FAILED:    { icon: AlertCircle,   color: "#F43F5E", label: "Échec" },
  }[audit.status as string] ?? { icon: Clock, color: "#94A3B8", label: audit.status };

  const StatusIcon = statusMeta.icon;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/audits"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Retour aux audits
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Audit {audit.id.slice(0, 8)}…
          </h1>
          <span
            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ color: statusMeta.color, borderColor: `${statusMeta.color}55`, backgroundColor: `${statusMeta.color}1A` }}
          >
            <StatusIcon className="h-2.5 w-2.5" />
            {statusMeta.label}
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-card/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Mode {audit.mode}
          </span>
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetaCard label="Démarré" value={new Date(audit.started_at).toLocaleString("fr-FR")} />
        <MetaCard label="Terminé" value={audit.completed_at ? new Date(audit.completed_at).toLocaleString("fr-FR") : "—"} />
        <MetaCard label="Durée" value={duration != null ? `${duration}s` : "—"} />
        <MetaCard label="Plateforme" value={account?.platform ?? "—"} />
      </div>

      {/* User card */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Compte audité
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#EC4899] to-[#FF8A00] text-sm font-bold text-white">
            {(account?.handle ?? "?").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold">
                {account?.handle ?? "Compte inconnu"}
              </span>
              {account?.platform && (
                <span className="rounded-full border border-border bg-background/60 px-1.5 py-0 text-[10px] font-bold uppercase tracking-wider">
                  {account.platform}
                </span>
              )}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {user?.email ?? "user inconnu"}
              {user?.country && ` · ${user.country}`}
              {user?.plan && ` · plan ${user.plan}`}
              {account?.followers != null && ` · ${fmt(account.followers)} abos`}
              {account?.niche && ` · niche ${account.niche}`}
            </div>
          </div>
          {user && (
            <Link
              href={`/admin/users?email=${encodeURIComponent(user.email)}`}
              className="rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold hover:bg-background/70"
            >
              Voir le user →
            </Link>
          )}
        </div>
      </div>

      {/* Scores grid */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold">
          <TrendingUp className="h-4 w-4 text-[#EC4899]" />
          Scores IA · {audit.status === "COMPLETED" ? "live data" : "en attente"}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          <ScoreBig label="Global" value={audit.score_global} icon={TrendingUp} color="#EC4899" />
          <ScoreBig label="Monétisation" value={audit.score_monetization} icon={DollarSign} color="#10B981" />
          <ScoreBig label="Viral" value={audit.score_viral} icon={Flame} color="#FF8A00" />
          <ScoreBig label="Risque (shadowban)" value={audit.score_risk} icon={ShieldOff} color="#F43F5E" invert />
          <ScoreBig label="Engagement" value={audit.score_engagement} icon={Eye} color="#FF8A00" />
        </div>
      </div>

      {/* Dimensions (8 axes) */}
      {dimensions.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <h2 className="font-display text-sm font-bold">Dimensions détaillées</h2>
          <ul className="mt-4 space-y-2">
            {dimensions.map((d) => (
              <li key={d.name} className="flex items-center gap-3 text-xs">
                <span className="w-44 truncate font-semibold">{d.name}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.score}%`,
                      backgroundColor: d.score >= 75 ? "#10B981" : d.score >= 50 ? "#FF8A00" : "#F43F5E",
                    }}
                  />
                </div>
                <span className="w-10 text-right font-display font-bold">{d.score}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            Problèmes détectés
          </h2>
          <ul className="mt-3 space-y-2">
            {issues.map((iss, i) => {
              const color = iss.severity === "high" ? "#F43F5E" : iss.severity === "medium" ? "#FF8A00" : "#94A3B8";
              return (
                <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
                  >
                    {iss.severity}
                  </span>
                  <span className="flex-1 text-sm">{iss.title}</span>
                  <span className="text-[10px] text-muted-foreground">{iss.scope}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <h2 className="font-display text-sm font-bold">Recommandations IA</h2>
          <ol className="mt-3 space-y-2">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-xl border border-border bg-background/40 p-3 text-xs">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#FF8A00] text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="leading-snug">{r}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Raw data debug */}
      <details className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <summary className="cursor-pointer font-display text-sm font-bold">
          Raw data (debug) ↓
        </summary>
        <pre className="mt-3 max-h-96 overflow-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-[10px]">
{JSON.stringify(audit, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}

function ScoreBig({
  label, value, icon: Icon, color, invert,
}: {
  label: string; value: number | null; icon: typeof Search; color: string; invert?: boolean;
}) {
  const display = invert && value != null ? 100 - value : value;
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4 text-center">
      <Icon className="mx-auto h-4 w-4" style={{ color }} />
      <div className="mt-2 font-display text-2xl font-bold" style={{ color }}>
        {display ?? "—"}
        {value != null && <span className="text-xs text-muted-foreground/60">/100</span>}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
