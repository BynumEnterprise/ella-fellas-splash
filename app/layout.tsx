import React from "react";
import type { Metadata } from "next";
import { Bebas_Neue, Inter, Caveat } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WebSiteSchema } from "@/components/schema/WebSiteSchema";
import "./globals.css";
const IMPACT_VERIFICATION_ID = "90e9a93e-1c37-48da-ae98-f4a8e59223f3";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${caveat.variable}`}>
<head>
    {React.createElement("meta", {
        name: "impact-site-verification",
            value: IMPACT_VERIFICATION_ID,
              })}
              </head>
                    <body className="min-h-screen flex flex-col bg-paper text-ink">
        {/* Impact.com site ownership verification */}
        <div style={{ display: "none" }} aria-hidden="true">
          Impact-Site-Verification: 465e0e70-5146-444d-9120-8c91daea7d51
        </div>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WebSiteSchema />
      </body>
    </html>
  );
}
