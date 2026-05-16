"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { sidebarVisibleFor, type AdminRole } from "@/lib/admin/rbac";
import {
  LayoutDashboard,
  Users,
  Search,
  Bot,
  Flame,
  DollarSign,
  MapPin,
  CreditCard,
  Code2,
  Shield,
  BarChart3,
  Bell,
  Layers,
  Megaphone,
  LifeBuoy,
  Lock,
  Settings,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/notifications", label: "Notifications", icon: Bell, badge: "12" },
    ],
  },
  {
    title: "AI Operations",
    items: [
      { href: "/admin/audits", label: "AI Audits", icon: Search },
      { href: "/admin/agents", label: "AI Agents", icon: Bot, badge: "7" },
      { href: "/admin/viral-engine", label: "Viral Engine", icon: Flame },
      { href: "/admin/revenue-engine", label: "Revenue Engine", icon: DollarSign },
      { href: "/admin/trends", label: "African Trends", icon: MapPin },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/subscriptions", label: "Subscriptions", icon: Layers },
      { href: "/admin/plans", label: "Plans (édition)", icon: Layers },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/payments-config", label: "Payment Providers", icon: CreditCard },
      { href: "/admin/coupons", label: "Coupons", icon: Megaphone },
      { href: "/admin/affiliates", label: "Affiliate System", icon: Megaphone },
    ],
  },
  {
    title: "Platform",
    items: [
      { href: "/admin/moderation", label: "Content Moderation", icon: Shield },
      { href: "/admin/testimonials", label: "Témoignages landing", icon: MessageSquare },
      { href: "/admin/api", label: "API Management", icon: Code2 },
      { href: "/admin/support", label: "Support Tickets", icon: LifeBuoy },
      { href: "/admin/security", label: "Security", icon: Lock },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<Set<string> | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    (async () => {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (sb.from("user_profiles") as any)
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      const r = data?.role as AdminRole | undefined;
      if (r) {
        setRole(r);
        setAllowed(new Set(sidebarVisibleFor(r)));
      }
    })();
  }, []);

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-background/60 backdrop-blur-xl md:flex md:flex-col">
      <div className="px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo showTagline={false} />
        </Link>
        <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-rose-500 dark:text-rose-300">
          <Sparkles className="h-2.5 w-2.5" />
          {role ?? "Admin"} Panel
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map((section) => {
          const visibleItems = section.items.filter((it) =>
            allowed === null ? true : allowed.has(it.href),
          );
          if (visibleItems.length === 0) return null;
          return (
          <div key={section.title} className="mb-5">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-card/80 text-foreground"
                        : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-[#7B61FF]" : "text-muted-foreground",
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                          active
                            ? "bg-[#7B61FF]/20 text-[#7B61FF]"
                            : "bg-muted/40 text-muted-foreground",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    {active && !item.badge && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#7B61FF]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl border border-[#7B61FF]/30 bg-gradient-to-br from-[#7B61FF]/15 to-[#FF8A00]/10 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#FF8A00] text-[10px] font-bold text-white">
            SA
          </div>
          <div className="min-w-0 flex-1 text-xs">
            <div className="truncate font-semibold">Super Admin</div>
            <div className="truncate text-[10px] text-muted-foreground">
              admin@creafix.ai
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
