/**
 * OUTBOUND LINKS TO OUR OWN MERCH STORE.
 *
 * The Ella Fellas print-on-demand store lives on its own domain
 * (shopellafellas.com) and reports into its OWN GA4 property
 * (G-K09E0JHHSG), separate from the fan site's (G-X10PZGV168). Plain referral
 * attribution collapses every fan-site link into a single
 * "ellafellas.com / referral" row — and vanishes entirely when a browser strips
 * the referrer — so every outbound store link is UTM-tagged here instead.
 *
 * ALWAYS build store hrefs with `shopUrl()`; never hardcode the origin or the
 * query string at a call site. Because the params are written with
 * `searchParams.set`, a path that already carries UTMs is overwritten rather
 * than double-tagged, and deep-link paths / other query params survive intact.
 *
 * NOTE: the host is also mapped in AffiliateClickTracker's NETWORK_BY_DOMAIN so
 * these clicks keep firing the GA4 `merch_store` affiliate_click event on the
 * fan-site side. If this origin ever changes, change it there too.
 */
export const MERCH_STORE_ORIGIN = "https://shopellafellas.com";

const UTM_SOURCE = "ellafellas.com";
const UTM_MEDIUM = "referral";
const UTM_CAMPAIGN = "fan_site";

/**
 * Absolute, UTM-tagged URL into the merch store.
 *
 * @param path      Store path, e.g. "/" or "/collections/concert-gear".
 * @param placement Distinct slug for WHERE the link lives, e.g. "nav_shop".
 *                  Becomes utm_content in the store's GA4 property. For
 *                  MerchCTA this is the same string as the fan site's GA4
 *                  `link_source`, so both properties label the placement alike.
 */
export function shopUrl(path: string, placement: string): string {
  const url = new URL(path, MERCH_STORE_ORIGIN);
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", UTM_MEDIUM);
  url.searchParams.set("utm_campaign", UTM_CAMPAIGN);
  url.searchParams.set("utm_content", placement);
  return url.toString();
}
