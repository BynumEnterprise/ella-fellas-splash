import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { AffiliateLink } from "@/components/AffiliateLink";
import { shopUrl } from "@/lib/merch-store";

interface MerchCTAProps {
  /** GA4 link_source for this placement, e.g. "set_times_merch". */
  source: string;
  variant?: "card" | "banner";
  className?: string;
}

/**
 * Funnel into the Ella Fellas merch store — our own unofficial, fan-made line,
 * always labeled as such. CSS-only visuals (no images), so it costs nothing in
 * Core Web Vitals. Clicks are tracked by the global AffiliateClickTracker:
 * shopellafellas.com maps to the "merch_store" network there, and the `source`
 * prop becomes GA4's link_source via data-affiliate-source. The same `source`
 * is also the utm_content on the outbound href (see lib/merch-store.ts), so the
 * store's separate GA4 property can attribute the visit to this placement.
 */
export function MerchCTA({ source, variant = "card", className = "" }: MerchCTAProps) {
  if (variant === "banner") {
    return (
      <section className={className}>
        <AffiliateLink
          href={shopUrl("/", source)}
          source={source}
          ariaLabel="Shop unofficial Ella Fellas merch"
          className="group relative block overflow-hidden rounded-xl bg-denim border border-denim text-paper p-6 md:p-8 hover:shadow-xl transition-shadow"
        >
          {/* Western flourish — CSS/SVG only, no image requests */}
          <Star
            className="absolute -right-6 -top-6 w-32 h-32 text-primary/15 rotate-12"
            strokeWidth={1}
            aria-hidden
          />
          <Star
            className="absolute right-28 bottom-3 hidden md:block w-8 h-8 text-primary/25 -rotate-12"
            strokeWidth={1.5}
            aria-hidden
          />
          <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-14 h-14 shrink-0 items-center justify-center rounded-lg bg-primary/15 border border-primary/40">
                <ShoppingBag className="w-6 h-6 text-primary" aria-hidden />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary font-medium">
                  Unofficial fan merch
                </p>
                <p className="font-display text-2xl md:text-3xl tracking-wider leading-tight mt-1">
                  SHOP ELLA FELLAS MERCH
                </p>
                <p className="text-sm text-paper/80 mt-1 leading-relaxed">
                  Fan-made tees, hoodies and totes &mdash; designed by the fellas, for the fellas.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-ink font-display tracking-wide text-sm rounded-md group-hover:bg-primary/90 transition-colors">
              VISIT THE STORE
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                aria-hidden
              />
            </span>
          </div>
        </AffiliateLink>
      </section>
    );
  }

  return (
    <AffiliateLink
      href={shopUrl("/", source)}
      source={source}
      ariaLabel="Shop unofficial Ella Fellas merch"
      className={`group flex items-center gap-4 bg-paper border border-ink/12 rounded-xl p-5 hover:border-primary hover:shadow-md transition-all ${className}`}
    >
      <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-lg bg-denim flex items-center justify-center">
        <Star
          className="absolute -right-2 -bottom-2 w-10 h-10 text-primary/25 rotate-12"
          strokeWidth={1.5}
          aria-hidden
        />
        <ShoppingBag className="relative w-6 h-6 text-primary" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.15em] text-clay font-medium">
          Unofficial fan merch
        </p>
        <p className="font-display text-lg text-denim leading-tight mt-0.5 group-hover:text-primary transition-colors">
          ELLA FELLAS MERCH
        </p>
        <p className="text-xs text-ink/65 mt-1 leading-relaxed">
          Fan-made tees, hoodies and totes &mdash; by the fellas, for the fellas.
        </p>
      </div>
      <ArrowRight
        className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform"
        aria-hidden
      />
    </AffiliateLink>
  );
}
