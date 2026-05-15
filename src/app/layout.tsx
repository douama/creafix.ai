import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Monetiq AI — Audit IA de monétisation pour créateurs africains",
    template: "%s · Monetiq AI",
  },
  description:
    "La première plateforme IA dédiée aux créateurs africains pour auditer, optimiser et accélérer la monétisation Facebook & TikTok. Score IA, anti-ban, idées virales, estimation revenus en FCFA et plus.",
  metadataBase: new URL("https://monetiq.ai"),
  keywords: [
    "monétisation Facebook",
    "TikTok Afrique",
    "créateurs Afrique",
    "audit IA",
    "RPM Afrique",
    "CPM Sénégal",
    "Mobile Money",
  ],
  openGraph: {
    title: "Monetiq AI — Le SEMrush des créateurs africains",
    description:
      "Connecte tes pages Facebook & comptes TikTok. Reçois un audit IA complet, des scores, un plan d'action et des idées virales adaptées à l'Afrique.",
    url: "https://monetiq.ai",
    siteName: "Monetiq AI",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monetiq AI",
    description: "Audit IA de monétisation sociale pour l'Afrique.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                "!border !backdrop-blur-xl !text-foreground",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
