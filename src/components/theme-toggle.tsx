"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeKey = "light" | "dark" | "system";

const OPTIONS: { key: ThemeKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "light", label: "Clair", icon: Sun },
  { key: "dark", label: "Sombre", icon: Moon },
  { key: "system", label: "Système", icon: Monitor },
];

/**
 * Toggle de thème Liquid Glass — 3 modes (clair / sombre / système).
 *
 * Variants :
 *   - "icon"      : bouton icône qui ouvre un popover glass avec les 3 options
 *   - "segmented" : 3 options visibles côte à côte (page settings)
 */
export function ThemeToggle({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "segmented";
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  // Fermer au clic extérieur / Escape
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted) {
    return (
      <div
        className={cn(
          variant === "icon"
            ? "h-10 w-10 rounded-full glass-thin"
            : "h-10 w-72 rounded-2xl glass-thin",
          className,
        )}
      />
    );
  }

  // ────────── Variant segmented (page Settings) ──────────
  if (variant === "segmented") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 rounded-2xl p-1 glass-thin",
          className,
        )}
        role="radiogroup"
        aria-label="Thème de l'interface"
      >
        {OPTIONS.map((o) => {
          const active = theme === o.key;
          return (
            <button
              key={o.key}
              onClick={() => setTheme(o.key)}
              role="radio"
              aria-checked={active}
              className={cn(
                "relative inline-flex h-9 items-center gap-2 rounded-xl px-3.5 text-xs font-medium transition-all",
                active
                  ? "glass text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
              )}
            >
              <o.icon className="h-3.5 w-3.5" />
              <span>{o.label}</span>
              {active && <Check className="h-3 w-3 opacity-70" />}
            </button>
          );
        })}
      </div>
    );
  }

  // ────────── Variant icon avec popover glass ──────────
  // L'icône reflète le thème *résolu* (system → light ou dark selon OS)
  const Icon =
    theme === "system" ? Monitor : resolvedTheme === "light" ? Sun : Moon;

  return (
    <div className={cn("relative", className)} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Changer le thème"
        title="Changer le thème"
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full glass-thin transition-colors",
          open && "ring-2 ring-ring/40",
        )}
      >
        <Icon className="h-4 w-4 text-foreground/90 transition-transform" />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-12 z-50 w-56 rounded-2xl p-1.5 glass-thick glass-refract",
            "animate-in fade-in-0 zoom-in-95 duration-150",
          )}
        >
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Apparence
          </div>
          {OPTIONS.map((o) => {
            const active = theme === o.key;
            return (
              <button
                key={o.key}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(o.key);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-foreground/8 text-foreground"
                    : "text-foreground/85 hover:bg-foreground/5",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <o.icon className="h-4 w-4" />
                  {o.label}
                </span>
                {active && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
