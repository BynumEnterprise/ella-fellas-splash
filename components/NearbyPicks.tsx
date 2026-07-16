import { Utensils, Coffee, Beer, Hotel, House, MapPin } from "lucide-react";
import type { TourDate } from "@/lib/types";
import { AffiliateLink } from "@/components/AffiliateLink";
import { vrboUrl, hotelUrl } from "@/lib/affiliates";

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/**
 * "…and a restaurant nearby" — live Google Maps lookups around the actual venue
 * address, plus the lodging options. We deliberately do NOT invent restaurant
 * names or reviews: we send people to live local results, which are current and
 * can't be wrong the way a hardcoded list goes stale.
 */
export function NearbyPicks({ d, want }: { d: TourDate; want: { stay?: boolean; food?: boolean } }) {
  const near = `${d.venue}, ${d.city}, ${d.state}`;
  const chip =
    "inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-paper border border-ink/20 rounded-full text-denim hover:bg-ink/10";

  return (
    <div className="space-y-5">
      {want.food && (
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg text-denim tracking-wide mb-1">
            <Utensils className="w-4 h-4 text-primary" aria-hidden="true" /> EAT &amp; DRINK NEAR {d.venue.toUpperCase()}
          </h3>
          <p className="text-xs text-ink/60 mb-2">
            Live local results — always current, never a stale list we made up.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={maps(`restaurants near ${near}`)} target="_blank" rel="noopener noreferrer" className={chip}>
              <Utensils className="w-4 h-4" aria-hidden="true" /> Restaurants
            </a>
            <a href={maps(`bars and honky tonks near ${near}`)} target="_blank" rel="noopener noreferrer" className={chip}>
              <Beer className="w-4 h-4" aria-hidden="true" /> Bars
            </a>
            <a href={maps(`coffee near ${near}`)} target="_blank" rel="noopener noreferrer" className={chip}>
              <Coffee className="w-4 h-4" aria-hidden="true" /> Coffee
            </a>
            <a href={maps(`breakfast near ${near}`)} target="_blank" rel="noopener noreferrer" className={chip}>
              <Coffee className="w-4 h-4" aria-hidden="true" /> Breakfast after
            </a>
          </div>
        </div>
      )}

      {want.stay && (
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg text-denim tracking-wide mb-1">
            <Hotel className="w-4 h-4 text-primary" aria-hidden="true" /> WHERE TO STAY
          </h3>
          <p className="text-xs text-ink/60 mb-2">
            Aim for within ~1.5 miles so the post-show surge doesn&apos;t get you.
          </p>
          <div className="flex flex-wrap gap-2">
            <AffiliateLink
              href={vrboUrl(`${d.city}, ${d.state}`)}
              source="vrbo"
              ariaLabel={`Find a vacation rental in ${d.city} on Vrbo`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90"
            >
              <House className="w-4 h-4" aria-hidden="true" /> VACATION RENTALS
            </AffiliateLink>
            <AffiliateLink href={hotelUrl(`${d.city}, ${d.state}`, d.id)} source="expedia" className={chip}>
              <Hotel className="w-4 h-4" aria-hidden="true" /> Hotels nearby
            </AffiliateLink>
            <a href={maps(`hotels near ${near}`)} target="_blank" rel="noopener noreferrer" className={chip}>
              <MapPin className="w-4 h-4" aria-hidden="true" /> See them on the map
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
