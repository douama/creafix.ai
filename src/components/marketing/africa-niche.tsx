"use client";

import { motion } from "framer-motion";
import { Clock, Music2, TrendingUp, MapPin } from "lucide-react";

const COUNTRIES = [
  {
    flag: "🇸🇳",
    name: "Sénégal",
    code: "SN",
    rpm: "$1.80",
    bestTime: "20h–22h",
    sound: "Wally B. Seck — Naari",
    growth: "+34%",
    color: "#00C2FF",
  },
  {
    flag: "🇨🇮",
    name: "Côte d'Ivoire",
    code: "CI",
    rpm: "$1.60",
    bestTime: "19h–21h",
    sound: "Didi B — Lou Pra",
    growth: "+42%",
    color: "#FF8A00",
  },
  {
    flag: "🇳🇬",
    name: "Nigeria",
    code: "NG",
    rpm: "$2.40",
    bestTime: "21h–23h",
    sound: "Davido — Awuke",
    growth: "+58%",
    color: "#10B981",
  },
  {
    flag: "🇲🇦",
    name: "Maroc",
    code: "MA",
    rpm: "$3.10",
    bestTime: "21h–00h",
    sound: "ElGrandeToto — Madrid",
    growth: "+27%",
    color: "#7B61FF",
  },
  {
    flag: "🇨🇲",
    name: "Cameroun",
    code: "CM",
    rpm: "$1.40",
    bestTime: "20h–22h",
    sound: "Locko — Margo",
    growth: "+31%",
    color: "#F43F5E",
  },
  {
    flag: "🇿🇦",
    name: "Afrique du Sud",
    code: "ZA",
    rpm: "$2.90",
    bestTime: "19h–22h",
    sound: "Tyla — Water (Remix)",
    growth: "+45%",
    color: "#FBBF24",
  },
];

export function AfricaNiche() {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-fade opacity-30 blur-3xl" />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#FF8A00]/30 bg-[#FF8A00]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#FF8A00]"
          >
            <MapPin className="h-3 w-3" /> Intelligence locale
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
          >
            Le seul outil qui{" "}
            <span className="gradient-text">comprend l&apos;Afrique</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-muted-foreground md:text-base"
          >
            RPM par pays, sons tendance, meilleurs créneaux de publication —
            données mises à jour chaque semaine pour 9 marchés africains.
          </motion.p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRIES.map((c, i) => (
            <motion.article
              key={c.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-xl"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-35"
                style={{ backgroundColor: c.color }}
              />

              <div className="relative flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl leading-none">{c.flag}</span>
                  <div>
                    <h3 className="font-display text-sm font-bold leading-tight">
                      {c.name}
                    </h3>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.code}
                    </p>
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: `${c.color}1A`,
                    borderColor: `${c.color}55`,
                    color: c.color,
                  }}
                >
                  <TrendingUp className="h-2.5 w-2.5" />
                  {c.growth}
                </span>
              </div>

              <div className="relative mt-4 space-y-2 text-xs">
                <Row icon={TrendingUp} label="RPM moyen" value={c.rpm} accent={c.color} />
                <Row icon={Clock} label="Meilleur créneau" value={c.bestTime} />
                <Row icon={Music2} label="Son trending" value={c.sound} truncate />
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          +3 pays bientôt : Ghana 🇬🇭, Mali 🇲🇱, RDC 🇨🇩
        </p>
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  accent,
  truncate,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span
        className={`font-display font-semibold ${truncate ? "max-w-[55%] truncate" : ""}`}
        style={accent ? { color: accent } : undefined}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
