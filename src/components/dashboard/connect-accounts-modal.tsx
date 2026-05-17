"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Plus, Unlink } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlatformIconBadge } from "@/components/brand/platform-icon";
import { createClient } from "@/lib/supabase/client";
import type { PlatformId } from "@/lib/platforms";

type ConnectedAccount = {
  id: string;
  platform: string;
  handle: string | null;
  display_name: string | null;
  is_connected: boolean;
};

const CONNECT_PLATFORMS: { id: PlatformId; name: string; description: string; available: boolean }[] = [
  { id: "TIKTOK",    name: "TikTok",    description: "Vidéos courtes & lives",        available: true  },
  { id: "INSTAGRAM", name: "Instagram", description: "Reels, stories & posts",        available: true  },
  { id: "YOUTUBE",   name: "YouTube",   description: "Vidéos longues & Shorts",       available: true  },
  { id: "FACEBOOK",  name: "Facebook",  description: "Pages & vidéos In-Stream",      available: true  },
  { id: "X",         name: "X",         description: "Tweets & Revenue Share",        available: true  },
];

export function ConnectAccountsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("social_accounts") as any)
        .select("id, platform, handle, display_name, is_connected")
        .eq("user_id", user.id)
        .eq("is_connected", true);
      setAccounts(data ?? []);
      setLoading(false);
    })();
  }, [open]);

  async function connect(platformId: PlatformId) {
    setConnecting(platformId);
    try {
      const res = await fetch("/api/social/connect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ platform: platformId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur");
      if (json.redirectUrl) {
        window.location.href = json.redirectUrl;
      } else {
        toast.error("URL de connexion manquante");
      }
    } catch (e: any) {
      toast.error(e.message ?? "Erreur de connexion");
      setConnecting(null);
    }
  }

  async function disconnect(accountId: string) {
    setDisconnecting(accountId);
    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("social_accounts") as any)
        .update({ is_connected: false, access_token: null, refresh_token: null })
        .eq("id", accountId);
      if (error) throw new Error(error.message);
      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
      toast.success("Compte déconnecté");
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setDisconnecting(null);
    }
  }

  const connectedByPlatform = accounts.reduce<Record<string, ConnectedAccount[]>>((acc, a) => {
    acc[a.platform] = [...(acc[a.platform] ?? []), a];
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#EC4899]/[0.08] via-background to-background p-6 pb-4">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#EC4899]/10 blur-2xl" />
          <DialogHeader className="relative">
            <DialogTitle className="font-display text-xl font-bold tracking-tight">
              Connecter mes comptes
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              Ajoute tes plateformes pour activer les 7 agents IA et commencer à monétiser.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Platform list */}
        <div className="px-6 pb-6 pt-2 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            CONNECT_PLATFORMS.map((platform) => {
              const connectedAccounts = connectedByPlatform[platform.id] ?? [];
              const isConnected = connectedAccounts.length > 0;

              return (
                <div
                  key={platform.id}
                  className={`group flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                    isConnected
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-border bg-card/40 hover:border-foreground/15 hover:bg-card/70"
                  }`}
                >
                  <PlatformIconBadge id={platform.id} size={40} rounded="rounded-xl" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{platform.name}</span>
                      {isConnected && (
                        <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Connecté
                        </span>
                      )}
                    </div>
                    {isConnected ? (
                      <div className="mt-0.5 flex flex-wrap gap-1.5">
                        {connectedAccounts.map((acc) => (
                          <span key={acc.id} className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                            @{acc.handle ?? acc.display_name ?? "compte"}
                            <button
                              onClick={() => disconnect(acc.id)}
                              disabled={disconnecting === acc.id}
                              className="ml-0.5 rounded-full text-muted-foreground/60 transition-colors hover:text-rose-400 disabled:opacity-50"
                              title="Déconnecter"
                            >
                              {disconnecting === acc.id ? (
                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                              ) : (
                                <Unlink className="h-2.5 w-2.5" />
                              )}
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{platform.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => connect(platform.id)}
                    disabled={connecting === platform.id}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-60 ${
                      isConnected
                        ? "border border-border bg-background/60 text-muted-foreground hover:bg-card"
                        : "bg-gradient-to-r from-[#EC4899] to-[#FF8A00] text-white shadow-md shadow-[#EC4899]/20 hover:shadow-lg hover:shadow-[#EC4899]/30"
                    }`}
                  >
                    {connecting === platform.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : isConnected ? (
                      <>
                        <Plus className="h-3 w-3" />
                        Ajouter
                      </>
                    ) : (
                      "Connecter"
                    )}
                  </button>
                </div>
              );
            })
          )}

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Tu seras redirigé vers la plateforme pour autoriser l&apos;accès. Aucun mot de passe stocké.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
