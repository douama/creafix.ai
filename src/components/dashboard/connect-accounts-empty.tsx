"use client";

import { useState } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { ConnectAccountsModal } from "./connect-accounts-modal";

type ConnectAccountsEmptyProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  label?: string;
  accent?: string;
};

export function ConnectAccountsEmpty({
  icon: Icon,
  title,
  description,
  label = "Connecter mes comptes",
  accent = "#EC4899",
}: ConnectAccountsEmptyProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ConnectAccountsModal open={open} onOpenChange={setOpen} />

      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center md:p-16">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{
            backgroundColor: `${accent}1A`,
            borderColor: `${accent}55`,
            color: accent,
          }}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="max-w-md space-y-2">
          <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
          style={{
            background: `linear-gradient(120deg, ${accent} 0%, #FF8A00 100%)`,
            boxShadow: `0 8px 24px ${accent}33`,
          }}
        >
          {label}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </>
  );
}
