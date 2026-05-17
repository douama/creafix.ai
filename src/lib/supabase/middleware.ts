import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

/**
 * Helper middleware Supabase — rafraîchit le token d'auth sur chaque requête
 * et propage les cookies. À appeler depuis `src/middleware.ts`.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "monetiq" as "public" },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protège /dashboard, /creators/*, /onboarding, /admin et /account
  const path = request.nextUrl.pathname;
  const protectedPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/creators") ||
    path.startsWith("/onboarding") ||
    path.startsWith("/admin") ||
    path.startsWith("/account");

  if (!user && protectedPath) {
    const url = request.nextUrl.clone();
    // Si on tente d'accéder à /admin sans être connecté → /login/admin
    url.pathname = path.startsWith("/admin") ? "/login/admin" : "/login";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  // /admin : check is_admin + RBAC granulaire par rôle
  if (user && path.startsWith("/admin")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // RBAC : récupère le rôle exact et check l'accès à la route demandée
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase.from("user_profiles") as any)
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const { canAccess, defaultLandingFor } = await import("@/lib/admin/rbac");
    const role = profile?.role as
      | "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SUPPORT" | "ANALYST" | null;

    if (role && !canAccess(path, role)) {
      const url = request.nextUrl.clone();
      url.pathname = defaultLandingFor(role);
      url.searchParams.set("noaccess", path);
      return NextResponse.redirect(url);
    }
  }

  // Empêche un user connecté de revoir /login ou /signup
  if (user && (path === "/login" || path === "/signup" || path === "/login/admin")) {
    const url = request.nextUrl.clone();
    // Si admin → /admin, sinon → /dashboard
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
    url.pathname = isAdmin && path === "/login/admin" ? "/admin/dashboard" : "/creators/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
