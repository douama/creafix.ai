"use client";

export function LogosStrip() {
  const items = [
    "Wave",
    "Orange Money",
    "MTN MoMo",
    "Meta",
    "TikTok",
    "Stripe",
    "PayPal",
    "OpenAI",
    "Anthropic",
    "Gemini",
  ];

  return (
    <section className="border-y border-border/60 py-10">
      <div className="container">
        <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Intégré avec les plateformes & outils que tu utilises déjà
        </p>
        <div className="mt-6 grid grid-cols-3 items-center gap-y-5 sm:grid-cols-5 md:grid-cols-10">
          {items.map((i) => (
            <div
              key={i}
              className="text-center font-display text-sm font-semibold text-muted-foreground/80"
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
