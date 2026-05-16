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
  UserPlus,
  Copy,
  Check,
  Eye,
  EyeOff,
  X,
  Shield,
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
  const [inviteOpen, setInviteOpen] = useState(false);
  const [credentialsModal, setCredentialsModal] = useState<{
    email: string; password: string; role: string;
  } | null>(null);

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-card/70"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Inviter un user
          </button>
        </div>
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          onCreated={(newUser, password) => {
            setUsers((prev) => [
              {
                id: newUser.id,
                email: newUser.email,
                full_name: newUser.full_name,
                role: newUser.role,
                plan: newUser.plan,
                credits: 50,
                country: null,
                status: "ACTIVE",
                created_at: new Date().toISOString(),
                last_seen_at: null,
              },
              ...prev.filter((u) => u.id !== newUser.id),
            ]);
            if (password) {
              setCredentialsModal({ email: newUser.email, password, role: newUser.role });
            }
            setInviteOpen(false);
          }}
        />
      )}

      {/* Credentials modal (affiché une fois après création) */}
      {credentialsModal && (
        <CredentialsModal
          {...credentialsModal}
          onClose={() => setCredentialsModal(null)}
        />
      )}

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

/* ════════════════════════════════════════════════════════════════════
 * Modal : créer un nouveau user / admin
 * ════════════════════════════════════════════════════════════════════ */

const ROLES_INVITE = [
  { id: "CREATOR",     label: "Créateur",     desc: "Plan FREE, accès basique" },
  { id: "INFLUENCER",  label: "Influenceur",  desc: "Stats étendues" },
  { id: "AGENCY",      label: "Agence",       desc: "Multi-clients" },
  { id: "ANALYST",     label: "Analyst",      desc: "Read-only analytics" },
  { id: "SUPPORT",     label: "Support",      desc: "Gestion tickets" },
  { id: "MODERATOR",   label: "Modérateur",   desc: "Modération contenus" },
  { id: "ADMIN",       label: "Admin",        desc: "Accès complet admin panel" },
  { id: "SUPER_ADMIN", label: "Super Admin",  desc: "Tous droits, irrévocable" },
];

const PLANS_INVITE = ["FREE", "PRO", "AGENCY"];

function InviteModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (user: { id: string; email: string; full_name: string; role: string; plan: string }, password: string | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [plan, setPlan] = useState("AGENCY");
  const [country, setCountry] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [useCustomPwd, setUseCustomPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Email valide requis");
      return;
    }
    if (useCustomPwd && customPassword.length < 8) {
      toast.error("Password min. 8 caractères");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          full_name: fullName.trim() || undefined,
          role,
          plan,
          country: country.trim() || undefined,
          password: useCustomPwd ? customPassword : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Échec");

      toast.success(json.isNew ? "Compte créé ✓" : "Compte mis à jour ✓");
      onCreated(json.user, json.generatedPassword);
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-border bg-gradient-to-br from-[#7B61FF]/[0.08] to-transparent p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#7B61FF]/40 bg-[#7B61FF]/15">
              <UserPlus className="h-4 w-4 text-[#7B61FF]" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold">Inviter un user</h2>
              <p className="text-[11px] text-muted-foreground">
                Crée un compte directement avec role + plan choisis
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-5">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nouveau@creafix.ai"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="(optionnel)"
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Pays (code ISO 2)
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="SN, NG, MA…"
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Rôle
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 md:grid-cols-3">
              {ROLES_INVITE.map((r) => {
                const active = role === r.id;
                const isAdminish = ["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    title={r.desc}
                    className={`rounded-lg border px-2.5 py-2 text-left text-xs transition-all ${
                      active
                        ? isAdminish
                          ? "border-rose-500/50 bg-rose-500/15 text-foreground"
                          : "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                        : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isAdminish && <Shield className="h-2.5 w-2.5" />}
                      <span className="font-semibold">{r.label}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      {r.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Plan
            </label>
            <div className="mt-1.5 flex gap-1.5">
              {PLANS_INVITE.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    plan === p
                      ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                      : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/40 p-3">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={useCustomPwd}
                onChange={(e) => setUseCustomPwd(e.target.checked)}
                className="h-3.5 w-3.5 cursor-pointer rounded border-border accent-[#7B61FF]"
              />
              <span className="font-semibold">Définir un mot de passe custom</span>
            </label>
            {useCustomPwd ? (
              <input
                type="text"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                placeholder="Min. 8 caractères"
                className="mt-2 h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-xs outline-none focus:border-foreground/30"
              />
            ) : (
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Un mot de passe fort sera généré et affiché une seule fois après création.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-background/40 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-card/40 px-3 py-1.5 text-xs font-semibold hover:bg-card/70"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting || !email.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
            Créer le compte
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * Modal : affichage des credentials générées (une seule fois)
 * ════════════════════════════════════════════════════════════════════ */

function CredentialsModal({
  email, password, role, onClose,
}: {
  email: string; password: string; role: string; onClose: () => void;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [copied, setCopied] = useState<"email" | "password" | "all" | null>(null);

  function copy(text: string, kind: typeof copied) {
    navigator.clipboard.writeText(text);
    setCopied(kind);
    toast.success("Copié dans le presse-papier");
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/30 bg-card shadow-2xl shadow-emerald-500/10">
        <div className="border-b border-border bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-5 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-300" />
          </div>
          <h2 className="mt-3 font-display text-base font-bold">Compte créé ✓</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            ⚠️ Copie le mot de passe maintenant — il ne sera plus jamais affiché.
          </p>
        </div>

        <div className="space-y-3 p-5">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-border bg-background/40 p-2.5">
              <code className="flex-1 truncate font-mono text-xs">{email}</code>
              <button
                type="button"
                onClick={() => copy(email, "email")}
                className="text-muted-foreground hover:text-foreground"
              >
                {copied === "email" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mot de passe
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/[0.06] p-2.5">
              <code className="flex-1 truncate font-mono text-xs font-bold">
                {showPwd ? password : "•".repeat(password.length)}
              </code>
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => copy(password, "password")}
                className="text-muted-foreground hover:text-foreground"
              >
                {copied === "password" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/40 p-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rôle assigné</span>
              <RoleBadge role={role} />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              copy(`Email: ${email}\nMot de passe: ${password}\nRôle: ${role}\nURL: ${
                role === "ADMIN" || role === "SUPER_ADMIN" || role === "MODERATOR"
                  ? "https://creafix-ai.vercel.app/login/admin"
                  : "https://creafix-ai.vercel.app/login"
              }`, "all")
            }
            className="w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-xs font-semibold transition-colors hover:bg-background/70"
          >
            {copied === "all" ? (
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Tout copié !
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Copy className="h-3.5 w-3.5" />
                Copier email + password + URL
              </span>
            )}
          </button>
        </div>

        <div className="border-t border-border bg-background/40 p-3 text-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gradient-to-r from-[#7B61FF] to-[#00C2FF] px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-[#7B61FF]/20"
          >
            J&apos;ai copié, fermer
          </button>
        </div>
      </div>
    </div>
  );
}
