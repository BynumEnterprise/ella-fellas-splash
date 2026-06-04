import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Clock, Ticket, Users } from "lucide-react";
import { getAllTourDates, getTourDate } from "@/lib/data";
import { AffiliateLink } from "@/components/AffiliateLink";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { ConcertGearWidget } from "@/components/ConcertGearWidget";
import { MusicEventSchema } from "@/components/schema/MusicEventSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { ticketUrl, hotelUrl } from "@/lib/affiliates";
import { eventQuery, formatDate, formatTime } from "@/lib/utils";
import type { FaqItem } from "@/lib/types";

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
    alternates: { canonical: `/tour/${slug}` },
    openGraph: { url: `/tour/${slug}` },
  };
}

export default async function TourStopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getTourDate(slug);
  if (!d) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const pageUrl = `${SITE_URL}/tour/${d.id}`;
  const breadcrumbItems = [
    { name: "Tour", url: `${SITE_URL}/tour` },
    { name: `${d.city}, ${d.state}`, url: pageUrl },
  ];
  // ONE query for ALL providers: artist + city. This is the only pattern that
  // returns real results across SeatGeek, TickPick, and Vivid consistently.
  // Venue-only searches return empty pages on TickPick & Vivid.
  // eventQuery() returns "{Headliner} {city}" for support shows, festival name
  // for festivals, and "Ella Langley {city}" for headlining dates.
  const primaryQuery = eventQuery(d);
  // Pass show id so ticketUrl() can deep-link to a known event page (TickPick)
  // instead of returning a generic search.
  const ctx = { query: primaryQuery, id: d.id, date: d.date, venue: d.venue, city: d.city };
  const seatGeekUrl = ticketUrl(ctx, "seatgeek");
  const tixUrl = ticketUrl(ctx, "tickpick");
  const vividUrl = ticketUrl(ctx, "vivid");
  // For Morgan Wallen stadium shows, Ticketmaster is the primary inventory.
  const isMWStadium = d.tourType === "support" && (d.venueCapacity ?? 0) >= 40000;
  const tmUrl = isMWStadium
    ? ticketUrl({ query: `${d.headliner ?? "Morgan Wallen"} ${d.city}`, id: d.id }, "ticketmaster")
    : null;

  // Build SEO FAQ entries from the tour-date data. Only include questions we
  // can answer factually from the data we actually have for this show.
  const faqItems: FaqItem[] = [];

  if (d.doorsTime || d.showTime) {
    const times: string[] = [];
    if (d.doorsTime) times.push(`doors open at ${formatTime(d.doorsTime)}`);
    if (d.showTime) times.push(`the show starts at ${formatTime(d.showTime)}`);
    faqItems.push({
      q: `What time do doors open for Ella Langley at ${d.venue}?`,
      a: `For the ${formatDate(d.date, "long")} show at ${d.venue} in ${d.city}, ${times.join(" and ")}. Times can shift on the day of the show, so check your ticket and the venue before you head out.`,
    });
  }

  faqItems.push({
    q: `Is the Ella Langley ${d.city} show sold out?`,
    a: d.soldOut
      ? `Yes. The ${d.city} show at ${d.venue} is sold out at face value. Tickets are still available on the resale market, generally in the ${d.ticketPriceRange.replace(/^Resale\s+/i, "")} range, with prices climbing as the date approaches.`
      : `No. As of now the ${d.city} show at ${d.venue} still has tickets available, typically in the ${d.ticketPriceRange.replace(/^Resale\s+/i, "")} range. Buying earlier usually means better seats and lower prices.`,
  });

  if (d.tourType === "support" && d.headliner) {
    faqItems.push({
      q: `Who is Ella Langley opening for in ${d.city}?`,
      a: `In ${d.city}, Ella Langley is direct support for ${d.headliner} at ${d.venue}. She plays roughly a 45-minute set before ${d.headliner} headlines.`,
    });
  } else if (d.openers.length > 0) {
    faqItems.push({
      q: `Who is opening for Ella Langley in ${d.city}?`,
      a: `${d.openers.join(" and ")} ${d.openers.length > 1 ? "open" : "opens"} for Ella Langley at ${d.venue} in ${d.city}. Set times move fast, so plan to be inside by doors if you want to catch the opener.`,
    });
  }

  faqItems.push({
    q: `How much are tickets for the Ella Langley ${d.city} show?`,
    a: `Tickets for ${d.venue} in ${d.city} generally run ${d.ticketPriceRange.replace(/^Resale\s+/i, "")}. Prices vary by section and move with demand, so compare SeatGeek, TickPick, and Vivid Seats before you buy.`,
  });

  faqItems.push({
    q: `What should I wear to the Ella Langley show in ${d.city}?`,
    a: `Jeans, closed-toe boots or sneakers, and a fitted tee or button-down is the safe default. Skip open-toe shoes and a brand-new cowboy hat. See our full what-to-wear guide for the complete breakdown.`,
  });

  // Other upcoming shows: 3 nearest future dates, excluding this one
  const today = new Date().toISOString().slice(0, 10);
  const otherUpcoming = getAllTourDates()
    .filter((t) => t.id !== d.id && t.date >= today)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <MusicEventSchema d={d} url={pageUrl} />

      <BreadcrumbSchema items={breadcrumbItems} />

      {faqItems.length > 0 && <FaqSchema items={faqItems} />}

      {/* Breadcrumb */}
      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/tour" className="hover:text-primary">&larr; All tour dates</Link>
      </nav>

      {/* Hero */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm text-clay uppercase tracking-wider font-medium">
          <Calendar className="w-4 h-4" />
          {formatDate(d.date, "long")}
          {d.soldOut && (
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

      {/* Ticket CTA */}
      <section className="bg-primary/15 border-2 border-primary rounded-lg p-5 mb-6">
        <p className="text-xs uppercase tracking-wider text-denim font-medium mb-1">
          {/* Strip a leading "Resale " from the price range so we do not get RESALE Resale price. */}
          {d.soldOut ? "RESALE" : "TICKETS"} · {d.ticketPriceRange.replace(/^Resale\s+/i, "")}
        </p>
        <h2 className="font-display text-2xl text-denim">Grab tickets</h2>
        <p className="text-sm text-ink/80 mt-1 mb-4">
          {d.soldOut
            ? "Sold out at face value. Resale starts around the price range above and climbs as the show approaches."
            : "Buy direct or check the secondary market for better seat options."}
        </p>
        <div className="flex flex-wrap gap-2">
          <AffiliateLink href={seatGeekUrl} source="seatgeek" className="inline-flex items-center gap-2 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90">
            <Ticket className="w-4 h-4" /> SEATGEEK
          </AffiliateLink>
          {tmUrl && (
            <AffiliateLink href={tmUrl} source="ticketmaster" className="inline-flex items-center gap-2 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90">
              <Ticket className="w-4 h-4" /> TICKETMASTER
            </AffiliateLink>
          )}
          <AffiliateLink href={tixUrl} source="tickpick" className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink/10 text-denim font-display tracking-wide rounded-md hover:bg-ink/20 border border-ink/20">
            <Ticket className="w-4 h-4" /> TICKPICK
          </AffiliateLink>
          <AffiliateLink href={vividUrl} source="vivid" className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink/10 text-denim font-display tracking-wide rounded-md hover:bg-ink/20 border border-ink/20">
            <Ticket className="w-4 h-4" /> VIVID SEATS
          </AffiliateLink>
        </div>
        <p className="text-xs text-ink/50 mt-3">
          Tip: SeatGeek usually has the most listings for {d.tourType === "support" ? `${d.headliner ?? "this tour"}` : "Ella"}&apos;s shows. Resale prices on TickPick &amp; Vivid Seats are often lower for sold-out dates.
        </p>
      </section>

      {/* Venue Info */}
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
                {d.doorsTime && <>Doors {formatTime(d.doorsTime)}</>}
                {d.doorsTime && d.showTime && " · "}
                {d.showTime && <>Show {formatTime(d.showTime)}</>}
              </span>
            </li>
          )}
        </ul>
      </section>

      {/* Openers */}
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

      {/* Hotels */}
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

      {/* Concert gear (Amazon affiliate) */}
      <ConcertGearWidget
        show={{ venue: d.venue, venueCapacity: d.venueCapacity }}
      />

      {/* What to wear */}
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

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="mb-8 mt-2 pt-6 border-t border-ink/10">
          <h2 className="font-display text-2xl text-denim mb-4">FREQUENTLY ASKED QUESTIONS</h2>
          <div className="space-y-3">
            {faqItems.map((f, i) => (
              <div key={i} className="bg-paper border border-ink/10 rounded-lg p-4">
                <h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3>
                <p className="text-sm text-ink/80 leading-relaxed mt-1.5">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other upcoming shows */}
      {otherUpcoming.length > 0 && (
        <section className="mt-10 pt-8 border-t border-ink/10">
          <h2 className="font-display text-2xl text-denim mb-5">OTHER UPCOMING SHOWS</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {otherUpcoming.map((t) => (
              <Link
                key={t.id}
                href={`/tour/${t.id}`}
                className="block bg-paper border border-ink/10 rounded-lg p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <p className="text-xs text-clay uppercase tracking-wider font-medium mb-1">
                  {formatDate(t.date, "short")}
                </p>
                <p className="font-display text-base text-denim leading-snug">
                  {t.city}, {t.state}
                </p>
                <p className="text-sm text-ink/70 mt-0.5">{t.venue}</p>
                {t.soldOut && (
                  <span className="inline-block mt-1.5 text-xs font-bold text-clay">SOLD OUT (FACE)</span>
                )}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link href="/tour" className="text-primary hover:underline">
              See all tour dates &rarr;
            </Link>
          </p>
        </section>
      )}

      <AffiliateDisclosure />
    </article>
  );
}

