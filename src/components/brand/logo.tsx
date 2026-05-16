import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo CreaFix AI — SVG officiel.
 * Bascule automatiquement entre logo light (texte sombre) et logo dark
 * (texte clair) selon la classe .dark / .light de l'ancêtre html.
 *
 * Les props `withText` et `showTagline` sont conservées pour compat
 * (no-op : le SVG officiel est la marque complète).
 */
export function Logo({
  className,
  withText: _withText = true,
  showTagline: _showTagline = true,
  size = 36,
}: {
  className?: string;
  withText?: boolean;
  showTagline?: boolean;
  /** Hauteur du logo en px (défaut 36). Width = height × 4.125 (ratio SVG). */
  size?: number;
}) {
  // Ratio viewBox 247.5 / 60 ≈ 4.125
  const height = size;
  const width = Math.round(size * 4.125);

  return (
    <div className={cn("inline-flex items-center", className)}>
      {/* Logo light — visible en thème clair */}
      <Image
        src="/logos/logo-light.svg"
        alt="CreaFix AI"
        width={width}
        height={height}
        priority
        className="block dark:hidden"
        style={{ height, width: "auto" }}
      />
      {/* Logo dark — visible en thème sombre */}
      <Image
        src="/logos/logo-dark.svg"
        alt="CreaFix AI"
        width={width}
        height={height}
        priority
        className="hidden dark:block"
        style={{ height, width: "auto" }}
      />
    </div>
  );
}
