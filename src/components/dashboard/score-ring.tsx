"use client";

import { cn } from "@/lib/utils";

export function ScoreRing({
  value,
  size = 140,
  thickness = 10,
  label,
  sublabel,
  tone = "brand",
}: {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  sublabel?: string;
  tone?: "brand" | "emerald" | "amber" | "rose";
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const gradientId = `g-${tone}`;
  const stops =
    tone === "emerald"
      ? ["#10b981", "#34d399"]
      : tone === "amber"
        ? ["#f59e0b", "#fbbf24"]
        : tone === "rose"
          ? ["#f43f5e", "#fb7185"]
          : ["#7C3AED", "#3B82F6", "#F97316"];

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} gradientTransform="rotate(45)">
            {stops.map((c, i) => (
              <stop key={c} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={thickness}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-display text-3xl font-bold")}>{value}</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          / 100
        </span>
      </div>
      {(label || sublabel) && (
        <div className="mt-3 text-center">
          {label && <div className="text-sm font-medium">{label}</div>}
          {sublabel && <div className="text-xs text-muted-foreground">{sublabel}</div>}
        </div>
      )}
    </div>
  );
}
