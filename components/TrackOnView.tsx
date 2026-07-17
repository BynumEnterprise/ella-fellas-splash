"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires one GA4 event when a server-rendered page mounts.
 *
 * Server components can't call gtag, so pages that need a view-level signal
 * (product detail, zero-result search) drop this in. Guarded against React
 * strict-mode double-invoke so it can't double-count.
 */
export function TrackOnView({
  event,
  params,
}: {
  event: string;
  params?: Record<string, unknown>;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", event, params ?? {});
      }
    } catch {
      // analytics must never break the page
    }
  }, [event, params]);
  return null;
}
