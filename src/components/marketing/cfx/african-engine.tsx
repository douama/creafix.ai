import { Globe2, TrendingUp, Languages, MapPin } from "lucide-react";

const COUNTRIES = [
  { flag: "🇳🇬", name: "Nigeria", trend: "Skits comedy +47%", color: "#00D1FF" },
  { flag: "🇿🇦", name: "Afrique du Sud", trend: "Amapiano shorts +62%", color: "#6C63FF" },
  { flag: "🇰🇪", name: "Kenya", trend: "Swahili podcasts +38%", color: "#0D6EFD" },
  { flag: "🇸🇳", name: "Sénégal", trend: "Wolof storytelling +29%", color: "#00D1FF" },
  { flag: "🇨🇮", name: "Côte d'Ivoire", trend: "Coupé-décalé clips +51%", color: "#6C63FF" },
  { flag: "🇲🇦", name: "Maroc", trend: "Darija beauty +44%", color: "#0D6EFD" },
  { flag: "🇪🇬", name: "Égypte", trend: "Arabic education +33%", color: "#00D1FF" },
  { flag: "🇬🇭", name: "Ghana", trend: "Afrobeats reactions +56%", color: "#6C63FF" },
];

export function CfxAfricanEngine() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background orb */}
      <div className="cfx-orb cfx-orb-cyan left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px]" style={{ animationDuration: "20s" }} />

      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left : copy */}
          <div>
            <span className="cfx-pill mb-5">
              <Globe2 className="h-3.5 w-3.5" />
              African Trends Engine
            </span>
            <h2 className="font-cfx text-[36px] md:text-[48px] leading-[1.05] font-bold tracking-[-0.02em] text-white">
              L'Afrique a ses{" "}
              <span className="cfx-text-gradient">propres trends</span>.
              <br />
              Pas Hollywood. Pas TikTok USA.
            </h2>
            <p className="mt-6 text-[17px] text-[#A5B4CC] leading-relaxed">
              Les outils anglo-saxons ratent 80% des viralités africaines. CreaFix AI
              monitore 24 pays, 12 langues locales et 6 dialectes pour te donner les
              tendances qui marchent <em className="not-italic text-white">vraiment</em> chez toi.
            </p>

            <div className="mt-8 space-y-4">
              <Feature
                icon={MapPin}
                title="24 pays africains"
                desc="Du Caire à Cape Town, du Sénégal à Madagascar."
              />
              <Feature
                icon={Languages}
                title="12 langues + 6 dialectes"
                desc="FR, EN, AR, SW, WO, HA, YO, ZU, AM, AR-MA, AR-EG, RW + dialectes."
              />
              <Feature
                icon={TrendingUp}
                title="Refresh toutes les 15 min"
                desc="Trends temps réel + alertes push quand un trend match ton niche."
              />
            </div>
          </div>

          {/* Right : trends grid */}
          <div className="cfx-glass-strong rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[12px] uppercase tracking-wider text-[#6C7A91]">
                Live trends · 8 pays
              </div>
              <span className="cfx-live-dot" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {COUNTRIES.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-white/[0.06] bg-[#0B1220]/60 p-3.5 cfx-card-lift"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{c.flag}</span>
                    <span className="text-[12.5px] font-semibold text-white">
                      {c.name}
                    </span>
                  </div>
                  <div
                    className="text-[12px] font-medium"
                    style={{ color: c.color }}
                  >
                    {c.trend}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-[11px] text-[#6C7A91]">
              + 16 autres pays disponibles
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#0D6EFD]/20 to-[#00D1FF]/10 border border-white/10 grid place-items-center">
        <Icon className="h-4 w-4 text-[#00D1FF]" />
      </div>
      <div>
        <div className="text-[15px] font-semibold text-white">{title}</div>
        <div className="text-[13.5px] text-[#A5B4CC] mt-0.5">{desc}</div>
      </div>
    </div>
  );
}
