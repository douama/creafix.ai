"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bell, Send, Mail, MessageCircle, Users, Filter, ChevronDown,
  CheckCircle2, Clock, Loader2, Sparkles, AlertCircle, BarChart3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NotifRow = {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  meta: Record<string, unknown> | null;
  created_at: string;
};

const TYPE_FILTERS = ["ALL", "audit_ready", "shadowban_alert", "subscription", "broadcast", "system"];
const CHANNELS = [
  { id: "in_app", label: "In-app", icon: Bell, color: "#7B61FF" },
  { id: "email", label: "Email", icon: Mail, color: "#FF8A00" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#10B981" },
];
const SEGMENTS = [
  { id: "all", label: "Tous les users" },
  { id: "free", label: "Plan FREE seulement" },
  { id: "pro", label: "Plan PRO+" },
  { id: "agency", label: "AGENCY only" },
  { id: "africa", label: "Afrique francophone" },
  { id: "active_30d", label: "Actifs 30 j" },
];

export function NotificationsClient({ initialNotifs }: { initialNotifs: NotifRow[] }) {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [composing, setComposing] = useState(false);

  // Compose form
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("in_app");
  const [segment, setSegment] = useState("all");
  const [sending, setSending] = useState(false);

  const filtered = useMemo(() => {
    return notifs.filter((n) => typeFilter === "ALL" || n.type === typeFilter);
  }, [notifs, typeFilter]);

  const stats = useMemo(() => ({
    total: notifs.length,
    unread: notifs.filter((n) => !n.read).length,
    today: notifs.filter((n) => new Date(n.created_at).toDateString() === new Date().toDateString()).length,
    types: new Set(notifs.map((n) => n.type)).size,
  }), [notifs]);

  async function send() {
    if (!title.trim()) {
      toast.error("Titre requis");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/admin/notifications/broadcast", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, body, channel, segment }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Échec");

      toast.success(`Broadcast envoyé à ${json.count ?? 0} users`);
      // Préprend la nouvelle notif au top de la liste
      if (json.preview) {
        setNotifs((prev) => [json.preview, ...prev]);
      }
      setTitle("");
      setBody("");
      setComposing(false);
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Notifications Center
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Broadcasts, alertes systèmes, push mobile · {notifs.length} envoyées
          </p>
        </div>
        <button
          type="button"
          onClick={() => setComposing(!composing)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#FF8A00] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20"
        >
          <Send className="h-3.5 w-3.5" />
          {composing ? "Fermer" : "Nouveau broadcast"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total notifs" value={stats.total} color="#7B61FF" icon={Bell} />
        <Stat label="Non lues" value={stats.unread} color="#FF8A00" icon={Clock} />
        <Stat label="Aujourd'hui" value={stats.today} color="#10B981" icon={Sparkles} />
        <Stat label="Types" value={stats.types} color="#FF8A00" icon={BarChart3} />
      </div>

      {/* Compose form */}
      {composing && (
        <div className="rounded-2xl border border-[#7B61FF]/40 bg-gradient-to-br from-[#7B61FF]/[0.06] via-card/40 to-card/40 p-5 backdrop-blur-xl">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold">
            <Send className="h-4 w-4 text-[#7B61FF]" />
            Nouveau broadcast
          </h2>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Canal
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {CHANNELS.map((c) => {
                  const Icon = c.icon;
                  const active = channel === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setChannel(c.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                        active
                          ? "text-foreground"
                          : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                      }`}
                      style={
                        active
                          ? {
                              backgroundColor: `${c.color}1A`,
                              borderColor: `${c.color}66`,
                            }
                          : undefined
                      }
                    >
                      <Icon className="h-3 w-3" style={active ? { color: c.color } : undefined} />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Segment cible
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SEGMENTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSegment(s.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                      segment === s.id
                        ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                        : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Titre
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Nouvel audit IA disponible"
                maxLength={100}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Message
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="Message à diffuser…"
                maxLength={500}
                className="mt-1.5 w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-foreground/30"
              />
            </div>

            <button
              type="button"
              onClick={send}
              disabled={sending || !title.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#FF8A00] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20 disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Envoyer le broadcast
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-xl">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <FilterDropdown label="Type" value={typeFilter} options={TYPE_FILTERS} onChange={setTypeFilter} />
      </div>

      {/* Notifications list */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Aucune notification · les broadcasts apparaîtront ici
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((n) => (
              <li key={n.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#7B61FF]/30 bg-[#7B61FF]/10">
                  <Bell className="h-4 w-4 text-[#7B61FF]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-display text-sm font-bold">{n.title}</span>
                    <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      {n.type}
                    </span>
                    {!n.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    )}
                  </div>
                  {n.body && (
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{n.body}</p>
                  )}
                  <div className="mt-1 text-[10px] text-muted-foreground">
                    {n.user_email ? `→ ${n.user_email}` : "broadcast global"}
                  </div>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {timeAgo(n.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">In-app fonctionne (Supabase Realtime).</b> Email (Resend) +
            WhatsApp (Twilio/Meta) à wirer en Phase D pour les broadcasts hors-app.
            Templates et schedule (cron) viennent ensuite.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon }: {
  label: string; value: number; color: string; icon: typeof Bell;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none">{value}</div>
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
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)}>{opt}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
