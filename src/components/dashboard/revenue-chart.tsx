"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "next-themes";
import { compact } from "@/lib/utils";

const data = [
  { day: "01", revenue: 12000, viral: 35 },
  { day: "03", revenue: 18000, viral: 40 },
  { day: "05", revenue: 22000, viral: 48 },
  { day: "07", revenue: 31000, viral: 52 },
  { day: "09", revenue: 28000, viral: 58 },
  { day: "11", revenue: 42000, viral: 64 },
  { day: "13", revenue: 51000, viral: 70 },
  { day: "15", revenue: 47000, viral: 68 },
  { day: "17", revenue: 63000, viral: 75 },
  { day: "19", revenue: 78000, viral: 80 },
  { day: "21", revenue: 91000, viral: 84 },
  { day: "23", revenue: 86000, viral: 82 },
  { day: "25", revenue: 102000, viral: 88 },
  { day: "27", revenue: 117000, viral: 91 },
  { day: "29", revenue: 134000, viral: 94 },
];

export function RevenueChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light";
  const axisColor = isLight ? "rgba(15,23,42,0.55)" : "rgba(255,255,255,0.5)";
  const gridColor = isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.06)";
  const tooltipBg = isLight ? "rgba(255,255,255,0.96)" : "rgba(15,15,25,0.92)";
  const tooltipBorder = isLight ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.10)";
  const tooltipFg = isLight ? "#0f172a" : "#ffffff";

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.6} />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke={gridColor} />
          <XAxis
            dataKey="day"
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v) => compact(Number(v))}
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: 12,
              backdropFilter: "blur(20px)",
              color: tooltipFg,
              boxShadow: isLight ? "0 12px 32px -16px rgba(15,23,42,0.2)" : undefined,
            }}
            labelStyle={{ color: tooltipFg }}
            itemStyle={{ color: tooltipFg }}
            formatter={(v: number) => [`${v.toLocaleString("fr-FR")} FCFA`, "Revenus"]}
            labelFormatter={(l) => `Jour ${l}`}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={isLight ? "#7C3AED" : "#A78BFA"}
            strokeWidth={2.5}
            fill="url(#revG)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
