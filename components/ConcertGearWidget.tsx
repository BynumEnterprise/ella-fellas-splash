import Link from "next/link";
import { AffiliateLink } from "@/components/AffiliateLink";
import { amazonUrl } from "@/lib/affiliates";

interface Pick {
  name: string;
  asin: string;
  blurb: string;
  price: string;
  image: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&q=80&auto=format&fit=crop`;

const UNIVERSAL: Pick[] = [
  {
    name: "High-fidelity concert earplugs",
    asin: "B0D4DS4FC8", // Loop Experience 2 — verified shop product ec-loop-experience-2
    blurb:
      "Knock the volume down without muffling Ella's vocals. Saves your ears for the next stop on the tour.",
    price: "$25-$35",
    image: img("photo-1583394838336-acd977736f90"),
  },
  {
    name: "10,000 mAh portable charger",
    asin: "B07H7M1Z1Z", // Anker PowerCore 10000 — verified shop product ec-anker-powercore-10k
    blurb:
      "Doors open early, encore runs late. Two phone charges keeps you covered through the rideshare home.",
    price: "$20-$30",
    image: img("photo-1609692814858-f7cd2f0afa4f"),
  },
];

const STADIUM_BAG: Pick = {
  name: "Clear stadium-approved sling",
  asin: "B0741GD3FS", // Clear stadium crossbody — verified shop product ec-clear-stadium-bag
  blurb:
    "Most NFL stadiums on the Morgan Wallen tour enforce a clear-bag policy at the gate. Easier to buy ahead than panic-buy on-site.",
  price: "$15-$25",
  image: img("photo-1553062407-98eeb64c6a62"),
};

const RAIN_PONCHO: Pick = {
  name: "Disposable rain poncho 4-pack",
  asin: "B076ZHMR3S", // Hagon PRO ponchos 5-pack — verified shop product ec-rain-poncho-5pk
  blurb:
    "Outdoor amphitheater shows mean weather is part of the deal. One rain delay justifies the eight bucks.",
  price: "$8-$15",
  image: img("photo-1519345182560-3f2917c472ef"),
};

const WATER_BOTTLE: Pick = {
  name: "Refillable insulated water bottle",
  asin: "B01KXHIXSK", // Hydro Flask 24oz — verified shop product ec-hydroflask-24
  blurb:
    "Most venues let you bring an empty bottle through security. Free fill stations beat $7 arena water.",
  price: "$25-$45",
  image: img("photo-1602143407151-7111542de6e8"),
};

interface ShowContext {
  venue: string;
  venueCapacity?: number;
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
        Three things worth tossing in your bag before {show.venue}. Amazon links are affiliate links &mdash;
        clicking through helps keep Ella Fellas free.
      </p>
      <ul className="space-y-3">
        {picks.map((p) => (
          <li
            key={p.name}
            className="flex items-start justify-between gap-3 border-t border-ink/10 pt-3 first:border-t-0 first:pt-0"
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-ink/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
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
              href={amazonUrl(p.asin)}
              source="amazon-tour-gear"
              className="inline-flex items-center px-3 py-1.5 bg-denim text-paper font-display tracking-wide text-xs rounded-md hover:bg-denim/90 whitespace-nowrap self-center"
              ariaLabel={`Shop ${p.name} on Amazon`}
            >
              SHOP &rarr;
            </AffiliateLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
