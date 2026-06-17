import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Compass,
  Home,
  Navigation,
  Ticket,
  Utensils,
} from "lucide-react";
import { getAllTourDates } from "@/lib/data";
import { AffiliateLink } from "@/components/AffiliateLink";
import { vrboUrl, viatorUrl, getYourGuideUrl } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "Plan Your Trip to an Ella Langley Show (2026)",
  description:
    "Plan your Ella Langley concert trip: an interactive map for every venue, where to eat and drink nearby, things to do in each tour city, and where to stay — for every 2026 show.",
  alternates: { canonical: "/plan-your-trip" },
  openGraph: { url: "/plan-your-trip" },
};

const GMAPS = "https://www.google.com/maps/search/?api=1&query=";

const primaryBtn =
  "inline-flex items-center gap-2 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90";
const chip =
  "inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-paper border border-ink/20 rounded-full text-denim hover:bg-ink/10";

function formatDate(d: string): string {
  return new Date(`${d}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PlanYourTripHubPage() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = getAllTourDates().filter((d) => d.date >= today);
  const experiencesHref = viatorUrl() ?? getYourGuideUrl();

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-clay font-medium mb-1">
          PLAN YOUR TRIP
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-denim">
          PLAN YOUR ELLA LANGLEY CONCERT TRIP
        </h1>
        <p className="text-ink/80 mt-3 max-w-2xl">
          Going to an Ella Langley show in 2026? Here is everything you need to turn one
          night into a great trip — an interactive map for every venue, where to eat and
          drink nearby, things to do in each city, and where to stay so you are not
          fighting post-show traffic. Pick your show below to open its full planner.
        </p>
      </header>

      <section className="mb-10 grid gap-3 sm:grid-cols-3">
        <div className="border border-ink/15 rounded-lg p-4 bg-paper">
          <MapPin className="w-6 h-6 text-denim mb-2" />
          <h2 className="font-display text-lg text-denim">Maps &amp; directions</h2>
          <p className="text-sm text-ink/70 mt-1">
            An interactive map and driving directions for every venue on the tour.
          </p>
        </div>
        <div className="border border-ink/15 rounded-lg p-4 bg-paper">
          <Utensils className="w-6 h-6 text-denim mb-2" />
          <h2 className="font-display text-lg text-denim">Eat, drink &amp; explore</h2>
          <p className="text-sm text-ink/70 mt-1">
            Restaurants, bars and honky-tonks, coffee, and things to do in each tour city.
          </p>
        </div>
        <div className="border border-ink/15 rounded-lg p-4 bg-paper">
          <Home className="w-6 h-6 text-denim mb-2" />
          <h2 className="font-display text-lg text-denim">Where to stay</h2>
          <p className="text-sm text-ink/70 mt-1">
            Vacation rentals and hotels close to the venue, so the night ends easy.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-2xl text-denim mb-4">PICK YOUR SHOW</h2>
        {upcoming.length === 0 ? (
          <p className="text-ink/70">
            No upcoming shows are on the calendar right now — check the{" "}
            <Link href="/tour" className="underline text-denim">
              full tour schedule
            </Link>{" "}
            for the latest dates.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {upcoming.map((d) => {
              const where = `${d.city}, ${d.state}`;
              const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                [d.venue, d.venueAddress, where].filter(Boolean).join(", "),
              )}`;
              return (
                <div
                  key={d.id}
                  className="border border-ink/15 rounded-lg p-4 bg-paper flex flex-col"
                >
                  <p className="text-xs uppercase tracking-wider text-clay">
                    {formatDate(d.date)}
                  </p>
                  <h3 className="font-display text-xl text-denim leading-tight mt-0.5">
                    {d.city}, {d.state}
                  </h3>
                  <p className="text-sm text-ink/70">{d.venue}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link href={`/tour/${d.id}`} className={primaryBtn}>
                      <MapPin className="w-4 h-4" /> Plan this trip
                    </Link>
                    {experiencesHref ? (
                      <AffiliateLink
                        href={experiencesHref}
                        source="things-to-do"
                        className={chip}
                      >
                        <Compass className="w-4 h-4" /> Things to do
                      </AffiliateLink>
                    ) : (
                      <a
                        href={GMAPS + encodeURIComponent(`things to do in ${where}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={chip}
                      >
                        <Compass className="w-4 h-4" /> Things to do
                      </a>
                    )}
                    <AffiliateLink
                      href={vrboUrl(where)}
                      source="vrbo"
                      ariaLabel={`Find a place to stay in ${d.city}`}
                      className={chip}
                    >
                      <Home className="w-4 h-4" /> Where to stay
                    </AffiliateLink>
                    <a
                      href={directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={chip}
                    >
                      <Navigation className="w-4 h-4" /> Directions
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-8 bg-paper border-2 border-primary/40 rounded-lg p-5">
        <h2 className="font-display text-2xl text-denim mb-2">GO DEEPER</h2>
        <p className="text-ink/80">
          Want the full playbook? Read{" "}
          <Link
            href="/guides/traveling-to-an-ella-langley-show"
            className="underline text-denim"
          >
            Traveling to an Ella Langley show
          </Link>{" "}
          for how to book, when to arrive, and how to do a concert weekend right. Need
          tickets first? Every date and on-sale link lives on the{" "}
          <Link href="/tour" className="underline text-denim">
            2026 tour page
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/tour" className={primaryBtn}>
            <Ticket className="w-4 h-4" /> See all tour dates
          </Link>
          <Link href="/guides" className={chip}>
            <Compass className="w-4 h-4" /> All fan guides
          </Link>
        </div>
      </section>

      <p className="text-xs italic text-ink/60">
        Some links here are affiliate links — we may earn a commission at no extra cost to
        you. Maps, directions, and the &quot;near the venue&quot; results are free Google
        Maps searches. Ella Fellas is an independent fan site and is not affiliated with
        Ella Langley.
      </p>
    </article>
  );
}
