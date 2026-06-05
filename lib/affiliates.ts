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

// Verified performer landing pages used as the fallback when no per-event deep
// link exists for a show on that platform. These list every Ella tour date.
const TICKPICK_PERFORMER = "https://www.tickpick.com/concerts/ella-langley-tickets/";
const SEATGEEK_PERFORMER = "https://seatgeek.com/ella-langley-tickets";
const VIVID_PERFORMER = "https://www.vividseats.com/ella-langley-tickets/performer/131263";

/**
 * Verified TickPick event-page URLs keyed by TourDate.id. When a show id matches
 * one of these, we deep-link straight to the event page instead of a search.
 * Every URL below was loaded in a browser and confirmed to show that exact
 * event (matching venue + date with live ticket prices) before being added.
 * TickPick drops past events from listings after they pass.
 */
const KNOWN_TICKPICK_URLS: Record<string, string> = {
  // Keys MUST match TourDate.id in data/tour-dates.json exactly.
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
  "pikeville-appalachian-wireless-arena-2026-07-23":
    "https://www.tickpick.com/buy-ella-langley-tickets-appalachian-wireless-arena-7-23-26-7pm/7715677/",
  "cary-koka-booth-amphitheatre-2026-07-24":
    "https://www.tickpick.com/buy-ella-langley-tickets-koka-booth-amphitheatre-at-regency-park-7-24-26-7pm/7715700/",
  "north-charleston-north-charleston-coliseum-2026-07-25":
    "https://www.tickpick.com/buy-ella-langley-tickets-north-charleston-coliseum-7-25-26-7pm/7715678/",
  "gilford-banknh-pavilion-2026-07-30":
    "https://www.tickpick.com/buy-ella-langley-tickets-bank-of-new-hampshire-pavilion-7-30-26-7pm/7715679/",
  "canandaigua-cmac-2026-07-31":
    "https://www.tickpick.com/buy-ella-langley-tickets-constellation-brands-marvin-sands-performing-arts-center-7-31-26-7pm/7715689/",
  "austin-moody-center-2026-08-13":
    "https://www.tickpick.com/buy-ella-langley-tickets-moody-center-atx-8-13-26-7pm/7715690/",
  "corpus-christi-american-bank-center-2026-08-14":
    "https://www.tickpick.com/buy-ella-langley-tickets-hilliard-center-arena-8-14-26-7pm/7715696/",
  "fort-worth-dickies-arena-2026-08-15":
    "https://www.tickpick.com/buy-ella-langley-tickets-dickies-arena-8-15-26-7pm/7715693/",
  // Festivals / Morgan Wallen stadium shows where Ella is on the bill and the
  // date matches our listing (matched by city + date).
  "lexington-railbird-festival-2026-06-07":
    "https://www.tickpick.com/buy-railbird-festival-tyler-childers-zach-top-ella-langley-(time-tbd)-sunday-tickets-the-red-mile-6-7-26-12pm/7509703/",
  "philadelphia-lincoln-financial-field-2026-08-01":
    "https://www.tickpick.com/buy-morgan-wallen-ella-langley-hudson-westbrook-blake-whiten-tickets-lincoln-financial-field-8-1-26-5pm/7529811/",
  "pittsburgh-acrisure-stadium-2026-06-06":
    "https://www.tickpick.com/buy-morgan-wallen-ella-langley-gavin-adcock-zach-john-king-tickets-acrisure-stadium-6-6-26-5pm/7529803/",
};

/**
 * Verified SeatGeek event-page URLs keyed by TourDate.id. Confirmed in a browser
 * (page title matches venue + date). SeatGeek slugs are self-describing.
 */
const KNOWN_SEATGEEK_URLS: Record<string, string> = {
  "oklahoma-city-zoo-amphitheatre-2026-06-18":
    "https://seatgeek.com/ella-langley-tickets/oklahoma-city-oklahoma-the-zoo-amphitheatre-2026-06-18-7-pm/concert/18046778",
  "independence-cable-dahmer-arena-2026-06-19":
    "https://seatgeek.com/ella-langley-tickets/independence-missouri-cable-dahmer-arena-2026-06-19-7-pm/concert/18046779",
  "salem-salem-civic-center-2026-06-25":
    "https://seatgeek.com/ella-langley-tickets/salem-virginia-salem-civic-center-2026-06-25-7-pm/concert/18046788",
  "wilmington-live-oak-bank-pavilion-2026-06-26":
    "https://seatgeek.com/ella-langley-tickets/wilmington-north-carolina-live-oak-bank-pavilion-2026-06-26-7-pm/concert/18046789",
  "pikeville-appalachian-wireless-arena-2026-07-23":
    "https://seatgeek.com/ella-langley-tickets/pikeville-kentucky-appalachian-wireless-arena-2026-07-23-7-pm/concert/18046790",
  "cary-koka-booth-amphitheatre-2026-07-24":
    "https://seatgeek.com/ella-langley-tickets/cary-north-carolina-koka-booth-amphitheatre-2026-07-24-7-pm/concert/18046791",
  "north-charleston-north-charleston-coliseum-2026-07-25":
    "https://seatgeek.com/ella-langley-tickets/north-charleston-south-carolina-north-charleston-coliseum-2026-07-25-7-pm/concert/18046796",
  "gilford-banknh-pavilion-2026-07-30":
    "https://seatgeek.com/ella-langley-tickets/gilford-new-hampshire-banknh-pavilion-2026-07-30-7-pm/concert/18046798",
  "canandaigua-cmac-2026-07-31":
    "https://seatgeek.com/ella-langley-tickets/canandaigua-new-york-constellation-brands-marvin-sands-performing-arts-center-cmac-2026-07-31-7-pm/concert/18046800",
  "austin-moody-center-2026-08-13":
    "https://seatgeek.com/ella-langley-tickets/austin-texas-moody-center-atx-2026-08-13-7-pm/concert/18046801",
  "corpus-christi-american-bank-center-2026-08-14":
    "https://seatgeek.com/ella-langley-tickets/corpus-christi-texas-hilliard-center-arena-2026-08-14-7-pm/concert/18046802",
  "fort-worth-dickies-arena-2026-08-15":
    "https://seatgeek.com/ella-langley-tickets/fort-worth-texas-dickies-arena-2026-08-15-7-pm/concert/18046804",
  // Morgan Wallen stadium show with Ella on the bill, date matches our listing.
  "philadelphia-lincoln-financial-field-2026-08-01":
    "https://seatgeek.com/morgan-wallen-tickets/philadelphia-pennsylvania-lincoln-financial-field-2026-08-01-5-30-pm/concert/17873143",
  "pittsburgh-acrisure-stadium-2026-06-06":
    "https://seatgeek.com/morgan-wallen-tickets/pittsburgh-pennsylvania-acrisure-stadium-2026-06-06-5-30-pm/concert/17873127",
};

/**
 * Verified Vivid Seats event-page URLs keyed by TourDate.id. Confirmed in a
 * browser (venue + date match). NOTE: Vivid currently lists Ella's HEADLINE
 * tour stops one month later than our dates (e.g. Aug shows appear under Sept),
 * so those have no reliable per-event match and fall back to the performer page
 * to avoid sending fans to a wrong-date page. Only festival / Morgan Wallen
 * dates that match exactly are deep-linked here.
 */
const KNOWN_VIVID_URLS: Record<string, string> = {
  "lexington-railbird-festival-2026-06-07":
    "https://www.vividseats.com/railbird-festival-tickets-lexington-the-red-mile-6-7-2026--concerts-music-festivals/production/6163370",
  "philadelphia-lincoln-financial-field-2026-08-01":
    "https://www.vividseats.com/morgan-wallen-tickets-philadelphia-lincoln-financial-field-8-1-2026--concerts-country-and-folk/production/6207826",
  "pittsburgh-acrisure-stadium-2026-06-06":
    "https://www.vividseats.com/morgan-wallen-tickets-pittsburgh-acrisure-stadium-6-6-2026--concerts-country-and-folk/production/6207811",
};

/**
 * Build an affiliate ticket URL for a specific source.
 *
 * Resolution order for each source:
 *   1. explicit per-show override in ctx.direct
 *   2. the source's KNOWN_* deep link keyed by ctx.id (direct event page)
 *   3. the verified performer landing page for that source (safe fallback)
 *
 * Passing the full TicketEventContext (with `id`) is REQUIRED for deep links to
 * fire. A prior version called this with a bare query string, so ctx.id was
 * undefined and every show fell back to the performer page.
 */
export function ticketUrl(input: string | TicketEventContext, source: TicketSource = "seatgeek"): string {
  const ctx: TicketEventContext = typeof input === "string" ? { query: input } : input;

  // 1. Honor explicit per-show override
  if (ctx.direct?.[source]) return ctx.direct[source]!;

  // 2. Per-source verified deep link keyed by show id
  if (ctx.id) {
    if (source === "tickpick" && KNOWN_TICKPICK_URLS[ctx.id]) return KNOWN_TICKPICK_URLS[ctx.id];
    if (source === "seatgeek" && KNOWN_SEATGEEK_URLS[ctx.id]) return KNOWN_SEATGEEK_URLS[ctx.id];
    if (source === "vivid" && KNOWN_VIVID_URLS[ctx.id]) return KNOWN_VIVID_URLS[ctx.id];
  }

  const q = encodeURIComponent(ctx.query);

  // 3. Fallbacks
  switch (source) {
    case "tickpick":
      // Performer landing page (lists every tour date) - TickPick search returns
      // irrelevant matches, so prefer the artist page.
      return `${TICKPICK_PERFORMER}${IDS.tickpick ? `?aff=${IDS.tickpick}` : ""}`;
    case "seatgeek":
      // Performer landing page rather than generic search.
      return `${SEATGEEK_PERFORMER}${IDS.seatgeek ? `?aid=${IDS.seatgeek}` : ""}`;
    case "vivid":
      // Performer landing page rather than generic search.
      return `${VIVID_PERFORMER}${IDS.vivid ? `?aff=${IDS.vivid}` : ""}`;
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
