import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  COUNTRIES,
  NICHE_MULTIPLIER,
  estimateMonthlyRevenue,
  type AfricanCountry,
} from "@/lib/africa-cpm";

const schema = z.object({
  country: z.string().length(2),
  platform: z.enum(["facebook", "tiktok"]),
  monthlyViews: z.number().int().nonnegative(),
  niche: z.string().optional(),
  watchTimeMin: z.number().positive().optional(),
});

/**
 * Estimateur de revenus.
 *
 * Si Supabase est configuré, lit les CPM depuis la table `monetiq.country_cpm`
 * (source vivante, mise à jour mensuellement). Sinon, fallback sur les
 * valeurs codées en dur dans `src/lib/africa-cpm.ts`.
 */
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { country, platform, monthlyViews, niche = "lifestyle", watchTimeMin = 1.2 } = parsed.data;

  let cpm: { cpmFacebook: number; cpmTiktok: number; rpmFacebook: number; rpmTiktok: number; fxToUsd: number; currency: string; name: string; flag: string } | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("country_cpm")
        .select("name, flag, currency, fx_to_usd, cpm_facebook, cpm_tiktok, rpm_facebook, rpm_tiktok")
        .eq("code", country)
        .single();

      if (!error && data) {
        cpm = {
          cpmFacebook: Number(data.cpm_facebook),
          cpmTiktok: Number(data.cpm_tiktok),
          rpmFacebook: Number(data.rpm_facebook),
          rpmTiktok: Number(data.rpm_tiktok),
          fxToUsd: Number(data.fx_to_usd),
          currency: data.currency,
          name: data.name,
          flag: data.flag,
        };
      }
    } catch {
      // Supabase indisponible — on tombe sur le fallback statique
    }
  }

  // Fallback statique
  if (!cpm) {
    if (!(country in COUNTRIES)) {
      return NextResponse.json({ error: "country non supporté" }, { status: 400 });
    }
    const est = estimateMonthlyRevenue({
      country: country as AfricanCountry,
      platform,
      monthlyViews,
      niche: (niche in NICHE_MULTIPLIER ? niche : "lifestyle") as keyof typeof NICHE_MULTIPLIER,
      watchTimeMin,
    });
    return NextResponse.json({ ok: true, estimate: est, source: "static" });
  }

  // Calcul à partir des données Supabase
  const rpm = platform === "facebook" ? cpm.rpmFacebook : cpm.rpmTiktok;
  const mult = NICHE_MULTIPLIER[niche] ?? 1;
  const watchBoost = Math.min(1.6, watchTimeMin / 1.0);
  const usd = (monthlyViews / 1000) * rpm * mult * watchBoost;

  return NextResponse.json({
    ok: true,
    estimate: {
      usd,
      local: usd * cpm.fxToUsd,
      currency: cpm.currency,
      country: cpm.name,
      flag: cpm.flag,
    },
    source: "supabase",
  });
}
