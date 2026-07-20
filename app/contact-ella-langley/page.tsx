import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Instagram, Building2, Mail, ExternalLink } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "How to Contact Ella Langley: Official Site, Socials, Booking & Fan Mail";
const DESC =
  "The real, verified ways to reach Ella Langley — her official website and socials, her label and booking, and an honest answer on fan mail. No fake addresses.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/contact-ella-langley` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/contact-ella-langley`,
    images: [`/api/og?title=${encodeURIComponent("How to Contact Ella Langley")}&kicker=${encodeURIComponent("Official channels, booking & fan mail")}`],
  },
};

export default function ContactPage() {
  const faq = [
    {
      q: "What is Ella Langley's official website?",
      a: "Her official website is ellalangley.com — that's the real one, and the best single source for tour dates, the fan-club sign-up, and official announcements.",
    },
    {
      q: "How do you contact Ella Langley on social media?",
      a: "Her main verified account is Instagram @ellalangleymusic. She's active there and on TikTok, Facebook and YouTube — the fastest way to see current, official posts is through the links on her own site.",
    },
    {
      q: "Does Ella Langley have a fan mail address?",
      a: "There's no publicly confirmed fan-mail address. We'd rather tell you that than print a random address that bounces. Artists at her level route fan mail through management or their label, and no official fan-mail P.O. box has been published, so anything you see claiming to be one is unverified.",
    },
    {
      q: "How do you book Ella Langley or reach her management?",
      a: "Ella records for Columbia Records (via Sawgod). Booking and management inquiries go through industry channels, not a public email — a booking agent and manager exist but aren't openly published, so serious booking requests typically start through her label or a booking agency, not a fan-facing address.",
    },
  ];

  const channels = [
    { icon: Globe, label: "Official website", value: "ellalangley.com", href: "https://www.ellalangley.com/" },
    { icon: Instagram, label: "Instagram (verified)", value: "@ellalangleymusic", href: "https://www.instagram.com/ellalangleymusic/" },
    { icon: Building2, label: "Label", value: "Columbia Records / Sawgod", href: null },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Contact Ella Langley", url: `${SITE_URL}/contact-ella-langley` }]} />
      <FaqSchema items={faq} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/" className="hover:text-primary">&larr; Home</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Contact</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          HOW TO CONTACT ELLA LANGLEY
        </h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          The real ways to reach her — official site, verified socials, label and booking — plus an
          honest answer on fan mail. We only list what we can actually confirm.
        </p>
      </header>

      <div className="space-y-3 mb-8">
        {channels.map((c) => (
          <div key={c.label} className="flex items-center gap-4 border border-ink/15 rounded-lg p-4 bg-paper">
            <c.icon className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-clay font-medium">{c.label}</p>
              {c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener nofollow"
                  className="font-display text-lg text-denim hover:text-primary inline-flex items-center gap-1"
                >
                  {c.value} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              ) : (
                <p className="font-display text-lg text-denim">{c.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-sm text-ink/75 bg-ink/5 border border-ink/15 rounded-md p-4 mb-8">
        <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong>On fan mail and phone numbers:</strong> there is no publicly confirmed fan-mail
          address or personal contact number for Ella Langley. Sites that list one are guessing. The
          reliable way to be seen is engaging with her official social posts; the reliable way to
          get tickets early is her{" "}
          <Link href="/fan-club" className="underline text-denim hover:text-primary">fan club presale</Link>.
        </p>
      </div>

      <div className="bg-primary/10 border border-primary/40 rounded-lg p-5 mb-8">
        <p className="font-display text-xl text-denim tracking-wide mb-1">
          WANT THE UPDATES WITHOUT THE HUNT?
        </p>
        <p className="text-sm text-ink/75 mb-3">
          We track her tour, set times, setlists and new releases and email the good stuff. Free,
          unsubscribe anytime.
        </p>
        <NewsletterSignup placement="contact" />
      </div>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">COMMON QUESTIONS</h2>
      <div className="space-y-4 mb-8">
        {faq.map((f) => (
          <div key={f.q} className="bg-paper border border-ink/10 rounded-lg p-5">
            <h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3>
            <p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-ink/70 mb-6">
        Also useful:{" "}
        <Link href="/fan-club" className="underline text-denim hover:text-primary">the fan club &amp; presale</Link>,{" "}
        <Link href="/tour" className="underline text-denim hover:text-primary">tour dates</Link>, and{" "}
        <Link href="/best-songs" className="underline text-denim hover:text-primary">her best songs ranked</Link>.
      </p>

      <AffiliateDisclosure />
    </article>
  );
}
