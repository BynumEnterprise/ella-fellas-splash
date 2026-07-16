const IDS = {
  amazon: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG ?? "ellafellas-20",
  booking: process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID ?? "",
};

export function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${IDS.amazon}`;
}

export function amazonSearchUrl(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${IDS.amazon}`;
}

// Awin publisher ID (used by other affiliate links if needed)
const AWIN_AFFID = "2906263";

/**
 * Hotel search for a city.
 *
 * Applied to Booking.com North America on CJ 2026-07-16 (advertiser 7864295,
 * 4% lead, serviceable US/CA) — status: pending advertiser review.
 *
 * The MOMENT it's approved, set NEXT_PUBLIC_AFF_BOOKING_CJ in Vercel to the CJ
 * click base for that program, e.g.
 *   https://www.anrdoezrs.net/click-101760569-<AID>
 * and every hotel link across all tour pages + Plan Your Trip modules starts
 * earning — no code change, no redeploy of logic. Until then this returns the
 * bare (unmonetized) Booking.com link, which still helps the reader.
 *
 * Same CJ deep-link pattern as ticketNetworkUrl()/vrboUrl(): <click-base>?url=<encoded destination>.
 */
export function hotelUrl(city: string): string {
  const dest = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`;
  const clickBase = process.env.NEXT_PUBLIC_AFF_BOOKING_CJ;
  if (clickBase && clickBase.trim()) {
    return `${clickBase.trim()}?url=${encodeURIComponent(dest)}`;
  }
  return dest;
}

// ─────────────────────────────────────────────────────────────────────────────
// TICKETS — TicketNetwork only
// TicketNetwork (CJ, 12.5% commission) is the SOLE ticket source named or linked
// across the site. The CJ click URL deep-links by appending
// ?url=<URL-encoded destination on ticketnetwork.com>.
// ─────────────────────────────────────────────────────────────────────────────

const TICKETNETWORK_CJ_CLICK = "https://www.anrdoezrs.net/click-101760569-12324527";
const TICKETNETWORK_ELLA_LANGLEY = "https://www.ticketnetwork.com/performers/ella-langley-tickets";

/**
 * Verified TicketNetwork event-page URLs keyed by TourDate.id. When a show id
 * matches one of these, the "Get Tickets" CTA deep-links straight to that
 * specific event page instead of the general performer page. Shows not listed
 * here fall back to the performer landing page (TICKETNETWORK_ELLA_LANGLEY).
 */
const KNOWN_TICKETNETWORK_URLS: Record<string, string> = {
  "oklahoma-city-zoo-amphitheatre-2026-06-18": "https://www.ticketnetwork.com/tickets/7715697/ella-langley-tickets-thu-jun-18-2026-oklahoma-city-zoo-amphitheatre",
  "independence-cable-dahmer-arena-2026-06-19": "https://www.ticketnetwork.com/tickets/7715673/ella-langley-tickets-fri-jun-19-2026-cable-dahmer-arena",
  "salem-salem-civic-center-2026-06-25": "https://www.ticketnetwork.com/tickets/7715674/ella-langley-tickets-thu-jun-25-2026-salem-civic-center",
  "wilmington-live-oak-bank-pavilion-2026-06-26": "https://www.ticketnetwork.com/tickets/7715675/ella-langley-tickets-fri-jun-26-2026-live-oak-bank-pavilion-at-riverfront-park",
  "pikeville-appalachian-wireless-arena-2026-07-23": "https://www.ticketnetwork.com/tickets/7715677/ella-langley-tickets-thu-jul-23-2026-appalachian-wireless-arena",
  "cary-koka-booth-amphitheatre-2026-07-24": "https://www.ticketnetwork.com/tickets/7715700/ella-langley-tickets-fri-jul-24-2026-koka-booth-amphitheatre-at-regency-park",
  "north-charleston-north-charleston-coliseum-2026-07-25": "https://www.ticketnetwork.com/tickets/7715678/ella-langley-tickets-sat-jul-25-2026-north-charleston-coliseum",
  "gilford-banknh-pavilion-2026-07-30": "https://www.ticketnetwork.com/tickets/7715679/ella-langley-tickets-thu-jul-30-2026-bank-of-new-hampshire-pavilion",
  "canandaigua-cmac-2026-07-31": "https://www.ticketnetwork.com/tickets/7715689/ella-langley-tickets-fri-jul-31-2026-constellation-brands-marvin-sands-performing-arts-center",
  "austin-moody-center-2026-08-13": "https://www.ticketnetwork.com/tickets/7715690/ella-langley-tickets-thu-aug-13-2026-moody-center-atx",
  "corpus-christi-american-bank-center-2026-08-14": "https://www.ticketnetwork.com/tickets/7715696/ella-langley-tickets-fri-aug-14-2026-hilliard-center-arena",
  "fort-worth-dickies-arena-2026-08-15": "https://www.ticketnetwork.com/tickets/7715693/ella-langley-tickets-sat-aug-15-2026-dickies-arena",
  "philadelphia-lincoln-financial-field-2026-08-01": "https://www.ticketnetwork.com/tickets/7529811/morgan-wallen-ella-langley-hudson-westbrook-blake-whiten-tickets-sat-aug-1-2026-lincoln-financial-field",
  "chicago-soldier-field-2026-06-20": "https://www.ticketnetwork.com/tickets/7529805/morgan-wallen-ella-langley-gavin-adcock-zach-john-king-tickets-sat-jun-20-2026-soldier-field",
  "clemson-memorial-stadium-2026-06-27": "https://www.ticketnetwork.com/tickets/7538546/morgan-wallen-ella-langley-gavin-adcock-jason-scott-and-the-high-heat-tickets-sat-jun-27-2026-frank-howard-field-at-clemson-memorial-stadium",
  "baltimore-mt-bank-stadium-2026-07-18": "https://www.ticketnetwork.com/tickets/7529807/morgan-wallen-ella-langley-gavin-adcock-jason-scott-and-the-high-heat-tickets-sat-jul-18-2026-mt-bank-stadium",
  "springfield-illinois-state-fair-2026-08-21": "https://www.ticketnetwork.com/tickets/7602339/ella-langley-tickets-fri-aug-21-2026-illinois-state-fairgrounds-grandstand",
  "cowboys-music-festival-2026-07-10": "https://www.ticketnetwork.com/tickets/7630422/cowboys-music-festival-ella-langley-bigxthaplug-tickets-fri-jul-10-2026-cowboys-park",
};

/**
 * Build the TicketNetwork affiliate (CJ) URL for a show. Pass the show id
 * (TourDate.id) to deep-link to that specific event; omit it (or pass an id not
 * in KNOWN_TICKETNETWORK_URLS) to fall back to the Ella Langley performer page.
 */
export function ticketNetworkUrl(showId?: string): string {
  const dest =
    (showId && KNOWN_TICKETNETWORK_URLS[showId]) || TICKETNETWORK_ELLA_LANGLEY;
  return `${TICKETNETWORK_CJ_CLICK}?url=${encodeURIComponent(dest)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAN YOUR TRIP — travel-affiliate module
// Vrbo is wired and live (CJ). Everything else below reads from an env var and
// returns null until the program is approved + the link is set. The
// PlanYourTrip component hides any option whose getter returns null.
// ─────────────────────────────────────────────────────────────────────────────

// Vrbo via CJ (vacation rentals, ~2%). Hardcoded base click URL — we have this
// program live. Deep-links to a Vrbo city search by URL-encoding the destination.
const VRBO_CLICK = "https://www.kqzyfj.com/click-101760569-10697641";

/** Affiliate deep link to Vrbo vacation-rental results for a given city. */
export function vrboUrl(city: string): string {
  const dest = `https://www.vrbo.com/search?destination=${encodeURIComponent(city)}`;
  return `${VRBO_CLICK}?url=${encodeURIComponent(dest)}`;
}

/**
 * Pending travel/experience affiliate slots. Each reads a NEXT_PUBLIC_AFF_<NAME>
 * env var and returns its value, or null if unset. Returning null lets the
 * PlanYourTrip component cleanly hide anything we don't yet have a link for.
 *
 * Populate these in Vercel env once each program is approved:
 *   Hotel-loyalty POINTS programs (Impact, pending review):
 *     NEXT_PUBLIC_AFF_IHG, NEXT_PUBLIC_AFF_HILTON,
 *     NEXT_PUBLIC_AFF_MARRIOTT, NEXT_PUBLIC_AFF_CHOICE
 *   Hotel / flight booking (room nights, future):
 *     NEXT_PUBLIC_AFF_PRICELINE, NEXT_PUBLIC_AFF_TRIPDOTCOM, NEXT_PUBLIC_AFF_CHEAPOAIR
 *   Experiences (future):
 *     NEXT_PUBLIC_AFF_VIATOR, NEXT_PUBLIC_AFF_GETYOURGUIDE
 */
function envLink(value: string | undefined): string | null {
  return value && value.trim() ? value : null;
}

// Hotel-loyalty points programs (NOT room booking — minor footnote only).
export const ihgUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_IHG);
export const hiltonUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_HILTON);
export const marriottUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_MARRIOTT);
export const choiceUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_CHOICE);

// Hotel / flight booking partners (room nights & airfare).
export const pricelineUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_PRICELINE);
export const tripDotComUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_TRIPDOTCOM);
export const cheapOairUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_CHEAPOAIR);

// Experiences.
export const viatorUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_VIATOR);
export const getYourGuideUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_GETYOURGUIDE);
