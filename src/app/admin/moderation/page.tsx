"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Shield, ShieldAlert, ShieldCheck, AlertOctagon, Eye, Flag,
  CheckCircle2, XCircle, Ban, Music2, Image as ImageIcon, FileText,
  ChevronDown, Filter, Sparkles, Bot, Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModerationItem = {
  id: string;
  type: "content" | "comment" | "account" | "audio";
  user: string;
  country: string;
  flag: string;
  excerpt: string;
  reason: string;
  ai_confidence: number;
  flagged_by: "openai" | "gemini" | "user_report" | "auto_rule";
  severity: "low" | "medium" | "high" | "critical";
  created_at: string;
};

const MOCK_QUEUE: ModerationItem[] = [
  {
    id: "mod-1",
    type: "content",
    user: "@fake_account_42",
    country: "Sénégal",
    flag: "🇸🇳",
    excerpt: "Achète des followers TikTok pas cher → bit.ly/...",
    reason: "Spam · self-promo + URL suspecte",
    ai_confidence: 96,
    flagged_by: "openai",
    severity: "high",
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "mod-2",
    type: "audio",
    user: "@dj_abidjan",
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    excerpt: "Vidéo avec audio sous copyright (Davido — Awuke)",
    reason: "Copyright DMCA · audio non licencié",
    ai_confidence: 99,
    flagged_by: "auto_rule",
    severity: "critical",
    created_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
  },
  {
    id: "mod-3",
    type: "content",
    user: "@karim.beauty",
    country: "Maroc",
    flag: "🇲🇦",
    excerpt: "Tutoriel maquillage avec contenu suggestif possible",
    reason: "NSFW potentiel · 67% confiance",
    ai_confidence: 67,
    flagged_by: "gemini",
    severity: "medium",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "mod-4",
    type: "comment",
    user: "@trolll_42",
    country: "Nigeria",
    flag: "🇳🇬",
    excerpt: "Insultes répétées sur 14 commentaires en 5 min",
    reason: "Harcèlement · pattern brigading détecté",
    ai_confidence: 88,
    flagged_by: "auto_rule",
    severity: "high",
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "mod-5",
    type: "account",
    user: "@bot_engagement_v2",
    country: "Cameroun",
    flag: "🇨🇲",
    excerpt: "Compte créé il y a 2h, 1200 likes en 30 min",
    reason: "Fake engagement · pattern bot détecté",
    ai_confidence: 94,
    flagged_by: "auto_rule",
    severity: "high",
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "mod-6",
    type: "content",
    user: "@news_dakar",
    country: "Sénégal",
    flag: "🇸🇳",
    excerpt: "Article : 'Comment hacker un compte Facebook en 2 min'",
    reason: "Contenu malveillant · violation TOS",
    ai_confidence: 91,
    flagged_by: "openai",
    severity: "critical",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "mod-7",
    type: "content",
    user: "@user_report_x",
    country: "Afrique du Sud",
    flag: "🇿🇦",
    excerpt: "Vidéo signalée 8 fois pour 'misinformation politique'",
    reason: "User reports · misinformation",
    ai_confidence: 72,
    flagged_by: "user_report",
    severity: "medium",
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

const TYPE_META = {
  content: { icon: FileText, label: "Contenu", color: "#7B61FF" },
  comment: { icon: FileText, label: "Commentaire", color: "#00C2FF" },
  account: { icon: Shield, label: "Compte", color: "#FF8A00" },
  audio: { icon: Music2, label: "Audio", color: "#F43F5E" },
};

const SEVERITY_META = {
  low: { color: "#94A3B8", label: "Bas" },
  medium: { color: "#FF8A00", label: "Moyen" },
  high: { color: "#F43F5E", label: "Élevé" },
  critical: { color: "#DC2626", label: "Critique" },
};

const FLAGGER_META = {
  openai: { label: "OpenAI Moderation", color: "#10A37F" },
  gemini: { label: "Gemini Moderation", color: "#4285F4" },
  user_report: { label: "User Report", color: "#7B61FF" },
  auto_rule: { label: "Règle auto", color: "#FF8A00" },
};

const SEVERITY_FILTERS = ["ALL", "critical", "high", "medium", "low"];

export default function ModerationAdminPage() {
  const [items, setItems] = useState(MOCK_QUEUE);
  const [severity, setSeverity] = useState("ALL");
  const [acting, setActing] = useState<string | null>(null);

  const filtered = items.filter((i) => severity === "ALL" || i.severity === severity);

  function action(id: string, kind: "approve" | "reject" | "ban") {
    setActing(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(
        kind === "approve" ? "Contenu approuvé"
        : kind === "reject" ? "Contenu rejeté"
        : "User banni"
      );
      setActing(null);
    }, 600);
  }

  const stats = {
    total: items.length,
    critical: items.filter((i) => i.severity === "critical").length,
    high: items.filter((i) => i.severity === "high").length,
    avgConfidence: Math.round(items.reduce((s, i) => s + i.ai_confidence, 0) / Math.max(items.length, 1)),
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
            IA + manuel
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Queue de modération · OpenAI + Gemini + règles automatiques
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="En attente" value={stats.total} color="#FF8A00" icon={Eye} />
        <Stat label="Critiques" value={stats.critical} color="#DC2626" icon={AlertOctagon} />
        <Stat label="Élevés" value={stats.high} color="#F43F5E" icon={ShieldAlert} />
        <Stat label="Confiance IA moy." value={stats.avgConfidence} color="#10B981" icon={Sparkles} suffix="%" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Sévérité :
        </span>
        {SEVERITY_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSeverity(s)}
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
              severity === s
                ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Queue */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-5 py-16 text-center">
            <ShieldCheck className="h-10 w-10 text-emerald-500/60" />
            <p className="text-sm font-semibold">Aucun item en queue</p>
            <p className="text-xs text-muted-foreground">Tout est modéré ✓</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((it) => {
              const tMeta = TYPE_META[it.type];
              const sMeta = SEVERITY_META[it.severity];
              const fMeta = FLAGGER_META[it.flagged_by];
              const TypeIcon = tMeta.icon;
              const isActing = acting === it.id;

              return (
                <li key={it.id} className="grid grid-cols-[auto_1fr_auto] items-start gap-3 px-5 py-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    style={{ backgroundColor: `${tMeta.color}1A`, borderColor: `${tMeta.color}55` }}
                  >
                    <TypeIcon className="h-4 w-4" style={{ color: tMeta.color }} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-bold">{it.user}</span>
                      <span className="text-base">{it.flag}</span>
                      <SeverityBadge severity={it.severity} meta={sMeta} />
                      <ConfidenceBadge value={it.ai_confidence} />
                    </div>
                    <p className="mt-1 text-xs text-foreground/80">
                      <Flag className="mr-1 inline h-3 w-3 text-rose-500" />
                      <b>{it.reason}</b>
                    </p>
                    <p className="mt-1 truncate text-[11px] italic text-muted-foreground">
                      « {it.excerpt} »
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-1.5 py-0">
                        <Bot className="h-2.5 w-2.5" style={{ color: fMeta.color }} />
                        {fMeta.label}
                      </span>
                      <span>· {timeAgo(it.created_at)}</span>
                    </div>
                  </div>

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
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
        <div className="flex items-start gap-3">
          <ImageIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">Données mockées :</b> en prod, ces items seront
            poussés en temps réel par les workers (OpenAI Moderation API + Gemini Moderation +
            règles auto sur les comptes/audits/uploads). Persiste en table <code className="rounded bg-background/60 px-1">monetiq.moderation_queue</code> à créer.
          </p>
        </div>
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

function SeverityBadge({ severity, meta }: { severity: string; meta: { color: string; label: string } }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider"
      style={{ color: meta.color, borderColor: `${meta.color}55`, backgroundColor: `${meta.color}1A` }}
    >
      {severity === "critical" && <AlertOctagon className="h-2.5 w-2.5" />}
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
