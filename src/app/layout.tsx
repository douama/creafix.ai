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
    default: "CreaFix AI — Fix your content. Scale your revenue.",
    template: "%s · CreaFix AI",
  },
  description:
    "CreaFix AI audits, fixes and scales your TikTok & Facebook monetization automatically. Shadowban detection, viral score, RPM predictor, AI content repair.",
  metadataBase: new URL("https://creafix.ai"),
  keywords: [
    "CreaFix AI",
    "shadowban detector",
    "viral score AI",
    "RPM predictor",
    "TikTok monetization",
    "Facebook monetization",
    "AI content repair",
    "African creators",
  ],
  openGraph: {
    title: "CreaFix AI — Turn Your Content Into Revenue With AI",
    description:
      "Audit, fix and scale your TikTok & Facebook monetization automatically. Built for creators worldwide, optimized for African markets.",
    url: "https://creafix.ai",
    siteName: "CreaFix AI",
    locale: "en_US",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
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
