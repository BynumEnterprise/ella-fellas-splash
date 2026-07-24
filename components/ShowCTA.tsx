import Link from "next/link";
import { Ticket, ShoppingBag } from "lucide-react";
import { AffiliateLink } from "@/components/AffiliateLink";
import { PlanYourTrip } from "@/components/PlanYourTrip";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { shopUrl } from "@/lib/merch-store";
import { getAllTourDates, getTourDate } from "@/lib/data";
import type { TourDate } from "@/lib/types";

interface Props {
  /** Explicit TourDate.id from frontmatter — always wins when present. */
  showId?: string;
  /** Post title + slug, used to auto-resolve the show when showId is absent. */
  title?: string;
  slug?: string;
  /** GA4 source prefix for this placement, e.g. "guide" or "news". */
  source: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolve which show a post is about. Explicit frontmatter showId wins. Otherwise
 * we only auto-match when it is unambiguous: the post text must name an UPCOMING
 * show's city, and if that city has more than one upcoming date the venue must be
 * named too. No match => no trip module (we never guess a show).
 */
function resolveShow(showId?: string, title?: string, slug?: string): TourDate | undefined {
  const today = new Date().toISOString().slice(0, 10);

  if (showId) {
    const d = getTourDate(showId);
    // A past show gets no trip planner and no dead event deep-link.
    return d && d.date >= today ? d : undefined;
  }

  const hay = `${slugify(title ?? "")}-${slug ?? ""}`;
  const upcoming = getAllTourDates().filter((d) => d.date >= today);
  const byCity = upcoming.filter((d) => hay.includes(slugify(d.city)));

  if (byCity.length === 1) return byCity[0];
  if (byCity.length > 1) {
    const withVenue = byCity.filter((d) =>
      slugify(d.venue)
        .split("-")
        .some((tok) => tok.length >= 4 && hay.includes(tok)),
    );
    if (withVenue.length === 1) return withVenue[0];
  }
  return undefined;
}

/**
 * High-intent affiliate block for show-related content (set-times guides,
 * tour-prep news). Tickets (TicketNetwork / CJ) + Shop Ella Fellas merch up top,
 * then the full Plan Your Trip module (stay / rental car / flights / venue map)
 * whenever we can pin the post to a specific upcoming show.
 */
export function ShowCTA({ showId, title, slug, source }: Props) {
  const td = resolveShow(showId, title, slug);
  // Deep-link to the exact event only when we resolved an upcoming show;
  // otherwise fall back to the Ella Langley performer page.
  const tnUrl = ticketNetworkUrl(td?.id);

  return (
    <div className="mb-8">
      <section className="bg-paper border-2 border-primary/40 rounded-lg p-5">
        <p className="text-xs uppercase tracking-wider text-clay font-medium mb-1">
          GOING TO THE SHOW?
        </p>
        <h2 className="font-display text-2xl text-denim">
          {td ? `Get ready for ${td.city}` : "Get ready for the show"}
        </h2>
        <p className="text-sm text-ink/80 mt-1 mb-4">
          Lock in tickets before prices move, then gear up &mdash; and if you&apos;re
          travelling in, sort your stay and ride below.
        </p>
        <div className="flex flex-wrap gap-3">
          <AffiliateLink
            href={tnUrl}
            source="ticketnetwork"
            ariaLabel="Get tickets on TicketNetwork"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md shadow-sm hover:bg-primary/90"
          >
            <Ticket className="w-5 h-5" /> GET TICKETS
          </AffiliateLink>
          <AffiliateLink
            href={shopUrl("/", `${source}_show_cta_merch`)}
            source={`${source}_show_cta_merch`}
            ariaLabel="Shop unofficial Ella Fellas merch"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-denim text-paper font-display text-lg tracking-wide rounded-md hover:bg-denim/90"
          >
            <ShoppingBag className="w-5 h-5" /> SHOP ELLA FELLAS
          </AffiliateLink>
        </div>
        {td && (
          <p className="text-xs text-ink/60 mt-3">
            Going to {td.city}?{" "}
            <Link href={`/tour/${td.id}`} className="underline hover:text-primary">
              Full show page &rarr;
            </Link>
          </p>
        )}
      </section>

      {td && (
        <div className="mt-6">
          <PlanYourTrip
            city={td.city}
            cityState={`${td.city}, ${td.state}`}
            venue={td.venue}
            venueAddress={td.venueAddress}
            date={td.date}
          />
        </div>
      )}
    </div>
  );
}
