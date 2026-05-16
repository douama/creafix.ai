"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  User,
  CreditCard,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  email: string;
  full_name: string | null;
  role: string | null;
  plan: string | null;
};

export function UserMenu({ variant = "default" }: { variant?: "default" | "admin" }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("user_profiles") as any)
        .select("email, full_name, role, plan")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data ?? { email: user.email ?? "", full_name: null, role: null, plan: null });
      setLoading(false);
    })();
  }, []);

  async function handleLogout() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Déconnecté");
      router.push("/");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Échec de la déconnexion");
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-9 w-9 animate-pulse items-center justify-center rounded-full bg-card/60">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-border bg-card/40 px-3 py-1.5 text-xs font-semibold hover:bg-card/70"
      >
        Connexion
      </Link>
    );
  }

  const initials = (profile.full_name ?? profile.email)
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  const isAdmin = profile.role === "ADMIN";
  const compact = variant === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2 rounded-xl border border-transparent p-1 outline-none transition-colors hover:border-border hover:bg-card/40 focus-visible:border-foreground/30">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] text-[10px] font-bold text-white shadow-lg shadow-[#7B61FF]/20`}
        >
          {initials || "?"}
        </div>
        {!compact && (
          <div className="hidden text-left md:block">
            <div className="text-xs font-semibold leading-tight">
              {profile.full_name ?? profile.email.split("@")[0]}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {profile.plan ?? "FREE"} · {profile.role ?? "CREATOR"}
            </div>
          </div>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#00C2FF] text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {profile.full_name ?? profile.email.split("@")[0]}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">
                {profile.email}
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {profile.role && <RoleChip role={profile.role} />}
            {profile.plan && <PlanChip plan={profile.plan} />}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4 text-rose-500" />
              Cockpit Admin
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <Sparkles className="mr-2 h-4 w-4 text-[#7B61FF]" />
            Mon dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Mon profil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/billing" className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Facturation
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          disabled={signingOut}
          className="cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 dark:text-rose-300"
        >
          {signingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          {signingOut ? "Déconnexion…" : "Se déconnecter"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RoleChip({ role }: { role: string }) {
  const colors: Record<string, string> = {
    ADMIN: "#F43F5E",
    AGENCY: "#7B61FF",
    INFLUENCER: "#FF8A00",
    CREATOR: "#10B981",
  };
  const color = colors[role] ?? "#94A3B8";
  return (
    <span
      className="inline-flex items-center rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider"
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}1A`,
      }}
    >
      {role}
    </span>
  );
}

function PlanChip({ plan }: { plan: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
      Plan {plan}
    </span>
  );
}
