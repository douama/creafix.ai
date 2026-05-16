import { Star, Quote } from "lucide-react";

const QUOTES = [
  {
    text: "J'ai doublé mes revenus YouTube en 3 mois. L'IA m'a montré que mes thumbnails saignaient mon CTR sans que je le sache.",
    author: "Awa Diop",
    role: "Créatrice food · 142K abonnés",
    flag: "🇸🇳",
    metric: "+118% revenue",
  },
  {
    text: "L'anti-shadowban m'a sauvé. J'ai détecté que TikTok réduisait mon reach à 3% — sans CreaFix j'aurais mis 2 mois à le réaliser.",
    author: "Kwame Asante",
    role: "Comedy creator · 480K abonnés",
    flag: "🇬🇭",
    metric: "Reach restauré en 5j",
  },
  {
    text: "Le African Trends Engine est un cheat code. J'ai surfé 4 trends avant qu'ils n'arrivent en USA, et j'ai monétisé.",
    author: "Lerato Mokoena",
    role: "Lifestyle · 290K abonnés",
    flag: "🇿🇦",
    metric: "4 viraux en 2 mois",
  },
  {
    text: "Mon agence gère 18 créateurs. CreaFix a remplacé 5 outils qu'on payait $400/mois. ROI immédiat.",
    author: "Ibrahim Yahaya",
    role: "Directeur agence · BeninCreatives",
    flag: "🇧🇯",
    metric: "$2 400/an économisés",
  },
  {
    text: "L'IA reformule mes hooks et ça fonctionne. Je passe de 12% à 38% de retention. Mes RPM YouTube ont explosé.",
    author: "Chinaza Okonkwo",
    role: "Tech reviews · 95K abonnés",
    flag: "🇳🇬",
    metric: "RPM × 3",
  },
];

export function CfxTestimonials() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="cfx-pill mb-5">
            <Star className="h-3.5 w-3.5 fill-current" />
            Aimé par +12 000 créateurs
          </span>
          <h2 className="font-cfx text-[36px] md:text-[48px] leading-[1.05] font-bold tracking-[-0.02em] text-white">
            Les chiffres parlent.
            <br />
            <span className="cfx-text-gradient">Eux aussi.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className={`cfx-glass cfx-card-lift rounded-2xl p-6 relative ${
                i === 0 || i === 4 ? "md:row-span-1" : ""
              } ${i === 1 ? "lg:col-span-1" : ""}`}
            >
              <Quote className="absolute top-5 right-5 h-6 w-6 text-[#6C63FF]/30" />
              <div className="flex items-center gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-[#00D1FF] text-[#00D1FF]" />
                ))}
              </div>
              <p className="text-[14.5px] text-white leading-relaxed">"{q.text}"</p>

              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{q.flag}</span>
                  <div>
                    <div className="text-[13px] font-semibold text-white">
                      {q.author}
                    </div>
                    <div className="text-[11px] text-[#A5B4CC]">{q.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#00D1FF] bg-[#00D1FF]/10 px-2 py-1 rounded-md">
                  {q.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
