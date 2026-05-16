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
  /** Hauteur du logo en px (défaut 72). Width auto = ratio SVG préservé. */
  size?: number;
}) {
  // SVG viewBox 180×60 → ratio 3:1
  const height = size;
  const width = Math.round(size * 3);

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ height }}
    >
      {/* Logo light — visible en thème clair (texte sombre) */}
      <Image
        src="/logos/logo-light.svg"
        alt="CreaFix AI"
        width={width}
        height={height}
        priority
        unoptimized
        className="block dark:hidden"
        style={{ height, width: "auto", display: "block", objectFit: "contain", objectPosition: "center" }}
      />
      {/* Logo dark — visible en thème sombre (texte clair) */}
      <Image
        src="/logos/logo-dark.svg"
        alt="CreaFix AI"
        width={width}
        height={height}
        priority
        unoptimized
        className="hidden dark:block"
        style={{ height, width: "auto", display: "block", objectFit: "contain", objectPosition: "center" }}
      />
    </div>
  );
}
