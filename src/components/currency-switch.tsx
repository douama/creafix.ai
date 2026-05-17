"use client";

import * as React from "react";
import { Check, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { CURRENCIES, currencyList, type CurrencyCode } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function CurrencySwitch({
  currency,
  className,
}: {
  currency: CurrencyCode;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState<CurrencyCode | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  const current = CURRENCIES[currency];

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function pick(c: CurrencyCode) {
    if (c === currency) {
      setOpen(false);
      return;
    }
    setPending(c);
    await fetch("/api/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency: c }),
    });
    setOpen(false);
    router.refresh();
    setTimeout(() => setPending(null), 600);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-card/60 px-3 text-sm font-medium backdrop-blur transition-colors hover:bg-card/80"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Coins className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-mono text-xs">{current.code}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-xl border border-border bg-popover/95 p-1 shadow-xl backdrop-blur-xl"
        >
          {currencyList.map((c) => {
            const active = c.code === currency;
            return (
              <button
                key={c.code}
                onClick={() => pick(c.code)}
                disabled={!!pending}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-card/80 text-foreground"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                  pending && "opacity-50",
                )}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="flex-1 text-left">
                  <span className="font-mono text-xs font-semibold">{c.code}</span>{" "}
                  <span className="text-[11px] text-muted-foreground">{c.label}</span>
                </span>
                {active && <Check className="h-3.5 w-3.5 text-[#EC4899]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
