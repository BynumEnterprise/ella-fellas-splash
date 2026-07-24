import { AffiliateLink } from "@/components/AffiliateLink";
import { PlanYourTrip } from "@/components/PlanYourTrip";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { shopUrl } from "@/lib/merch-store";
import { getTourDate } from "@/lib/data";
import { Ticket, ShoppingBag } from "lucide-react";

interface Props {
  /** TourDate.id — deep-links tickets to the exact event and powers the trip
   *  planner. Omit for evergreen posts; tickets fall back to the Ella Langley
   *  performer page and the trip module is hidden. */
  showId?: string;
  /** GA4 source prefix for this placement, e.g. "guide" or "news". */
  source: string;
}

/**
 * High-intent affiliate block for show-related content (set-times guides,
 * tour-prep news). Tickets (TicketNetwork / CJ) + Shop Ella Fellas merch up top,
 * then the full Plan Your Trip module (stay / rental car / flights / venue map)
 * whenever the show resolves. All links tracked via AffiliateLink and the store
 * UTM helper.
 */
export function ShowCTA({ showId, source }: Props) {
  const td = showId ? getTourDate(showId) : undefined;
  const tnUrl = ticketNetworkUrl(showId);

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
