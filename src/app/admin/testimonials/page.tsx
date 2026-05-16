import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { TestimonialsClient, type TestimonialRow } from "./testimonials-client";

export const metadata = {
  title: "Témoignages · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  // 1. Vérifie que l'utilisateur est admin (auth + RBAC)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login/admin");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) redirect("/dashboard");

  // 2. Lit toutes les lignes via service_role (bypass RLS — l'auth est validée ci-dessus)
  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (sb.from("testimonials") as any)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) console.error("[admin/testimonials] DB error:", error);

  const rows: TestimonialRow[] = (data ?? []) as TestimonialRow[];
  return <TestimonialsClient initial={rows} />;
}
