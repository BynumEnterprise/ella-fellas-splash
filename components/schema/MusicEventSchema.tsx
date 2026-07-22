import type { TourDate } from "@/lib/types";

export function MusicEventSchema({ d, url }: { d: TourDate; url: string }) {
  const names = [
    d.headliner ?? "Ella Langley",
    ...(d.tourType !== "support" ? ["Ella Langley", ...d.openers] : []),
  ];
  const performers = [...new Set(names)].map((name) => ({
    "@type": "MusicGroup",
    name,
  }));

  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const prices = (d.ticketPriceRange.replace(/,/g, "").match(/\d+(?:\.\d+)?/g) ?? []).map(Number);

  // Only publish price structured data when the range was researched for THIS
  // date. The tour-wide default ($45-$285) is a placeholder, and emitting it as
  // lowPrice/highPrice tells Google a price we cannot stand behind.
  const offers: any = {
    "@type": "Offer",
    url,
    availability: d.soldOut
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock",
  };
  if (d.pricesConfirmed) {
    offers.priceRange = d.ticketPriceRange;
    if (prices.length) {
      offers.priceCurrency = "USD";
      offers.lowPrice = String(Math.min(...prices));
      offers.highPrice = String(Math.max(...prices));
    }
  }

  const json: any = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `Ella Langley \u2014 ${d.tour}, ${d.city}`,
    // schema.org accepts a plain Date for startDate. When we do not have a
    // confirmed start time we publish the date only rather than asserting a
    // clock time we guessed.
    startDate: d.timesConfirmed && d.showTime
      ? `${d.date}T${d.showTime.padStart(5, "0")}`
      : d.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${SITE}/opengraph-image.png`,
    location: {
      "@type": "Place",
      name: d.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: d.venueAddress,
        addressLocality: d.city,
        addressRegion: d.state,
        addressCountry: "US",
      },
    },
    performer: performers,
    offers,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
