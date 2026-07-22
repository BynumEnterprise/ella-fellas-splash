import type { Metadata } from "next";
import Link from "next/link";
import { Ticket, TrendingDown, Flame, ArrowRight } from "lucide-react";
import { getAllTourDates } from "@/lib/data";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { AffiliateLink } from "@/components/AffiliateLink";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import type { TourDate } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "How Much Are Ella Langley Tickets? 2026 Prices by City";
const DESC =
  "What Ella Langley tickets actually cost in 2026 — tracked price ranges for every show, the cheapest dates, and which are sold out at face value. Live prices update on the ticket marketplace.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/ticket-prices` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/ticket-prices`,
    images: [`/api/og?title=${encodeURIComponent("Ella Langley Ticket Prices")}&kicker=${encodeURIComponent("2026, by city")}`],
  },
};

/** Pull the low/high dollar figures out of a tracked range string.
 *  Handles "$45-$285", "Resale $85-$450", "Resale $185-$1,200", "Festival pass". */
function parseRange(s: string): { low: number | null; high: number | null; resale: boolean } {
  const resale = /resale/i.test(s);
  const nums = (s.match(/\$[\d,]+/g) ?? []).map((n) => Number(n.replace(/[$,]/g, "")));
  if (nums.length === 0) return { low: null, high: null, resale };
  return { low: Math.min(...nums), high: Math.max(...nums), resale };
}

function fmt(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const today = () => new Date().toISOString().slice(0, 10);

export default function TicketPricesPage() {
  const shows = getAllTourDates()
    .filter((d) => d.date >= today())
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const withPrice = shows
    .map((d) => ({ d, ...parseRange(d.ticketPriceRange) }))
    .filter((x) => x.low !== null) as { d: TourDate; low: number; high: number; resale: boolean }[];

  const cheapest = withPrice.length
    ? withPrice.reduce((a, b) => (b.low < a.low ? b : a))
    : null;
  const priciest = withPrice.length
    ? withPrice.reduce((a, b) => (b.high > a.high ? b : a))
    : null;
  const soldOutCount = shows.filter((d) => d.soldOut).length;
  const lowestFace = withPrice.filter((x) => !x.resale).sort((a, b) => a.low - b.low)[0];

  const faq = [
    {
      q: "How much are Ella Langley tickets in 2026?",
      a: cheapest
        ? `Across her 2026 tour, tracked prices run from about ${usd(cheapest.low)} for the cheapest dates to ${usd(priciest!.high)} at the highest-demand shows. Face-value seats on the still-available dates start around ${lowestFace ? usd(lowestFace.low) : usd(cheapest.low)}; sold-out shows are resale only and climb from there. Live prices move daily on the marketplace.`
        : `Prices vary by city and demand. Check the live marketplace for the show you want — this page tracks the ranges we've seen.`,
    },
    {
      q: "What's the cheapest Ella Langley show?",
      a: cheapest
        ? `Right now the lowest tracked entry price is ${cheapest.d.city}, ${cheapest.d.state} (${cheapest.d.venue}) from about ${usd(cheapest.low)}. Prices change, so confirm on the marketplace before you buy.`
        : `It changes by date — compare the table above.`,
    },
    {
      q: "Are Ella Langley tickets sold out?",
      a:
        soldOutCount > 0
          ? `${soldOutCount} of her ${shows.length} upcoming 2026 shows are sold out at face value and available on the resale market only. The rest still have face-value tickets. Sold-out dates are marked below.`
          : `As of now, upcoming shows still have tickets available. Popular dates sell out fast, so the marketplace is the fastest way to check live.`,
    },
    {
      q: "Do Ella Langley ticket prices drop closer to the show?",
      a: "Sometimes — resale prices on lower-demand dates can soften in the final week as sellers clear inventory. But her marquee shows (Red Rocks, the Greek, the Saint Paul finale) tend to climb, not fall. If it's a bucket-list date, waiting usually costs more; if it's a lower-demand night, patience can pay. Prices are live on the marketplace, so it's worth checking a few times.",
    },
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Ticket Prices", url: `${SITE_URL}/ticket-prices` }]} />
      <FaqSchema items={faq} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/tour" className="hover:text-primary">&larr; All tour dates</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Ticket prices</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          HOW MUCH ARE ELLA LANGLEY TICKETS?
        </h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          Here&apos;s what her 2026 shows actually cost — the price range we&apos;re tracking for
          every date, which are the cheapest, and which are sold out at face value. Prices move
          daily, so the numbers below are a guide and the live price is one click away.
        </p>
      </header>

      {/* At-a-glance callouts, all derived from the real data. */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {cheapest && (
          <div className="border border-ink/15 rounded-lg p-4 bg-paper">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-clay font-medium">
              <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" /> Cheapest right now
            </p>
            <p className="font-display text-2xl text-denim mt-1">{usd(cheapest.low)}+</p>
            <p className="text-sm text-ink/70">{cheapest.d.city}, {cheapest.d.state}</p>
          </div>
        )}
        {priciest && (
          <div className="border border-ink/15 rounded-lg p-4 bg-paper">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-clay font-medium">
              <Flame className="w-3.5 h-3.5" aria-hidden="true" /> Highest demand
            </p>
            <p className="font-display text-2xl text-denim mt-1">up to {usd(priciest.high)}</p>
            <p className="text-sm text-ink/70">{priciest.d.city}, {priciest.d.state}</p>
          </div>
        )}
        <div className="border border-ink/15 rounded-lg p-4 bg-paper">
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-clay font-medium">
            <Ticket className="w-3.5 h-3.5" aria-hidden="true" /> Sold out at face
          </p>
          <p className="font-display text-2xl text-denim mt-1">{soldOutCount} of {shows.length}</p>
          <p className="text-sm text-ink/70">resale only</p>
        </div>
      </div>

      {/* Per-show price table. */}
      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">PRICES BY CITY</h2>
      <div className="space-y-2 mb-8">
        {shows.map((d) => {
          const { low, resale } = parseRange(d.ticketPriceRange);
          return (
            <div key={d.id} className="border border-ink/15 rounded-lg p-4 bg-paper">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-wider text-clay">{fmt(d.date)}</p>
                  <p className="font-display text-xl text-denim leading-tight mt-0.5">
                    {d.city}, {d.state}
                  </p>
                  <p className="text-sm text-ink/70">{d.venue}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl text-denim">
                    {d.pricesConfirmed ? d.ticketPriceRange : `~${d.ticketPriceRange}`}
                  </p>
                  <p className="text-xs text-ink/50">
                    {d.soldOut ? "Sold out at face · resale" : resale ? "Resale market" : "Face value + resale"}
                    {low === null ? " · see marketplace" : ""}
                  </p>
                  {!d.pricesConfirmed && (
                    <p className="text-[11px] text-ink/45 mt-0.5">
                      typical tour range · check live prices
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <AffiliateLink
                  href={ticketNetworkUrl(d.id)}
                  source="ticket-prices"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-paper font-display tracking-wide rounded-md hover:bg-primary/90"
                >
                  <span aria-hidden="true">🎟</span> {d.soldOut ? "SEE RESALE PRICES" : "SEE LIVE PRICES"}
                  <ArrowRight className="w-4 h-4" />
                </AffiliateLink>
                <Link
                  href={`/tour/${d.id}`}
                  className="ml-2 text-sm text-denim underline decoration-primary/40 underline-offset-4 hover:text-primary"
                >
                  Show guide
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 text-sm text-ink/75 bg-ink/5 border border-ink/15 rounded-md p-4 mb-8">
        <Ticket className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong>How we track prices:</strong> the ranges above are the prices we&apos;ve seen for
          each date and refresh regularly — they&apos;re a planning guide, not a live quote. The
          real-time price for any show is on the marketplace via the buttons above. We only point
          you to buyer-guaranteed resale, and we earn a commission if you buy through our links at
          no extra cost to you.
        </p>
      </div>

      <div className="bg-primary/10 border border-primary/40 rounded-lg p-5 mb-8">
        <p className="font-display text-xl text-denim tracking-wide mb-1">
          WANT A PRICE-DROP HEADS-UP FOR YOUR CITY?
        </p>
        <p className="text-sm text-ink/75 mb-3">
          Tell us your show and we&apos;ll email you when set times drop and when it&apos;s the smart
          window to buy. No spam, unsubscribe anytime.
        </p>
        <NewsletterSignup placement="ticket-prices" />
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
        Going to a show? Line up the{" "}
        <Link href="/set-times" className="underline text-denim hover:text-primary">set times</Link>,{" "}
        <Link href="/guides/best-seats-ella-langley-concert" className="underline text-denim hover:text-primary">where to sit</Link>, and{" "}
        <Link href="/guides/ella-langley-meet-and-greet" className="underline text-denim hover:text-primary">whether VIP is worth it</Link>.
      </p>

      <AffiliateDisclosure />
    </article>
  );
}
