import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Clock, Ticket, Users } from "lucide-react";
import { getAllTourDates, getTourDate } from "@/lib/data";
import { AffiliateLink } from "@/components/AffiliateLink";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { ConcertGearWidget } from "@/components/ConcertGearWidget";
import { MusicEventSchema } from "@/components/schema/MusicEventSchema";
import { ticketUrl, hotelUrl } from "@/lib/affiliates";
import { eventQuery, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllTourDates().map((d) => ({ slug: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getTourDate(slug);
  if (!d) return {};
  return {
    title: `Ella Langley in ${d.city}, ${d.state} — ${d.venue}`,
    description: `Tickets, parking, hotels, openers, and everything you need for Ella Langley's ${d.tour} stop at ${d.venue} in ${d.city} on ${formatDate(d.date, "long")}.`,
  };
}

export default async function TourStopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getTourDate(slug);
  if (!d) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const pageUrl = `${SITE_URL}/tour/${d.id}`;

  // Past shows must NOT render "buy/resale tickets" buttons - the links would
  // point fans at events that no longer exist. Compare YYYY-MM-DD strings
  // (both lexicographically sortable) against today in UTC.
  const today = new Date().toISOString().slice(0, 10);
  const isPast = d.date < today;

  // Performer/per-event ticket links. We never use raw search URLs (dead pages).
  // TickPick is primary (per-event deep links + reliable artist page).
  const primaryQuery = eventQuery(d);
  const tixUrl = ticketUrl({ query: primaryQuery, id: d.id }, "tickpick");
  const seatGeekUrl = ticketUrl(primaryQuery, "seatgeek");
  const vividUrl = ticketUrl(primaryQuery, "vivid");
  const isMWStadium = d.tourType === "support" && (d.venueCapacity ?? 0) >= 40000;
  const tmUrl = isMWStadium
    ? ticketUrl(`${d.headliner ?? "Morgan Wallen"} ${d.city}`, "ticketmaster")
    : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <MusicEventSchema d={d} url={pageUrl} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/tour" className="hover:text-primary">&larr; All tour dates</Link>
      </nav>

      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm text-clay uppercase tracking-wider font-medium">
          <Calendar className="w-4 h-4" />
          {formatDate(d.date, "long")}
          {!isPast && d.soldOut && (
            <span className="ml-2 bg-clay text-paper text-xs font-bold px-2 py-0.5 rounded-full">
              SOLD OUT (FACE)
            </span>
          )}
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2">
          Ella Langley in {d.city}, {d.state}
        </h1>
        <p className="text-xl text-ink/80 mt-2">{d.venue}</p>
        <p className="text-sm text-ink/60 mt-1">{d.tour}</p>
      </header>

      {isPast ? (
        <section className="bg-ink/5 border border-ink/15 rounded-lg p-5 mb-6">
          <p className="text-xs uppercase tracking-wider text-ink/50 font-medium mb-1">
            PAST SHOW
          </p>
          <h2 className="font-display text-2xl text-denim">This show has passed</h2>
          <p className="text-sm text-ink/80 mt-1">
            Ella played {d.venue} in {d.city} on {formatDate(d.date, "long")}. Tickets are no longer available for this date.
          </p>
          <Link
            href="/tour"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90"
          >
            <Ticket className="w-4 h-4" /> SEE UPCOMING DATES
          </Link>
        </section>
      ) : (
        <section className="bg-primary/15 border-2 border-primary rounded-lg p-5 mb-6">
          <p className="text-xs uppercase tracking-wider text-denim font-medium mb-1">
            {d.soldOut ? "RESALE" : "TICKETS"} · {d.ticketPriceRange}
          </p>
          <h2 className="font-display text-2xl text-denim">Grab tickets</h2>
          <p className="text-sm text-ink/80 mt-1 mb-4">
            {d.soldOut
              ? "Sold out at face value. Resale starts around the price range above and climbs as the show approaches."
              : "Buy direct or check the secondary market for better seat options."}
          </p>
          <div className="flex flex-wrap gap-2">
            <AffiliateLink href={tixUrl} source="tickpick" className="inline-flex items-center gap-2 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90">
              <Ticket className="w-4 h-4" /> TICKPICK
            </AffiliateLink>
            {tmUrl && (
              <AffiliateLink href={tmUrl} source="ticketmaster" className="inline-flex items-center gap-2 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90">
                <Ticket className="w-4 h-4" /> TICKETMASTER
              </AffiliateLink>
            )}
            <AffiliateLink href={seatGeekUrl} source="seatgeek" className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink/10 text-denim font-display tracking-wide rounded-md hover:bg-ink/20 border border-ink/20">
              <Ticket className="w-4 h-4" /> SEATGEEK
            </AffiliateLink>
            <AffiliateLink href={vividUrl} source="vivid" className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink/10 text-denim font-display tracking-wide rounded-md hover:bg-ink/20 border border-ink/20">
              <Ticket className="w-4 h-4" /> VIVID SEATS
            </AffiliateLink>
          </div>
          <p className="text-xs text-ink/50 mt-3">
            Tip: TickPick has all-in pricing (no surprise fees at checkout) and per-show pages for {d.tourType === "support" ? `${d.headliner ?? "this tour"}` : "Ella"}&apos;s dates. SeatGeek &amp; Vivid Seats are good for comparing resale seats.
          </p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="font-display text-2xl text-denim mb-3">VENUE INFO</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
            <span>{d.venueAddress}</span>
          </li>
          {d.venueCapacity && (
            <li className="flex items-start gap-2">
              <Users className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Capacity: {d.venueCapacity.toLocaleString()}</span>
            </li>
          )}
          {(d.doorsTime || d.showTime) && (
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                {d.doorsTime && <>Doors {d.doorsTime}</>}
                {d.doorsTime && d.showTime && " · "}
                {d.showTime && <>Show {d.showTime}</>}
              </span>
            </li>
          )}
        </ul>
      </section>

      {d.openers.length > 0 && d.tourType !== "support" && (
        <section className="mb-8">
          <h2 className="font-display text-2xl text-denim mb-3">OPENING THIS DATE</h2>
          <ul className="space-y-1.5">
            {d.openers.map((o) => (
              <li key={o} className="text-base">
                <span className="text-primary">&bull;</span> {o}
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink/60 mt-2">
            See our <Link href="/guides/opening-acts-explained" className="text-primary hover:underline">opening acts breakdown</Link> for who&apos;s worth showing up early for.
          </p>
        </section>
      )}

      {d.tourType === "support" && d.headliner && (
        <section className="mb-8">
          <h2 className="font-display text-2xl text-denim mb-3">HEADLINER</h2>
          <p>
            Ella Langley is direct support. {d.headliner} headlines after Ella&apos;s 45-minute set.
          </p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="font-display text-2xl text-denim mb-3">HOTELS NEARBY</h2>
        <p className="text-sm text-ink/80 mb-3">
          Anywhere within 1.5 miles of the venue is the move — Uber surge kicks in by 9 PM on show nights.
        </p>
        <AffiliateLink
          href={hotelUrl(`${d.city}, ${d.state}`)}
          source="booking"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-ink font-display tracking-wide rounded-md hover:bg-primary-dark hover:text-paper"
        >
          FIND HOTELS NEAR {d.venue.toUpperCase()}
        </AffiliateLink>
      </section>

      <ConcertGearWidget show={{ venue: d.venue, venueCapacity: d.venueCapacity }} />

      <section className="mb-8 bg-paper border border-ink/10 rounded-lg p-5">
        <h2 className="font-display text-xl text-denim mb-2">WHAT TO WEAR</h2>
        <p className="text-sm text-ink/80">
          Jeans + boots + a button-down or a fitted tee is the default. Nobody&apos;s grading your fit.
          Avoid open-toe shoes (your feet will get stepped on) and don&apos;t buy a cowboy hat for the show.
        </p>
        <Link href="/guides/what-to-wear-to-an-ella-langley-concert" className="inline-block mt-3 text-sm font-medium text-primary hover:underline">
          Full guide &rarr;
        </Link>
      </section>

      <AffiliateDisclosure />
    </article>
  );
}
