import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemedToaster } from "@/components/themed-toaster";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationLd, websiteLd, softwareApplicationLd } from "@/lib/seo/structured-data";
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
    default: "CreaFix AI — Fix your content. Scale your revenue.",
    template: "%s · CreaFix AI",
  },
  description:
    "CreaFix AI audits, fixes and scales your monetization across 9 platforms — YouTube, Facebook, Instagram, TikTok, X, Snapchat, Twitch, Pinterest, LinkedIn. Shadowban detection, viral score, RPM predictor, AI content repair.",
  metadataBase: new URL("https://creafix.ai"),
  keywords: [
    "CreaFix AI",
    "creator monetization",
    "shadowban detector",
    "viral score AI",
    "RPM predictor",
    "YouTube monetization",
    "Instagram monetization",
    "TikTok Creator Rewards",
    "Twitch Affiliate",
    "AI content repair",
    "multi-platform analytics",
  ],
  openGraph: {
    title: "CreaFix AI — Turn Your Content Into Revenue With AI",
    description:
      "Audit, fix and scale your monetization across YouTube, Facebook, Instagram, TikTok, X, Snapchat, Twitch, Pinterest and LinkedIn — automatically.",
    url: "https://creafix.ai",
    siteName: "CreaFix AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreaFix AI",
    description: "Fix your content. Scale your revenue.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0D14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${sora.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Structured data global (toutes pages) — Organization, Website, SoftwareApplication */}
            <JsonLd data={[organizationLd(), websiteLd(), softwareApplicationLd()]} />
            {children}
            <ThemedToaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
