import { NextResponse } from "next/server";
import { z } from "zod";
import { viralAgent } from "@/lib/ai/agents";

const schema = z.object({
  niche: z.string().optional(),
  topic: z.string().optional(),
  country: z.string().length(2).default("SN"),
  platform: z.enum(["FACEBOOK", "TIKTOK"]).default("TIKTOK"),
  handle: z.string().default("@creator"),
});

export async function POST(req: Request) {
  const body = await req.json();
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
