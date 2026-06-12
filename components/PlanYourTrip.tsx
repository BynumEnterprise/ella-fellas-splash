import Link from "next/link";
import { Home, Hotel, Plane, Compass } from "lucide-react";
import { AffiliateLink } from "@/components/AffiliateLink";
import {
  vrboUrl,
  pricelineUrl,
  tripDotComUrl,
  cheapOairUrl,
  viatorUrl,
  getYourGuideUrl,
  ihgUrl,
  hiltonUrl,
  marriottUrl,
  choiceUrl,
} from "@/lib/affiliates";

interface Props {
  /** City name, e.g. "Oklahoma City". Used as the button label. */
  city: string;
  /** Full "City, ST" string for the Vrbo destination (falls back to city). */
  cityState?: string;
  venue?: string;
  date?: string;
}

const stayBtn =
  "inline-flex items-center gap-2 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90";
const secondaryBtn =
  "inline-flex items-center gap-2 px-4 py-2.5 bg-ink/10 text-denim font-display tracking-wide rounded-md hover:bg-ink/20 border border-ink/20";

/**
 * "Plan Your Trip" card for an upcoming show. Renders only the options whose
 * affiliate link currently exists -- Vrbo is live; everything else stays hidden
 * until its NEXT_PUBLIC_AFF_* env var is populated.
 */
export function PlanYourTrip({ city, cityState, venue }: Props) {
  const dest = cityState ?? city;

  // Booking partners (room nights / airfare) -- hidden until env links are set.
  const booking = [
    { label: "Priceline", href: pricelineUrl() },
    { label: "Trip.com", href: tripDotComUrl() },
    { label: "CheapOair", href: cheapOairUrl() },
  ].filter((b) => b.href) as { label: string; href: string }[];

  // Flights + things-to-do -- hidden until env links are set.
  const flights = cheapOairUrl();
  const experiences = [
    { label: "Viator", href: viatorUrl() },
    { label: "GetYourGuide", href: getYourGuideUrl() },
  ].filter((e) => e.href) as { label: string; href: string }[];

  // Hotel-loyalty points programs -- minor footnote only, never a primary CTA.
  const loyalty = [
    { label: "IHG", href: ihgUrl() },
    { label: "Hilton", href: hiltonUrl() },
    { label: "Marriott", href: marriottUrl() },
    { label: "Choice", href: choiceUrl() },
  ].filter((l) => l.href) as { label: string; href: string }[];

  return (
    <section className="mb-8 bg-paper border-2 border-primary/40 rounded-lg p-5">
      <p className="text-xs uppercase tracking-wider text-clay font-medium mb-1">
        PLAN YOUR TRIP
      </p>
      <h2 className="font-display text-2xl text-denim">
        Where to stay near the show
      </h2>
      <p className="text-sm text-ink/80 mt-1 mb-4">
        Coming in from out of town? Book a place close to {venue ? venue : city} so you&apos;re not
        fighting post-show traffic to get home.
      </p>

      {/* Where to stay -- Vrbo primary */}
      <div className="flex flex-wrap gap-2">
        <AffiliateLink
          href={vrboUrl(dest)}
          source="vrbo"
          ariaLabel={`Find a vacation rental in ${city} on Vrbo`}
          className={stayBtn}
        >
          <Home className="w-4 h-4" /> FIND A VACATION RENTAL IN {city.toUpperCase()} ON VRBO
        </AffiliateLink>
        {booking.map((b) => (
          <AffiliateLink key={b.label} href={b.href} source={b.label.toLowerCase()} className={secondaryBtn}>
            <Hotel className="w-4 h-4" /> {b.label.toUpperCase()}
          </AffiliateLink>
        ))}
      </div>
      <p className="text-xs text-ink/50 mt-2">
        Vrbo lists whole-home vacation rentals -- usually the better call when a few of you are
        splitting a place for the weekend.
      </p>

      {/* Getting there / things to do */}
      {(flights || experiences.length > 0) && (
        <div className="mt-5">
          <h3 className="font-display text-lg text-denim mb-2">Getting there &amp; things to do</h3>
          <div className="flex flex-wrap gap-2">
            {flights && (
              <AffiliateLink href={flights} source="cheapoair-flights" className={secondaryBtn}>
                <Plane className="w-4 h-4" /> FIND FLIGHTS
              </AffiliateLink>
            )}
            {experiences.map((e) => (
              <AffiliateLink key={e.label} href={e.href} source={e.label.toLowerCase()} className={secondaryBtn}>
                <Compass className="w-4 h-4" /> {e.label.toUpperCase()}
              </AffiliateLink>
            ))}
          </div>
        </div>
      )}

      {/* Hotel-loyalty footnote (points programs only) */}
      {loyalty.length > 0 && (
        <p className="text-xs text-ink/50 mt-4">
          Already a hotel rewards member?{" "}
          {loyalty.map((l, i) => (
            <span key={l.label}>
              {i > 0 && <span className="mx-1">·</span>}
              <AffiliateLink href={l.href} source={`loyalty-${l.label.toLowerCase()}`} className="underline hover:text-primary">
                {l.label}
              </AffiliateLink>
            </span>
          ))}
        </p>
      )}

      <Link
        href="/guides/traveling-to-an-ella-langley-show"
        className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
      >
        Full trip-planning guide &rarr;
      </Link>

      <p className="text-xs italic text-ink/60 mt-4">
        We may earn a commission from links in this section, at no extra cost to you.
      </p>
    </section>
  );
}
