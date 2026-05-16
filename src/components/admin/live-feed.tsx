"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Search, UserPlus, DollarSign, ShieldOff, MessageSquare,
  Bell, AlertOctagon, Flame,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FeedEvent = {
  id: string;
  kind: "audit" | "user" | "payment" | "moderation" | "notification" | "support";
  title: string;
  subtitle?: string;
  at: string;
};

const KIND_META: Record<FeedEvent["kind"], { icon: typeof Activity; color: string }> = {
  audit:        { icon: Search,        color: "#EC4899" },
  user:         { icon: UserPlus,      color: "#FF8A00" },
  payment:      { icon: DollarSign,    color: "#10B981" },
  moderation:   { icon: AlertOctagon,  color: "#F43F5E" },
  notification: { icon: Bell,          color: "#FF8A00" },
  support:      { icon: MessageSquare, color: "#FBBF24" },
};

const MAX_VISIBLE = 8;

export function LiveFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sb = createClient();

    function push(e: FeedEvent) {
      setEvents((prev) => [e, ...prev].slice(0, MAX_VISIBLE));
    }

    // Subscribe à postgres_changes sur les tables clés
    // Notes : Supabase Realtime nécessite que les tables soient ajoutées
    //        à la publication `supabase_realtime` côté DB pour fonctionner.
    //        Le fallback est silencieux si pas configuré.
    const channel = sb
      .channel("admin-live-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "monetiq", table: "audits" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          push({
            id: payload.new?.id ?? crypto.randomUUID(),
            kind: "audit",
            title: `Nouvel audit IA lancé`,
            subtitle: `mode ${payload.new?.mode ?? "?"} · status ${payload.new?.status ?? "?"}`,
            at: payload.new?.started_at ?? new Date().toISOString(),
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "monetiq", table: "user_profiles" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          push({
            id: payload.new?.id ?? crypto.randomUUID(),
            kind: "user",
            title: `Nouvel utilisateur inscrit`,
            subtitle: payload.new?.email ?? "—",
            at: payload.new?.created_at ?? new Date().toISOString(),
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "monetiq", table: "payments" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          push({
            id: payload.new?.id ?? crypto.randomUUID(),
            kind: "payment",
            title: `Paiement ${payload.new?.status ?? "?"}`,
            subtitle: `$${payload.new?.amount ?? "?"} via ${payload.new?.provider ?? "?"}`,
            at: payload.new?.created_at ?? new Date().toISOString(),
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "monetiq", table: "moderation_queue" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          push({
            id: payload.new?.id ?? crypto.randomUUID(),
            kind: "moderation",
            title: `Modération · ${payload.new?.severity ?? "?"}`,
            subtitle: payload.new?.reason ?? "—",
            at: payload.new?.created_at ?? new Date().toISOString(),
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "monetiq", table: "support_tickets" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          push({
            id: payload.new?.id ?? crypto.randomUUID(),
            kind: "support",
            title: `Nouveau ticket support`,
            subtitle: payload.new?.subject ?? "—",
            at: payload.new?.created_at ?? new Date().toISOString(),
          });
        },
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      sb.removeChannel(channel);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-5 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-[#EC4899]" />
          <h2 className="font-display text-sm font-bold">Live feed</h2>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
              connected
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-300"
            }`}
          >
            <span
              className={`relative flex h-1.5 w-1.5 ${connected ? "" : "opacity-50"}`}
            >
              {connected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              )}
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                  connected ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
            {connected ? "Live" : "Attente"}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {events.length} évén.
        </span>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
          <Flame className="h-6 w-6 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">
            En attente d&apos;activité…
          </p>
          <p className="text-[10px] text-muted-foreground/70">
            Les events apparaîtront dès qu&apos;un user lance un audit, paie, ou
            qu&apos;un ticket arrive.
          </p>
        </div>
      ) : (
        <ul>
          <AnimatePresence initial={false}>
            {events.map((e) => {
              const meta = KIND_META[e.kind];
              const Icon = meta.icon;
              return (
                <motion.li
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 border-b border-border/40 px-5 py-2.5 last:border-0"
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border"
                    style={{
                      backgroundColor: `${meta.color}1A`,
                      borderColor: `${meta.color}55`,
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: meta.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold">{e.title}</div>
                    {e.subtitle && (
                      <div className="truncate text-[10px] text-muted-foreground">
                        {e.subtitle}
                      </div>
                    )}
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {timeAgo(e.at)}
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      {!connected && (
        <div className="border-t border-border/40 bg-amber-500/[0.04] px-5 py-2 text-[10px] text-muted-foreground">
          💡 Pour activer le live feed, ajoute les tables à la publication
          {" "}<code className="rounded bg-background/60 px-1">supabase_realtime</code> dans Supabase Dashboard (Settings → Replication).
        </div>
      )}
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 5) return "à l'instant";
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}
