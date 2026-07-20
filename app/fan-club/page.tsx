import type { Metadata } from "next";
import Link from "next/link";
import { Users, Mail, Ticket, Star, ExternalLink } from "lucide-react";
import { getUpcomingTourDates } from "@/lib/data";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { AffiliateLink } from "@/components/AffiliateLink";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "Ella Langley Fan Club: How to Join, Presale Access & What Fans Are Called";
const DESC =
  "Does Ella Langley have a fan club? What are her fans called? How do you join and get presale codes? The straight answers — plus the free way to plug into the community.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/fan-club` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/fan-club`,
    images: [`/api/og?title=${encodeURIComponent("Ella Langley Fan Club")}&kicker=${encodeURIComponent("Join, presale, and what fans are called")}`],
  },
};

export default function FanClubPage() {
  const nextShow = getUpcomingTourDates(1)[0];

  const faq = [
    {
      q: "Does Ella Langley have an official fan club?",
      a: "Yes — Ella runs an official fan club through her own website (ellalangley.com), and its main perk is early access: fan-club members get presale codes before general on-sale for her tour dates. It's built around ticket presales and updates rather than a paid membership community, so the practical reason to join is to beat the queue on tickets.",
    },
    {
      q: "What are Ella Langley fans called?",
      a: "There's no official, artist-declared fan name the way Taylor Swift has \"Swifties.\" What caught on organically is \"Ella Fellas\" — it spread from a viral clip and fans and outlets ran with it. So if someone asks what Ella Langley fans are called, the honest answer is: unofficially, Ella Fellas. (Yes, that's where this site got its name.)",
    },
    {
      q: "How do you join Ella Langley's fan club?",
      a: "Sign up on her official site, ellalangley.com, to get on the fan-club list — that's what unlocks presale codes for upcoming shows. There's no membership card or fee involved; it's an email/text sign-up tied to ticket access.",
    },
    {
      q: "Is joining the fan club worth it?",
      a: "If you're planning to see her live, yes — the presale window is genuinely useful because her marquee dates sell fast, and getting in before general on-sale is the difference between face value and the resale market. If you just want to keep up with news, set times, and setlists, our free newsletter below does that without any of the ticketing overhead.",
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Fan Club", url: `${SITE_URL}/fan-club` }]} />
      <FaqSchema items={faq} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/" className="hover:text-primary">&larr; Home</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Fan club</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          THE ELLA LANGLEY FAN CLUB
        </h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          Does she have a fan club? What are her fans actually called? How do you join and get
          presale codes? Here are the straight answers — and the free way to plug into the
          community without missing a thing.
        </p>
      </header>

      {/* The name — the query we can own honestly */}
      <div className="bg-primary/10 border-2 border-primary/40 rounded-lg p-5 mb-8">
        <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-clay font-medium mb-1">
          <Users className="w-4 h-4" aria-hidden="true" /> What are Ella Langley fans called?
        </p>
        <p className="text-ink/85 leading-relaxed">
          There&apos;s no official fan name — Ella and her team have never declared one. But
          organically, fans got tagged <strong>&ldquo;Ella Fellas,&rdquo;</strong> and it stuck. It
          spread from a viral clip and fans and country outlets ran with it. So the honest answer:
          unofficially, Ella Langley fans are <strong>Ella Fellas</strong>. That&apos;s exactly where
          this site got its name — we&apos;re the unofficial superfan HQ.
        </p>
      </div>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-3">
        THE OFFICIAL FAN CLUB (AND WHAT IT ACTUALLY GETS YOU)
      </h2>
      <p className="text-ink/80 leading-relaxed mb-4">
        Ella runs an official fan club through her own site. Its real value isn&apos;t a membership
        card — it&apos;s <strong>presale access</strong>. Fan-club members get presale codes before
        tickets hit general on-sale, which matters a lot because her big dates sell out fast and
        resale climbs from there. If you&apos;re going to a show, joining before the on-sale is the
        single best money-saving move.
      </p>
      <p className="text-ink/80 leading-relaxed mb-6">
        You join on her official website —{" "}
        <a
          href="https://www.ellalangley.com/"
          target="_blank"
          rel="noopener nofollow"
          className="underline text-denim hover:text-primary inline-flex items-center gap-1"
        >
          ellalangley.com <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>{" "}
        — where you sign up for the fan list. No fee, no card; it&apos;s an email/text sign-up tied to
        ticket presales.
      </p>

      {/* Our free community angle + newsletter */}
      <div className="bg-paper border border-ink/15 rounded-lg p-5 mb-8">
        <p className="flex items-center gap-2 font-display text-xl text-denim tracking-wide mb-2">
          <Mail className="w-5 h-5 text-primary" aria-hidden="true" /> THE FREE FAN COMMUNITY
        </p>
        <p className="text-sm text-ink/80 leading-relaxed mb-3">
          The official club is for presale codes. For everything else — set times the moment
          they&apos;re posted, setlists within hours of each show, new-song breakdowns, and tour news
          — that&apos;s us, free. Join the Ella Fellas list and never miss a beat.
        </p>
        <NewsletterSignup placement="fan-club" />
      </div>

      {nextShow && (
        <div className="bg-primary/10 border border-primary/40 rounded-lg p-5 mb-8">
          <p className="text-xs uppercase tracking-wider text-clay font-medium mb-1">
            <Ticket className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" /> Missed the presale?
          </p>
          <p className="font-display text-xl text-denim leading-tight">
            Her next show: {nextShow.city}, {nextShow.state}
          </p>
          <p className="text-sm text-ink/75 mt-1 mb-3">
            {nextShow.venue} — buyer-guaranteed resale, browse the full price range before you buy.
          </p>
          <AffiliateLink
            href={ticketNetworkUrl(nextShow.id)}
            source="fan-club-tickets"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md hover:bg-primary/90"
          >
            <span aria-hidden="true">🎟</span> {nextShow.soldOut ? "FIND RESALE TICKETS" : "GET TICKETS"}
          </AffiliateLink>
        </div>
      )}

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
        More for the real ones:{" "}
        <Link href="/best-songs" className="underline text-denim hover:text-primary">the best Ella Langley songs, ranked</Link>,{" "}
        <Link href="/contact-ella-langley" className="underline text-denim hover:text-primary">how to contact her</Link>, and{" "}
        <Link href="/tour" className="underline text-denim hover:text-primary">every 2026 tour date</Link>.
      </p>

      <AffiliateDisclosure />
    </article>
  );
}
