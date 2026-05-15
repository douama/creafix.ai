"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { locales, localeFlags, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LocaleSwitch({ className }: { className?: string }) {
  const t = useTranslations("locale");
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState<Locale | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function pick(l: Locale) {
    if (l === currentLocale) {
      setOpen(false);
      return;
    }
    setPending(l);
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: l }),
    });
    setOpen(false);
    router.refresh();
    // courte temporisation pour laisser le refresh propager
    setTimeout(() => setPending(null), 600);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card/40 px-3 text-sm backdrop-blur transition-colors hover:bg-card/70"
        aria-haspopup="menu"
        aria-expanded={open}
        title={t("switch")}
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-base leading-none">{localeFlags[currentLocale]}</span>
        <span className="hidden text-xs font-medium uppercase md:inline">
          {currentLocale}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-popover/95 p-1 shadow-xl backdrop-blur-xl"
        >
          {locales.map((l) => {
            const active = l === currentLocale;
            return (
              <button
                key={l}
                role="menuitem"
                onClick={() => pick(l)}
                disabled={!!pending}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-card/80 text-foreground"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                  pending && "opacity-50",
                )}
              >
                <span className="text-base leading-none">{localeFlags[l]}</span>
                <span className="flex-1 text-left">{localeNames[l]}</span>
                {active && <Check className="h-3.5 w-3.5 text-[#7B61FF]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
