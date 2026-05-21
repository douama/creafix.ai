"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";

/**
 * Lit ?connect_result=success:PLATFORM:@handle ou error:PLATFORM:reason
 * (posé par les routes /api/social/callback/*) et affiche un toast,
 * puis nettoie le param de l'URL pour ne pas le re-toaster au reload.
 */

const PLATFORM_LABELS: Record<string, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  X: "X",
};

const ERROR_MESSAGES: Record<string, string> = {
  missing_params:        "Réponse OAuth incomplète. Réessaie.",
  missing_state_cookie:  "Session OAuth expirée (10 min). Réessaie.",
  state_mismatch:        "Vérification anti-CSRF échouée. Réessaie.",
  token_exchange_failed: "Impossible d'obtenir un token d'accès. Réessaie ou vérifie les permissions.",
  profile_fetch_failed:  "Impossible de récupérer ton profil. Si tu n'as pas de compte business lié, configure-le d'abord.",
  db_insert_failed:      "Erreur lors de l'enregistrement. Contacte le support.",
  user_denied:           "Tu as refusé l'autorisation.",
  config_missing:        "Configuration OAuth manquante côté serveur. Contacte le support.",
  unknown:               "Erreur inconnue. Réessaie.",
};

export function SocialAuthToast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const result = params.get("connect_result");
    if (!result) return;

    const [outcome, platform, detail] = result.split(":");
    const label = PLATFORM_LABELS[platform] ?? platform;

    if (outcome === "success") {
      toast.success(`${label} connecté !`, {
        description: detail ? `Compte : @${detail.replace(/^@/, "")}` : "Tu peux maintenant lancer un audit.",
      });
    } else {
      toast.error(`Échec connexion ${label}`, {
        description: ERROR_MESSAGES[detail] ?? ERROR_MESSAGES.unknown,
      });
    }

    // Strip le param de l'URL pour ne pas re-toaster au reload
    const next = new URLSearchParams(params.toString());
    next.delete("connect_result");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [params, router, pathname]);

  return null;
}
