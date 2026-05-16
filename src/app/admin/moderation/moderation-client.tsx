"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Shield, ShieldAlert, ShieldCheck, AlertOctagon, Eye, Flag,
  CheckCircle2, XCircle, Ban, Music2, Image as ImageIcon, FileText,
  ChevronDown, Filter, Sparkles, Bot, Loader2, User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ModerationItem = {
  id: string;
  kind: string;
  severity: string;
  status: string;
  excerpt: string;
  reason: string;
  ai_confidence: number;
  flagged_by: string;
  user_handle: string;
  user_email: string | null;
  user_country: string | null;
  created_at: string;
};

const KIND_META: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  CONTENT:   { icon: FileText,  label: "Contenu",     color: "#7B61FF" },
  COMMENT:   { icon: FileText,  label: "Commentaire", color: "#FF8A00" },
  ACCOUNT:   { icon: Shield,    label: "Compte",      color: "#FF8A00" },
  AUDIO:     { icon: Music2,    label: "Audio",       color: "#F43F5E" },
  THUMBNAIL: { icon: ImageIcon, label: "Thumbnail",   color: "#FBBF24" },
};

const SEVERITY_META: Record<string, { color: string; label: string }> = {
  LOW:      { color: "#94A3B8", label: "Bas" },
  MEDIUM:   { color: "#FF8A00", label: "Moyen" },
  HIGH:     { color: "#F43F5E", label: "Élevé" },
  CRITICAL: { color: "#DC2626", label: "Critique" },
};

const FLAGGER_META: Record<string, { label: string; color: string }> = {
  openai:      { label: "OpenAI Moderation", color: "#10A37F" },
  gemini:      { label: "Gemini Moderation", color: "#4285F4" },
  user_report: { label: "User Report",       color: "#7B61FF" },
  auto_rule:   { label: "Règle auto",        color: "#FF8A00" },
};

const SEVERITY_FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
const STATUS_FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "BANNED"];

export function ModerationClient({ initialItems }: { initialItems: ModerationItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [severity, setSeverity] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [acting, setActing] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (severity !== "ALL" && i.severity !== severity) return false;
      if (statusFilter !== "ALL" && i.status !== statusFilter) return false;
      return true;
    });
  }, [items, severity, statusFilter]);

  async function action(id: string, kind: "approve" | "reject" | "ban") {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/moderation/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: kind }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Échec");

      const newStatus = kind === "approve" ? "APPROVED" : kind === "reject" ? "REJECTED" : "BANNED";
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
      toast.success(
        kind === "approve" ? "Contenu approuvé"
        : kind === "reject" ? "Contenu rejeté"
        : "User banni"
      );
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setActing(null);
    }
  }

  const stats = {
    total: items.length,
    pending: items.filter((i) => i.status === "PENDING").length,
    critical: items.filter((i) => i.severity === "CRITICAL" && i.status === "PENDING").length,
    avgConfidence: items.length === 0
      ? 0
      : Math.round(items.reduce((s, i) => s + i.ai_confidence, 0) / items.length),
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Content Moderation
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
            <Bot className="h-2.5 w-2.5" />
            Live data
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Queue de modération · OpenAI + Gemini + règles auto · {items.length} entrées
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total" value={stats.total} color="#7B61FF" icon={Eye} />
        <Stat label="En attente" value={stats.pending} color="#FF8A00" icon={Flag} />
        <Stat label="Critiques" value={stats.critical} color="#DC2626" icon={AlertOctagon} />
        <Stat label="Confiance IA moy." value={stats.avgConfidence} color="#10B981" icon={Sparkles} suffix="%" />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-xl">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <FilterDropdown label="Statut" value={statusFilter} options={STATUS_FILTERS} onChange={setStatusFilter} />
        <FilterDropdown label="Sévérité" value={severity} options={SEVERITY_FILTERS} onChange={setSeverity} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-5 py-16 text-center">
            <ShieldCheck className="h-10 w-10 text-emerald-500/60" />
            <p className="text-sm font-semibold">Aucun item à modérer</p>
            <p className="text-xs text-muted-foreground">Tout est traité ✓</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((it) => {
              const tMeta = KIND_META[it.kind] ?? { icon: FileText, label: it.kind, color: "#94A3B8" };
              const sMeta = SEVERITY_META[it.severity] ?? { color: "#94A3B8", label: it.severity };
              const fMeta = FLAGGER_META[it.flagged_by] ?? { label: it.flagged_by, color: "#94A3B8" };
              const TypeIcon = tMeta.icon;
              const isActing = acting === it.id;
              const isResolved = it.status !== "PENDING";

              return (
                <li
                  key={it.id}
                  className={`grid grid-cols-[auto_1fr_auto] items-start gap-3 px-5 py-4 ${
                    isResolved ? "opacity-60" : ""
                  }`}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    style={{ backgroundColor: `${tMeta.color}1A`, borderColor: `${tMeta.color}55` }}
                  >
                    <TypeIcon className="h-4 w-4" style={{ color: tMeta.color }} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-bold">{it.user_handle}</span>
                      {it.user_country && <span className="text-xs text-muted-foreground">· {it.user_country}</span>}
                      <SeverityBadge severity={it.severity} meta={sMeta} />
                      <ConfidenceBadge value={it.ai_confidence} />
                      {isResolved && (
                        <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
                          {it.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-foreground/80">
                      <Flag className="mr-1 inline h-3 w-3 text-rose-500" />
                      <b>{it.reason}</b>
                    </p>
                    {it.excerpt && (
                      <p className="mt-1 truncate text-[11px] italic text-muted-foreground">
                        « {it.excerpt} »
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-1.5 py-0">
                        <Bot className="h-2.5 w-2.5" style={{ color: fMeta.color }} />
                        {fMeta.label}
                      </span>
                      <span>· {timeAgo(it.created_at)}</span>
                      {it.user_email && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <User className="h-2.5 w-2.5" />
                            {it.user_email}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {!isResolved && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={isActing}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background/40 px-2.5 text-xs font-semibold transition-colors hover:bg-background"
                      >
                        {isActing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Action"}
                        <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => action(it.id, "approve")}>
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                          Approuver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => action(it.id, "reject")}>
                          <XCircle className="mr-2 h-3.5 w-3.5 text-amber-500" />
                          Rejeter le contenu
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => action(it.id, "ban")}
                          className="text-rose-500 focus:bg-rose-500/10 focus:text-rose-500"
                        >
                          <Ban className="mr-2 h-3.5 w-3.5" />
                          Bannir le user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon, suffix }: {
  label: string; value: number; color: string; icon: typeof Shield; suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none">
          {value}{suffix && <span className="text-xs text-muted-foreground/60">{suffix}</span>}
        </div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function FilterDropdown({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-background/70">
        {label}: {value}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)}>{opt}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SeverityBadge({ severity, meta }: { severity: string; meta: { color: string; label: string } }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider"
      style={{ color: meta.color, borderColor: `${meta.color}55`, backgroundColor: `${meta.color}1A` }}
    >
      {severity === "CRITICAL" && <AlertOctagon className="h-2.5 w-2.5" />}
      {meta.label}
    </span>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const color = value >= 90 ? "#10B981" : value >= 70 ? "#FF8A00" : "#94A3B8";
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0 text-[9px] font-bold"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
    >
      IA {value}%
    </span>
  );
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return `${Math.floor(diff / 86400)} j`;
}
