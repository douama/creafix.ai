import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, User as UserIcon, CreditCard, Search, Activity, Smartphone,
  CheckCircle2, AlertCircle, Clock, DollarSign, Globe2, Calendar, Crown,
  Bell, Shield,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function load(id: string) {
  const sb = supabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (sb.from("user_profiles") as any)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!profile) return null;

  const [audits, payments, apiUsage, devices, notifications, socials] = await Promise.all([
    sb.from("audits")
      .select("id, status, mode, score_global, started_at, completed_at, social_account_id")
      .eq("user_id", id)
      .order("started_at", { ascending: false })
      .limit(20),
    sb.from("payments")
      .select("id, provider, amount, currency, status, description, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sb.from("api_usage") as any)
      .select("id, endpoint, method, status_code, duration_ms, cost_usd, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sb.from("user_devices") as any)
      .select("id, device_type, os, browser, ip, country, last_seen_at, first_seen_at")
      .eq("user_id", id)
      .order("last_seen_at", { ascending: false })
      .limit(10),
    sb.from("notifications")
      .select("id, type, title, read, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
    sb.from("social_accounts")
      .select("id, platform, handle, followers, country")
      .eq("user_id", id),
  ]);

  // Revenue généré = sum payments SUCCEEDED
  const revenueGenerated = (payments.data ?? [])
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((s, p) => s + Number(p.amount ?? 0), 0);

  return {
    profile,
    audits: audits.data ?? [],
    payments: payments.data ?? [],
    apiUsage: (apiUsage.data ?? []) as Array<{ id: string; endpoint: string; method: string; status_code: number; duration_ms: number; cost_usd: number; created_at: string }>,
    devices: (devices.data ?? []) as Array<{ id: string; device_type: string | null; os: string | null; browser: string | null; ip: string | null; country: string | null; last_seen_at: string; first_seen_at: string }>,
    notifications: notifications.data ?? [],
    socials: socials.data ?? [],
    revenueGenerated,
  };
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await load(id);
  if (!data) notFound();

  const { profile, audits, payments, apiUsage, devices, notifications, socials, revenueGenerated } = data;

  const initials = (profile.full_name ?? profile.email)
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s: string) => s[0]?.toUpperCase())
    .join("");

  const isAdmin = ["ADMIN", "SUPER_ADMIN", "MODERATOR", "SUPPORT", "ANALYST"].includes(profile.role);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Retour aux users
        </Link>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#FF8A00] text-base font-bold text-white shadow-lg shadow-[#EC4899]/20">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {profile.full_name ?? profile.email}
                </h1>
                <RoleBadge role={profile.role} />
                {isAdmin && (
                  <Shield className="h-4 w-4 text-rose-500" />
                )}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {profile.email}
                {profile.country && ` · ${profile.country}`}
                {profile.plan && ` · plan ${profile.plan}`}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Inscrit {new Date(profile.created_at).toLocaleString("fr-FR")}
                {profile.last_seen_at && ` · vu ${timeAgo(profile.last_seen_at)}`}
              </div>
            </div>
          </div>
          <StatusBadge status={profile.status ?? "ACTIVE"} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi icon={Search} label="Audits totaux" value={audits.length.toString()} color="#EC4899" />
        <Kpi icon={DollarSign} label="Revenue généré" value={`$${revenueGenerated.toFixed(2)}`} color="#10B981" />
        <Kpi icon={Activity} label="API calls" value={apiUsage.length.toString()} color="#FF8A00" />
        <Kpi icon={Smartphone} label="Devices" value={devices.length.toString()} color="#FF8A00" />
        <Kpi icon={Crown} label="Credits IA" value={String(profile.credits ?? 0)} color="#FBBF24" />
      </div>

      {/* Social accounts */}
      <Section title="Comptes sociaux connectés" icon={Globe2}>
        {socials.length === 0 ? (
          <Empty label="Aucun compte social connecté" />
        ) : (
          <ul className="grid gap-2 md:grid-cols-2">
            {socials.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
                <span className="inline-flex rounded-md border border-border bg-card/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {s.platform}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{s.handle}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {s.followers != null && `${fmt(s.followers)} abos`}
                    {s.country && ` · ${s.country}`}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Audits récents */}
      <Section title={`Audits récents (${audits.length})`} icon={Search}>
        {audits.length === 0 ? (
          <Empty label="Aucun audit lancé" />
        ) : (
          <ul className="space-y-1.5">
            {audits.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3 text-xs">
                <AuditStatusIcon status={a.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Audit {a.id.slice(0, 8)}…</span>
                    <span className="text-[10px] text-muted-foreground">mode {a.mode}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {timeAgo(a.started_at)}
                    {a.completed_at && ` · terminé ${timeAgo(a.completed_at)}`}
                  </div>
                </div>
                {a.score_global != null && (
                  <span
                    className="font-display text-sm font-bold"
                    style={{ color: scoreColor(a.score_global) }}
                  >
                    {a.score_global}/100
                  </span>
                )}
                <Link
                  href={`/admin/audits/${a.id}`}
                  className="rounded-md border border-border bg-card/40 px-2 py-1 text-[10px] font-bold uppercase hover:bg-card/70"
                >
                  Détail →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Payments */}
      <Section title={`Paiements (${payments.length})`} icon={CreditCard}>
        {payments.length === 0 ? (
          <Empty label="Aucun paiement" />
        ) : (
          <ul className="space-y-1.5">
            {payments.map((p) => (
              <li key={p.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-xl border border-border bg-background/40 p-3 text-xs">
                <span className="rounded-md border border-border bg-card/40 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                  {p.provider}
                </span>
                <div className="min-w-0">
                  <div className="truncate">{p.description ?? "—"}</div>
                  <div className="text-[10px] text-muted-foreground">{timeAgo(p.created_at)}</div>
                </div>
                <span className="font-display font-bold">
                  {p.currency === "USD" || p.currency === "EUR" ? "$" : ""}
                  {Number(p.amount).toLocaleString("fr-FR")} {p.currency !== "USD" && p.currency !== "EUR" && p.currency}
                </span>
                <PaymentStatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* API Usage */}
      <Section title={`API usage récente (${apiUsage.length})`} icon={Activity}>
        {apiUsage.length === 0 ? (
          <Empty label="Aucun appel API" />
        ) : (
          <ul className="space-y-1.5">
            {apiUsage.map((u) => (
              <li key={u.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-2.5 font-mono text-[11px]">
                <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                  u.method === "GET" ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-300"
                  : u.method === "POST" ? "bg-blue-500/10 text-blue-500"
                  : "bg-amber-500/10 text-amber-500"
                }`}>
                  {u.method}
                </span>
                <span className="flex-1 truncate">{u.endpoint}</span>
                <span className={`font-bold ${u.status_code >= 200 && u.status_code < 300 ? "text-emerald-500 dark:text-emerald-300" : "text-rose-500"}`}>
                  {u.status_code}
                </span>
                <span className="text-muted-foreground">{u.duration_ms}ms</span>
                {u.cost_usd > 0 && (
                  <span className="text-muted-foreground">${Number(u.cost_usd).toFixed(4)}</span>
                )}
                <span className="text-muted-foreground">{timeAgo(u.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Devices */}
      <Section title={`Appareils (${devices.length})`} icon={Smartphone}>
        {devices.length === 0 ? (
          <Empty label="Aucun appareil tracé" />
        ) : (
          <ul className="grid gap-2 md:grid-cols-2">
            {devices.map((d) => (
              <li key={d.id} className="rounded-xl border border-border bg-background/40 p-3 text-xs">
                <div className="font-semibold">
                  {d.device_type ?? "Device"} · {d.os ?? "?"} · {d.browser ?? "?"}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {d.ip && `IP ${d.ip}`}
                  {d.country && ` · ${d.country}`}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  Première visite {new Date(d.first_seen_at).toLocaleDateString("fr-FR")}
                  {" · dernière "}{timeAgo(d.last_seen_at)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Notifications */}
      <Section title={`Notifications reçues (${notifications.length})`} icon={Bell}>
        {notifications.length === 0 ? (
          <Empty label="Aucune notification" />
        ) : (
          <ul className="space-y-1.5">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-2.5 text-xs">
                <span className={`h-1.5 w-1.5 rounded-full ${n.read ? "bg-muted-foreground/30" : "bg-rose-500"}`} />
                <span className="rounded-md border border-border bg-card/40 px-1.5 py-0 text-[9px] font-bold uppercase">
                  {n.type}
                </span>
                <span className="flex-1 truncate">{n.title}</span>
                <span className="text-[10px] text-muted-foreground">{timeAgo(n.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Profile raw */}
      <details className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <summary className="cursor-pointer font-display text-sm font-bold">Profil raw (debug) ↓</summary>
        <pre className="mt-3 max-h-96 overflow-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-[10px]">
{JSON.stringify(profile, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function Section({ title, icon: Icon, children }: {
  title: string; icon: typeof Calendar; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
      <h2 className="flex items-center gap-2 font-display text-sm font-bold">
        <Icon className="h-4 w-4 text-[#EC4899]" />
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background/30 p-6 text-center text-xs text-muted-foreground">
      {label}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color }: {
  icon: typeof Search; label: string; value: string; color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border"
          style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}>
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="mt-2 font-display text-xl font-bold">{value}</div>
    </div>
  );
}

function RoleBadge({ role }: { role: string | null }) {
  if (!role) return null;
  const colors: Record<string, string> = {
    SUPER_ADMIN: "#F43F5E", ADMIN: "#F43F5E", AGENCY: "#EC4899",
    INFLUENCER: "#FF8A00", CREATOR: "#10B981", MODERATOR: "#FF8A00",
    SUPPORT: "#FBBF24", ANALYST: "#94A3B8",
  };
  const color = colors[role] ?? "#94A3B8";
  return (
    <span className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "#10B981", SUSPENDED: "#FF8A00", BANNED: "#F43F5E",
  };
  const color = colors[status] ?? "#94A3B8";
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold uppercase tracking-wider"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    SUCCEEDED: "#10B981", PENDING: "#FF8A00", FAILED: "#F43F5E", REFUNDED: "#EC4899",
  };
  const color = colors[status] ?? "#94A3B8";
  return (
    <span className="inline-flex items-center rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}>
      {status}
    </span>
  );
}

function AuditStatusIcon({ status }: { status: string }) {
  if (status === "COMPLETED")
    return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-300" />;
  if (status === "FAILED")
    return <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />;
  return <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />;
}

function scoreColor(s: number) {
  if (s >= 75) return "#10B981";
  if (s >= 50) return "#FF8A00";
  return "#F43F5E";
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
