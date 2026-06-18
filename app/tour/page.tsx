import type { Metadata } from "next";
import { getAllTourDates } from "@/lib/data";
import { TourCard } from "@/components/TourCard";

export const metadata: Metadata = {
  title: { absolute: "Ella Langley Tour 2026: Dates, Cities & Tickets | Ella Fellas" },
  description:
    "Every 2026 Ella Langley tour date: the Dandelion headlining tour, Morgan Wallen stadium support dates, and festivals — with tickets, set times & city guides.",
  alternates: { canonical: "/tour" },
  openGraph: { url: "/tour", images: ["/opengraph-image.png"] },
};

export default function TourIndexPage() {
  // Hide shows whose date is in the past — fans don't want to see Toledo May 7
  // on their screen in late May. Per-show /tour/[slug] pages still render so
  // historical SEO / inbound links keep working.
  const today = new Date().toISOString().slice(0, 10);
  const allDates = getAllTourDates();
  const dates = allDates.filter((d) => d.date >= today);
  const headlining = dates.filter((d) => d.tourType === "headlining");
  const support = dates.filter((d) => d.tourType === "support");
  const festival = dates.filter((d) => d.tourType === "festival");

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ella Langley Tour Dates 2026",
    description: "All confirmed Ella Langley tour stops for the 2026 Dandelion tour, Morgan Wallen support dates, and festival appearances.",
    numberOfItems: allDates.length,
    itemListElement: allDates
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
        <h1 className="font-display text-4xl md:text-5xl text-denim">ELLA LANGLEY TOUR 2026</h1>
        <p className="text-ink/80 mt-3">
          {headlining.length} headlining + {support.length} Morgan Wallen support + {festival.length} festivals.
          Tap any date for venue info, openers, hotels nearby, and tickets.
        </p>
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
    </article>
  );
}
