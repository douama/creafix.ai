import { createClient } from "@/lib/supabase/server";
import { TestimonialsClient, type TestimonialRow } from "./testimonials-client";

export const metadata = {
  title: "Témoignages · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const sb = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (sb.from("testimonials") as any)
    .select("*")
    .order("sort_order", { ascending: true });

  const rows: TestimonialRow[] = (data ?? []) as TestimonialRow[];
  return <TestimonialsClient initial={rows} />;
}
