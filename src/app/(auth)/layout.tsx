import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Zap, Flame } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Mobile-only top bar */}
      <header className="flex items-center justify-between px-4 py-4 md:hidden">
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

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ─── LEFT : form column ─── */}
        <div className="relative flex flex-col">
          {/* Desktop header */}
          <header className="hidden items-center justify-between px-8 py-6 lg:flex">
            <Link href="/">
              <Logo />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Retour à l&apos;accueil
            </Link>
          </header>

          <main className="flex flex-1 items-center justify-center px-4 pb-8 lg:px-12">
            <div className="w-full max-w-md">{children}</div>
          </main>

          <footer className="hidden px-8 py-5 text-[11px] text-muted-foreground lg:flex lg:items-center lg:justify-between">
            <span>© {new Date().getFullYear()} CreaFix AI</span>
            <div className="flex items-center gap-4">
              <Link href="/legal/privacy" className="hover:text-foreground">Confidentialité</Link>
              <Link href="/legal/terms" className="hover:text-foreground">CGU</Link>
            </div>
          </footer>
        </div>

        {/* ─── RIGHT : marketing panel (desktop only) ─── */}
        <aside
          aria-hidden
          className="relative hidden overflow-hidden border-l border-border lg:flex lg:flex-col lg:justify-between"
        >
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(123,97,255,0.20), transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0,194,255,0.12), transparent 60%), radial-gradient(ellipse 50% 30% at 10% 80%, rgba(255,138,0,0.10), transparent 60%), linear-gradient(135deg, hsl(var(--card)), hsl(var(--background)))",
            }}
          />
          <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
          <div className="pointer-events-none absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-[#7B61FF]/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 -bottom-32 -z-10 h-96 w-96 rounded-full bg-[#FF8A00]/20 blur-3xl" />

          <div className="relative flex flex-col gap-10 p-10 xl:p-14">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7B61FF]">
              <Sparkles className="h-3 w-3" />
              The AI Revenue OS for African Creators
            </div>

            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
              Transforme ton contenu en{" "}
              <span className="gradient-text">revenus prévisibles</span> grâce à l&apos;IA.
            </h2>

            <p className="max-w-md text-sm text-muted-foreground xl:text-base">
              Audit IA en 60s, détection shadowban, score viral pré-publication, sons trending par
              pays africain. Tout ce qu&apos;il te faut pour gagner plus avec ton contenu.
            </p>

            <ul className="space-y-3">
              {[
                { icon: Zap, text: "Audit IA complet en 60 secondes", color: "#FF8A00" },
                { icon: ShieldCheck, text: "Détection shadowban + plan de récupération", color: "#10B981" },
                { icon: Flame, text: "Score viral 0-100 avant publication", color: "#F43F5E" },
                { icon: Sparkles, text: "Trends Afrique en temps réel · 9 pays", color: "#FF8A00" },
              ].map(({ icon: Icon, text, color }) => (
                <li key={text} className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                    style={{ backgroundColor: `${color}1A`, borderColor: `${color}55` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color }} />
                  </div>
                  <span className="text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative border-t border-border/60 bg-background/40 p-10 backdrop-blur-xl xl:p-14">
            <figure>
              <blockquote className="text-sm italic text-foreground/90">
                « CreaFix a détecté un shadowban Facebook que je n&apos;avais pas vu. En 9 jours
                ma page était réactivée avec un plan d&apos;action concret. »
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#FF8A00] text-xs font-bold text-white">
                  IS
                </div>
                <div>
                  <div className="text-sm font-semibold">Ibrahim Sow</div>
                  <div className="text-[11px] text-muted-foreground">
                    Page Facebook actualité · 🇸🇳 Dakar
                  </div>
                </div>
              </figcaption>
            </figure>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                    <path d="M10 1l2.6 6h6.4l-5 4.5 1.9 6.5L10 14l-5.9 4 1.9-6.5-5-4.5h6.4z" />
                  </svg>
                ))}
                <span className="ml-1 font-semibold text-foreground">4.9/5</span>
              </div>
              <span>·</span>
              <span><b className="text-foreground">12 000+</b> créateurs</span>
              <span>·</span>
              <span><b className="text-foreground">9 pays</b> africains</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
