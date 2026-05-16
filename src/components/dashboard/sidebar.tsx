"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bot,
  Building2,
  Code2,
  CreditCard,
  FileBarChart2,
  Flame,
  HelpCircle,
  LayoutDashboard,
  Search,
  Settings,
  ShieldOff,
  Sparkles,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const nav = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/analytics", label: "Analytics", icon: Activity },
      { href: "/dashboard/audits", label: "AI Audit", icon: Search },
    ],
  },
  {
    title: "WOW AI",
    items: [
      { href: "/dashboard/generator", label: "Viral Lab", icon: Flame },
      { href: "/dashboard/revenue", label: "Revenue Predictor", icon: TrendingUp },
      { href: "/dashboard/trends", label: "Trend Scanner", icon: Sparkles },
      { href: "/dashboard/anti-ban", label: "Shadowban Guard", icon: ShieldOff },
      { href: "/dashboard/ai-studio", label: "AI Studio", icon: Wand2 },
      { href: "/dashboard/agents", label: "AI Agents", icon: Bot },
    ],
  },
  {
    title: "Pro",
    items: [
      { href: "/dashboard/reports", label: "Reports", icon: FileBarChart2 },
      { href: "/dashboard/agency", label: "Agency Mode", icon: Building2 },
      { href: "/dashboard/api", label: "API & Webhooks", icon: Code2 },
      { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/dashboard/support", label: "Support", icon: HelpCircle },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-background/40 backdrop-blur-xl md:flex md:flex-col">
      <div className="px-5 py-5">
        <Link href="/dashboard">
          <Logo showTagline={false} />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {nav.map((section) => (
          <div key={section.title} className="mb-5">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname?.startsWith(item.href);
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
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-[#7B61FF]" : "text-muted-foreground",
                      )}
                    />
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#7B61FF]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-2xl border border-[#7B61FF]/30 bg-gradient-to-br from-[#7B61FF]/15 to-[#FF8A00]/10 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#7B61FF]">
          Free Plan
        </div>
        <div className="mt-2 text-sm">
          Upgrade to <b>Pro</b> for unlimited audits.
        </div>
        <Link
          href="/dashboard/billing"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:bg-foreground/90"
        >
          Upgrade · $29/mo →
        </Link>
      </div>
    </aside>
  );
}
