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
  // Impact links are <brand>.pxf.io / <brand>.sjv.io — the subdomain IS the brand.
  if (network === "impact") return host;
  return host.replace(/^www\./, "");
}

/** Amazon ASIN, so the owner can see WHICH product earned the click. */
function amazonAsin(url: string): string | null {
  const m = url.match(/\/(?:dp|gp\/aw\/d|gp\/product)\/([A-Z0-9]{10})/i);
  return m ? m[1].toUpperCase() : null;
}

function networkForHost(host: string): string | null {
  host = host.toLowerCase();
  for (const d in NETWORK_BY_DOMAIN) {
    if (host === d || host.endsWith("." + d)) return NETWORK_BY_DOMAIN[d];
  }
  if (host.endsWith(".pxf.io") || host.endsWith(".sjv.io")) return "impact";
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
        const network = networkForHost(host);
        if (!network) return;
        const text = (anchor.textContent || "").trim().slice(0, 100);
        if (window.gtag) {
          const destination = merchantForUrl(anchor.href, host, network);
          const asin = network === "amazon" ? amazonAsin(anchor.href) : null;
          window.gtag("event", "affiliate_click", {
            network,
            destination,
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
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
