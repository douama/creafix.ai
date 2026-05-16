"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Ban,
  ShieldOff,
  Crown,
  RefreshCcw,
  Trash2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  plan: string | null;
  credits: number | null;
  country: string | null;
  status: string | null;
  created_at: string;
  last_seen_at: string | null;
};

const ROLE_FILTERS = ["ALL", "ADMIN", "AGENCY", "INFLUENCER", "CREATOR"];
const PLAN_FILTERS = ["ALL", "FREE", "PRO", "AGENCY"];
const STATUS_FILTERS = ["ALL", "ACTIVE", "SUSPENDED", "BANNED"];

export function UsersClient({ initialUsers }: { initialUsers: UserRow[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pending, startTransition] = useTransition();
  const [actingId, setActingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
      if (planFilter !== "ALL" && u.plan !== planFilter) return false;
      if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          u.email.toLowerCase().includes(s) ||
          (u.full_name ?? "").toLowerCase().includes(s) ||
          (u.country ?? "").toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [users, search, roleFilter, planFilter, statusFilter]);

  async function action(id: string, kind: "suspend" | "unsuspend" | "ban" | "reset" | "upgrade") {
    setActingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/action`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: kind }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Échec");

      // Optimistic local update
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== id) return u;
          switch (kind) {
            case "suspend": return { ...u, status: "SUSPENDED" };
            case "unsuspend": return { ...u, status: "ACTIVE" };
            case "ban": return { ...u, status: "BANNED" };
            case "reset": return { ...u, credits: 50 };
            case "upgrade": return { ...u, plan: "PRO" };
          }
        }),
      );

      toast.success(
        kind === "suspend" ? "Utilisateur suspendu"
        : kind === "unsuspend" ? "Suspension levée"
        : kind === "ban" ? "Utilisateur banni"
        : kind === "reset" ? "Crédits remis à 50"
        : "Plan passé à PRO"
      );
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setActingId(null);
    }
  }

  function refresh() {
    startTransition(() => router.refresh());
  }

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "ACTIVE" || !u.status).length,
      suspended: users.filter((u) => u.status === "SUSPENDED").length,
      admins: users.filter((u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length,
    }),
    [users],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Users Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestion complète des utilisateurs CreaFix AI · {users.length} comptes
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-card/70"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatPill label="Total" value={stats.total} color="#7B61FF" icon={Users} />
        <StatPill label="Actifs" value={stats.active} color="#10B981" icon={CheckCircle2} />
        <StatPill label="Suspendus" value={stats.suspended} color="#FF8A00" icon={ShieldOff} />
        <StatPill label="Admins" value={stats.admins} color="#F43F5E" icon={Crown} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/40 p-3 backdrop-blur-xl">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher email, nom, pays…"
            className="h-9 w-full rounded-lg border border-border bg-background/40 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-foreground/30"
          />
        </div>
        <FilterChip label="Role" value={roleFilter} options={ROLE_FILTERS} onChange={setRoleFilter} />
        <FilterChip label="Plan" value={planFilter} options={PLAN_FILTERS} onChange={setPlanFilter} />
        <FilterChip label="Statut" value={statusFilter} options={STATUS_FILTERS} onChange={setStatusFilter} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        <div className="hidden grid-cols-[2fr_0.8fr_0.8fr_0.6fr_0.8fr_0.8fr_0.6fr] items-center gap-3 border-b border-border bg-background/40 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
          <div>User</div>
          <div>Role</div>
          <div>Plan</div>
          <div className="text-right">Credits</div>
          <div>Pays</div>
          <div>Inscrit</div>
          <div className="text-right">Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <ul>
            {filtered.map((u) => {
              const isActing = actingId === u.id;
              const isSuspended = u.status === "SUSPENDED";
              const isBanned = u.status === "BANNED";
              const initials = (u.full_name ?? u.email)
                .split(/[\s@.]/)
                .filter(Boolean)
                .slice(0, 2)
                .map((s) => s[0]?.toUpperCase())
                .join("");

              return (
                <li
                  key={u.id}
                  className={`grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/40 px-4 py-3 transition-colors hover:bg-card/30 md:grid-cols-[2fr_0.8fr_0.8fr_0.6fr_0.8fr_0.8fr_0.6fr] md:px-5 last:border-0 ${
                    isBanned ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] text-[10px] font-bold text-white">
                      {initials || "?"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="truncate text-sm font-semibold">
                          {u.full_name ?? u.email}
                        </span>
                        {isSuspended && (
                          <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300">
                            Suspendu
                          </span>
                        )}
                        {isBanned && (
                          <span className="inline-flex items-center gap-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
                            Banni
                          </span>
                        )}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">{u.email}</div>
                    </div>
                  </div>

                  <div className="hidden md:block"><RoleBadge role={u.role} /></div>
                  <div className="hidden md:block"><PlanBadge plan={u.plan} /></div>
                  <div className="hidden text-right text-xs font-semibold md:block">
                    {u.credits ?? 0}
                  </div>
                  <div className="hidden text-xs text-muted-foreground md:block">
                    {u.country ?? "—"}
                  </div>
                  <div className="hidden text-[11px] text-muted-foreground md:block">
                    {timeAgo(u.created_at)}
                  </div>

                  <div className="flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={isActing}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background/40 transition-colors hover:bg-background"
                      >
                        {isActing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <MoreVertical className="h-3.5 w-3.5" />
                        )}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem onClick={() => action(u.id, "reset")}>
                          <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                          Reset crédits (50)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => action(u.id, "upgrade")}>
                          <Crown className="mr-2 h-3.5 w-3.5 text-amber-500" />
                          Upgrader vers PRO
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isSuspended ? (
                          <DropdownMenuItem onClick={() => action(u.id, "unsuspend")}>
                            <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                            Lever la suspension
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => action(u.id, "suspend")}>
                            <ShieldOff className="mr-2 h-3.5 w-3.5 text-amber-500" />
                            Suspendre
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => action(u.id, "ban")}
                          className="text-rose-500 focus:bg-rose-500/10 focus:text-rose-500"
                        >
                          <Ban className="mr-2 h-3.5 w-3.5" />
                          Bannir définitivement
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatPill({
  label, value, color, icon: Icon,
}: {
  label: string; value: number; color: string; icon: typeof Users;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="font-display text-xl font-bold leading-none">{value}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label, value, options, onChange,
}: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-background/70">
        <Filter className="h-3 w-3 text-muted-foreground" />
        {label}: {value}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onClick={() => onChange(opt)}>
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RoleBadge({ role }: { role: string | null }) {
  if (!role) return <span className="text-xs text-muted-foreground">—</span>;
  const colors: Record<string, string> = {
    SUPER_ADMIN: "#F43F5E", ADMIN: "#F43F5E",
    AGENCY: "#7B61FF", INFLUENCER: "#FF8A00",
    CREATOR: "#10B981", MODERATOR: "#00C2FF",
    SUPPORT: "#FBBF24", ANALYST: "#94A3B8",
  };
  const color = colors[role] ?? "#94A3B8";
  return (
    <span
      className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
    >
      {role}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string | null }) {
  if (!plan) return <span className="text-xs text-muted-foreground">—</span>;
  const colors: Record<string, string> = {
    FREE: "#94A3B8", PRO: "#7B61FF", AGENCY: "#FF8A00",
  };
  const color = colors[plan] ?? "#94A3B8";
  return (
    <span
      className="inline-flex items-center rounded-full border border-border bg-background/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color }}
    >
      {plan}
    </span>
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
