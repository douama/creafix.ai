import {
  Search,
  Flame,
  Coins,
  ShieldAlert,
  TrendingUp,
  Image as ImageIcon,
  FileText,
  Sparkles,
} from "lucide-react";

/**
 * "7 Agents IA travaillent pour toi" — strip section.
 * Cards solides (no-lg-glass) — ne se mélange pas avec le liquid glass.
 */
const AGENTS = [
  {
    icon: Search,
    name: "Audit Agent",
    role: "Diagnostic",
    desc: "Scanne tes 5 dernières vidéos et identifie les fuites de RPM en 60 secondes.",
    color: "#7B61FF",
    badge: "Analyse",
    runs: 8,
  },
  {
    icon: Flame,
    name: "Viral Score Agent",
    role: "Prédiction",
    desc: "Note ton contenu 0-100 avant publication. Tu publies seulement le top 30%.",
    color: "#f15522",
    badge: "Growth",
    runs: 6,
  },
  {
    icon: Coins,
    name: "Monetization Agent",
    role: "Optimisation",
    desc: "Détecte les vidéos sous-monétisées et te dit exactement comment les fixer.",
    color: "#FF8A00",
    badge: "Revenu",
    runs: 5,
  },
  {
    icon: ShieldAlert,
    name: "Anti-Ban Agent",
    role: "Protection",
    desc: "Surveille TikTok/FB en continu et t'alerte AVANT un shadowban.",
    color: "#E11D48",
    badge: "Sécurité",
    runs: 9,
  },
  {
    icon: TrendingUp,
    name: "Trend Scout",
    role: "Veille",
    desc: "Trouve les sons, hashtags et formats qui marchent dans 9 pays africains.",
    color: "#7B61FF",
    badge: "Tendances",
    runs: 7,
  },
  {
    icon: ImageIcon,
    name: "Thumbnail Agent",
    role: "Création",
    desc: "Génère 8 miniatures A/B-testées et te montre laquelle aura le meilleur CTR.",
    color: "#FF8A00",
    badge: "Création",
    runs: 4,
  },
  {
    icon: FileText,
    name: "Script Agent",
    role: "Création",
    desc: "Réécrit tes hooks faibles + génère 3 variantes de scripts pour Reels/Shorts.",
    color: "#f15522",
    badge: "Création",
    runs: 6,
  },
];

export function SevenAgents() {
  return (
    <section id="agents" className="relative py-16 md:py-24">
      <div className="container">
        {/* Eyebrow */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7B61FF]">
            <Sparkles className="h-3 w-3" />
            7 agents IA travaillent pour toi
          </div>

          <h2 className="mt-4 font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight text-balance md:text-[2.25rem]">
            Pas un outil. <span className="text-gradient-orange">Une équipe IA complète.</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
            Pendant que tu dors, 7 agents IA analysent, prédisent, optimisent et protègent
            tes comptes 24/7. Chacun spécialisé dans une discipline précise.
          </p>
        </div>

        {/* Grid des 7 agents */}
        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((a, i) => (
            <AgentCard key={a.name} agent={a} highlighted={i === 0} />
          ))}
        </div>

        {/* Live stat */}
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-2 text-[12px] text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>
            <b className="text-foreground">14 327</b> actions IA exécutées dans la dernière heure
          </span>
        </div>
      </div>
    </section>
  );
}

function AgentCard({
  agent,
  highlighted,
}: {
  agent: (typeof AGENTS)[number];
  highlighted?: boolean;
}) {
  const Icon = agent.icon;

  return (
    <article
      className={[
        "no-lg-glass group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-card",
        highlighted ? "border-[#7B61FF]/40" : "border-border",
      ].join(" ")}
    >
      {/* Soft glow accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-50"
        style={{ backgroundColor: agent.color }}
      />

      <div className="relative">
        {/* Header : icon + badge */}
        <div className="flex items-center justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110"
            style={{
              backgroundColor: `${agent.color}1A`,
              border: `1px solid ${agent.color}40`,
            }}
          >
            <Icon className="h-5 w-5" style={{ color: agent.color }} />
          </div>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{
              color: agent.color,
              backgroundColor: `${agent.color}15`,
            }}
          >
            {agent.badge}
          </span>
        </div>

        {/* Name + role */}
        <h3 className="mt-4 font-display text-[15px] font-bold tracking-tight">
          {agent.name}
        </h3>
        <div className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
          {agent.role}
        </div>

        {/* Desc */}
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
          {agent.desc}
        </p>

        {/* Status */}
        <div className="mt-4 flex items-center gap-1.5 border-t border-border/60 pt-3 text-[10.5px] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: agent.color }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: agent.color }}
            />
          </span>
          <span>Actif · {agent.runs} 000+ exécutions/jour</span>
        </div>
      </div>
    </article>
  );
}
