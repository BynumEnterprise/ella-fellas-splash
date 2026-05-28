import Link from "next/link";
import { AffiliateLink } from "@/components/AffiliateLink";
import { amazonSearchUrl } from "@/lib/affiliates";

interface Pick {
  name: string;
  query: string;
  blurb: string;
  price: string;
}

const UNIVERSAL: Pick[] = [
  {
    name: "High-fidelity concert earplugs",
    query: "concert earplugs high fidelity",
    blurb: "Knock the volume down without muffling Ella's vocals. Saves your ears for the next stop on the tour.",
    price: "$25â$35",
  },
  {
    name: "10,000 mAh portable charger",
    query: "anker portable charger 10000mAh",
    blurb: "Doors open early, encore runs late. Two phone charges keeps you covered through the rideshare home.",
    price: "$20â$30",
  },
];

const STADIUM_BAG: Pick = {
  name: "Clear stadium-approved crossbody",
  query: "clear stadium crossbody bag NFL approved",
  blurb: "Most NFL stadiums on the Morgan Wallen tour enforce a clear-bag policy at the gate. Easier to buy ahead than panic-buy on-site.",
  price: "$15â$25",
};

const RAIN_PONCHO: Pick = {
  name: "Disposable rain poncho",
  query: "disposable rain poncho 4 pack",
  blurb: "Outdoor amphitheater shows mean weather is part of the deal. One rain delay justifies the eight bucks.",
  price: "$8â$15",
};

const WATER_BOTTLE: Pick = {
  name: "Refillable insulated water bottle",
  query: "Hydro Flask 24oz water bottle",
  blurb: "Most venues let you bring an empty bottle through security. Free fill stations beat $7 arena water.",
  price: "$25â$45",
};

interface ShowContext {
  venue: string;
  venueCapacity?: number;
  /** lower-cased venue name often hints outdoor: amphitheater, pavilion, stadium */
  outdoor?: boolean;
}

function pickGearForShow(show: ShowContext): Pick[] {
  const isStadium = (show.venueCapacity ?? 0) >= 40000;
  const venueLower = show.venue.toLowerCase();
  const looksOutdoor =
    show.outdoor ||
    venueLower.includes("amphitheater") ||
    venueLower.includes("amphitheatre") ||
    venueLower.includes("pavilion") ||
    venueLower.includes("stadium") ||
    venueLower.includes("field") ||
    venueLower.includes("park");

  const picks = [...UNIVERSAL];
  if (isStadium) picks.push(STADIUM_BAG);
  else if (looksOutdoor) picks.push(RAIN_PONCHO);
  else picks.push(WATER_BOTTLE);

  return picks;
}

export function ConcertGearWidget({ show }: { show: ShowContext }) {
  const picks = pickGearForShow(show);

  return (
    <section className="mb-8 bg-paper border border-ink/15 rounded-lg p-5">
      <div className="flex items-baseline justify-between gap-2 mb-3 flex-wrap">
        <h2 className="font-display text-2xl text-denim tracking-wider">
          GEAR FOR THIS SHOW
        </h2>
        <Link href="/shop" className="text-xs text-primary hover:underline whitespace-nowrap">
          Full shop &rarr;
        </Link>
      </div>
      <p className="text-sm text-ink/70 mb-4">
        Three things worth tossing in your bag before {show.venue}. Amazon links are affiliate links â
        clicking through helps keep Ella Fellas free.
      </p>
      <ul className="space-y-3">
        {picks.map((p) => (
          <li
            key={p.name}
            className="flex items-start justify-between gap-3 border-t border-ink/10 pt-3 first:border-t-0 first:pt-0"
          >
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-denim leading-tight">
                {p.name}{" "}
                <span className="text-xs uppercase tracking-[0.15em] text-primary">
                  {p.price}
                </span>
              </p>
              <p className="text-sm text-ink/70 mt-1 leading-relaxed">{p.blurb}</p>
            </div>
            <AffiliateLink
              href={amazonSearchUrl(p.query)}
              source="amazon-tour-gear"
              className="inline-flex items-center px-3 py-1.5 bg-denim text-paper font-display tracking-wide text-xs rounded-md hover:bg-denim/90 whitespace-nowrap"
              ariaLabel={`Shop ${p.name} on Amazon`}
            >
              SHOP â
            </AffiliateLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
