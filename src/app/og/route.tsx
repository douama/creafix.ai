import { ImageResponse } from "next/og";

/**
 * OG image dynamique : /og?title=Mon+titre&subtitle=Sous-titre
 * Génère une 1200x630 PNG à la volée via Next.js Edge runtime.
 *
 * Utilisée par lib/seo/metadata.ts en fallback quand aucune image
 * statique n'est fournie pour une page.
 */

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "CreaFix AI").slice(0, 90);
  const subtitle = (
    searchParams.get("subtitle") ??
    "L'OS IA de revenu des créateurs africains"
  ).slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(ellipse 60% 40% at 10% 10%, rgba(31,190,175,0.30), transparent 60%)," +
            "radial-gradient(ellipse 50% 35% at 90% 25%, rgba(236,72,153,0.30), transparent 60%)," +
            "radial-gradient(ellipse 70% 50% at 50% 110%, rgba(255,138,0,0.25), transparent 70%)," +
            "#0B0F19",
          color: "#FFFFFF",
          padding: "72px 80px",
          fontFamily: '"Inter", system-ui',
          position: "relative",
        }}
      >
        {/* Top : brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #1FBEAF 0%, #EC4899 50%, #FF8A00 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "white",
            }}
          >
            C
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>
              CreaFix AI
            </div>
            <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 2 }}>
              Video Growth · Content Optimization · Creator Tools
            </div>
          </div>
        </div>

        {/* Center : title + subtitle */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 920,
          }}
        >
          <div
            style={{
              fontSize: title.length > 50 ? 56 : 72,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              backgroundImage: "linear-gradient(135deg, #FFFFFF 0%, #F472B6 60%, #FB923C 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 26,
              color: "#E6EEF9",
              lineHeight: 1.35,
              maxWidth: 880,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom : trust strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            color: "#94A3B8",
            fontSize: 18,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: "#22C55E" }} />
            <span>30+ créateurs vérifiés</span>
          </div>
          <span style={{ color: "#475569" }}>·</span>
          <span>Audit IA en 60s</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>Multi-plateformes</span>
          <div style={{ marginLeft: "auto", color: "#5EEAD4", fontWeight: 600 }}>
            creafix-ai.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
