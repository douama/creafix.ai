import Link from "next/link";
import { Sparkles, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";

const COLS = [
  {
    title: "Produit",
    links: [
      { label: "Features", href: "#produit" },
      { label: "Dashboard", href: "#dashboard" },
      { label: "Plateformes", href: "#plateformes" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Guides YouTube", href: "/guides/youtube" },
      { label: "Guides TikTok", href: "/guides/tiktok" },
      { label: "Guides Facebook", href: "/guides/facebook" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Outils gratuits", href: "/tools" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/about" },
      { label: "Affiliés", href: "/partners" },
      { label: "Presse", href: "/press" },
      { label: "Mobile app", href: "/mobile" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Confidentialité", href: "/legal/privacy" },
      { label: "Conditions", href: "/legal/terms" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Mentions légales", href: "/legal/legal" },
    ],
  },
];

export function CfxFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] mt-16">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#6C63FF] via-[#0D6EFD] to-[#00D1FF] shadow-[0_8px_24px_-6px_rgba(13,110,253,0.5)]">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-[17px] font-bold tracking-tight text-white">
                CreaFix<span className="text-[#00D1FF]"> AI</span>
              </span>
            </Link>
            <p className="text-[13.5px] text-[#A5B4CC] leading-relaxed max-w-xs">
              L'OS IA de revenu des créateurs africains. Audit, optimisation et
              orchestration sur 9 plateformes.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <SocialIcon Icon={Twitter} href="https://twitter.com/creafixai" />
              <SocialIcon Icon={Linkedin} href="https://linkedin.com/company/creafix-ai" />
              <SocialIcon Icon={Youtube} href="https://youtube.com/@creafixai" />
              <SocialIcon Icon={Instagram} href="https://instagram.com/creafix.ai" />
            </div>
          </div>

          {/* Cols */}
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#6C7A91] font-semibold mb-4">
                {c.title}
              </div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13.5px] text-[#A5B4CC] hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="cfx-divider my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12.5px] text-[#6C7A91]">
          <div>© {new Date().getFullYear()} CreaFix AI — Made in 🌍 with care.</div>
          <div className="flex items-center gap-2">
            <span className="cfx-live-dot" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ Icon, href }: { Icon: React.ComponentType<{ className?: string }>; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-9 w-9 rounded-xl border border-white/[0.08] bg-white/[0.03] grid place-items-center text-[#A5B4CC] hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
    >
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}
