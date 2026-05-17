import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-[1fr_1.15fr]">
      {/* Mobile-only top bar */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo showTagline={false} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Accueil
        </Link>
      </header>

      {/* ───────────────────────  LEFT : form column  ─────────────────────── */}
      <div className="relative flex min-h-screen flex-col bg-[#FAF7F5] dark:bg-background">
        <div className="hidden items-center justify-start px-10 pt-10 lg:flex">
          <Link href="/" aria-label="CreaFix AI">
            <Logo showTagline={false} size={56} />
          </Link>
        </div>

        <main className="flex flex-1 items-center justify-center px-5 pb-10 pt-6 lg:px-12 lg:pt-2">
          <div className="w-full max-w-md">{children}</div>
        </main>

        <footer className="hidden items-center justify-between px-10 pb-6 text-[11px] text-muted-foreground lg:flex">
          <span>© {new Date().getFullYear()} CreaFix AI · Made in Africa</span>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Help</Link>
          </div>
        </footer>
      </div>

      {/* ───────────────────────  RIGHT : showcase (desktop only)  ─────────────────────── */}
      <aside
        aria-hidden
        className="relative hidden overflow-hidden bg-[#0B0F19] lg:flex lg:flex-col lg:items-center lg:justify-center"
      >
        {/* Ambient radial orbs */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 15%, rgba(236,72,153,0.30), transparent 60%), radial-gradient(ellipse 60% 50% at 85% 85%, rgba(255,138,0,0.22), transparent 60%), radial-gradient(ellipse 80% 50% at 50% 50%, rgba(31,190,175,0.10), transparent 70%)",
          }}
        />

        {/* Mosaic of 4 office photos */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-2 p-4">
            {["dakar", "abidjan", "lagos", "casablanca"].map((city) => (
              <div key={city} className="relative overflow-hidden rounded-3xl">
                <Image
                  src={`/offices/${city}.png`}
                  alt=""
                  fill
                  sizes="(min-width:1280px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Subtle bottom-to-top fade for content readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0F19]/45 via-[#0B0F19]/85 to-[#0B0F19]/96" />

        {/* Back-to-home top-right */}
        <Link
          href="/"
          className="absolute right-6 top-6 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to home
        </Link>

        {/* Centered content */}
        <div className="relative z-10 mx-auto max-w-md px-8 py-12 text-center text-white">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EC4899]/40 bg-[#EC4899]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EC4899] backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            #1 AI Revenue OS for African creators
          </div>

          <blockquote className="mt-8 text-balance font-display text-2xl font-semibold leading-snug tracking-tight xl:text-[28px]">
            «&nbsp;CreaFix a détecté un shadowban Facebook que je n&apos;avais pas vu. En 9 jours
            ma page était réactivée avec un plan concret.&nbsp;»
          </blockquote>

          <figcaption className="mt-6 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#FF8A00] text-xs font-bold text-white shadow-lg shadow-[#EC4899]/30">
              IS
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">Ibrahim Sow</div>
              <div className="text-[11px] text-white/60">
                Page Facebook actualité · 🇸🇳 Dakar
              </div>
            </div>
          </figcaption>

          {/* Rating */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[12px] text-white/80">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                  <path d="M10 1l2.6 6h6.4l-5 4.5 1.9 6.5L10 14l-5.9 4 1.9-6.5-5-4.5h6.4z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold text-white">4.9/5</span>
            <span className="text-white/40">·</span>
            <span className="text-white/70">noté par les créateurs africains</span>
          </div>

          {/* Country flags strip */}
          <div className="mt-8 flex items-center justify-center gap-2 text-2xl">
            <span title="Sénégal">🇸🇳</span>
            <span title="Côte d&apos;Ivoire">🇨🇮</span>
            <span title="Nigéria">🇳🇬</span>
            <span title="Ghana">🇬🇭</span>
            <span title="Cameroun">🇨🇲</span>
            <span title="Maroc">🇲🇦</span>
            <span title="Kenya">🇰🇪</span>
            <span title="Afrique du Sud">🇿🇦</span>
            <span title="Égypte">🇪🇬</span>
          </div>
          <div className="mt-2 text-[11px] uppercase tracking-wider text-white/50">
            9 pays · 5 langues · 1 monnaie : tes revenus
          </div>
        </div>
      </aside>
    </div>
  );
}
