/**
 * Single source of truth for the shop catalog.
 * Used by /shop (index), /shop/[slug] (detail), and the homepage gear section.
 *
 * `slug` is the URL fragment for the product detail page (/shop/{slug}).
 * `image` is a curated Unsplash CDN ID. `query` is the Amazon search fallback
 * if no ASIN is set.
 */

export interface ShopProduct {
  slug: string;
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
  /** Which category section this belongs to on the /shop index. */
  category: ShopCategorySlug;
}

export type ShopCategorySlug = "concert-essentials" | "what-to-wear" | "fan-collection" | "travel-prep";

export interface ShopCategory {
  slug: ShopCategorySlug;
  title: string;
  intro: string;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    slug: "concert-essentials",
    title: "CONCERT ESSENTIALS",
    intro:
      "The five things every Ella show veteran has in their bag. Spend $40 once and you're set for the whole tour.",
  },
  {
    slug: "what-to-wear",
    title: "WHAT TO WEAR",
    intro:
      "Men's gear that holds up at a 4-hour show. Jeans + boots + a button-down is the default — no costume required.",
  },
  {
    slug: "fan-collection",
    title: "FOR THE FAN COLLECTION",
    intro:
      "Vinyl, CDs, posters, and stuff worth owning. We link to whatever Amazon has — official Ella merch is at ellalangley.us.",
  },
  {
    slug: "travel-prep",
    title: "TRAVEL PREP",
    intro:
      "For the fellas flying in for a specific show — practical packing for a 36-hour music-trip.",
  },
];

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`;

export const SHOP_PRODUCTS: ShopProduct[] = [
  // CONCERT ESSENTIALS
  {
    slug: "high-fidelity-concert-earplugs",
    category: "concert-essentials",
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
    slug: "clear-stadium-crossbody",
    category: "concert-essentials",
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
    slug: "portable-charger-10k",
    category: "concert-essentials",
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
    slug: "insulated-water-bottle",
    category: "concert-essentials",
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
    slug: "rain-poncho",
    category: "concert-essentials",
    name: "Lightweight rain poncho",
    blurb:
      "Half the Dandelion Tour dates are amphitheatres and outdoor. One rain delay justifies the $8.",
    query: "disposable rain poncho 4 pack",
    price: "$8-$15",
    why: "Estero, OKC, Cary, Salem — all outdoor venues. Better to have one and not need it.",
    image: img("photo-1519345182560-3f2917c472ef"),
    badge: "Weather-ready",
  },

  // WHAT TO WEAR
  {
    slug: "mens-western-boots",
    category: "what-to-wear",
    name: "Men's western boots that don't kill your feet",
    blurb:
      "Real-life boots from brands that ship via Amazon — Ariat, Justin, Dan Post. Break them in first.",
    query: "Ariat men's western boots",
    price: "$120-$250",
    why: "Avoid the $40 Halloween cowboy boots. You'll be standing for 4+ hours. Worth the upgrade.",
    image: img("photo-1610685756406-0f2fdc231bf0"),
    badge: "Built to last",
  },
  {
    slug: "pearl-snap-western-shirt",
    category: "what-to-wear",
    name: "Men's pearl-snap western shirt",
    blurb:
      "The unofficial Ella crowd uniform. Looks right, costs $25, fits in any venue.",
    query: "men's pearl snap western shirt",
    price: "$25-$45",
    why: "Works for cowboy-aesthetic without trying too hard. Wrangler is the safe pick.",
    image: img("photo-1769374090266-ae4e916abc75"),
    badge: "Crowd uniform",
  },
  {
    slug: "straw-cowboy-hat",
    category: "what-to-wear",
    name: "Men's lightweight straw cowboy hat",
    blurb:
      "Don't buy this for one show. But if you're doing the festival circuit, a good crushable straw lid is worth it.",
    query: "men's straw cowboy hat crushable",
    price: "$40-$80",
    why: "Resistol or Stetson via FlexOffers are the lifetime picks. The $20 versions look $20 and won't survive Stagecoach.",
    image: img("photo-1626792625154-36f7e192df1e"),
    badge: "Festival lid",
  },
  {
    slug: "mens-denim-jacket",
    category: "what-to-wear",
    name: "Men's classic denim trucker jacket",
    blurb:
      "Layers easily over a pearl-snap when the temp drops after sunset. Levi's, Wrangler, Lee — all under $80.",
    query: "men's denim trucker jacket",
    price: "$50-$90",
    why: "Spring/fall amphitheatre shows get cold after sunset. A trucker jacket layers without bulking you up and pairs with everything else in this section.",
    image: img("photo-1769374086235-2df32fa530d6"),
    badge: "Layer up",
  },
  {
    slug: "western-leather-belt",
    category: "what-to-wear",
    name: "Tooled leather belt with western buckle",
    blurb:
      "A real leather belt with a tooled western buckle. Finishes the look without trying too hard.",
    query: "men's western leather belt tooled buckle",
    price: "$35-$75",
    why: "If you're already in boots and a snap, a cheap web belt looks off. A real leather western belt grounds the outfit.",
    image: img("photo-1776951128893-5ca65057d63c"),
    badge: "Finishing touch",
  },

  // FAN COLLECTION
  {
    slug: "dandelion-vinyl",
    category: "fan-collection",
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
    slug: "hungover-vinyl",
    category: "fan-collection",
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
    slug: "country-music-tees",
    category: "fan-collection",
    name: "Country Now / Whiskey Riff men's tees",
    blurb:
      "Country-blog tees are a vibe. Cheaper than band merch and you'll get nods from other fans in line.",
    query: "Whiskey Riff country music men's t-shirt",
    price: "$22-$30",
    why: "Pairs well with denim and a Stetson. Less try-hard than an actual artist tee.",
    image: img("photo-1521572163474-6864f9cf17ab"),
    badge: "Apparel",
  },

  // TRAVEL PREP
  {
    slug: "underseat-duffel",
    category: "travel-prep",
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
    slug: "dopp-kit",
    category: "travel-prep",
    name: "Dopp kit / toiletry organizer",
    blurb:
      "Keeps your razor, deodorant, and chargers from rattling around in the duffel.",
    query: "men's leather dopp kit toiletry bag",
    price: "$15-$30",
    why: "If you're driving to Stagecoach or hopping to a stadium date, a solid dopp kit saves the carry-on chaos.",
    image: img("photo-1535632787350-4e68ef0ac584"),
    badge: "Organize",
  },
];

export function getAllProducts(): ShopProduct[] {
  return SHOP_PRODUCTS;
}

export function getProduct(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ShopCategorySlug): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.category === category);
}

/**
 * Pick a handful of featured products to show on the homepage.
 * Currently: 2 "what-to-wear" + 2 "concert-essentials" so a homepage visitor sees both clothes and gear.
 */
export function getFeaturedProducts(): ShopProduct[] {
  return [
    SHOP_PRODUCTS.find((p) => p.slug === "mens-western-boots")!,
    SHOP_PRODUCTS.find((p) => p.slug === "pearl-snap-western-shirt")!,
    SHOP_PRODUCTS.find((p) => p.slug === "straw-cowboy-hat")!,
    SHOP_PRODUCTS.find((p) => p.slug === "mens-denim-jacket")!,
    SHOP_PRODUCTS.find((p) => p.slug === "high-fidelity-concert-earplugs")!,
    SHOP_PRODUCTS.find((p) => p.slug === "portable-charger-10k")!,
    SHOP_PRODUCTS.find((p) => p.slug === "western-leather-belt")!,
    SHOP_PRODUCTS.find((p) => p.slug === "dandelion-vinyl")!,
  ];
}
