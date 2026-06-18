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

  const offers: any = {
    "@type": "Offer",
    url,
    availability: d.soldOut
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock",
    priceRange: d.ticketPriceRange,
  };
  if (prices.length) {
    offers.priceCurrency = "USD";
    offers.lowPrice = String(Math.min(...prices));
    offers.highPrice = String(Math.max(...prices));
  }

  const json: any = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `Ella Langley \u2014 ${d.tour}, ${d.city}`,
    startDate: `${d.date}T${(d.showTime ?? "19:30").padStart(5, "0")}`,
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
