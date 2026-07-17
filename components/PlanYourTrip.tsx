import { AffiliateLink } from "@/components/AffiliateLink";
import {
  MapPin,
  Navigation,
  Home,
  Hotel,
  Car,
  Plane,
  Utensils,
  Beer,
  Coffee,
  Compass,
} from "lucide-react";
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
  hotelUrl,
  hotelsComUrl,
  economyBookingsUrl,
} from "@/lib/affiliates";

interface Props {
  /** City name, e.g. "Oklahoma City". */
  city: string;
  /** Full "City, ST" string (preferred for map + stay searches). */
  cityState?: string;
  /** Venue name, e.g. "Zoo Amphitheatre". */
  venue?: string;
  /** Full street address if available -- makes the map pin exact. */
  venueAddress?: string;
  date?: string;
}

const GMAPS_SEARCH = "https://www.google.com/maps/search/?api=1&query=";

const primaryBtn =
  "inline-flex items-center gap-2 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90";
const secondaryBtn =
  "inline-flex items-center gap-2 px-4 py-2.5 bg-ink/10 text-denim font-display tracking-wide rounded-md hover:bg-ink/20 border border-ink/20";
const chip =
  "inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-paper border border-ink/20 rounded-full text-denim hover:bg-ink/10";

/**
 * Full inline trip planner for an upcoming show. Renders directly on the
 * concert page (no separate guide): an interactive venue map, live
 * "near the venue" searches (food, bars, coffee, things to do), and where to
 * stay. Free Google Maps features show on every page; affiliate stay/flight
 * options layer in as each NEXT_PUBLIC_AFF_* env link is populated.
 */
export function PlanYourTrip({ city, cityState, venue, venueAddress, date }: Props) {
  const where = cityState ?? city;
  const dest = where;
  const mapQuery = [venue, venueAddress, where].filter(Boolean).join(", ");
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapQuery,
  )}&z=14&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    mapQuery,
  )}`;
  const openInMaps = GMAPS_SEARCH + encodeURIComponent(mapQuery);

  const nearVenue = (term: string) =>
    GMAPS_SEARCH +
    encodeURIComponent(`${term} near ${[venue, where].filter(Boolean).join(", ")}`);

  // Affiliate booking partners -- hidden until their env link is set.
  const booking = [
    { label: "Priceline", href: pricelineUrl() },
    { label: "Trip.com", href: tripDotComUrl() },
    { label: "CheapOair", href: cheapOairUrl() },
  ].filter((b) => b.href) as { label: string; href: string }[];

  const flights = cheapOairUrl();
  const stay = { venue, date };
  const hotelsCom = hotelsComUrl(dest, stay);
  const rentalCar = economyBookingsUrl();
  const experiencesHref = viatorUrl() ?? getYourGuideUrl();

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
      <h2 className="font-display text-2xl text-denim">Plan your trip to {city}</h2>
      <p className="text-sm text-ink/80 mt-1 mb-4">
        Everything for {venue ?? "the show"} in one place — where it is, where to eat
        and drink, and where to crash so you&apos;re not fighting post-show traffic.
      </p>

      {/* Interactive venue map + venue facts */}
      <div className="grid gap-4 md:grid-cols-2 mb-5">
        <iframe
          title={`Map of ${venue ?? city}`}
          src={mapEmbed}
          className="w-full h-64 rounded-md border border-ink/15"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="flex flex-col justify-center">
          <div className="flex items-start gap-2 text-denim">
            <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              {venue && (
                <p className="font-display text-lg leading-tight">{venue}</p>
              )}
              {venueAddress && (
                <p className="text-sm text-ink/70">{venueAddress}</p>
              )}
              {!venueAddress && (
                <p className="text-sm text-ink/70">{where}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryBtn}
            >
              <Navigation className="w-4 h-4" /> DIRECTIONS
            </a>
            <a
              href={openInMaps}
              target="_blank"
              rel="noopener noreferrer"
              className={chip}
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* Eat & explore near the venue (free live Google Maps searches) */}
      <h3 className="font-display text-lg text-denim mb-1">
        Eat &amp; explore near the venue
      </h3>
      <p className="text-xs text-ink/50 mb-2">
        Live Google Maps results around {venue ?? where} — tap to see what&apos;s close.
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        <a href={nearVenue("restaurants")} target="_blank" rel="noopener noreferrer" className={chip}>
          <Utensils className="w-4 h-4" /> Restaurants
        </a>
        <a href={nearVenue("bars and honky tonks")} target="_blank" rel="noopener noreferrer" className={chip}>
          <Beer className="w-4 h-4" /> Bars &amp; honky-tonks
        </a>
        <a href={nearVenue("breakfast")} target="_blank" rel="noopener noreferrer" className={chip}>
          <Utensils className="w-4 h-4" /> Breakfast
        </a>
        <a href={nearVenue("coffee")} target="_blank" rel="noopener noreferrer" className={chip}>
          <Coffee className="w-4 h-4" /> Coffee
        </a>
        {experiencesHref ? (
          <AffiliateLink href={experiencesHref} source="things-to-do" className={chip}>
            <Compass className="w-4 h-4" /> Things to do in {city}
          </AffiliateLink>
        ) : (
          <a
            href={GMAPS_SEARCH + encodeURIComponent(`things to do in ${where}`)}
            target="_blank"
            rel="noopener noreferrer"
            className={chip}
          >
            <Compass className="w-4 h-4" /> Things to do in {city}
          </a>
        )}
      </div>

      {/* Where to stay */}
      <h3 className="font-display text-lg text-denim mb-2">Where to stay</h3>
      <div className="flex flex-wrap gap-2">
        <AffiliateLink
          href={vrboUrl(dest, stay)}
          source="vrbo"
          ariaLabel={`Find a vacation rental in ${city} on Vrbo`}
          className={primaryBtn}
        >
          <Home className="w-4 h-4" /> VACATION RENTALS IN {city.toUpperCase()}
        </AffiliateLink>
        {booking.map((b) => (
          <AffiliateLink
            key={b.label}
            href={b.href}
            source={b.label.toLowerCase()}
            className={secondaryBtn}
          >
            <Hotel className="w-4 h-4" /> {b.label.toUpperCase()}
          </AffiliateLink>
        ))}
        {hotelsCom && (
          <AffiliateLink
            href={hotelsCom}
            source="hotels-com"
            ariaLabel={`Find hotels in ${city} on Hotels.com`}
            className={secondaryBtn}
          >
            <Hotel className="w-4 h-4" /> HOTELS.COM
          </AffiliateLink>
        )}
        <AffiliateLink href={hotelUrl(dest, city, stay)} source="expedia" className={secondaryBtn}>
          <Hotel className="w-4 h-4" /> HOTELS NEARBY
        </AffiliateLink>
      </div>
      <p className="text-xs text-ink/50 mt-2">
        Vrbo whole-home rentals are usually the better call when a few of you split a
        place; aim for within ~1.5 miles so the post-show Uber surge doesn&apos;t get you.
      </p>
      {loyalty.length > 0 && (
        <p className="text-xs text-ink/50 mt-2">
          Topping up loyalty points for the trip?{" "}
          {loyalty.map((l, i) => (
            <span key={l.label}>
              {i > 0 && <span className="mx-1">·</span>}
              <AffiliateLink
                href={l.href}
                source={`loyalty-${l.label.toLowerCase()}`}
                className="underline hover:text-primary"
              >
                {l.label}
              </AffiliateLink>
            </span>
          ))}
        </p>
      )}

      {/* Getting there */}
      <h3 className="font-display text-lg text-denim mt-5 mb-2">Getting there</h3>
      <div className="flex flex-wrap gap-2">
        <a href={directions} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
          <Navigation className="w-4 h-4" /> DRIVING DIRECTIONS
        </a>
        {flights && (
          <AffiliateLink href={flights} source="cheapoair-flights" className={secondaryBtn}>
            <Plane className="w-4 h-4" /> FIND FLIGHTS
          </AffiliateLink>
        )}
        {rentalCar && (
          <AffiliateLink href={rentalCar} source="economybookings" className={secondaryBtn}>
            <Car className="w-4 h-4" /> RENTAL CAR
          </AffiliateLink>
        )}
      </div>
      {rentalCar && (
        <p className="text-xs text-ink/50 mt-2">
          Flying in? A rental beats surge pricing both ways on a stadium night &mdash; and
          it doubles as your bag storage between the tailgate and the gate.
        </p>
      )}

      <p className="text-xs italic text-ink/60 mt-5">
        Some links here are affiliate links — we may earn a commission at no extra cost
        to you. Maps, directions, and the &quot;near the venue&quot; results are free Google Maps
        searches.
      </p>
    </section>
  );
}
