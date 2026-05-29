/**
 * Single source of truth for the shop catalog.
 * Used by /shop (index), /shop/[slug] (detail), and the homepage gear section.
 *
 * Each product carries:
 *   - asin: the Amazon product ID (drives the affiliate link)
 *   - image / gallery: real Amazon product CDN images (m.media-amazon.com)
 *   - amazonTitle: the actual Amazon listing title (for trust + SEO)
 *   - rating / reviewCount: social-proof signals on the detail page
 *   - blurb / why: our editorial voice — why a fella should buy this
 */

export interface ShopProduct {
  slug: string;
  name: string;
  blurb: string;
  query?: string;
  asin?: string;
  price?: string;
  why: string;
  /** Hero image — real Amazon CDN product photo. */
  image: string;
  /** Short hashtag-style category badge shown over the image. */
  badge?: string;
  /** Additional Amazon product photos for the gallery thumbnails. */
  gallery?: string[];
  /** The actual Amazon listing title (for trust signal + SEO). */
  amazonTitle?: string;
  /** Star rating from Amazon (0-5). Drives the rating badge on detail page. */
  rating?: number;
  /** Total Amazon review count. Drives the social-proof callout. */
  reviewCount?: number;
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

export const SHOP_PRODUCTS: ShopProduct[] = [
  // CONCERT ESSENTIALS
  {
    slug: "high-fidelity-concert-earplugs",
    asin: "B0D4DS4FC8",
    category: "concert-essentials",
    name: "Loop Experience 2 Plus concert earplugs",
    amazonTitle: "Loop Experience 2 Plus Ear Plugs — Stylish Certified Hearing Protection for Concerts & Festivals",
    blurb:
      "Lowers volume without muffling vocals. You'll hear every word of 'Choosin' Texas' and not leave with your ears ringing.",
    query: "Loop Experience 2 Plus earplugs",
    price: "$44.95",
    rating: 4.6,
    reviewCount: 3828,
    why: "The viral pick for concert ear protection. 17dB reduction, swap-in Mute plugs for openers, and they actually look like jewelry — not foam plugs.",
    image: "https://m.media-amazon.com/images/I/518YIjNoXML._AC_SL1200_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/31er3TzLYHL._AC_SL1200_.jpg",
      "https://m.media-amazon.com/images/I/51-c9l1rdUL._AC_SL1200_.jpg",
      "https://m.media-amazon.com/images/I/31y7xy9CA2L._AC_SL1200_.jpg",
      "https://m.media-amazon.com/images/I/41AtwqvC1XL._AC_SL1200_.jpg",
    ],
    badge: "Ear protection",
  },
  {
    slug: "clear-stadium-crossbody",
    asin: "B0741GD3FS",
    category: "concert-essentials",
    name: "Clear stadium-approved crossbody",
    amazonTitle: "Clear Stadium Bag with Denim Trim — NFL NCAA PGA NASCAR Approved Crossbody",
    blurb:
      "Most stadiums on Morgan Wallen's tour now enforce clear-bag policy. Get a stadium-approved one before you go.",
    query: "clear stadium crossbody bag NFL approved",
    price: "$9.98",
    rating: 4.4,
    reviewCount: 216,
    why: "Soldier Field, Gillette, Acrisure, Lincoln Financial — all clear-bag stadiums. Cheaper to buy ahead than panic-buy at the gate.",
    image: "https://m.media-amazon.com/images/I/81BE47zzrFL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/51LROduCaDL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/51-hBJKyGAL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61y-ZZW8omL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/5138pMRlqqL._AC_SL1500_.jpg",
    ],
    badge: "Stadium-ready",
  },
  {
    slug: "portable-charger-10k",
    asin: "B07H7M1Z1Z",
    category: "concert-essentials",
    name: "Anker PowerCore 10,000 mAh charger",
    amazonTitle: "Anker PowerCore 10000 Portable Charger — Ultra-Compact Power Bank",
    blurb:
      "Doors open at 5:30 and you won't be home until midnight. Phones die fast at outdoor shows.",
    query: "Anker PowerCore 10000",
    price: "$21.99",
    rating: 4.6,
    reviewCount: 2133,
    why: "Anker is the trusted brand. 10K mAh is two full phone charges — enough for openers, headliner, and the rideshare home.",
    image: "https://m.media-amazon.com/images/I/51rmIu8bVtL._AC_SL1500_.jpg",
    gallery: ["https://m.media-amazon.com/images/I/31oPNx4TpOL._AC_SL1500_.jpg"],
    badge: "Stay charged",
  },
  {
    slug: "insulated-water-bottle",
    asin: "B01KXHIXSK",
    category: "concert-essentials",
    name: "Hydro Flask 24oz water bottle",
    amazonTitle: "Hydro Flask Water Bottle — Insulated Stainless Steel — 24oz Black",
    blurb:
      "Most venues let you bring an empty one in. Summer shows = expensive arena water unless you bring your own.",
    query: "Hydro Flask 24oz black",
    price: "$19.98",
    rating: 4.8,
    reviewCount: 10285,
    why: "Empty bottles pass security. $5 stadium water adds up fast across a tour.",
    image: "https://m.media-amazon.com/images/I/61v5ydIs6LL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/21lyHq8MYVL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/51hlKt+fbUL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/31EdAyqWxFL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61V0OAg3s-L._AC_SL1500_.jpg",
    ],
    badge: "Hydrate",
  },
  {
    slug: "rain-poncho",
    asin: "B076ZHMR3S",
    category: "concert-essentials",
    name: "Disposable rain ponchos (5-pack)",
    amazonTitle: "Hagon PRO Disposable Rain Ponchos for Adults (5 Pack)",
    blurb:
      "Half the Dandelion Tour dates are amphitheatres and outdoor. One rain delay justifies the $10.",
    query: "Hagon rain poncho 5 pack",
    price: "$9.99",
    rating: 4.5,
    reviewCount: 17962,
    why: "Estero, OKC, Cary, Salem — all outdoor venues. 5 in a pack covers the crew. Better to have one and not need it.",
    image: "https://m.media-amazon.com/images/I/51Y8sl82ozL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/410-FvgdSeL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/51mHH7HFrpL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/51Gx0dfx2IL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41lk+eFxgWL._AC_SL1500_.jpg",
    ],
    badge: "Weather-ready",
  },

  // WHAT TO WEAR
  {
    slug: "mens-western-boots",
    asin: "B00XB0HR1G",
    category: "what-to-wear",
    name: "Ariat Heritage Roughstock western boot",
    amazonTitle: "Ariat Men's Heritage Roughstock Western Cowboy Boot",
    blurb:
      "Real-deal cowboy boots from the brand that ranchers and rodeo riders actually wear. Break them in for a week first.",
    query: "Ariat Heritage Roughstock",
    price: "$169.95",
    why: "Avoid the $40 Halloween cowboy boots. You'll be standing for 4+ hours. Worth the upgrade — Ariat's ATS footbed is the only thing that gets you through three encores without your arches screaming.",
    image: "https://m.media-amazon.com/images/I/81nW2mG9VyL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/41k8-X4KlcL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/519fHy2okDL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41VkbZ477LL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/51IF6DNgaNL._AC_SL1500_.jpg",
    ],
    badge: "Built to last",
  },
  {
    slug: "pearl-snap-western-shirt",
    asin: "B000RF62QY",
    category: "what-to-wear",
    name: "Wrangler Cowboy Cut pearl-snap shirt",
    amazonTitle: "Wrangler Men's Cowboy Cut Western Long Sleeve Snap Work Shirt",
    blurb:
      "The unofficial Ella crowd uniform. Looks right, costs less than $40, fits in any venue.",
    query: "Wrangler Cowboy Cut snap shirt",
    price: "$29.50",
    rating: 4.4,
    reviewCount: 14977,
    why: "Wrangler's Cowboy Cut has been the rodeo-and-honky-tonk shirt for 50+ years. Pearl snaps so you can rip it open in the heat. Fits tapered if you're built, boxy if you're not.",
    image: "https://m.media-amazon.com/images/I/81xhXwkgDSL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/41LoYuGa4RL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41IQ6vdyGqL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/31a+LGZ-vML._AC_SL1500_.jpg",
    ],
    badge: "Crowd uniform",
  },
  {
    slug: "straw-cowboy-hat",
    asin: "B09824V8BS",
    category: "what-to-wear",
    name: "Resistol Denison 7X straw cowboy hat",
    amazonTitle: "RESISTOL Denison 7X Bangora Straw Cowboy Hat",
    blurb:
      "Don't buy this for one show. But if you're doing the festival circuit, a real Resistol is the buy-once-cry-once move.",
    query: "Resistol Denison straw cowboy hat",
    price: "$89.95",
    rating: 4.2,
    reviewCount: 421,
    why: "Resistol made hats for John Wayne, George Strait, and half of Nashville. The 7X Bangora straw is what real cowboys wear — vented, packable, holds shape after a sweaty stadium summer.",
    image: "https://m.media-amazon.com/images/I/517b4M0eV5L._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/21fFIwg-RsL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41wACHoFthL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/21bGSW-8jVL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/31dlIykgkOL._AC_SL1500_.jpg",
    ],
    badge: "Festival lid",
  },
  {
    slug: "mens-denim-jacket",
    asin: "B077TDS2G6",
    category: "what-to-wear",
    name: "Levi's Original Trucker denim jacket",
    amazonTitle: "Levi's Men's Trucker Jacket",
    blurb:
      "Layers easily over a pearl-snap when the temp drops after sunset. The single most-photographed jacket in country music.",
    query: "Levi's Trucker Jacket",
    price: "$78.99",
    rating: 4.6,
    reviewCount: 21119,
    why: "Spring and fall amphitheatre shows get cold after sunset. The Trucker layers without bulking you up, breaks in better the longer you own it, and pairs with everything else in this whole section.",
    image: "https://m.media-amazon.com/images/I/61H9t3DXhZL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/41rZ0y9-UlL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41ovybVNYIL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41VvZDCOsGL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41hf0NJK6xL._AC_SL1500_.jpg",
    ],
    badge: "Layer up",
  },
  {
    slug: "western-leather-belt",
    asin: "B09NZG637M",
    category: "what-to-wear",
    name: "CHAOREN western leather belt",
    amazonTitle: "CHAOREN Western Belts for Men — Cowboy Belt 1.5\" Full Grain Leather",
    blurb:
      "Full-grain leather, classic western width. Finishes the boots-and-snap look without trying too hard.",
    query: "CHAOREN western leather belt",
    price: "$28.99",
    rating: 4.5,
    reviewCount: 2958,
    why: "Real full-grain leather (not bonded) at a price that doesn't sting. Comes with two buckle options so it pairs whether you're going dressed-up or pasture-honest.",
    image: "https://m.media-amazon.com/images/I/817fmpxjsHL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/41nuDgXLJlL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/51xOS5vWsNL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41dklzhSQzL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41nLlDFuEvL._AC_SL1500_.jpg",
    ],
    badge: "Finishing touch",
  },

  // FAN COLLECTION
  {
    slug: "dandelion-vinyl",
    asin: "B0GK933R83",
    category: "fan-collection",
    name: "Dandelion (Ella Langley, vinyl)",
    amazonTitle: "Dandelion — Ella Langley",
    blurb:
      "Ella's second album, the one that broke her to the mainstream. Pressed by Columbia, widely available on Amazon.",
    query: "Ella Langley Dandelion vinyl",
    price: "$29.74",
    rating: 4.7,
    reviewCount: 230,
    why: "The album that made her a household name. Look for the colored variants — standard black is fine but the limited indie-store pressings will hold value if you keep them sealed.",
    image: "https://m.media-amazon.com/images/I/81d4noTXq6L._AC_SL1500_.jpg",
    gallery: ["https://m.media-amazon.com/images/I/41gOSO2-NaL._AC_SL1500_.jpg"],
    badge: "LP / 2026",
  },
  {
    slug: "hungover-vinyl",
    asin: "B0GKVFYQGW",
    category: "fan-collection",
    name: "Hungover (Ella Langley debut, plum vinyl)",
    amazonTitle: "hungover — Plum Colored Vinyl — Ella Langley",
    blurb:
      "Her 2024 debut, on a limited plum-colored pressing. Less polished, more honest. 'You Look Like You Love Me' lives here.",
    query: "Ella Langley Hungover vinyl",
    price: "$69.74",
    rating: 5.0,
    reviewCount: 5,
    why: "Best entry point if you're starting the collection. Includes the duet with Riley Green that made the whole world pay attention. The plum-color pressing is the collector's pick.",
    image: "https://m.media-amazon.com/images/I/51vBSH5TdDL._AC_SL1500_.jpg",
    gallery: ["https://m.media-amazon.com/images/I/412II358HJL._AC_SL1500_.jpg"],
    badge: "LP / 2024",
  },
  {
    slug: "country-music-tees",
    category: "fan-collection",
    name: "Country / Nashville graphic tees",
    blurb:
      "Vintage-style country graphic tees — Nashville, Tennessee, classic country lettering. Browse the Amazon picks.",
    query: "vintage country music graphic tee mens",
    price: "$18-$30",
    why: "Pairs well with denim and a Stetson. Less try-hard than an artist tee, and you'll get nods from other fans in line. We link to the curated search — pick whichever city or motto fits.",
    image: "https://m.media-amazon.com/images/I/61H9t3DXhZL._AC_SL1500_.jpg",
    badge: "Apparel",
  },

  // TRAVEL PREP
  {
    slug: "underseat-duffel",
    asin: "B0D7BS89HH",
    category: "travel-prep",
    name: "STOVER convertible carry-on duffel",
    amazonTitle: "STOVER Garment Travel Duffle Bag — 2-in-1 Convertible Carry-on",
    blurb:
      "Fits boots + outfit changes + chargers + a hanging suit. Goes under the seat on Southwest and Delta.",
    query: "STOVER garment travel duffel carry-on",
    price: "$69.99",
    rating: 4.0,
    reviewCount: 235,
    why: "Skip the checked bag. Hanging suit compartment means your snap shirt arrives wrinkle-free, and the standard duffel layout still fits boots and a charger pouch. Faster off the plane, no bag fee.",
    image: "https://m.media-amazon.com/images/I/71rpMjCpw9L._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/41WY1uIzYvL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41FGBozvknL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41Fkrk3yypL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41t+yjO86OL._AC_SL1500_.jpg",
    ],
    badge: "Carry-on",
  },
  {
    slug: "dopp-kit",
    asin: "B073558TLB",
    category: "travel-prep",
    name: "Aaron Leather vintage dopp kit",
    amazonTitle: "Aaron Leather Goods Premium Vintage Leather Dopp Kit",
    blurb:
      "Real leather, waterproof lining, fits a razor, deodorant, cologne, and your chargers without bulging.",
    query: "Aaron Leather Goods dopp kit",
    price: "$39.99",
    rating: 4.7,
    reviewCount: 5678,
    why: "If you're driving to Stagecoach or hopping to a stadium date, a solid dopp kit saves the carry-on chaos. The waterproof lining means a leaked-cologne bottle doesn't ruin everything.",
    image: "https://m.media-amazon.com/images/I/81EfjG8aXzL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/41QRN-H6qSL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41OGOUgqClL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41ETym18y1L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/41V-T51zqzL._AC_SL1500_.jpg",
    ],
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
 * Mix of what-to-wear, concert-essentials, fan-collection so a homepage visitor sees variety.
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
