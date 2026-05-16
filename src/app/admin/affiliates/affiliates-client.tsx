"use client";

import { useMemo, useState } from "react";
import {
  Megaphone, DollarSign, Users, Trophy, Crown, Medal, Award,
  ChevronDown, Filter, CheckCircle2, Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ReferralRow = {
  id: string;
  code: string;
  affiliate_id: string;
  affiliate_email: string | null;
  affiliate_name: string | null;
  referred_id: string | null;
  referred_email: string | null;
  referred_country: string | null;
  commission_pct: number;
  earned_usd: number;
  paid_usd: number;
  status: string;
  created_at: string;
  paid_at: string | null;
};

type Leader = {
  affiliate_id: string;
  email: string | null;
  name: string | null;
  earned: number;
  referrals: number;
};

const STATUS_FILTERS = ["ALL", "pending", "approved", "paid", "rejected"];

export function AffiliatesClient({
  referrals,
  stats,
  leaderboard,
}: {
  referrals: ReferralRow[];
  stats: { total: number; uniqueAffiliates: number; totalEarned: number; totalPaid: number; pendingPayout: number };
  leaderboard: Leader[];
}) {
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return referrals.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      return true;
    });
  }, [referrals, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Affiliate System
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Programme parrainage créateurs · {stats.uniqueAffiliates} affiliés actifs · ${stats.totalEarned.toFixed(0)} générés
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Referrals" value={stats.total.toString()} color="#7B61FF" icon={Megaphone} />
        <Stat label="Affiliés actifs" value={stats.uniqueAffiliates.toString()} color="#00C2FF" icon={Users} />
        <Stat label="Commissions générées" value={`$${stats.totalEarned.toFixed(0)}`} color="#10B981" icon={DollarSign} />
        <Stat label="Payouts effectués" value={`$${stats.totalPaid.toFixed(0)}`} color="#FF8A00" icon={CheckCircle2} />
        <Stat label="À payer" value={`$${stats.pendingPayout.toFixed(0)}`} color="#F43F5E" icon={Clock} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        {/* Leaderboard */}
        <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold">
            <Trophy className="h-4 w-4 text-amber-500" />
            Top Affiliates
          </h2>
          {leaderboard.length === 0 ? (
            <p className="mt-6 text-center text-xs text-muted-foreground">Aucun affilié encore</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {leaderboard.map((l, i) => {
                const PodiumIcon = i === 0 ? Crown : i === 1 ? Medal : i === 2 ? Award : null;
                const podiumColor = i === 0 ? "#FBBF24" : i === 1 ? "#9CA3AF" : i === 2 ? "#92400E" : null;
                return (
                  <li
                    key={l.affiliate_id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] text-[10px] font-bold text-white">
                      {(l.name ?? l.email ?? "?").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {PodiumIcon && <PodiumIcon className="h-3.5 w-3.5" style={{ color: podiumColor! }} />}
                        <span className="truncate text-xs font-semibold">{l.name ?? l.email ?? "—"}</span>
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        {l.referrals} referrals
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-sm font-bold text-emerald-500 dark:text-emerald-300">
                        ${l.earned.toFixed(0)}
                      </div>
                      <div className="text-[9px] text-muted-foreground">générés</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Referrals list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-bold">Tous les referrals</h2>
            <FilterDropdown label="Statut" value={statusFilter} options={STATUS_FILTERS} onChange={setStatusFilter} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
            {filtered.length === 0 ? (
              <div className="px-5 py-16 text-center text-sm text-muted-foreground">
                Aucun referral · le programme s&apos;activera dès qu&apos;un affilié partagera son code
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {filtered.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold">{r.affiliate_email ?? "?"}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="truncate">{r.referred_email ?? "—"}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="font-mono">code: {r.code}</span>
                        <span>· {r.commission_pct}% commission</span>
                        {r.referred_country && <span>· {r.referred_country}</span>}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display text-sm font-bold text-emerald-500 dark:text-emerald-300">
                        ${r.earned_usd.toFixed(2)}
                      </div>
                      {r.paid_usd > 0 && (
                        <div className="text-[10px] text-muted-foreground">
                          ${r.paid_usd.toFixed(2)} payé
                        </div>
                      )}
                    </div>

                    <StatusBadge status={r.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-[#7B61FF]/30 bg-[#7B61FF]/[0.06] p-4">
        <div className="flex items-start gap-3">
          <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-[#7B61FF]" />
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">Programme parrainage :</b> chaque user PRO/AGENCY recevra un code de
            parrainage unique. Commission par défaut <b className="text-foreground">20%</b> à vie sur le 1er paiement
            du parrainé. Payouts automatiques via Wave/Orange Money/Stripe (à wirer en prochaine session).
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color, icon: Icon }: {
  label: string; value: string; color: string; icon: typeof Megaphone;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border"
        style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="truncate font-display text-base font-bold leading-none">{value}</div>
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
        <Filter className="h-3 w-3 text-muted-foreground" />
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "#FF8A00", approved: "#00C2FF", paid: "#10B981", rejected: "#F43F5E",
  };
  const color = colors[status] ?? "#94A3B8";
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}1A` }}
    >
      {status}
    </span>
  );
}
