import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

type EmptySectionProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  accent?: string;
};

/**
 * Empty state générique pour les pages dashboard (analytics, audits, anti-ban, agents…).
 * Affiché tant que l'utilisateur n'a pas connecté de comptes ou lancé d'audits.
 */
export function EmptySection({
  icon: Icon,
  title,
  description,
  primaryCta,
  secondaryCta,
  accent = "#EC4899",
}: EmptySectionProps) {
  return (
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
        <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row">
        <Link
          href={primaryCta.href}
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
          style={{
            background: `linear-gradient(120deg, ${accent} 0%, #FF8A00 100%)`,
            boxShadow: `0 8px 24px ${accent}33`,
          }}
        >
          {primaryCta.label}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {secondaryCta && (
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            {secondaryCta.label}
          </Link>
        )}
      </div>
    </div>
  );
}
