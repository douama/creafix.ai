"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LifeBuoy, Filter, ChevronDown, Loader2,
  CheckCircle2, Clock, AlertOctagon, AlertCircle,
  Mail, MessageSquare, Tag, User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TicketRow = {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  user_country: string | null;
  user_plan: string | null;
  subject: string;
  body: string;
  status: string;
  priority: string;
  category: string;
  channel: string;
  assigned_to: string | null;
  assigned_email: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_FILTERS = ["ALL", "OPEN", "IN_PROGRESS", "WAITING_USER", "RESOLVED", "CLOSED"];
const PRIORITY_FILTERS = ["ALL", "URGENT", "HIGH", "MEDIUM", "LOW"];
const CATEGORY_FILTERS = ["ALL", "BILLING", "TECHNICAL", "ACCOUNT", "FEATURE_REQUEST", "OTHER"];

const STATUS_META: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  OPEN:          { icon: AlertCircle,  color: "#FF8A00", label: "Ouvert" },
  IN_PROGRESS:   { icon: Loader2,      color: "#7B61FF", label: "En cours" },
  WAITING_USER:  { icon: Clock,        color: "#FBBF24", label: "Attente user" },
  RESOLVED:      { icon: CheckCircle2, color: "#10B981", label: "Résolu" },
  CLOSED:        { icon: CheckCircle2, color: "#94A3B8", label: "Fermé" },
};

const PRIORITY_META: Record<string, string> = {
  URGENT: "#F43F5E", HIGH: "#FF8A00", MEDIUM: "#FBBF24", LOW: "#94A3B8",
};

export function SupportClient({ initialTickets }: { initialTickets: TicketRow[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selected, setSelected] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
      if (categoryFilter !== "ALL" && t.category !== categoryFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          t.subject.toLowerCase().includes(s) ||
          t.body.toLowerCase().includes(s) ||
          (t.user_email ?? "").toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter]);

  const selectedTicket = tickets.find((t) => t.id === selected);

  async function changeStatus(id: string, newStatus: string) {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Échec");
      }
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
      toast.success(`Ticket marqué ${newStatus}`);
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setActing(null);
    }
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    urgent: tickets.filter((t) => t.priority === "URGENT").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Support Tickets
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inbox tickets · {tickets.length} tickets · {stats.open} ouverts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total" value={stats.total} color="#7B61FF" icon={LifeBuoy} />
        <Stat label="Ouverts" value={stats.open} color="#FF8A00" icon={AlertCircle} />
        <Stat label="En cours" value={stats.inProgress} color="#7B61FF" icon={Loader2} />
        <Stat label="Urgents" value={stats.urgent} color="#F43F5E" icon={AlertOctagon} />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-xl">
        <div className="relative min-w-[200px] flex-1">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher subject, email, message…"
            className="h-9 w-full rounded-lg border border-border bg-background/40 pl-9 pr-3 text-sm outline-none focus:border-foreground/30"
          />
        </div>
        <FilterDropdown label="Statut" value={statusFilter} options={STATUS_FILTERS} onChange={setStatusFilter} />
        <FilterDropdown label="Priorité" value={priorityFilter} options={PRIORITY_FILTERS} onChange={setPriorityFilter} />
        <FilterDropdown label="Catégorie" value={categoryFilter} options={CATEGORY_FILTERS} onChange={setCategoryFilter} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
          {filtered.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-muted-foreground">
              Aucun ticket trouvé
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {filtered.map((t) => {
                const meta = STATUS_META[t.status] ?? STATUS_META.OPEN;
                const Icon = meta.icon;
                const isSelected = selected === t.id;
                const isActing = acting === t.id;

                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(isSelected ? null : t.id)}
                      className={`flex w-full items-start gap-3 px-5 py-3 text-left transition-colors hover:bg-card/60 ${
                        isSelected ? "bg-card/70" : ""
                      }`}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                        style={{ backgroundColor: `${meta.color}1A`, borderColor: `${meta.color}55` }}
                      >
                        {isActing ? (
                          <Loader2 className="h-4 w-4 animate-spin" style={{ color: meta.color }} />
                        ) : (
                          <Icon className="h-4 w-4" style={{ color: meta.color }} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-display text-sm font-bold">{t.subject}</span>
                          <PriorityBadge priority={t.priority} />
                          <CategoryBadge category={t.category} />
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                          {t.body}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <User className="h-2.5 w-2.5" />
                          <span className="truncate">{t.user_email ?? "?"}</span>
                          {t.user_country && <span>· {t.user_country}</span>}
                          <span>· {timeAgo(t.created_at)}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Detail panel */}
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          {!selectedTicket ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Sélectionne un ticket</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-base font-bold">{selectedTicket.subject}</h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1 text-xs font-semibold transition-colors hover:bg-background/70">
                      Changer statut
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {STATUS_FILTERS.slice(1).map((s) => (
                        <DropdownMenuItem key={s} onClick={() => changeStatus(selectedTicket.id, s)}>
                          {STATUS_META[s]?.label ?? s}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedTicket.status} />
                  <PriorityBadge priority={selectedTicket.priority} />
                  <CategoryBadge category={selectedTicket.category} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background/40 p-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <User className="h-2.5 w-2.5" />
                  Demandé par
                </div>
                <div className="mt-1 text-xs">
                  <div className="font-semibold">{selectedTicket.user_name ?? selectedTicket.user_email}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {selectedTicket.user_email}
                    {selectedTicket.user_country && ` · ${selectedTicket.user_country}`}
                    {selectedTicket.user_plan && ` · plan ${selectedTicket.user_plan}`}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Message
                </div>
                <p className="mt-1.5 whitespace-pre-wrap rounded-xl border border-border bg-background/40 p-3 text-sm">
                  {selectedTicket.body}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <div className="uppercase tracking-wider text-muted-foreground">Créé</div>
                  <div className="mt-0.5">{new Date(selectedTicket.created_at).toLocaleString("fr-FR")}</div>
                </div>
                <div>
                  <div className="uppercase tracking-wider text-muted-foreground">Modifié</div>
                  <div className="mt-0.5">{timeAgo(selectedTicket.updated_at)}</div>
                </div>
              </div>

              {selectedTicket.assigned_email && (
                <div className="text-[11px] text-muted-foreground">
                  Assigné à <b className="text-foreground">{selectedTicket.assigned_email}</b>
                </div>
              )}

              <button
                type="button"
                onClick={() => toast.info("Reply UI à wirer en Phase E (table support_messages déjà créée)")}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#FF8A00] px-4 py-2 text-xs font-semibold text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                Répondre au ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon }: {
  label: string; value: number; color: string; icon: typeof LifeBuoy;
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

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.OPEN;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color: meta.color, borderColor: `${meta.color}55`, backgroundColor: `${meta.color}1A` }}
    >
      {meta.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = PRIORITY_META[priority] ?? "#94A3B8";
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
    >
      {priority === "URGENT" && <AlertOctagon className="h-2.5 w-2.5" />}
      {priority}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full border border-border bg-background/60 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
      <Tag className="h-2.5 w-2.5" />
      {category.replace(/_/g, " ")}
    </span>
  );
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
