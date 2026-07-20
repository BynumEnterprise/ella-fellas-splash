import type { Metadata } from "next";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { getUpcomingTourDates } from "@/lib/data";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { AffiliateLink } from "@/components/AffiliateLink";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "Ella Langley at the Cowboys Music Festival, Calgary (2026)";
const DESC =
  "Ella Langley played the Cowboys Music Festival in Calgary during the 2026 Stampede. Here's what happened, who she played with, and where to catch her next.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/ella-langley-calgary` },
  openGraph: { title: TITLE, description: DESC, images: [`/api/og?title=${encodeURIComponent("Ella Langley in Calgary")}&kicker=${encodeURIComponent("Cowboys Music Festival 2026")}`] },
};

export default function CalgaryPage() {
  const nextShow = getUpcomingTourDates(1)[0];
  const faq = [
    { q: "Did Ella Langley play the Calgary Stampede in 2026?", a: "Yes — Ella Langley performed at the Cowboys Music Festival at Cowboys Park in Calgary on Friday, July 10, 2026, during Calgary Stampede, on a bill with BigXthaPlug. That show has already happened." },
    { q: "Is Ella Langley coming back to Calgary?", a: "No further Calgary dates are on her calendar right now. Her focus for the rest of 2026 is the U.S. Dandelion Tour plus her Morgan Wallen stadium support dates. Check the tour page for the latest — if a new Calgary or Canadian date is announced, it'll show up there." },
    { q: "Where can I see Ella Langley next?", a: "See the full 2026 tour schedule for every upcoming city, with set times, venue guides and tickets." },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Calgary", url: `${SITE_URL}/ella-langley-calgary` }]} />
      <FaqSchema items={faq} />
      <nav className="text-xs text-ink/60 mb-4"><Link href="/tour" className="hover:text-primary">&larr; Tour</Link></nav>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Calgary · Cowboys Music Festival</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">ELLA LANGLEY IN CALGARY</h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          She brought the Dandelion Tour energy to the Calgary Stampede. Here&apos;s the rundown — and
          where to catch her next, since the Calgary date has already passed.
        </p>
      </header>
      <div className="bg-paper border border-ink/15 rounded-lg p-5 mb-6">
        <p className="text-ink/85 leading-relaxed">
          Ella Langley played the <strong>Cowboys Music Festival</strong> at Cowboys Park in Calgary on
          <strong> Friday, July 10, 2026</strong>, during Calgary Stampede, sharing the bill with
          BigXthaPlug. It was one of her few 2026 dates outside the U.S. and a big one for her Canadian
          fans. If you searched hoping to grab tickets — that show has already happened.
        </p>
      </div>
      {nextShow && (
        <div className="bg-primary/10 border border-primary/40 rounded-lg p-5 mb-8">
          <p className="text-xs uppercase tracking-wider text-clay font-medium mb-1"><Ticket className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" /> Catch her next</p>
          <p className="font-display text-xl text-denim leading-tight">{nextShow.city}, {nextShow.state}</p>
          <p className="text-sm text-ink/75 mt-1 mb-3">{nextShow.venue}</p>
          <AffiliateLink href={ticketNetworkUrl(nextShow.id)} source="calgary-tickets" className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md hover:bg-primary/90">
            <span aria-hidden="true">🎟</span> {nextShow.soldOut ? "FIND RESALE TICKETS" : "GET TICKETS"}
          </AffiliateLink>
          <p className="text-xs text-ink/60 mt-3">Or see the <Link href="/tour" className="underline hover:text-primary">full 2026 tour schedule</Link>.</p>
        </div>
      )}
      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">COMMON QUESTIONS</h2>
      <div className="space-y-4 mb-8">
        {faq.map((f) => (<div key={f.q} className="bg-paper border border-ink/10 rounded-lg p-5"><h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3><p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p></div>))}
      </div>
      <AffiliateDisclosure />
    </article>
  );
}
