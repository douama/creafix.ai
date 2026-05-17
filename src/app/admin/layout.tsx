import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

/**
 * Guard centralisé pour TOUTES les routes /admin/*.
 *
 * Vérifie que l'utilisateur est authentifié ET possède un rôle admin.
 * On teste les deux RPCs en parallèle car :
 *   - is_admin       → role = 'ADMIN' (migration 0003)
 *   - is_super_admin → role = 'SUPER_ADMIN' (défini dans Supabase, pas dans le repo)
 *   Les roles MODERATOR / SUPPORT / ANALYST sont portés par is_admin dans
 *   les déploiements où l'enum a été étendue.
 *
 * Les pages qui exigent SUPER_ADMIN strict (settings, payments-config,
 * platform-apis) font leur propre vérification supplémentaire.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login/admin");
  }

  // Run both checks in parallel — either role grants admin access.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rpc = supabase.rpc as any;
  const [{ data: isAdmin }, { data: isSuperAdmin }] = await Promise.all([
    rpc("is_admin",       { p_user_id: user.id }),
    rpc("is_super_admin", { p_user_id: user.id }),
  ]);

  if (!isAdmin && !isSuperAdmin) {
    redirect("/?error=admin_required");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
