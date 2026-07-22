"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const NETWORK_BY_DOMAIN: Record<string, string> = {
  "amazon.com": "amazon",
  "expedia.com": "expedia",
  "pintoranch.com": "pinto_ranch",
  "kqzyfj.com": "cj",
  "anrdoezrs.net": "cj",
  "dpbolvw.com": "cj",
  "jdoqocy.com": "cj",
  "tkqlhce.com": "cj",
  "qksrv.net": "cj",
  "tickpick.com": "tickpick",
  "seatgeek.com": "seatgeek",
  "vividseats.com": "vivid_seats",
  "ticketmaster.com": "ticketmaster",
  "stubhub.com": "stubhub",
  "awin1.com": "awin",
  "myshopify.com": "merch_store",
};

// CJ hides the merchant behind generic click domains (jdoqocy.com etc). Map our
// link ids to the real merchant so GA4's "Affiliate destination" is readable.
// ANY NEW CJ LINK ID MUST BE ADDED HERE or its clicks report as a raw domain.
const CJ_MERCHANT_BY_LINK_ID: Record<string, string> = {
  "15734399": "hotels.com",
  "15736982": "economybookings.com",
  "10697641": "vrbo.com",
  "12324527": "ticketnetwork.com",
  "15736262": "pintoranch.com",
};

function cjMerchantForUrl(url: string): string | null {
  const m = url.match(/\/click-\d+-(\d+)/);
  return (m && CJ_MERCHANT_BY_LINK_ID[m[1]]) || null;
}

/**
 * The merchant we actually sent the visitor to — what the owner wants to read in
 * GA4, rather than a redirect hostname. Falls back to the host we saw.
 */
function merchantForUrl(url: string, host: string, network: string): string {
  if (network === "cj") return cjMerchantForUrl(url) ?? host;
  // Expedia's affiliate links wrap the real destination in ?landingPage=
  if (network === "expedia") return "expedia.com";
  if (network === "amazon") return "amazon.com";
  // Our own Shopify POD store — report a readable name, not the random shop host.
  if (network === "merch_store") return "ella_fellas_merch";
  // Impact links are <brand>.<vanity> — the subdomain IS the brand, so report
  // "ihg" / "hilton" / "marriott" / "choice" rather than an opaque redirect host.
  if (network === "impact") return host.split(".")[0] || host;
  return host.replace(/^www\./, "");
}

/** Amazon ASIN, so the owner can see WHICH product earned the click. */
function amazonAsin(url: string): string | null {
  const m = url.match(/\/(?:dp|gp\/aw\/d|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : null;
}

// Impact gives every brand its own vanity domain, so there is no single Impact
// hostname to match. ADD A SUFFIX HERE whenever a new Impact brand is wired, or
// its clicks silently fire no event. (hmxg=IHG, ijrn=Hilton, mtko=Choice.)
const IMPACT_SUFFIXES = [".pxf.io", ".sjv.io", ".hmxg.net", ".ijrn.net", ".mtko.net"];

/**
 * COMMISSION WEIGHT — a relative planning score, NOT dollars.
 *
 * A raw click count treats a 12.5% ticket click and a ~2% Vrbo click the same,
 * which quietly points us at the wrong pages to build. This weights each click by
 * roughly how much a conversion is worth = the program's commission rate times a
 * typical order size, expressed as a small integer. Summing `click_weight` in GA4
 * gives a money-aware ranking of what earns, without pretending we know real sales.
 *
 * These are deliberately coarse and honest. Re-tune once we have real conversion
 * data. NOT for GA4's reserved `value` param (that would masquerade as revenue).
 */
const CLICK_WEIGHT: Record<string, number> = {
  ticketnetwork: 10, // 12.5% of a $100-300 resale ticket = the top earner, matches our top intent
  hotels: 8,         // Hotels.com ~4-5% of a $200-400 stay
  expedia: 8,        // same ballpark, different program
  vrbo: 6,           // ~2-3% but big rental basket
  economybookings: 5,// high % (~55%) on a small rental base
  pinto_ranch: 4,    // western wear, mid basket
  amazon: 2,         // ~3-4% on low baskets
  merch_store: 8,    // our own POD line — full print margin per order (~$8-13), not a % commission
  impact_points: 1,  // buy-points programs, low fit
  unmapped: 1,
};

/** Map a network + merchant to its planning weight. */
function clickWeight(network: string, destination: string): number {
  if (network === "cj") {
    const m = destination.replace(/\.com$/, "").replace(/[^a-z]/g, "_");
    if (m.includes("ticketnetwork")) return CLICK_WEIGHT.ticketnetwork;
    if (m.includes("hotels")) return CLICK_WEIGHT.hotels;
    if (m.includes("vrbo")) return CLICK_WEIGHT.vrbo;
    if (m.includes("economybookings")) return CLICK_WEIGHT.economybookings;
    if (m.includes("pinto")) return CLICK_WEIGHT.pinto_ranch;
  }
  if (network === "expedia") return CLICK_WEIGHT.expedia;
  if (network === "amazon") return CLICK_WEIGHT.amazon;
  if (network === "impact") return CLICK_WEIGHT.impact_points;
  return CLICK_WEIGHT[network] ?? CLICK_WEIGHT.unmapped;
}

function networkForHost(host: string): string | null {
  host = host.toLowerCase();
  for (const d in NETWORK_BY_DOMAIN) {
    if (host === d || host.endsWith("." + d)) return NETWORK_BY_DOMAIN[d];
  }
  if (IMPACT_SUFFIXES.some((d) => host.endsWith(d))) return "impact";
  return null;
}

export function AffiliateClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      try {
        const target = e.target as Element | null;
        if (!target || typeof target.closest !== "function") return;
        const anchor = target.closest("a") as HTMLAnchorElement | null;
        if (!anchor || !anchor.href) return;
        let host = "";
        try {
          host = new URL(anchor.href, window.location.href).host;
        } catch {
          return;
        }
        let network = networkForHost(host);
        if (!network) {
          // SAFETY NET: a monetized link on an unmapped host would otherwise earn
          // money completely invisibly (this is exactly how expedia.com went 35
          // links / zero events). Anything we marked rel="sponsored" and opened in
          // a new tab is an affiliate link by our own convention — report it as
          // "unmapped" so it shows up in GA4 and we can go map it properly.
          const rel = (anchor.getAttribute("rel") || "").toLowerCase();
          if (!rel.includes("sponsored")) return;
          network = "unmapped";
        }
        const text = (anchor.textContent || "").trim().slice(0, 100);
        if (window.gtag) {
          const destination = merchantForUrl(anchor.href, host, network);
          const asin = network === "amazon" ? amazonAsin(anchor.href) : null;
          // WHICH MODULE earned the click. Every AffiliateLink already sets
          // data-affiliate-source; until now it was written to the DOM and thrown
          // away, so a ticket click from the hero and one from the planner were
          // indistinguishable. This is the number that tells us what to build more of.
          const source = anchor.dataset.affiliateSource || "unknown";
          window.gtag("event", "affiliate_click", {
            network,
            destination,
            click_weight: clickWeight(network, destination),
            link_source: source,
            link_url: anchor.href,
            link_text: text,
            page_path: window.location.pathname,
            ...(asin ? { item_id: asin } : {}),
          });
        }
      } catch {
        // swallow — tracking must never break navigation
      }
    }
    // Middle-click fires `auxclick`, not `click`. Every affiliate link here is
    // target="_blank", so "open in a new tab" is habitual for this audience —
    // those opens were being counted as zero.
    function onAux(e: MouseEvent) {
      if (e.button === 1) onClick(e);
    }
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onAux, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onAux, true);
    };
  }, []);

  return null;
}
