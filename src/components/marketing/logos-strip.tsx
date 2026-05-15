"use client";

export function LogosStrip() {
  const items = [
    "Facebook",
    "TikTok",
    "Instagram",
    "Wave",
    "Orange Money",
    "MTN MoMo",
    "Moov Money",
    "Stripe",
    "PayPal",
  ];

  return (
    <section className="border-y border-border/60 py-7">
      <div className="container">
        <p className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Intégré aux plateformes et moyens de paiement que tu utilises déjà
        </p>
        <div className="mt-4 grid grid-cols-3 items-center gap-y-3 sm:grid-cols-5 md:grid-cols-9">
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
