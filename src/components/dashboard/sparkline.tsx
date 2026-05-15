"use client";

import { cn } from "@/lib/utils";

/**
 * Mini-graphique inline (sparkline) sans bibliothèque externe.
 * Idéal pour des KPI cards où une visualisation rapide aide.
 */
export function Sparkline({
  data,
  className,
  stroke = "#7B61FF",
  fill = "rgba(123, 97, 255, 0.15)",
  width = 80,
  height = 28,
}: {
  data: number[];
  className?: string;
  stroke?: string;
  fill?: string;
  width?: number;
  height?: number;
}) {
  if (data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const pathLine = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  const pathFill = `${pathLine} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("inline-block", className)}
      preserveAspectRatio="none"
    >
      <path d={pathFill} fill={fill} />
      <path d={pathLine} stroke={stroke} strokeWidth={1.5} fill="none" />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r={2}
        fill={stroke}
      />
    </svg>
  );
}
