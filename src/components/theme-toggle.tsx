"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bouton de bascule clair / sombre / système.
 * - variant="icon" : icône seule (header, topbar)
 * - variant="segmented" : 3 options visibles côte à côte (settings)
 */
export function ThemeToggle({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "segmented";
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Skeleton serveur — évite l'hydration mismatch
    return (
      <div
        className={cn(
          variant === "icon"
            ? "h-10 w-10 rounded-xl border border-border bg-card/40"
            : "h-10 w-32 rounded-xl border border-border bg-card/40",
          className,
        )}
      />
    );
  }

  if (variant === "segmented") {
    const options = [
      { key: "light", label: "Clair", icon: Sun },
      { key: "dark", label: "Sombre", icon: Moon },
      { key: "system", label: "Système", icon: Monitor },
    ] as const;
    return (
      <div
        className={cn(
          "inline-flex h-10 items-center gap-0.5 rounded-xl border border-border bg-muted/40 p-1",
          className,
        )}
        role="group"
      >
        {options.map((o) => {
          const active = theme === o.key;
          return (
            <button
              key={o.key}
              onClick={() => setTheme(o.key)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={active}
            >
              <o.icon className="h-3.5 w-3.5" />
              {o.label}
              {active && <Check className="h-3 w-3 opacity-60" />}
            </button>
          );
        })}
      </div>
    );
  }

  const isLight = resolvedTheme === "light";
  return (
    <button
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/40 backdrop-blur transition-colors hover:bg-card/70",
        className,
      )}
      aria-label={`Passer en mode ${isLight ? "sombre" : "clair"}`}
      title={`Mode ${isLight ? "sombre" : "clair"}`}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isLight ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          isLight ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
      />
    </button>
  );
}
