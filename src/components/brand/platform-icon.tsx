/**
 * Vrais logos officiels des plateformes via react-icons.
 *
 * Source : Simple Icons (sicons.org) — logos officiels avec couleurs de marque.
 * LinkedIn vient de Font Awesome (retiré de Simple Icons pour raisons trademark).
 *
 * Tree-shakeable : seuls les icons importés sont bundlés.
 */
import {
  SiYoutube,
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiX,
  SiSnapchat,
  SiTwitch,
  SiPinterest,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import type { PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<PlatformId, React.ComponentType<{ className?: string; size?: number | string }>> = {
  YOUTUBE: SiYoutube,
  FACEBOOK: SiFacebook,
  INSTAGRAM: SiInstagram,
  TIKTOK: SiTiktok,
  X: SiX,
  SNAPCHAT: SiSnapchat,
  TWITCH: SiTwitch,
  PINTEREST: SiPinterest,
  LINKEDIN: FaLinkedin,
};

/** Couleurs officielles de marque (utilisées en hex direct). */
export const PLATFORM_BRAND_COLORS: Record<PlatformId, string> = {
  YOUTUBE: "#FF0000",
  FACEBOOK: "#1877F2",
  INSTAGRAM: "#E4405F",
  TIKTOK: "#FFFFFF",     // TikTok = noir/blanc, on utilise blanc sur fond sombre
  X: "#FFFFFF",          // X = noir/blanc, blanc sur sombre
  SNAPCHAT: "#000000",   // logo noir sur fond jaune
  TWITCH: "#9146FF",
  PINTEREST: "#E60023",
  LINKEDIN: "#0A66C2",
};

export function PlatformIcon({
  id,
  className,
  size,
  style,
}: {
  id: PlatformId;
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
}) {
  const Icon = ICON_MAP[id] as React.ComponentType<{
    className?: string;
    size?: number | string;
    style?: React.CSSProperties;
  }>;
  if (!Icon) return null;
  return <Icon className={cn("inline-block", className)} size={size} style={style} />;
}

/**
 * Variante avec background gradient + icon blanc.
 * Pour les avatars/buttons.
 */
export function PlatformIconBadge({
  id,
  size = 40,
  rounded = "rounded-xl",
  className,
}: {
  id: PlatformId;
  size?: number;
  rounded?: "rounded-md" | "rounded-lg" | "rounded-xl" | "rounded-2xl" | "rounded-full";
  className?: string;
}) {
  const Icon = ICON_MAP[id];

  // Snapchat : fond jaune + icon noir (sa marque officielle)
  if (id === "SNAPCHAT") {
    return (
      <div
        className={cn("flex items-center justify-center bg-[#FFFC00] shadow-md", rounded, className)}
        style={{ width: size, height: size }}
      >
        <Icon className="text-black" size={size * 0.55} />
      </div>
    );
  }

  // TikTok : fond noir + icon blanc + accents néon (signature TikTok)
  if (id === "TIKTOK") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-black shadow-md",
          rounded,
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Icon className="relative z-10 text-white" size={size * 0.55} />
      </div>
    );
  }

  // X : fond noir + icon blanc
  if (id === "X") {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-black shadow-md",
          rounded,
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Icon className="text-white" size={size * 0.5} />
      </div>
    );
  }

  // Toutes les autres : couleur de marque solide
  return (
    <div
      className={cn("flex items-center justify-center shadow-md", rounded, className)}
      style={{
        width: size,
        height: size,
        backgroundColor: PLATFORM_BRAND_COLORS[id],
      }}
    >
      <Icon className="text-white" size={size * 0.55} />
    </div>
  );
}
