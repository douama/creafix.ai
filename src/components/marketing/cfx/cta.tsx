import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CfxCta() {
  return (
    <section className="relative py-28">
      <div className="container mx-auto">
        <div className="relative cfx-border-glow rounded-3xl overflow-hidden">
          <div className="relative bg-[#0B1220] rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 cfx-grid-bg opacity-50" />
            <div className="cfx-orb cfx-orb-purple left-1/4 top-1/2 -translate-y-1/2 h-[300px] w-[300px]" />
            <div className="cfx-orb cfx-orb-cyan right-1/4 top-1/2 -translate-y-1/2 h-[280px] w-[280px]" style={{ animationDelay: "-6s" }} />

            <div className="relative">
              <span className="cfx-pill mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Sans carte · 2 min · 0 risque
              </span>
              <h2 className="font-cfx text-[36px] md:text-[56px] leading-[1.02] font-bold tracking-[-0.02em] text-white max-w-2xl mx-auto">
                Ton revenu créateur,{" "}
                <span className="cfx-text-gradient">multiplié par 3</span>
                <br className="hidden md:block" />
                en 90 jours.
              </h2>
              <p className="mt-6 text-[17px] text-[#A5B4CC] max-w-xl mx-auto">
                Connecte tes comptes, lance ton premier audit gratuit, et vois
                pourquoi 12 000 créateurs africains font confiance à CreaFix AI.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/signup" className="cfx-btn-primary">
                  Lancer mon audit gratuit
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="cfx-btn-ghost">
                  Voir les plans
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-1.5">
                <div className="flex -space-x-2">
                  {["🇸🇳", "🇳🇬", "🇰🇪", "🇿🇦", "🇲🇦"].map((f, i) => (
                    <span
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-[#0B1220] bg-[#0F1830] grid place-items-center text-sm"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-[12px] text-[#A5B4CC]">
                  +12 000 créateurs déjà inscrits
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
