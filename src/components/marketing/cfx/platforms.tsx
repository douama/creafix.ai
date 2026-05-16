import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitch,
  FaPinterest,
  FaLinkedin,
  FaXTwitter,
  FaSnapchat,
} from "react-icons/fa6";

const PLATFORMS = [
  { name: "YouTube", icon: FaYoutube, color: "#FF0000" },
  { name: "TikTok", icon: FaTiktok, color: "#FFFFFF" },
  { name: "Facebook", icon: FaFacebook, color: "#1877F2" },
  { name: "Instagram", icon: FaInstagram, color: "#E1306C" },
  { name: "X", icon: FaXTwitter, color: "#FFFFFF" },
  { name: "Snapchat", icon: FaSnapchat, color: "#FFFC00" },
  { name: "Twitch", icon: FaTwitch, color: "#9146FF" },
  { name: "Pinterest", icon: FaPinterest, color: "#BD081C" },
  { name: "LinkedIn", icon: FaLinkedin, color: "#0A66C2" },
];

export function CfxPlatforms() {
  return (
    <section id="plateformes" className="relative py-24 border-y border-white/[0.06]">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#6C7A91] mb-4">
            9 plateformes · 1 cockpit
          </div>
          <h2 className="font-cfx text-[28px] md:text-[36px] font-bold text-white">
            Tout ton empire de contenu, <span className="text-[#00D1FF]">synchronisé</span>.
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              className="group relative aspect-square rounded-2xl border border-white/[0.06] bg-white/[0.02] grid place-items-center cfx-card-lift overflow-hidden"
            >
              <p.icon
                className="h-7 w-7 transition-transform group-hover:scale-125"
                style={{ color: p.color, filter: `drop-shadow(0 0 8px ${p.color}50)` }}
              />
              <span className="absolute bottom-1.5 text-[9.5px] text-[#6C7A91] font-medium group-hover:text-white transition-colors">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
