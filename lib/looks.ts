/**
 * "SHOP THE LOOK" — curated outfit + gear collections for an Ella Langley show.
 *
 * Each look references ONLY real product slugs that exist in lib/shop-catalog.ts
 * (every one has a verified Amazon ASIN). Do NOT add a slug here that is not in
 * the catalog — getLookProducts() filters out unknowns, so a typo silently drops
 * the item rather than shipping a broken link.
 */
import { getProduct, type ShopProduct } from "./shop";

export interface Look {
  slug: string;
  title: string;
  tagline: string;
  vibe: string;
  occasion: string;
  productSlugs: string[];
}

export const LOOKS: Look[] = [
  {
    slug: "festival-day-heat",
    title: "Festival Day Heat",
    tagline: "All-day sun, no melting",
    occasion: "Outdoor festival · daytime",
    vibe:
      "Railbird, Stagecoach, any all-day bill where you are on your feet from noon. Breathable layers, a straw lid for shade, and the gear that keeps you cool and charged until the headliner.",
    productSlugs: [
      "ww-venado-henley",
      "ww-resistol-denison-straw",
      "ww-levis-501-original",
      "ec-cooling-towel-2pk",
      "ec-hydroflask-24",
      "ec-anker-powercore-10k",
    ],
  },
  {
    slug: "arena-night",
    title: "Arena Night",
    tagline: "Indoor lights, clean fit",
    occasion: "Arena · evening",
    vibe:
      "Moody Center, Dickies Arena, the indoor headline rooms. A sharp pearl-snap, real boots, and a leather belt that pulls it together — plus earplugs so you actually hear the encore.",
    productSlugs: [
      "ww-wrangler-cowboy-cut",
      "ww-ariat-heritage-roughstock",
      "ww-chaoren-western-belt",
      "ww-levis-501-original",
      "ec-loop-experience-2",
      "ec-clear-stadium-bag",
    ],
  },
  {
    slug: "stagecoach-western",
    title: "Stagecoach Western",
    tagline: "Full Western, dialed up",
    occasion: "Festival · go-big Western",
    vibe:
      "When the dress code is the whole point. Felt hat, suede vest, a turquoise bolo and the boots to back it up. This is the look that gets the nods in the beer line.",
    productSlugs: [
      "ww-stetson-skyline",
      "ww-leather-vest-western",
      "ww-bolo-tie-silver",
      "ww-ariat-heritage-roughstock",
      "ww-chaoren-western-belt",
      "ww-pendleton-board-shirt",
    ],
  },
  {
    slug: "honky-tonk-night",
    title: "Honky-Tonk Night",
    tagline: "Two-step ready",
    occasion: "Bar / club show · late",
    vibe:
      "Small room, sticky floor, a band that plays till last call. Move-in-it boots, a flannel you can tie around your waist when it gets warm, and a flask for the walk between bars.",
    productSlugs: [
      "ww-ariat-rebar-flannel",
      "ww-levis-501-original",
      "ww-ariat-heritage-roughstock",
      "ww-trucker-cap-low-pro",
      "wb-stanley-classic-flask",
      "ec-collapsible-cup",
    ],
  },
  {
    slug: "amphitheater-lawn",
    title: "Amphitheater Lawn",
    tagline: "Sunset-to-chilly comfort",
    occasion: "Amphitheater · lawn seats",
    vibe:
      "Koka Booth, CMAC, the outdoor sheds where it is warm at doors and cold by the encore. Layer a trucker jacket over a henley, bring a blanket for the grass, and pack binoculars for the cheap seats.",
    productSlugs: [
      "ww-venado-henley",
      "ww-levis-trucker-jacket",
      "ec-blanket-waterproof",
      "ec-compact-binoculars-10x25",
      "ec-hydroflask-24",
      "ec-anker-powercore-10k",
    ],
  },
  {
    slug: "first-concert-starter",
    title: "First Concert Starter",
    tagline: "Everything, nothing fancy",
    occasion: "Your first show · any venue",
    vibe:
      "Never been to a country show? Start here. A pearl-snap, jeans, a belt, and the four essentials that keep the night from going sideways — earplugs, a charger, a clear bag, water.",
    productSlugs: [
      "ww-wrangler-cowboy-cut",
      "ww-levis-501-original",
      "ww-chaoren-western-belt",
      "ec-loop-experience-2",
      "ec-anker-powercore-10k",
      "ec-clear-stadium-bag",
    ],
  },
  {
    slug: "tailgate",
    title: "Tailgate Kingdom",
    tagline: "Four hours before doors",
    occasion: "Parking lot · pre-show",
    vibe:
      "The show before the show. A real cooler, a chair you will not break, cornhole, and a thermos of whatever gets you through the wait. Wear the trucker cap and a henley you do not mind spilling on.",
    productSlugs: [
      "to-yeti-tundra-45",
      "to-coleman-camp-chair",
      "to-corn-hole-set",
      "to-stanley-thermos",
      "ww-trucker-cap-low-pro",
      "ww-venado-henley",
    ],
  },
  {
    slug: "rain-ready",
    title: "Rain-Ready",
    tagline: "When the forecast turns",
    occasion: "Outdoor · wet weather",
    vibe:
      "Half the outdoor dates flirt with a rain delay. A packable shell, ponchos for the crew, a waterproof-backed blanket and a cap keep the night going when the sky opens up.",
    productSlugs: [
      "ec-foldable-rain-jacket",
      "ec-rain-poncho-5pk",
      "ec-blanket-waterproof",
      "ww-trucker-cap-low-pro",
      "ec-anker-powercore-10k",
      "ec-airtag-keychain",
    ],
  },
  {
    slug: "going-out-western",
    title: "Going-Out Western",
    tagline: "Date-night sharp",
    occasion: "Date night / nicer room",
    vibe:
      "When you want to look like you tried without looking like a costume. A clean henley, a felt hat, a leather watch and good boots. Quiet money, country edition.",
    productSlugs: [
      "ww-venado-henley",
      "ww-stetson-skyline",
      "ww-shinola-runaround-watch",
      "ww-ariat-heritage-roughstock",
      "ww-chaoren-western-belt",
      "g50-leather-card-wallet",
    ],
  },
  {
    slug: "classic-denim-and-boots",
    title: "Classic Denim & Boots",
    tagline: "Can't-miss default",
    occasion: "Any show · the safe call",
    vibe:
      "The uniform that works at every venue on the tour. Jeans, boots, a graphic tee and a denim trucker for when the sun drops. Add the earplugs and you are set.",
    productSlugs: [
      "fc-cash-tee-graphic",
      "ww-levis-501-original",
      "ww-ariat-heritage-roughstock",
      "ww-levis-trucker-jacket",
      "ww-chaoren-western-belt",
      "ec-loop-experience-2",
    ],
  },

  {
    slug: "cowgirl-festival-day",
    title: "Cowgirl Festival Day",
    tagline: "All-day Stagecoach uniform",
    occasion: "Outdoor festival · daytime",
    vibe:
      "Railbird, Stagecoach, any all-day bill in the sun. A fitted rodeo dress, real cowgirl boots, a felt brim for shade, and the fringe and turquoise that make the crowd photos. Light enough to dance in from noon to the headliner.",
    productSlugs: [
      "wfw-verdusa-rodeo-dress",
      "wfw-iuv-festival-boots",
      "wfw-felt-wide-brim-hat",
      "wfw-milumia-fringe-vest",
      "wfw-avecon-feather-earrings",
      "wfw-ruffle-boot-socks",
    ],
  },
  {
    slug: "nashville-night-out-her",
    title: "Nashville Night Out",
    tagline: "Broadway-ready, dialed up",
    occasion: "Bar / club show · late",
    vibe:
      "Lower Broadway, a honky-tonk crawl, the kind of night that ends at last call. A backless fringe romper or an embroidered shirt dress, the comfortable boots you can two-step in, a fringe jacket for when it cools off, and turquoise to finish it.",
    productSlugs: [
      "wfw-ella-lust-fringe-romper",
      "wfw-hisea-rollda-boots",
      "wfw-prettygarden-fringe-jacket",
      "wfw-turquoise-dangle-earrings",
      "wfw-beaudrm-concho-belt",
      "wfw-inogih-fedora-hat",
    ],
  },
];

export function getAllLooks(): Look[] {
  return LOOKS;
}

export function getLook(slug: string): Look | undefined {
  return LOOKS.find((l) => l.slug === slug);
}

export function getLookProducts(look: Look): ShopProduct[] {
  return look.productSlugs
    .map((s) => getProduct(s))
    .filter((p): p is ShopProduct => Boolean(p));
}

export function getLookTotal(look: Look): number {
  return getLookProducts(look).reduce((sum, p) => {
    const m = p.price?.match(/\$([\d.]+)/);
    return sum + (m ? parseFloat(m[1]) : 0);
  }, 0);
}

export function getLooksForProduct(productSlug: string): Look[] {
  return LOOKS.filter((l) => l.productSlugs.includes(productSlug));
}

export const GUIDE_LOOK_MAP: Record<string, string[]> = {
  "what-to-wear-to-an-ella-langley-concert": [
    "classic-denim-and-boots",
    "arena-night",
    "going-out-western",
  ],
  "country-concert-outfit-ideas-women": [
    "festival-day-heat",
    "stagecoach-western",
    "going-out-western",
  ],
  "ella-langley-concert-checklist": ["first-concert-starter", "rain-ready"],
  "what-to-bring-ella-langley-concert": ["first-concert-starter", "tailgate"],
  "best-cowboy-boots-for-a-country-concert": [
    "classic-denim-and-boots",
    "honky-tonk-night",
  ],
  "best-cowboy-hats-for-a-country-concert": [
    "stagecoach-western",
    "festival-day-heat",
  ],
  "ella-langley-dandelion-tour-survival-guide": ["rain-ready", "amphitheater-lawn"],
  "ella-langley-arena-vs-festival": ["arena-night", "festival-day-heat"],
};

export function getLooksForGuide(guideSlug: string): Look[] {
  return (GUIDE_LOOK_MAP[guideSlug] ?? [])
    .map((s) => getLook(s))
    .filter((l): l is Look => Boolean(l));
}
