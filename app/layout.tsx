import type { Metadata } from "next";
import { Bebas_Neue, Inter, Caveat } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { WebSiteSchema } from "@/components/schema/WebSiteSchema";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-accent" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ella Fellas — the unofficial Ella Langley superfan HQ",
    template: "%s | Ella Fellas",
  },
  description:
    "Daily Ella Langley news, tour stop guides, ticket alerts, and everything in between. Built by fans, for the Fellas.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Ella Fellas — the unofficial Ella Langley superfan HQ",
    description:
      "Daily news, tour guides, song breakdowns, and concert-prep guides for Ella Langley fans.",
    siteName: "Ella Fellas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ella Fellas — the unofficial Ella Langley superfan HQ",
    description:
      "Daily news, tour guides, song breakdowns, and concert-prep guides for Ella Langley fans.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  verification: {
    other: {
      "impact-site-verification": "d6149793-9e44-4a14-9fa1-478de342389a"
    }
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${caveat.variable}`}>
      <body className="min-h-screen flex flex-col bg-paper text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WebSiteSchema />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
