import type { Metadata } from "next";
import { seoTitle } from "@/lib/seo";
import Link from "next/link";
import { Ticket, CalendarClock, ArrowRight } from "lucide-react";
import { getAllTourDates, getNextShow, getPastTourDates } from "@/lib/data";
import { hasSetlist } from "@/lib/setlists";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { formatDate } from "@/lib/utils";
import { TourCard } from "@/components/TourCard";
import { MerchCTA } from "@/components/MerchCTA";
import { AffiliateLink } from "@/components/AffiliateLink";
import type { TourDate } from "@/lib/types";

// ISR: "next show" / "updated" copy is date-relative, so rebuild hourly between deploys.
export const revalidate = 3600;

/** "Oct 13" — compact date for titles and meta. */
function md(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Everything the answer block + metadata need, computed at build time. */
function tourSummary() {
  const today = todayISO();
  const all = getAllTourDates();
  const next = getNextShow(today);
  const live = all.filter((d) => d.date >= today && !d.canceled);
  const remaining2026 = live.filter((d) => d.date.startsWith("2026"));
  const dates2027 = all.filter((d) => d.date.startsWith("2027") && !d.canceled);
  return { today, all, next, remaining2026, dates2027 };
}

export async function generateMetadata(): Promise<Metadata> {
  const { next, remaining2026, dates2027 } = tourSummary();
  const nextBit = next ? ` Next: ${next.city} ${md(next.date)}` : "";
  const title = `Ella Langley Tour Dates 2026 & 2027 —${nextBit || " Every Show"}`;
  const description = `${remaining2026.length} Ella Langley shows left in 2026${
    next ? ` (next: ${next.city}, ${md(next.date)} at ${next.venue})` : ""
  }, plus ${dates2027.length} confirmed 2027 date${dates2027.length === 1 ? "" : "s"}${
    dates2027.length ? ` (${dates2027.map((d) => `${d.city} ${md(d.date)}`).join(", ")})` : ""
  }. Tickets, set times, openers and past setlists.`;
  return {
    title: seoTitle(title),
    description,
    alternates: { canonical: "/tour" },
    openGraph: { title, description, url: "/tour", images: ["/opengraph-image.png"] },
  };
}

function ShowLine({ d }: { d: TourDate }) {
  return (
    <li>
      <Link href={`/tour/${d.id}`} className="font-semibold text-denim underline decoration-primary/50 underline-offset-2 hover:text-primary">
        {formatDate(d.date, "short")} &mdash; {d.city}, {d.state}
      </Link>{" "}
      <span className="text-ink/70">({d.venue})</span>
    </li>
  );
}

export default function TourIndexPage() {
  // Hide shows whose date is in the past — fans don't want to see Toledo May 7
  // on their screen in late May. Per-show /tour/[slug] pages still render so
  // historical SEO / inbound links keep working.
  const { today, all: allDates, next, remaining2026, dates2027 } = tourSummary();
  const dates = allDates.filter((d) => d.date >= today);
  const past2026 = getPastTourDates(today).filter((d) => d.date.startsWith("2026"));
  const headlining = dates.filter((d) => d.tourType === "headlining");
  const support = dates.filter((d) => d.tourType === "support");
  const festival = dates.filter((d) => d.tourType === "festival");

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ella Langley Tour Dates 2026 & 2027",
    description: "All confirmed Ella Langley tour stops for the 2026 Dandelion tour, Morgan Wallen support dates, and festival appearances.",
    numberOfItems: allDates.length,
    itemListElement: [...allDates]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/tour/${d.id}`,
      })),
  };

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-denim">ELLA LANGLEY TOUR DATES 2026 &amp; 2027</h1>

        {/* Answer-first block: what searchers actually want, before any list. */}
        <section className="mt-5 bg-primary/10 border-2 border-primary/50 rounded-lg p-5" aria-label="Tour summary">
          <p className="text-xs uppercase tracking-wider text-clay font-medium inline-flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5" aria-hidden="true" /> Updated {formatDate(today, "long")}
          </p>
          {next ? (
            <p className="text-lg text-ink/90 mt-2 leading-relaxed">
              <strong>Ella Langley&apos;s next show is {formatDate(next.date, "long")} in {next.city}, {next.state}</strong>{" "}
              at {next.venue}. She has <strong>{remaining2026.length} show{remaining2026.length === 1 ? "" : "s"} left in 2026</strong>
              {remaining2026.length > 0 && (
                <> (through {formatDate(remaining2026[remaining2026.length - 1].date, "short")})</>
              )}
              {dates2027.length > 0 ? (
                <>
                  {" "}and <strong>{dates2027.length} confirmed 2027 date{dates2027.length === 1 ? "" : "s"}</strong> so far.
                </>
              ) : (
                <>. No 2027 dates are confirmed yet.</>
              )}
            </p>
          ) : (
            <p className="text-lg text-ink/90 mt-2">No upcoming shows are on the calendar right now.</p>
          )}
          {dates2027.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-denim">Confirmed 2027 dates:</p>
              <ul className="text-sm mt-1 space-y-1">
                {dates2027.map((d) => <ShowLine key={d.id} d={d} />)}
              </ul>
              <Link href="/guides/ella-langley-2027-tour" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1 mt-2">
                Everything we know about the 2027 tour <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
          {next && (
            <AffiliateLink
              href={ticketNetworkUrl(next.id)}
              source="tour-index-next-show-tickets"
              ariaLabel={`Get tickets for Ella Langley in ${next.city} on TicketNetwork`}
              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md shadow-sm hover:bg-primary/90"
            >
              <Ticket className="w-5 h-5" aria-hidden="true" /> {next.city.toUpperCase()} TICKETS
            </AffiliateLink>
          )}
        </section>

        <p className="text-ink/80 mt-4">
          {headlining.length} headlining + {support.length} Morgan Wallen support + {festival.length} festivals.
          Tap any date for venue info, openers, hotels nearby, and tickets.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            href="/ticket-prices"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/15 border border-primary/40 rounded-md text-denim font-medium hover:bg-primary/25 transition-colors"
          >
            How much are Ella Langley tickets? See 2026 prices by city &rarr;
          </Link>
          <Link
            href="/openers"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/15 border border-primary/40 rounded-md text-denim font-medium hover:bg-primary/25 transition-colors"
          >
            Who&apos;s opening for Ella Langley? See every city&apos;s support act &rarr;
          </Link>
        </div>
      </header>

      {headlining.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-denim mb-4">THE DANDELION TOUR (HEADLINING)</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {headlining.map((d) => <TourCard key={d.id} d={d} />)}
          </div>
        </section>
      )}

      {support.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-denim mb-4">SUPPORTING MORGAN WALLEN (STADIUMS)</h2>
          <p className="text-sm text-ink/70 mb-4">
            Direct support — 45-minute set, then Wallen headlines. All sold at face value on the primary on-sale.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {support.map((d) => <TourCard key={d.id} d={d} />)}
          </div>
        </section>
      )}

      {festival.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-denim mb-4">FESTIVAL APPEARANCES</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {festival.map((d) => <TourCard key={d.id} d={d} />)}
          </div>
        </section>
      )}
      {past2026.length > 0 && (
        <section className="mb-10" id="past-shows">
          <h2 className="font-display text-2xl text-denim mb-2">PAST 2026 SHOWS</h2>
          <p className="text-sm text-ink/70 mb-4">
            Looking up an old tour date? Every 2026 show that has already happened, newest first &mdash;
            tap through for the setlist from that night.
          </p>
          <ul className="grid md:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {past2026.map((d) => (
              <li key={d.id} className="flex items-baseline justify-between gap-3 border-b border-ink/10 py-1.5">
                <span>
                  <span className="text-ink/60">{formatDate(d.date, "short")}</span>{" "}
                  <Link href={`/tour/${d.id}`} className={`text-denim hover:text-primary ${d.canceled ? "line-through decoration-clay/70" : ""}`}>
                    {d.city}, {d.state}
                  </Link>
                </span>
                {d.canceled ? (
                  <span className="text-xs uppercase font-bold text-clay">Canceled</span>
                ) : (
                  <Link href={`/tour/${d.id}/setlist`} className={`text-xs font-medium hover:underline ${hasSetlist(d.id) ? "text-primary" : "text-ink/50"}`}>
                    {hasSetlist(d.id) ? "Setlist" : "Setlist pending"} &rarr;
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link href="/setlists" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1 mt-3">
            Every Ella Langley setlist from 2026 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

      <MerchCTA source="tour_index_merch" variant="banner" className="mt-12" />

    </article>
  );
}
