"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Music2,
  Hash,
  TrendingUp,
  Sparkles,
  Plus,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  Loader2,
  Flame,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TrendRow = {
  id: string;
  country: string;
  platform: string;
  kind: string;
  title: string;
  momentum: number;
  uses_count: number | null;
  status: string;
  source: string | null;
  created_at: string;
};

const COUNTRIES = [
  { code: "ALL", flag: "🌍", name: "Tous" },
  { code: "SN", flag: "🇸🇳", name: "Sénégal" },
  { code: "CI", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "CM", flag: "🇨🇲", name: "Cameroun" },
  { code: "MA", flag: "🇲🇦", name: "Maroc" },
  { code: "ZA", flag: "🇿🇦", name: "Afrique du Sud" },
  { code: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "ML", flag: "🇲🇱", name: "Mali" },
  { code: "CD", flag: "🇨🇩", name: "RD Congo" },
];

const KINDS = ["SOUND", "HASHTAG", "NICHE", "FORMAT", "CHALLENGE", "TIMING"];
const PLATFORMS = ["TIKTOK", "INSTAGRAM", "YOUTUBE", "FACEBOOK", "X", "SNAPCHAT"];
const STATUSES = ["ALL", "PENDING", "APPROVED", "REJECTED", "ARCHIVED"];

const KIND_META: Record<string, { icon: typeof Music2; color: string }> = {
  SOUND:     { icon: Music2,     color: "#7B61FF" },
  HASHTAG:   { icon: Hash,       color: "#FF8A00" },
  NICHE:     { icon: TrendingUp, color: "#10B981" },
  FORMAT:    { icon: Sparkles,   color: "#FBBF24" },
  CHALLENGE: { icon: Flame,      color: "#FF8A00" },
  TIMING:    { icon: TrendingUp, color: "#F43F5E" },
};

export function TrendsClient({ initialTrends }: { initialTrends: TrendRow[] }) {
  const [trends, setTrends] = useState(initialTrends);
  const [country, setCountry] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [adding, setAdding] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  // Form add
  const [form, setForm] = useState({
    country: "SN",
    platform: "TIKTOK",
    kind: "SOUND",
    title: "",
    momentum: 70,
  });

  const filtered = useMemo(() => {
    return trends.filter((t) => {
      if (country !== "ALL" && t.country !== country) return false;
      if (status !== "ALL" && t.status !== status) return false;
      return true;
    });
  }, [trends, country, status]);

  async function action(id: string, kind: "approve" | "reject" | "archive" | "delete") {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/trends/${id}/action`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: kind }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Échec");
      }

      if (kind === "delete") {
        setTrends((prev) => prev.filter((t) => t.id !== id));
        toast.success("Trend supprimé");
      } else {
        const newStatus = kind === "approve" ? "APPROVED" : kind === "reject" ? "REJECTED" : "ARCHIVED";
        setTrends((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
        toast.success(`Trend ${newStatus.toLowerCase()}`);
      }
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setActing(null);
    }
  }

  async function add() {
    if (!form.title.trim()) {
      toast.error("Titre requis");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/trends", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, status: "APPROVED" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Échec");

      setTrends((prev) => [json.trend, ...prev]);
      setForm({ ...form, title: "", momentum: 70 });
      toast.success("Trend ajouté");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setAdding(false);
    }
  }

  const stats = {
    total: trends.length,
    approved: trends.filter((t) => t.status === "APPROVED").length,
    pending: trends.filter((t) => t.status === "PENDING").length,
    countries: new Set(trends.map((t) => t.country)).size,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          African Trend Engine
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Curation des trends (sons, hashtags, niches) par pays africain
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total trends" value={stats.total} color="#7B61FF" icon={TrendingUp} />
        <Stat label="Approuvés" value={stats.approved} color="#10B981" icon={CheckCircle2} />
        <Stat label="En attente" value={stats.pending} color="#FF8A00" icon={Sparkles} />
        <Stat label="Pays couverts" value={stats.countries} color="#FF8A00" icon={MapPin} />
      </div>

      {/* Add form */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
        <h2 className="flex items-center gap-2 font-display text-sm font-bold">
          <Plus className="h-4 w-4 text-[#7B61FF]" />
          Ajouter un trend
        </h2>
        <div className="mt-3 grid gap-2 md:grid-cols-[1fr_1fr_1fr_2fr_120px_auto]">
          <Select value={form.country} onChange={(v) => setForm({ ...form, country: v })}>
            {COUNTRIES.filter((c) => c.code !== "ALL").map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </Select>
          <Select value={form.platform} onChange={(v) => setForm({ ...form, platform: v })}>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
          <Select value={form.kind} onChange={(v) => setForm({ ...form, kind: v })}>
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </Select>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Titre (ex: Davido — Awuke / #abidjantiktok)"
            className="h-9 rounded-lg border border-border bg-background/40 px-3 text-xs outline-none focus:border-foreground/30"
          />
          <input
            type="number"
            value={form.momentum}
            min={0}
            max={100}
            onChange={(e) => setForm({ ...form, momentum: Number(e.target.value) })}
            placeholder="Momentum"
            className="h-9 rounded-lg border border-border bg-background/40 px-3 text-xs outline-none focus:border-foreground/30"
          />
          <button
            type="button"
            onClick={add}
            disabled={adding || !form.title}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#FF8A00] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20 disabled:opacity-50"
          >
            {adding ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            Ajouter
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Filtres :</span>
        {COUNTRIES.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => setCountry(c.code)}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
              country === c.code
                ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{c.flag}</span>
            <span className="hidden md:inline">{c.name}</span>
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-border" />
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
              status === s
                ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Aucun trend trouvé
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((t) => {
              const meta = KIND_META[t.kind] ?? { icon: TrendingUp, color: "#94A3B8" };
              const Icon = meta.icon;
              const flag = COUNTRIES.find((c) => c.code === t.country)?.flag ?? "🏳";
              const isActing = acting === t.id;

              return (
                <li key={t.id} className="flex items-center gap-3 px-5 py-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                    style={{ backgroundColor: `${meta.color}1A`, borderColor: `${meta.color}55` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: meta.color }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{flag}</span>
                      <span className="truncate font-display text-sm font-bold">{t.title}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{t.country} · {t.platform} · {t.kind}</span>
                      {t.uses_count != null && t.uses_count > 0 && (
                        <span>· {fmt(t.uses_count)} usages</span>
                      )}
                      <StatusChip status={t.status} />
                    </div>
                  </div>

                  <div className="hidden items-center gap-2 md:flex">
                    <div className="w-24">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Momentum</span>
                        <b className="text-foreground" style={{ color: meta.color }}>{t.momentum}</b>
                      </div>
                      <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-muted/30">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${t.momentum}%`, backgroundColor: meta.color }}
                        />
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      disabled={isActing}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background/40 hover:bg-background"
                    >
                      {isActing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "⋯"}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {t.status !== "APPROVED" && (
                        <DropdownMenuItem onClick={() => action(t.id, "approve")}>
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                          Approuver
                        </DropdownMenuItem>
                      )}
                      {t.status !== "REJECTED" && (
                        <DropdownMenuItem onClick={() => action(t.id, "reject")}>
                          <XCircle className="mr-2 h-3.5 w-3.5 text-amber-500" />
                          Rejeter
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => action(t.id, "archive")}>
                        <Archive className="mr-2 h-3.5 w-3.5" />
                        Archiver
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => action(t.id, "delete")}
                        className="text-rose-500 focus:bg-rose-500/10 focus:text-rose-500"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({
  label, value, color, icon: Icon,
}: { label: string; value: number; color: string; icon: typeof MapPin }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none">{value}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const colors: Record<string, string> = {
    APPROVED: "#10B981", PENDING: "#FF8A00", REJECTED: "#F43F5E", ARCHIVED: "#94A3B8",
  };
  const color = colors[status] ?? "#94A3B8";
  return (
    <span
      className="inline-flex items-center rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
    >
      {status}
    </span>
  );
}

function Select({
  value, onChange, children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-border bg-background/40 px-3 text-xs outline-none focus:border-foreground/30"
    >
      {children}
    </select>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}
