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

// ─── EXPEDIA (hotels) — Expedia Group Travel Creator ─────────────────────────
// APPROVED + LIVE 2026-07-16. These IDs are NOT secrets (they ride in every public
// link, same as the Amazon tag) so they're hardcoded: the links earn on deploy,
// with no env var to forget.
//
// VERIFIED END-TO-END 2026-07-16 against links produced by Expedia's own Link
// builder, then followed in a real browser to confirm tracking actually fires:
//   official  -> affcid=US.DIRECT.PHG.1110l37284.1100l68075, afflid/clickref set, regionId=738 (Baltimore)
//   ours      -> identical affcid + afflid/clickref. Attribution is driven by camref.
//
// Shape (do NOT "improve" this — it's copied from the builder's real output):
//   https://expedia.com/affiliate
//     ?siteid=1                      <- Expedia USA point of sale
//     &landingPage=<encoded Expedia URL>
//     &camref=<publisher id>         <- THE thing that pays us
//     &creativeref=<creative id>
//     &adref=<free-form>             <- optional; lands in affdtl for reporting
//
// NOTE: this is NOT the `prf.hn/click/camref:.../destination:...` Partnerize shape
// documented in Expedia's older Vrbo linking guide. That guide describes the Vrbo
// program; the Travel Creator link builder emits the /affiliate?... form above.
// Tested: adref is OPTIONAL (omitting it keeps the identical affcid) and accepts a
// custom value, which passes through verbatim as affdtl=PHG.<clickref>.<adref>.
// It's also NOT the CJ `<click-base>?url=` shape — Vrbo below stays on CJ.
const EXPEDIA_SITEID = "1";
const EXPEDIA_CAMREF = "1100l5Pw9U";
const EXPEDIA_CREATIVEREF = "1100l68075";

/**
 * Affiliate hotel search on Expedia for a city.
 *
 * @param city  e.g. "Baltimore, MD" — Expedia resolves this to a real region.
 * @param adref optional per-page reference (we pass the show id / city) so the
 *              Travel Creator reports show WHICH show earned the booking.
 */
export function hotelUrl(city: string, adref?: string, opts?: StayOpts): string {
  const dest =
    `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(stayDestination(city, opts?.venue))}` +
    stayDates(opts?.date);
  const camref = (process.env.NEXT_PUBLIC_AFF_EXPEDIA_CAMREF ?? EXPEDIA_CAMREF).trim() || EXPEDIA_CAMREF;

  // Restricted to url-safe chars so a stray character can't corrupt the query.
  const ref = (adref ?? "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 60);
  const refPart = ref ? `&adref=${ref}` : "";

  return (
    `https://expedia.com/affiliate?siteid=${EXPEDIA_SITEID}` +
    `&landingPage=${encodeURIComponent(dest)}` +
    `&camref=${camref}` +
    `&creativeref=${EXPEDIA_CREATIVEREF}` +
    refPart
  );
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

/** Options shared by the stay/travel link builders. */
export interface StayOpts {
  /** Venue name — centers the search on the stadium/venue, not the city center. */
  venue?: string;
  /** Show date (YYYY-MM-DD) — pre-fills check-in = show night, check-out = next day. */
  date?: string;
}

/** "Venue, City, ST" when we know the venue (Expedia-family sites geocode
 *  landmarks and sort results by distance from them), else just "City, ST". */
function stayDestination(city: string, venue?: string): string {
  return venue && venue.trim() ? `${venue}, ${city}` : city;
}

/** `&startDate=<show night>&endDate=<morning after>` (empty if no/invalid date). */
function stayDates(date?: string): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return `&startDate=${date}&endDate=${d.toISOString().slice(0, 10)}`;
}

// Vrbo via CJ (vacation rentals, ~2%). Hardcoded base click URL — we have this
// program live. Deep-links to a Vrbo city search by URL-encoding the destination.
const VRBO_CLICK = "https://www.kqzyfj.com/click-101760569-10697641";

/** Affiliate deep link to Vrbo vacation-rental results near the show. */
export function vrboUrl(city: string, opts?: StayOpts): string {
  const dest =
    `https://www.vrbo.com/search?destination=${encodeURIComponent(stayDestination(city, opts?.venue))}` +
    `${stayDates(opts?.date)}&adults=2`;
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

// ─────────────────────────────────────────────────────────────────────────────
// Hotel-loyalty programs via Impact — links created in the user's Impact account
// 2026-07-17 and read verbatim off the Create-a-link panel. Each redirect was
// verified live to land on the brand's real points storefront carrying a
// `clickid` (i.e. attribution works).
//
// IMPORTANT — these are POINTS.COM "buy points" programs, NOT room booking.
// A fan looking for a room near the venue wants Hotels.com/Expedia/Vrbo above;
// these earn only when someone BUYS LOYALTY POINTS. That's why they stay a
// one-line footnote and never compete with the real "where to stay" CTAs.
// Each Impact brand has its own vanity domain (hmxg/ijrn/pxf/mtko) — any new one
// must also be added to AffiliateClickTracker or its clicks fire no GA event.
// ─────────────────────────────────────────────────────────────────────────────
const IHG_IMPACT = "https://ihg.hmxg.net/jRD4Y6";
const HILTON_IMPACT = "https://hilton.ijrn.net/enJ2YX";
const MARRIOTT_IMPACT = "https://marriott.pxf.io/QYzX7M";
const CHOICE_IMPACT = "https://choice.mtko.net/PzYg7X";

export const ihgUrl = (): string => envLink(process.env.NEXT_PUBLIC_AFF_IHG) ?? IHG_IMPACT;
export const hiltonUrl = (): string => envLink(process.env.NEXT_PUBLIC_AFF_HILTON) ?? HILTON_IMPACT;
export const marriottUrl = (): string =>
  envLink(process.env.NEXT_PUBLIC_AFF_MARRIOTT) ?? MARRIOTT_IMPACT;
export const choiceUrl = (): string => envLink(process.env.NEXT_PUBLIC_AFF_CHOICE) ?? CHOICE_IMPACT;

// Hotel / flight booking partners (room nights & airfare).
export const pricelineUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_PRICELINE);
export const tripDotComUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_TRIPDOTCOM);
export const cheapOairUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_CHEAPOAIR);

// Experiences.
export const viatorUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_VIATOR);
export const getYourGuideUrl = (): string | null => envLink(process.env.NEXT_PUBLIC_AFF_GETYOURGUIDE);

// ─────────────────────────────────────────────────────────────────────────────
// CJ programs approved 2026-07 — Hotels.com (hotels/travel) + EconomyBookings
// (rental cars). Both click URLs below were copied verbatim from CJ's Get Code
// panel for website "Ella Fellas (ellafellas.com) - 101760569". Never invent a
// CJ link id: a wrong id tracks to nothing and the commission is lost.
// ─────────────────────────────────────────────────────────────────────────────

// Hotels.com via CJ — advertiser 1702763, "Evergreen Link for Hotels.com"
// (link id 15734399, deep-linking enabled). Evergreen = does not expire.
const HOTELSCOM_CLICK = "https://www.jdoqocy.com/click-101760569-15734399";

// EconomyBookings.com via CJ — advertiser 6385999, "Evergreen Link for
// EconomyBookings.com" (link id 15736982, deep-linking enabled). Sale: 55%.
const ECONOMYBOOKINGS_CLICK = "https://www.tkqlhce.com/click-101760569-15736982";

/** Affiliate deep link to Hotels.com results near the show (venue-centered, show dates). */
export function hotelsComUrl(city: string, opts?: StayOpts): string {
  const override = envLink(process.env.NEXT_PUBLIC_AFF_HOTELSCOM);
  const base = override ?? HOTELSCOM_CLICK;
  if (!base.includes("/click-")) return base;
  const dest =
    `https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(stayDestination(city, opts?.venue))}` +
    stayDates(opts?.date);
  return `${base}?url=${encodeURIComponent(dest)}`;
}

/**
 * Affiliate link to EconomyBookings (rental cars) via CJ.
 *
 * NOTE: verified 2026-07-17 in a real browser — EconomyBookings has NO public
 * per-city URL pattern. /car-rental/<city>/ silently 302s to /car-rental/all
 * for EVERY slug (real cities included), and their location index only links
 * continents, not cities. So we deliberately do NOT guess a city deep link
 * (that is exactly the dead-URL mistake that got us rejected elsewhere); we
 * send tracked traffic to their landing page, where the pick-up-location search
 * box is the first thing on the screen.
 */
export function economyBookingsUrl(): string {
  return envLink(process.env.NEXT_PUBLIC_AFF_ECONOMYBOOKINGS) ?? ECONOMYBOOKINGS_CLICK;
}
