import Link from "next/link";
import { Ticket } from "lucide-react";
import { AffiliateLink } from "@/components/AffiliateLink";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { getNextShow, isCanceled } from "@/lib/data";
import type { TourDate } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface Props {
  d: TourDate;
  /** GA4 link_source prefix for this placement, e.g. "setlist" or "set-times". */
  source: string;
  className?: string;
}

/**
 * Compact, above-the-fold ticket bar for per-show templates (setlist, set times).
 * - Upcoming, not canceled: TicketNetwork deep link for THIS show.
 * - Past or canceled: points at the NEXT show that is still on, so the page
 *   still has a useful, attributable CTA instead of a dead end.
 * link_source values: `${source}-tickets-top` and `${source}-next-show-tickets`.
 */
export function ShowTicketCTA({ d, source, className = "" }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = d.date >= today && !isCanceled(d);

  if (upcoming) {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-3 bg-primary/15 border-2 border-primary rounded-lg p-4 ${className}`}
      >
        <div>
          <p className="text-xs uppercase tracking-wider text-denim font-medium">
            {d.soldOut ? "Sold out at face value · resale" : "Tickets"} &middot; {d.city}, {formatDate(d.date, "short")}
          </p>
          <p className="text-sm text-ink/80">
            Still going? Check live seats for {d.venue} before prices move.
          </p>
        </div>
        <AffiliateLink
          href={ticketNetworkUrl(d.id)}
          source={`${source}-tickets-top`}
          ariaLabel={`Get tickets for Ella Langley in ${d.city} on TicketNetwork`}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md shadow-sm hover:bg-primary/90"
        >
          <Ticket className="w-5 h-5" aria-hidden="true" /> {d.soldOut ? "FIND RESALE TICKETS" : "GET TICKETS"}
        </AffiliateLink>
      </div>
    );
  }

  const next = getNextShow(today);
  if (!next) return null;
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 bg-primary/10 border-2 border-primary/50 rounded-lg p-4 ${className}`}
    >
      <div>
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Next Ella Langley show</p>
        <p className="font-display text-xl text-denim leading-tight">
          {next.city}, {next.state} &middot; {formatDate(next.date, "long")}
        </p>
        <p className="text-sm text-ink/70">
          {next.venue} &middot;{" "}
          <Link href={`/tour/${next.id}`} className="underline hover:text-primary">
            show guide
          </Link>
        </p>
      </div>
      <AffiliateLink
        href={ticketNetworkUrl(next.id)}
        source={`${source}-next-show-tickets`}
        ariaLabel={`Get tickets for Ella Langley in ${next.city} on TicketNetwork`}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md shadow-sm hover:bg-primary/90"
      >
        <Ticket className="w-5 h-5" aria-hidden="true" /> {next.soldOut ? "FIND RESALE TICKETS" : "GET TICKETS"}
      </AffiliateLink>
    </div>
  );
}
