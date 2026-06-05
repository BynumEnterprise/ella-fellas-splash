/**
 * Single source of truth for the shop catalog.
 * Used by /shop (index), /shop/category/[slug] (category page),
 * /shop/[slug] (product detail), and the homepage featured strip.
 *
 * The catalog lives in `lib/shop-catalog.ts` (200 curated products across
 * 10 categories). This file declares the shared interface, the category
 * registry, and the lookup helpers.
 */

import { EXTENDED_CATALOG } from "./shop-catalog";

export type ShopCategorySlug =
  | "concert-essentials"
  | "what-to-wear"
  | "fan-collection"
  | "travel-prep"
  | "whiskey-and-bar"
  | "home-and-ranch"
  | "audio-gear"
  | "gifts-under-50"
  | "tailgate-and-outdoors"
  | "books-and-media";

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

export interface ShopCategory {
  slug: ShopCategorySlug;
  title: string;
  /** Sub-tagline shown on the category landing page hero. */
  tagline: string;
  intro: string;
  /** Emoji or short tag used in the nav strip. */
  glyph?: string;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    slug: "concert-essentials",
    title: "CONCERT ESSENTIALS",
    tagline: "What stays in the bag",
    intro:
      "The five things every Ella show veteran keeps in their bag. Spend $40 once and you're set for the whole tour.",
    glyph: "🎤",
  },
  {
    slug: "what-to-wear",
    title: "WHAT TO WEAR",
    tagline: "The crowd uniform, done right",
    intro:
      "Men's gear that holds up at a 4-hour show. Jeans + boots + a button-down is the default — no costume required.",
    glyph: "👢",
  },
  {
    slug: "fan-collection",
    title: "FAN COLLECTION",
    tagline: "Vinyl, posters, the deep cuts",
    intro:
      "Vinyl, CDs, posters, and stuff worth owning. We link to whatever Amazon has — official Ella merch is at ellalangley.us.",
    glyph: "💿",
  },
  {
    slug: "travel-prep",
    title: "TRAVEL PREP",
    tagline: "For the fly-in-fly-out fellas",
    intro:
      "For the fellas flying in for a specific show — practical packing for a 36-hour music-trip.",
    glyph: "✈️",
  },
  {
    slug: "whiskey-and-bar",
    title: "WHISKEY & BAR",
    tagline: "The home bar that earns its keep",
    intro:
      "Glasses, decanters, ice molds, and bar tools for the pre-show round and the after-the-after-party. Country-honest, not corporate.",
    glyph: "🥃",
  },
  {
    slug: "home-and-ranch",
    title: "HOME & RANCH",
    tagline: "For the place you come home to",
    intro:
      "Leather, candles, cast iron, longhorn art, and rustic decor that makes a bachelor pad feel like a real place.",
    glyph: "🤠",
  },
  {
    slug: "audio-gear",
    title: "AUDIO & VINYL",
    tagline: "Hi-fi for the country shrine",
    intro:
      "Turntables, bookshelf speakers, headphones, and the cleaning/storage gear that keeps your records sounding right.",
    glyph: "🎧",
  },
  {
    slug: "gifts-under-50",
    title: "GIFTS UNDER $50",
    tagline: "For the birthday, the anniversary, the just-because",
    intro:
      "Curated under-$50 country-leaning gifts for the fan in your life — boyfriend, brother, the buddy who's always at every show.",
    glyph: "🎁",
  },
  {
    slug: "tailgate-and-outdoors",
    title: "TAILGATE & OUTDOORS",
    tagline: "Parking-lot kingdom",
    intro:
      "Coolers, folding chairs, bottle openers, tailgate games, and fire pits. Built for the four hours before the show too.",
    glyph: "🔥",
  },
  {
    slug: "books-and-media",
    title: "BOOKS & DOCS",
    tagline: "The country canon",
    intro:
      "Biographies, photography books, and documentaries that build the country-music vocabulary. From Hank to Ella.",
    glyph: "📚",
  },
];

/** The single source of truth for product data. */
export const SHOP_PRODUCTS: ShopProduct[] = EXTENDED_CATALOG;

export function getAllProducts(): ShopProduct[] {
  return SHOP_PRODUCTS;
}

export function getProduct(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ShopCategorySlug): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.category === category);
}

export function getCategory(slug: string): ShopCategory | undefined {
  return SHOP_CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Featured products for the homepage and /shop top strip.
 * Mix of categories with stronger brand names (Ariat, Loop, Levi's, Hydro Flask, Yeti, Bose, Wrangler).
 */
export function getFeaturedProducts(): ShopProduct[] {
  const picks = [
    "ww-ariat-heritage-roughstock",
    "ww-wrangler-cowboy-cut",
    "ww-resistol-denison-straw",
    "ww-levis-trucker-jacket",
    "ec-loop-experience-2",
    "ec-anker-powercore-10k",
    "ww-chaoren-western-belt",
    "fc-dandelion-vinyl",
  ];
  return picks
    .map((slug) => SHOP_PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is ShopProduct => Boolean(p));
}

/**
 * Parse a price string like "$24.99" or "$25-$45" or "$120-$250" into a
 * single number used for filtering / sorting. Returns the LOW end of a range.
 */
export function priceToNumber(price: string | undefined): number {
  if (!price) return 0;
  const m = price.match(/\$([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

/** Price buckets used for the filter UI. */
export const PRICE_BUCKETS = [
  { id: "under-25", label: "Under $25", min: 0, max: 25 },
  { id: "25-75", label: "$25 — $75", min: 25, max: 75 },
  { id: "75-150", label: "$75 — $150", min: 75, max: 150 },
  { id: "over-150", label: "Over $150", min: 150, max: Infinity },
] as const;

/** Minimum-rating filters used for the filter UI. */
export const RATING_FILTERS = [
  { id: "4plus", label: "4 stars & up", min: 4 },
  { id: "3plus", label: "3 stars & up", min: 3 },
] as const;

export type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

export function sortProducts(products: ShopProduct[], key: SortKey): ShopProduct[] {
  const arr = [...products];
  switch (key) {
    case "price-asc":
      return arr.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
    case "price-desc":
      return arr.sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
    case "rating":
      return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "popular":
    default:
      // Popularity proxy: review count × rating
      return arr.sort(
        (a, b) =>
          (b.reviewCount ?? 0) * (b.rating ?? 4) -
          (a.reviewCount ?? 0) * (a.rating ?? 4)
      );
  }
}
