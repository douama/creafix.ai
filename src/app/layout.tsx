import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
  themeColor: "#0B0F19",
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
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className: "!border !backdrop-blur-xl !text-foreground",
              }}
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
