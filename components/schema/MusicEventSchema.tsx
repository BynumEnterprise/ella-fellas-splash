import type { TourDate } from "@/lib/types";

export function MusicEventSchema({ d, url }: { d: TourDate; url: string }) {
  const performers: { "@type": string; name: string }[] = [
    { "@type": "MusicGroup", name: d.headliner ?? "Ella Langley" },
  ];
  if (d.tourType !== "support") {
    performers.push({ "@type": "MusicGroup", name: "Ella Langley" });
    d.openers.forEach((o) => performers.push({ "@type": "MusicGroup", name: o }));
  }

  const json: any = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `Ella Langley — ${d.tour}, ${d.city}`,
    startDate: `${d.date}T${(d.showTime ?? "19:30").padStart(5, "0")}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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
    offers: {
      "@type": "Offer",
      url,
      priceRange: d.ticketPriceRange,
      availability: d.soldOut
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
