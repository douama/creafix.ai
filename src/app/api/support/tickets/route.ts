import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  // Anti-spam : bucket "public" (30/min) par user. Plus restrictif que par IP
  // car ticket = action stockée en DB. Évite la création massive de tickets.
  const rl = await rateLimit("public", user.id);
  if (!rl.success) return rateLimitResponse(rl);

  const body = (await request.json().catch(() => null)) as {
    subject?: string;
    body?: string;
    category?: string;
    priority?: string;
  } | null;

  if (!body?.subject?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "subject et body requis" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("support_tickets") as any)
    .insert({
      user_id: user.id,
      subject: body.subject.trim().slice(0, 120),
      body: body.body.trim().slice(0, 2000),
      category: body.category ?? "OTHER",
      priority: body.priority ?? "MEDIUM",
      status: "OPEN",
      channel: "in_app",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, ticket: data });
}
