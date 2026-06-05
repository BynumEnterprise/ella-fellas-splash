"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const NETWORK_BY_DOMAIN: Record<string, string> = {
  "amazon.com": "amazon",
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
          window.gtag("event", "affiliate_click", {
            network,
            destination: host,
            link_url: anchor.href,
            link_text: text,
            page_path: window.location.pathname,
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
