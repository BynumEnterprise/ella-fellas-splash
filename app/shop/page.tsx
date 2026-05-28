import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateLink } from "@/components/AffiliateLink";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { amazonSearchUrl, amazonUrl } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "Concert Gear & Fan Picks — the Ella Fellas Shop",
  description:
    "Hand-picked men's gear for Ella Langley concerts and country shows: boots, earplugs, hats, portable chargers, and Dandelion vinyl. All Amazon links are affiliate links — your clicks help keep the site free.",
};

interface Pick {
  name: string;
  blurb: string;
  query?: string;
  asin?: string;
  price?: string;
  why: string;
  /** Real product photo URL — Unsplash CDN, stable IDs. */
  image: string;
  /** Short hashtag-style category badge shown over the image. */
  badge?: string;
}

interface Category {
  slug: string;
  title: string;
  intro: string;
  picks: Pick[];
}

// Curated Unsplash photo IDs. Format: https://images.unsplash.com/{ID}?w=600&q=80&auto=format&fit=crop
const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=600&q=80&auto=format&fit=crop`;

const CATEGORIES: Category[] = [
  {
    slug: "concert-essentials",
    title: "CONCERT ESSENTIALS",
    intro:
      "The five things every Ella show veteran has in their bag. Spend $40 once and you're set for the whole tour.",
    picks: [
      {
        name: "High-fidelity concert earplugs",
        blurb:
          "Lowers volume without muffling vocals. You'll hear every word of 'Choosin' Texas' and not leave with your ears ringing.",
        query: "concert earplugs high fidelity",
        price: "$25-$35",
        why: "If you're going to multiple stadium dates this summer, the difference between cheap foam and real filtered earplugs is night and day. Loop Experience is the popular pick but the off-brand versions on Amazon work fine.",
        image: img("photo-1583394838336-acd977736f90"),
        badge: "Ear protection",
      },
      {
        name: "Clear stadium-approved crossbody",
        blurb:
          "Most stadiums on Morgan Wallen's tour now enforce clear-bag policy. Get a stadium-approved one before you go.",
        query: "clear stadium crossbody bag NFL approved men",
        price: "$15-$25",
        why: "Soldier Field, Gillette, Acrisure, Lincoln Financial — all clear-bag stadiums. Cheaper to buy ahead than panic-buy at the gate.",
        image: img("photo-1553062407-98eeb64c6a62"),
        badge: "Stadium-ready",
      },
      {
        name: "10,000 mAh portable charger",
        blurb:
          "Doors open at 5:30 and you won't be home until midnight. Phones die fast at outdoor shows.",
        query: "anker portable charger 10000mAh",
        price: "$20-$30",
        why: "Anker is the trusted brand. 10K mAh is two full phone charges — enough for openers, headliner, and the rideshare home.",
        image: img("photo-1609692814858-f7cd2f0afa4f"),
        badge: "Stay charged",
      },
      {
        name: "Refillable insulated water bottle",
        blurb:
          "Most venues let you bring an empty one in. Summer shows = expensive arena water unless you bring your own.",
        query: "Hydro Flask 24oz water bottle",
        price: "$25-$45",
        why: "Empty bottles pass security. $5 stadium water adds up fast across a tour.",
        image: img("photo-1602143407151-7111542de6e8"),
        badge: "Hydrate",
      },
      {
        name: "Lightweight rain poncho",
        blurb:
          "Half the Dandelion Tour dates are amphitheatres and outdoor. One rain delay justifies the $8.",
        query: "disposable rain poncho 4 pack",
        price: "$8-$15",
        why: "Estero, OKC, Cary, Salem — all outdoor venues. Better to have one and not need it.",
        image: img("photo-1519345182560-3f2917c472ef"),
        badge: "Weather-ready",
      },
    ],
  },
  {
    slug: "what-to-wear",
    title: "WHAT TO WEAR",
    intro:
      "Men's gear that holds up at a 4-hour show. Jeans + boots + a button-down is the default — no costume required.",
    picks: [
      {
        name: "Men's western boots that don't kill your feet",
        blurb:
          "Real-life boots from brands that ship via Amazon — Ariat, Justin, Dan Post. Break them in first.",
        query: "Ariat men's western boots",
        price: "$120-$250",
        why: "Avoid the $40 Halloween cowboy boots. You'll be standing for 4+ hours. Worth the upgrade.",
        image: img("photo-1542840843-3349799cded6"),
        badge: "Built to last",
      },
      {
        name: "Men's pearl-snap western shirt",
        blurb:
          "The unofficial Ella crowd uniform. Looks right, costs $25, fits in any venue.",
        query: "men's pearl snap western shirt",
        price: "$25-$45",
        why: "Works for cowboy-aesthetic without trying too hard. Wrangler is the safe pick.",
        image: img("photo-1602810316693-3667c854239a"),
        badge: "Crowd uniform",
      },
      {
        name: "Men's lightweight straw cowboy hat",
        blurb:
          "Don't buy this for one show. But if you're doing the festival circuit, a good crushable straw lid is worth it.",
        query: "men's straw cowboy hat crushable",
        price: "$40-$80",
        why: "Resistol or Stetson via FlexOffers are the lifetime picks. The $20 versions look $20 and won't survive Stagecoach.",
        image: img("photo-1521369909029-2afed882baee"),
        badge: "Festival lid",
      },
    ],
  },
  {
    slug: "fan-collection",
    title: "FOR THE FAN COLLECTION",
    intro:
      "Vinyl, CDs, posters, and stuff worth owning. We link to whatever Amazon has — official Ella merch is at ellalangley.us.",
    picks: [
      {
        name: "Dandelion (vinyl)",
        blurb:
          "Ella's second album, the one that broke her to the mainstream. Pressed by Columbia, widely available on Amazon and at indie record stores.",
        query: "Ella Langley Dandelion vinyl",
        price: "$28-$35",
        why: "Look for the colored variants. The standard black is fine but the limited indie-store colors will hold value.",
        image: img("photo-1539375665275-f9de415ef9ac"),
        badge: "LP / 2026",
      },
      {
        name: "Hungover (debut album, vinyl)",
        blurb:
          "Her 2024 debut. Less polished, more honest. 'You Look Like You Love Me' lives here.",
        query: "Ella Langley Hungover vinyl",
        price: "$24-$30",
        why: "Best entry point if you're starting the collection. Includes the song she sings with Riley Green that made the whole world pay attention.",
        image: img("photo-1483412033650-1015ddeb83d1"),
        badge: "LP / 2024",
      },
      {
        name: "Country Now / Whiskey Riff men's tees",
        blurb:
          "Country-blog tees are a vibe. Cheaper than band merch and you'll get nods from other fans in line.",
        query: "Whiskey Riff country music men's t-shirt",
        price: "$22-$30",
        why: "Pairs well with denim and a Stetson. Less try-hard than an actual artist tee.",
        image: img("photo-1521572163474-6864f9cf17ab"),
        badge: "Apparel",
      },
    ],
  },
  {
    slug: "travel-prep",
    title: "TRAVEL PREP",
    intro:
      "For the fellas flying in for a specific show — practical packing for a 36-hour music-trip.",
    picks: [
      {
        name: "Underseat duffel (45L)",
        blurb:
          "Fits boots + outfit changes + chargers and still goes under the seat on Southwest and Delta.",
        query: "men's underseat carry on duffel bag 45L",
        price: "$35-$70",
        why: "Skip the checked bag for a 1-night turnaround. Faster off the plane, no bag-fee.",
        image: img("photo-1581605405669-fcdf81165afa"),
        badge: "Carry-on",
      },
      {
        name: "Dopp kit / toiletry organizer",
        blurb:
          "Keeps your razor, deodorant, and chargers from rattling around in the duffel.",
        query: "men's leather dopp kit toiletry bag",
        price: "$15-$30",
        why: "If you're driving to Stagecoach or hopping to a stadium date, a solid dopp kit saves the carry-on chaos.",
        image: img("photo-1535632787350-4e68ef0ac584"),
        badge: "Organize",
      },
    ],
  },
];

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* HERO */}
      <header className="mb-12 text-center max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-clay font-medium mb-3">
          Curated affiliate picks
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-denim leading-none tracking-wider">
          THE FELLAS SHOP
        </h1>
        <p className="text-lg text-ink/80 mt-5 leading-relaxed">
          Stuff we actually recommend for the fellas heading to an Ella Langley show — concert
          gear, festival packing, and additions to the fan collection.{" "}
          <strong className="text-denim">Every Amazon link is an affiliate link.</strong>
        </p>
        <p className="text-sm text-ink/55 mt-3">
          You won&apos;t pay more by clicking through — Amazon pays a small commission that keeps
          Ella Fellas free.
        </p>
      </header>

      {/* Category nav chips */}
      <nav className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.slug}
            href={`#${cat.slug}`}
            className="text-xs uppercase tracking-[0.18em] px-4 py-2 bg-paper border border-ink/15 rounded-full text-ink/75 hover:border-primary hover:text-primary transition-colors font-medium"
          >
            {cat.title}
          </a>
        ))}
      </nav>

      {CATEGORIES.map((cat) => (
        <section key={cat.slug} id={cat.slug} className="mb-16 scroll-mt-24">
          <div className="mb-7">
            <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider">
              {cat.title}
            </h2>
            <p className="text-ink/75 mt-2 leading-relaxed max-w-3xl">{cat.intro}</p>
          </div>

          {/* Product grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cat.picks.map((p) => {
              const href = p.asin
                ? amazonUrl(p.asin)
                : amazonSearchUrl(p.query ?? p.name);
              return (
                <article
                  key={p.name}
                  className="group bg-paper border border-ink/12 rounded-xl overflow-hidden flex flex-col hover:border-primary hover:shadow-lg transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-denim/90 text-paper text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
                        {p.badge}
                      </span>
                    )}
                    {p.price && (
                      <span className="absolute bottom-3 right-3 bg-paper/95 text-denim text-xs uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-display font-medium backdrop-blur-sm border border-ink/10">
                        {p.price}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display text-lg md:text-xl text-denim leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-sm text-ink/75 mt-2 leading-relaxed flex-1">
                      {p.blurb}
                    </p>
                    <details className="mt-3 group/details">
                      <summary className="text-xs text-ink/55 cursor-pointer list-none flex items-center gap-1 hover:text-primary">
                        <span className="font-medium">Why we picked it</span>
                        <span className="text-[10px] group-open/details:rotate-180 transition-transform">&#9662;</span>
                      </summary>
                      <p className="text-xs text-ink/65 mt-2 leading-relaxed italic border-l-2 border-primary/30 pl-3">
                        {p.why}
                      </p>
                    </details>
                    <AffiliateLink
                      href={href}
                      source={`amazon-${cat.slug}`}
                      className="mt-4 inline-flex items-center justify-center gap-1 px-4 py-2.5 bg-denim text-paper font-display tracking-wide text-sm rounded-md hover:bg-denim/90"
                      ariaLabel={`Shop ${p.name} on Amazon`}
                    >
                      SHOP ON AMAZON &rarr;
                    </AffiliateLink>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div className="bg-primary/10 border-2 border-primary rounded-xl p-7 md:p-10 mb-10 text-center">
        <h2 className="font-display text-3xl text-denim mb-2 tracking-wider">
          LOOKING FOR OFFICIAL MERCH?
        </h2>
        <p className="text-ink/80 mb-5 max-w-xl mx-auto">
          We&apos;re an unofficial fan site. For official Ella Langley apparel and tour merch, go
          straight to the source.
        </p>
        <a
          href="https://ellalangley.us"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90"
        >
          ELLALANGLEY.US &rarr;
        </a>
      </div>

      <AffiliateDisclosure />

      <p className="text-xs text-ink/50 mt-8 text-center">
        Looking for something specific?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Tell us what to add
        </Link>
        .
      </p>
    </div>
  );
}
