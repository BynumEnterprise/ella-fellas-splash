export type TicketSource = "tickpick" | "vivid" | "seatgeek" | "stubhub" | "ticketmaster";

const IDS = {
  tickpick: process.env.NEXT_PUBLIC_TICKPICK_AFFILIATE_ID ?? "",
  vivid: process.env.NEXT_PUBLIC_VIVID_AFFILIATE_ID ?? "",
  seatgeek: process.env.NEXT_PUBLIC_SEATGEEK_AFFILIATE_ID ?? "",
  stubhub: process.env.NEXT_PUBLIC_STUBHUB_AFFILIATE_ID ?? "",
  ticketmaster: process.env.NEXT_PUBLIC_TICKETMASTER_AFFILIATE_ID ?? "",
  amazon: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG ?? "ellafellas-20",
  booking: process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID ?? "",
};

/** Optional per-show explicit ticket URLs (overrides search). Maps show id -> source -> URL. */
interface DirectTicketLinks {
  tickpick?: string;
  vivid?: string;
  seatgeek?: string;
  stubhub?: string;
  ticketmaster?: string;
}

export interface TicketEventContext {
  query: string;            // primary search query (use eventQuery())
  id?: string;              // show id (matches TourDate.id) - enables KNOWN_* deep-link lookup
  date?: string;            // YYYY-MM-DD for date-narrowed search
  venue?: string;           // venue name for venue search
  city?: string;            // city name
  direct?: DirectTicketLinks; // per-show overrides
}

/**
 * Verified TickPick event-page URLs keyed by TourDate.id. When a show id matches
 * one of these, we deep-link straight to the event page instead of a search.
 * Add new entries as URLs are confirmed live on tickpick.com.
 */
const KNOWN_TICKPICK_URLS: Record<string, string> = {
  // Keys MUST match TourDate.id in data/tour-dates.json exactly.
  // Sourced from the TickPick Ella Langley artist page; verify URL still resolves
  // when adding entries - TickPick drops past events from listings after they pass.
  "estero-hertz-arena-2026-05-14":
    "https://www.tickpick.com/buy-ella-langley-tickets-hertz-arena-5-14-26-7pm/7715671/",
  "oklahoma-city-zoo-amphitheatre-2026-06-18":
    "https://www.tickpick.com/buy-ella-langley-tickets-oklahoma-city-zoo-amphitheatre-6-18-26-7pm/7715697/",
  "independence-cable-dahmer-arena-2026-06-19":
    "https://www.tickpick.com/buy-ella-langley-tickets-cable-dahmer-arena-6-19-26-7pm/7715673/",
  "salem-salem-civic-center-2026-06-25":
    "https://www.tickpick.com/buy-ella-langley-tickets-salem-civic-center-6-25-26-7pm/7715674/",
  "wilmington-live-oak-bank-pavilion-2026-06-26":
    "https://www.tickpick.com/buy-ella-langley-tickets-live-oak-bank-pavilion-at-riverfront-park-6-26-26-7pm/7715675/",
  "north-charleston-north-charleston-coliseum-2026-07-25":
    "https://www.tickpick.com/buy-ella-langley-tickets-north-charleston-coliseum-7-25-26-7pm/7715678/",
  "fort-worth-dickies-arena-2026-08-15":
    "https://www.tickpick.com/buy-ella-langley-tickets-dickies-arena-8-15-26-7pm/7715693/",
};

/**
 * Build an affiliate ticket URL for a specific source.
 * Prefers an explicit per-show URL if provided in `direct`. Otherwise builds
 * a search URL using the smartest pattern each provider supports - most use
 * a simpler "{artist} {city}" query than full venue+state which returns 0 hits.
 *
 * Affiliate tracking: for search-result clicks, providers use cookie-based
 * attribution from referral params (aff/aid/irgwc), so the search URL itself
 * carries the tag forward to whichever event the user clicks.
 */
export function ticketUrl(input: string | TicketEventContext, source: TicketSource = "seatgeek"): string {
  const ctx: TicketEventContext = typeof input === "string" ? { query: input } : input;

  // Honor explicit per-show override
  if (ctx.direct?.[source]) return ctx.direct[source]!;

  // For TickPick, prefer a known event-page deep link before any search fallback
  if (source === "tickpick" && ctx.id && KNOWN_TICKPICK_URLS[ctx.id]) {
    return KNOWN_TICKPICK_URLS[ctx.id];
  }

  const q = encodeURIComponent(ctx.query);

  switch (source) {
    case "tickpick":
      // Fall back to the Ella Langley artist landing page (lists every tour date)
      // rather than the generic search results, which returned irrelevant matches.
      return `https://www.tickpick.com/concerts/ella-langley-tickets/${IDS.tickpick ? `?aff=${IDS.tickpick}` : ""}`;
    case "vivid":
      return `https://www.vividseats.com/search?searchTerm=${q}${IDS.vivid ? `&aff=${IDS.vivid}` : ""}`;
    case "seatgeek":
      return `https://seatgeek.com/search?search=${q}${IDS.seatgeek ? `&aid=${IDS.seatgeek}` : ""}`;
    case "stubhub":
      return `https://www.stubhub.com/find/s/?q=${q}${IDS.stubhub ? `&utm_source=${IDS.stubhub}` : ""}`;
    case "ticketmaster":
      return `https://www.ticketmaster.com/search?q=${q}${IDS.ticketmaster ? `&irgwc=1&clickid=${IDS.ticketmaster}` : ""}`;
  }
}

/**
 * Pick the best primary ticket source for a given show.
 * - Ticketmaster for stadium shows on Morgan Wallen tour (primary inventory)
 * - SeatGeek for everything else (best search reliability)
 */
export function primaryTicketSource(d: { tourType?: string; venueCapacity?: number }): TicketSource {
  if (d.tourType === "support" && (d.venueCapacity ?? 0) >= 40000) {
    return "ticketmaster";
  }
  return "seatgeek";
}

export function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${IDS.amazon}`;
}

export function amazonSearchUrl(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${IDS.amazon}`;
}

// Awin publisher ID (used by other affiliate links if needed)
const AWIN_AFFID = "2906263";

export function hotelUrl(city: string): string {
  // Booking.com not currently on Awin US -- bare link until a hotel affiliate program (e.g. Stay22/Expedia) is set up.
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`;
}

