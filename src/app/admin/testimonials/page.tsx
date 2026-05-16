import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TestimonialsClient, type TestimonialRow } from "./testimonials-client";

export const metadata = {
  title: "Témoignages · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Fetch direct PostgREST avec service_role — bypass total de la couche supabase-js
 *  pour éviter tout problème de schema resolution. */
async function fetchTestimonials(): Promise<TestimonialRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[admin/testimonials] env vars manquantes");
    return [];
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/testimonials?select=*&order=sort_order.asc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Accept-Profile": "monetiq",  // PostgREST : cible schema monetiq
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(`[admin/testimonials] PostgREST ${res.status}:`, text);
      return [];
    }

    const data = (await res.json()) as TestimonialRow[];
    console.log(`[admin/testimonials] rows fetched: ${data.length}`);
    return data;
  } catch (e) {
    console.error("[admin/testimonials] fetch error:", (e as Error).message);
    return [];
  }
}

export default async function AdminTestimonialsPage() {
  // 1. Auth + RBAC (utilise supabase-js pour cookies + RPC)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login/admin");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) redirect("/dashboard");

  // 2. Lecture des témoignages via raw PostgREST + service_role (bypass RLS)
  const rows = await fetchTestimonials();

  return <TestimonialsClient initial={rows} />;
}
