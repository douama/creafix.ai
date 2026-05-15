import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, locale = "fr-FR") {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n);
}

export function formatCurrency(
  amount: number,
  currency: "XOF" | "XAF" | "NGN" | "GHS" | "ZAR" | "MAD" | "USD" | "EUR" = "XOF",
  locale = "fr-FR",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function compact(n: number, locale = "fr-FR") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

export function scoreTone(score: number) {
  if (score >= 80) return "emerald";
  if (score >= 60) return "amber";
  if (score >= 40) return "orange";
  return "rose";
}
