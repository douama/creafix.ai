import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Sparkles,
  Globe2,
  Activity,
} from "lucide-react";

const FEATURES = [
  {
    icon: Activity,
    title: "Audit IA en 2 minutes",
    desc: "Connecte tes comptes, l'IA analyse 47 signaux par plateforme et te livre un rapport actionnable.",
    accent: "#00D1FF",
  },
  {
    icon: TrendingUp,
    title: "Viral score predictor",
    desc: "Score 0-100 par vidéo avant publication. Reformule le hook, la description, le thumbnail.",
    accent: "#6C63FF",
  },
  {
    icon: ShieldCheck,
    title: "Anti-shadowban guard",
    desc: "Détection précoce de baisse de reach. Alertes Slack/email + plan de correction automatique.",
    accent: "#0D6EFD",
  },
  {
    icon: DollarSign,
    title: "RPM predictor multi-plateforme",
    desc: "Prédit ton RPM YouTube, Facebook RPM, TikTok Creator Rewards selon ton niche & géo.",
    accent: "#00D1FF",
  },
  {
    icon: Globe2,
    title: "African Trends Engine",
    desc: "Trends spécifiques à 24 pays africains. Ce qui marche à Lagos n'est pas ce qui marche à Dakar.",
    accent: "#6C63FF",
  },
  {
    icon: Sparkles,
    title: "AI Content Repair",
    desc: "Génère hook + description + tags optimisés en un clic. Multi-langue : FR, EN, WO, SW, AR.",
    accent: "#0D6EFD",
  },
];

export function CfxFeatures() {
  return (
    <section id="produit" className="relative py-28">
      <div className="container mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="cfx-pill mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            6 modules IA en un OS
          </span>
          <h2 className="font-cfx text-[36px] md:text-[48px] leading-[1.05] font-bold tracking-[-0.02em] text-white">
            Tout ce qu'il faut pour{" "}
            <span className="cfx-text-gradient">scaler ton revenu</span>.
          </h2>
          <p className="mt-5 text-[16px] text-[#A5B4CC]">
            Plus besoin de jongler entre 12 outils. Tout est dans CreaFix AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="cfx-glass cfx-card-lift p-6 rounded-2xl group"
            >
              <div
                className="h-12 w-12 rounded-2xl grid place-items-center mb-5 transition-transform group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${f.accent}25, ${f.accent}05)`,
                  border: `1px solid ${f.accent}40`,
                  boxShadow: `0 8px 24px -8px ${f.accent}40`,
                }}
              >
                <f.icon className="h-5 w-5" style={{ color: f.accent }} />
              </div>
              <h3 className="font-cfx text-[18px] font-bold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-[14px] text-[#A5B4CC] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
