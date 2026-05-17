/**
 * RBAC granulaire pour /admin/*
 *
 * Chaque rôle a accès à un sous-ensemble de pages. Le middleware utilise
 * `canAccess()` pour bloquer les routes non autorisées et rediriger vers
 * la première page accessible (ou /dashboard si aucune).
 */

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SUPPORT" | "ANALYST";

/** Pages admin (paths sous /admin) avec les rôles autorisés. */
export const ADMIN_ROUTE_ACCESS: Record<string, AdminRole[]> = {
  // ── Tout le monde admin a accès au cockpit (URL legacy + URL nouvelle)
  "/admin":                ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT", "ANALYST"],
  "/admin/dashboard":      ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT", "ANALYST"],

  // ── Analytics : SUPER_ADMIN, ADMIN, ANALYST
  "/admin/analytics":      ["SUPER_ADMIN", "ADMIN", "ANALYST"],

  // ── Operations IA : SUPER_ADMIN, ADMIN
  "/admin/audits":         ["SUPER_ADMIN", "ADMIN", "ANALYST"],
  "/admin/agents":         ["SUPER_ADMIN", "ADMIN"],
  "/admin/viral-engine":   ["SUPER_ADMIN", "ADMIN", "ANALYST"],
  "/admin/revenue-engine": ["SUPER_ADMIN", "ADMIN", "ANALYST"],
  "/admin/trends":         ["SUPER_ADMIN", "ADMIN", "MODERATOR"],

  // ── Business : SUPER_ADMIN, ADMIN (Support voit les users)
  "/admin/users":          ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
  "/admin/subscriptions":  ["SUPER_ADMIN", "ADMIN", "ANALYST"],
  "/admin/plans":          ["SUPER_ADMIN", "ADMIN"],
  "/admin/payments":       ["SUPER_ADMIN", "ADMIN", "ANALYST"],
  "/admin/payments-config":["SUPER_ADMIN"],
  "/admin/coupons":        ["SUPER_ADMIN", "ADMIN"],
  "/admin/affiliates":     ["SUPER_ADMIN", "ADMIN"],

  // ── Platform
  "/admin/moderation":     ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
  "/admin/testimonials":   ["SUPER_ADMIN", "ADMIN"],
  "/admin/seo":            ["SUPER_ADMIN", "ADMIN", "ANALYST"],
  "/admin/api":            ["SUPER_ADMIN", "ADMIN"],
  "/admin/support":        ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
  "/admin/notifications":  ["SUPER_ADMIN", "ADMIN"],

  // ── Stricte : Security + Settings uniquement SUPER_ADMIN
  "/admin/security":       ["SUPER_ADMIN", "ADMIN"],
  "/admin/settings":       ["SUPER_ADMIN"],
};

/** Retourne true si le rôle peut accéder à ce path. */
export function canAccess(path: string, role: AdminRole | null | undefined): boolean {
  if (!role) return false;
  // Trouve la règle la plus spécifique
  const match = Object.keys(ADMIN_ROUTE_ACCESS)
    .filter((p) => path === p || path.startsWith(p + "/"))
    .sort((a, b) => b.length - a.length)[0];
  if (!match) return role === "SUPER_ADMIN";
  return ADMIN_ROUTE_ACCESS[match].includes(role);
}

/** Première page accessible pour un rôle donné (pour redirect après login). */
export function defaultLandingFor(role: AdminRole): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":       return "/admin/dashboard";
    case "MODERATOR":   return "/admin/moderation";
    case "SUPPORT":     return "/admin/support";
    case "ANALYST":     return "/admin/analytics";
    default:            return "/creators/dashboard";
  }
}

/** Items sidebar filtrés par rôle (pour cacher les liens inaccessibles). */
export function sidebarVisibleFor(role: AdminRole | null | undefined): string[] {
  if (!role) return [];
  return Object.entries(ADMIN_ROUTE_ACCESS)
    .filter(([, roles]) => roles.includes(role))
    .map(([path]) => path);
}
