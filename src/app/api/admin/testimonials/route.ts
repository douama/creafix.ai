import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/guard";

/**
 * POST /api/admin/testimonials  → create new testimonial
 * Body : { name, role, country, avatar_url?, quote, rating, platforms[], metric, sort_order?, active? }
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "body requis" }, { status: 400 });

  const guard = await requireAdmin();
  if (guard instanceof NextResponse) return guard;
  const { user } = guard;

  const required = ["name", "role", "country", "quote", "metric"];
  for (const k of required) {
    if (!body[k] || typeof body[k] !== "string") {
      return NextResponse.json({ error: `Champ requis manquant: ${k}` }, { status: 400 });
    }
  }

  const insert = {
    name: body.name,
    role: body.role,
    country: body.country,
    avatar_url: body.avatar_url ?? null,
    quote: body.quote,
    rating: Number(body.rating ?? 5),
    platforms: Array.isArray(body.platforms) ? body.platforms : [],
    metric: body.metric,
    sort_order: Number(body.sort_order ?? 100),
    active: body.active !== false,
  };

  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (sb.from("testimonials") as any)
    .insert(insert)
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from("audit_logs") as any).insert({
    actor_id: user.id,
    action: "testimonial.create",
    target_type: "testimonial",
    target_id: data.id,
    meta: { name: insert.name },
  });

  return NextResponse.json({ ok: true, id: data.id });
}
