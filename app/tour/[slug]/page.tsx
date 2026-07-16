import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { getAllTourDates, getTourDate } from "@/lib/data";
import { AffiliateLink } from "@/components/AffiliateLink";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { PlanYourTrip } from "@/components/PlanYourTrip";
import { MusicEventSchema } from "@/components/schema/MusicEventSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { formatDate } from "@/lib/utils";
import { buildNightPlan, findStandSiblings } from "@/lib/night-plan";
import { NightPlanView } from "@/components/NightPlan";

export async function generateStaticParams() {
  return getAllTourDates().map((d) => ({ slug: d.id }));
}

/** "18:00" -> "6:00 PM". Falls back to the raw string if it isn't HH:MM. */
function to12h(t?: string): string | undefined {
  if (!t) return undefined;
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return t;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${min} ${ampm}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getTourDate(slug);
  if (!d) return {};
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const canonical = `${SITE_URL}/tour/${d.id}`;
  // Include the date so two-night stands (e.g. Auburn Aug 28 + 29) don't produce identical titles.
  const title = `Ella Langley ${d.city} ${formatDate(d.date, "short")}: Tickets & Set Times | Ella Fellas`;
  const ogImage = `/api/og?title=${encodeURIComponent(`Ella Langley in ${d.city}`)}&kicker=${encodeURIComponent(`${formatDate(d.date, "short")} · ${d.venue}`)}`;
  const description = `Ella Langley at ${d.venue}, ${d.city} — ${formatDate(d.date, "long")}. Tickets, parking, hotels, and openers.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "article", images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function TourStopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getTourDate(slug);
  if (!d) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const pageUrl = `${SITE_URL}/tour/${d.id}`;
  // Past-show handling matches getUpcomingTourDates() in lib/data.ts (date >= today).
  const today = new Date().toISOString().slice(0, 10);
  const isPast = d.date < today;
  // TicketNetwork (CJ, 12.5%) — the SOLE ticket CTA for every show
  // (headline, support and stadium dates all use this one affiliate link).
  const tnUrl = ticketNetworkUrl(d.id);

  // Build-time night plan — deterministic, grounded in this show's own data, and
  // server-rendered so it's indexable and instant on mobile.
  const plan = buildNightPlan(d);
  const siblings = findStandSiblings(d, getAllTourDates());

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Tour", url: `${SITE_URL}/tour` },
          { name: `Ella Langley in ${d.city}, ${d.state}`, url: pageUrl },
        ]}
      />
      <MusicEventSchema d={d} url={pageUrl} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/tour" className="hover:text-primary">&larr; All tour dates</Link>
      </nav>

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

      {isPast ? (
        <section className="bg-denim/5 border-2 border-denim/25 rounded-lg p-5 mb-6">
          <p className="text-xs uppercase tracking-wider text-denim font-medium mb-1">
            THIS SHOW HAS ALREADY HAPPENED
          </p>
          <h2 className="font-display text-2xl text-denim">
            {formatDate(d.date, "long")} is in the books
          </h2>
          <p className="text-sm text-ink/80 mt-1 mb-4">
            Tickets for this date are long gone &mdash; but Ella is on the road through October.
            Find the next show near you, or read what she played on this run.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/tour" className="inline-flex items-center justify-center px-5 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md shadow-sm hover:bg-primary/90">
              SEE UPCOMING SHOWS &rarr;
            </Link>
            <Link href="/guides/ella-langley-setlist-2026" className="inline-flex items-center justify-center px-5 py-3 border-2 border-denim/30 text-denim font-display text-lg tracking-wide rounded-md hover:border-primary hover:text-primary">
              WHAT SHE PLAYED
            </Link>
          </div>
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
        {/* Primary, highest-paying CTA: TicketNetwork (CJ, 12.5%). */}
        <AffiliateLink href={tnUrl} source="ticketnetwork" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-primary text-paper font-display text-lg tracking-wide rounded-md shadow-sm hover:bg-primary/90">
          <span aria-hidden="true">🎟</span> GET TICKETS ON TICKETNETWORK
        </AffiliateLink>
        <p className="text-xs text-ink/50 mt-3">
          TicketNetwork lists seats for {d.tourType === "support" ? `${d.headliner ?? "this tour"}` : "Ella"}&apos;s shows with buyer-guaranteed resale &mdash; browse the full price range before you buy.
        </p>
        <p className="text-sm text-ink/70 mt-3">
          Not sure where to sit? Read our{" "}
          <Link href="/guides/best-seats-ella-langley-concert" className="underline text-denim hover:text-primary">best seats for an Ella Langley concert</Link>{" "}
          guide before you pick.
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
                {d.doorsTime && <>Doors {to12h(d.doorsTime)}</>}
                {d.doorsTime && d.showTime && " · "}
                {d.showTime && <>Show {to12h(d.showTime)}</>}
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

      {/* Which night? — two-night stands (Baltimore, Auburn, LA Greek) */}
      {siblings.length > 0 && (
        <section className="mb-8 bg-primary/10 border-2 border-primary/40 rounded-lg p-5">
          <h2 className="font-display text-xl text-denim tracking-wide mb-2">
            WHICH NIGHT SHOULD YOU GO?
          </h2>
          <p className="text-sm text-ink/80 mb-3">
            {d.venue} has more than one night on this run, and the bills can differ &mdash; check your
            ticket before you plan around it.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="font-semibold text-denim">
              {formatDate(d.date, "long")} &mdash; this page
              {d.openers.length > 0 && <span className="font-normal text-ink/75"> &middot; {d.openers.join(", ")}</span>}
            </li>
            {siblings.map((s2) => (
              <li key={s2.id}>
                <Link href={`/tour/${s2.id}`} className="font-semibold text-denim underline underline-offset-2 hover:text-primary">
                  {formatDate(s2.date, "long")}
                </Link>
                {s2.openers.length > 0 && <span className="text-ink/75"> &middot; {s2.openers.join(", ")}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Night plan — build-time, indexable */}
      <section className="mb-8 bg-paper border border-ink/15 rounded-lg p-5">
        <NightPlanView plan={plan} />
        {!isPast && (
          <Link
            href={`/plan?show=${d.id}`}
            className="mt-5 inline-flex items-center gap-2 px-5 py-3 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90"
          >
            BUILD MY PERSONALIZED PLAN &rarr;
          </Link>
        )}
      </section>

      {!isPast && (
        <PlanYourTrip
          city={d.city}
          cityState={`${d.city}, ${d.state}`}
          venue={d.venue}
          venueAddress={d.venueAddress}
          date={d.date}
        />
      )}

      {/* Gear now lives in the night plan above (context-aware: clear bag only at stadiums,
          poncho only outdoors, layers only when it is cold) — one packing list, not two. */}

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
