import { NextResponse } from "next/server";
import { z } from "zod";
import { viralAgent } from "@/lib/ai/agents";
import { createClient } from "@/lib/supabase/server";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const schema = z.object({
  niche: z.string().max(80).optional(),
  topic: z.string().max(200).optional(),
  country: z.string().length(2).default("SN"),
  platform: z.enum(["FACEBOOK", "TIKTOK"]).default("TIKTOK"),
  handle: z.string().max(80).default("@creator"),
});

export async function POST(req: Request) {
  // Identifier : user.id si connecté, sinon IP. Bucket "audits" car appel LLM coûteux.
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const identifier = user?.id ?? `ip:${getClientIp(req)}`;
  const rl = await rateLimit("audits", identifier);
  if (!rl.success) return rateLimitResponse(rl);

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const result = await viralAgent({
    platform: parsed.data.platform,
    handle: parsed.data.handle,
    country: parsed.data.country,
    niche: parsed.data.niche,
    topic: parsed.data.topic,
  });

  return NextResponse.json({ ok: true, ...result });
}
