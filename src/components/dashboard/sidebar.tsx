"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Coins,
  ShieldAlert,
  TrendingUp,
  FileBarChart2,
  Building2,
  Settings,
  CreditCard,
  Bot,
  HelpCircle,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const nav = [
  {
    title: "Tableau de bord",
    items: [
      { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
      { href: "/dashboard/audits", label: "Audits IA", icon: Search },
      { href: "/dashboard/revenue", label: "Revenus & estimations", icon: Coins },
      { href: "/dashboard/trends", label: "Tendances Afrique", icon: TrendingUp },
    ],
  },
  {
    title: "Création IA",
    items: [
      { href: "/dashboard/generator", label: "Idées virales", icon: Sparkles },
      { href: "/dashboard/agents", label: "Agents IA", icon: Bot },
      { href: "/dashboard/anti-ban", label: "Anti-Ban", icon: ShieldAlert },
    ],
  },
  {
    title: "Pro",
    items: [
      { href: "/dashboard/reports", label: "Rapports PDF", icon: FileBarChart2 },
      { href: "/dashboard/agency", label: "Mode Agence", icon: Building2 },
      { href: "/dashboard/billing", label: "Facturation", icon: CreditCard },
    ],
  },
  {
    title: "Compte",
    items: [
      { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
      { href: "/dashboard/help", label: "Aide & support", icon: HelpCircle },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-background/40 backdrop-blur-xl md:flex md:flex-col">
      <div className="px-5 py-5">
        <Link href="/dashboard">
          <Logo />
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
                        ? "bg-white/[0.07] text-foreground"
                        : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-violet-300" : "text-muted-foreground",
                      )}
                    />
                    <span>{item.label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/15 to-orange-500/10 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-violet-200">
          Plan Créateur
        </div>
        <div className="mt-2 text-sm">
          Passe en <b>Pro</b> pour les audits illimités.
        </div>
        <Link
          href="/dashboard/billing"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black hover:bg-white/90"
        >
          Upgrade →
        </Link>
      </div>
    </aside>
  );
}
