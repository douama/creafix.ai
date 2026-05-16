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
  size = 72,
}: {
  className?: string;
  withText?: boolean;
  showTagline?: boolean;
  /** Hauteur du logo en px (défaut 72). Width auto = ratio PNG préservé. */
  size?: number;
}) {
  // PNG dims 1109 × 471 → ratio ≈ 2.354:1
  const height = size;
  const width = Math.round(size * 2.354);

  return (
    <div className={cn("inline-flex items-center", className)}>
      {/* Logo light — visible en thème clair (texte sombre) */}
      <Image
        src="/logos/logo-light.png"
        alt="CreaFix AI"
        width={width}
        height={height}
        priority
        className="block dark:hidden"
        style={{ height, width: "auto" }}
      />
      {/* Logo dark — visible en thème sombre (texte clair) */}
      <Image
        src="/logos/logo-dark.png"
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
