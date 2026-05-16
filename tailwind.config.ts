import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      // Largeur max uniforme sur tous les breakpoints xl+
      screens: { "xl": "1280px", "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        brand: {
          violet: "#7B61FF",     // Violet IA
          electric: "#00C2FF",   // Bleu électrique
          orange: "#FF8A00",     // Orange accent
          midnight: "#0B0F19",   // Noir profond
          ink: "#0F1320",
        },
        // ─── Nouvelle palette CreaFix AI Fintech (2026) ───
        cfx: {
          primary: "#0D6EFD",      // Fintech blue (primary CTA)
          "primary-hover": "#3B8AFE",
          "primary-deep": "#0950B8",
          dark: "#071426",         // Deep navy bg
          "dark-2": "#0B1220",     // Secondary dark (cards)
          "dark-3": "#0F1830",     // Tertiary dark (sub-panels)
          cyan: "#00D1FF",         // AI cyan glow
          "cyan-soft": "#5EE3FF",
          purple: "#6C63FF",       // AI purple gradient
          "purple-soft": "#9189FF",
          white: "#FFFFFF",
          "ink-1": "#E6EEF9",      // Body text on dark
          "ink-2": "#A5B4CC",      // Muted text on dark
          "ink-3": "#6C7A91",      // Subtle text on dark
          stroke: "rgba(255,255,255,0.08)",   // Default border on dark
          "stroke-strong": "rgba(255,255,255,0.14)",
          glass: "rgba(255,255,255,0.04)",
          "glass-strong": "rgba(255,255,255,0.07)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        // Satoshi pour le nouveau brand CreaFix Fintech
        cfx: ["var(--font-cfx)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(circle at top, rgba(123,97,255,0.25), transparent 60%)",
        "brand-gradient":
          "linear-gradient(135deg, #7B61FF 0%, #00C2FF 50%, #FF8A00 100%)",
        // ─── Nouveaux gradients CreaFix AI Fintech ───
        "cfx-ai":
          "linear-gradient(135deg, #6C63FF 0%, #0D6EFD 55%, #00D1FF 100%)",
        "cfx-ai-soft":
          "linear-gradient(135deg, rgba(108,99,255,0.18) 0%, rgba(13,110,253,0.12) 50%, rgba(0,209,255,0.08) 100%)",
        "cfx-button":
          "linear-gradient(180deg, #2A85FE 0%, #0D6EFD 100%)",
        "cfx-button-hover":
          "linear-gradient(180deg, #4796FF 0%, #1B7AFE 100%)",
        "cfx-glow":
          "radial-gradient(ellipse at center, rgba(13,110,253,0.45) 0%, rgba(108,99,255,0.25) 40%, transparent 70%)",
        "cfx-grid":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      boxShadow: {
        "cfx-glow": "0 0 0 1px rgba(13,110,253,0.35), 0 0 40px rgba(13,110,253,0.25), 0 0 80px rgba(108,99,255,0.18)",
        "cfx-cyan-glow": "0 0 0 1px rgba(0,209,255,0.35), 0 0 60px rgba(0,209,255,0.35)",
        "cfx-card": "0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 64px -16px rgba(7,20,38,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
        "cfx-float": "0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
        "cfx-button-glow": "0 8px 24px -6px rgba(13,110,253,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 24px rgba(123,97,255,0.4)" },
          "50%": { boxShadow: "0 0 48px rgba(123,97,255,0.7)" },
        },
        // ─── CreaFix Fintech animations ───
        "cfx-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,209,255,0.6)" },
          "50%": { boxShadow: "0 0 0 12px rgba(0,209,255,0)" },
        },
        "cfx-orb": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)", opacity: "0.5" },
          "50%": { transform: "translate3d(40px,-30px,0) scale(1.1)", opacity: "0.8" },
        },
        "cfx-bar-grow": {
          "0%": { height: "0%", opacity: "0" },
          "100%": { height: "var(--bar-h, 60%)", opacity: "1" },
        },
        "cfx-tick": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "cfx-spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 3s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "cfx-pulse": "cfx-pulse 2s ease-out infinite",
        "cfx-orb": "cfx-orb 14s ease-in-out infinite",
        "cfx-bar-grow": "cfx-bar-grow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "cfx-tick": "cfx-tick 3s ease-in-out infinite",
        "cfx-spin-slow": "cfx-spin-slow 16s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
