import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Zap, Globe2 } from "lucide-react";

/**
 * Auth layout — CreaFix Fintech (navy + AI cyan/purple).
 * Split : form (left) + marketing panel (right desktop).
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cfx-shell relative min-h-screen">
      {/* Mobile-only top bar */}
      <header className="flex items-center justify-between px-4 py-4 md:hidden border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#6C63FF] via-[#0D6EFD] to-[#00D1FF]">
            <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-bold text-white">
            CreaFix<span className="text-[#00D1FF]"> AI</span>
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-[#A5B4CC] hover:text-white"
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
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#6C63FF] via-[#0D6EFD] to-[#00D1FF] shadow-[0_8px_24px_-6px_rgba(13,110,253,0.5)]">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-[17px] font-bold tracking-tight text-white">
                CreaFix<span className="text-[#00D1FF]"> AI</span>
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12px] text-[#A5B4CC] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Retour à l&apos;accueil
            </Link>
          </header>

          <main className="flex flex-1 items-center justify-center px-4 pb-8 lg:px-12">
            <div className="w-full max-w-md">{children}</div>
          </main>

          <footer className="hidden px-8 py-5 text-[11px] text-[#6C7A91] lg:flex lg:items-center lg:justify-between">
            <span>© {new Date().getFullYear()} CreaFix AI</span>
            <div className="flex items-center gap-4">
              <Link href="/legal/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
              <Link href="/legal/terms" className="hover:text-white transition-colors">CGU</Link>
            </div>
          </footer>
        </div>

        {/* ─── RIGHT : marketing panel (desktop only) ─── */}
        <aside
          aria-hidden
          className="relative hidden overflow-hidden border-l border-white/[0.06] lg:flex lg:flex-col lg:justify-between"
        >
          {/* Background orbs */}
          <div className="cfx-orb cfx-orb-purple -left-20 top-20 h-96 w-96" style={{ animationDelay: "0s" }} />
          <div className="cfx-orb cfx-orb-cyan right-0 bottom-32 h-80 w-80" style={{ animationDelay: "-5s" }} />
          <div className="cfx-orb cfx-orb-blue left-1/3 bottom-0 h-72 w-72" style={{ animationDelay: "-9s" }} />

          <div className="absolute inset-0 cfx-grid-bg opacity-50" />

          <div className="relative flex flex-col gap-9 p-10 xl:p-14">
            <span className="cfx-pill w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              The AI Revenue OS · Africa
            </span>

            <h2 className="font-cfx text-3xl xl:text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-white">
              Transforme ton contenu en{" "}
              <span className="cfx-text-gradient">revenus prévisibles</span> grâce à l&apos;IA.
            </h2>

            <p className="max-w-md text-[14px] xl:text-[15px] text-[#A5B4CC] leading-relaxed">
              Audit IA en 60s, détection shadowban, score viral pré-publication, trends
              par pays africain. Tout ce qu&apos;il te faut pour gagner plus avec ton contenu.
            </p>

            <ul className="space-y-3.5">
              {[
                { icon: Zap, text: "Audit IA complet en 60 secondes", color: "#00D1FF" },
                { icon: ShieldCheck, text: "Détection shadowban + plan de récupération", color: "#6C63FF" },
                { icon: Sparkles, text: "Score viral 0-100 avant publication", color: "#0D6EFD" },
                { icon: Globe2, text: "Trends Afrique temps réel · 24 pays", color: "#00D1FF" },
              ].map(({ icon: Icon, text, color }) => (
                <li key={text} className="flex items-center gap-3">
                  <div
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border"
                    style={{
                      backgroundColor: `${color}1A`,
                      borderColor: `${color}40`,
                      boxShadow: `0 8px 20px -6px ${color}35`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <span className="text-[14px] text-[#E6EEF9]">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="relative cfx-glass border-t border-white/[0.06] !rounded-none p-10 xl:p-14">
            <figure>
              <blockquote className="text-[14px] italic text-white/90 leading-relaxed">
                « CreaFix a détecté un shadowban Facebook que je n&apos;avais pas vu. En 9 jours
                ma page était réactivée avec un plan d&apos;action concret. »
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D1FF] text-xs font-bold text-white">
                  IS
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">Ibrahim Sow</div>
                  <div className="text-[11px] text-[#A5B4CC]">
                    Page Facebook actualité · 🇸🇳 Dakar
                  </div>
                </div>
              </figcaption>
            </figure>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] text-[#A5B4CC]">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="h-3 w-3 fill-[#00D1FF] text-[#00D1FF]" viewBox="0 0 20 20">
                    <path d="M10 1l2.6 6h6.4l-5 4.5 1.9 6.5L10 14l-5.9 4 1.9-6.5-5-4.5h6.4z" />
                  </svg>
                ))}
                <span className="ml-1.5 font-semibold text-white">4.9/5</span>
              </div>
              <span className="opacity-40">·</span>
              <span><b className="text-white">12 000+</b> créateurs</span>
              <span className="opacity-40">·</span>
              <span><b className="text-white">24 pays</b> africains</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
