/**
 * Licensed photo registry.
 *
 * EVERY photo we publish must be one we are legally allowed to publish.
 * Two kinds live here:
 *   - rights: "owned"  — the owner's own photos (he confirmed full rights 2026-07-30).
 *                        Rendered with a caption and an "Ella Fellas photo" line.
 *   - rights: "cc"     — Creative Commons files, credited TASL-style with the
 *                        photographer, source and license, all linked.
 *
 * Press/wire/Getty photos and screenshots of her socials are NOT allowed unless
 * the owner confirms rights and adds them here.
 *
 * To add a photo:
 *  1. Confirm we have the rights.
 *  2. Save a web-sized copy (max 1400px wide, q82 progressive JPEG) to public/images/ella/.
 *  3. Add an entry below, including `focus` (see note) and `tags`.
 */

export interface CreditedPhoto {
  id: string;
  /** Path under /public. */
  src: string;
  width: number;
  height: number;
  /** Descriptive alt text. Never starts with "image of". */
  alt: string;
  /** Short caption shown under the photo. Never invents a venue or date. */
  caption: string;
  rights: "owned" | "cc";
  /** CC only: photographer / rights holder, exactly as credited at the source. */
  photographer?: string;
  sourceName?: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string;
  /**
   * CSS object-position for cropped contexts (index cards, capped hero).
   * Concert shots put the subject well below centre, so a plain object-cover
   * crop lands on a guitar or an elbow. Point this at her face.
   */
  focus: string;
  /**
   * True only for files big enough to fill the large featured tile on /news
   * (~1150px wide) without visible softness. Smaller photos are still great in
   * the grid cards and inline figures.
   */
  hero?: boolean;
  /**
   * Topic hints. If one appears in a post's slug or title, that photo is
   * preferred for the post — a Miranda Lambert duet story should not lead with
   * a solo festival shot when we have the actual duet photo.
   */
  tags: string[];
}

export const ELLA_PHOTOS: CreditedPhoto[] = [
  {
    id: "red-dress-entrance",
    hero: true,
    src: "/images/ella/ella-langley-dandelion-tour-red-dress-entrance.jpg",
    width: 1400,
    height: 787,
    alt: "Ella Langley walking out through a red stage curtain in a red fringed dress and boots under a burst of golden light on the Dandelion Tour",
    caption: "Ella Langley making her entrance on the Dandelion Tour.",
    rights: "owned",
    focus: "50% 32%",
    tags: ["dandelion", "tour", "headline", "arena", "record", "no-1", "hot-100", "weeks"],
  },
  {
    id: "leopard-festival",
    hero: true,
    src: "/images/ella/ella-langley-festival-set-leopard-dress.jpg",
    width: 960,
    height: 1439,
    alt: "Ella Langley singing with her hair mid-flip in a leopard-print dress and black cowboy boots during a daytime festival set",
    caption: "Ella Langley during a daytime festival set.",
    rights: "owned",
    focus: "50% 18%",
    tags: ["festival", "bluesfest", "stagecoach", "fest", "summer", "outfit", "wear", "boots", "style"],
  },
  {
    id: "festival-mainstage",
    hero: true,
    src: "/images/ella/ella-langley-lakeshake-style-festival-stage.jpg",
    width: 1024,
    height: 683,
    alt: "Ella Langley on a festival main stage with her name on the video wall and a packed daytime crowd in front of the barricade",
    caption: "Ella Langley on a festival main stage in front of a full field.",
    rights: "owned",
    focus: "50% 40%",
    tags: ["crowd", "fans", "festival", "recap", "setlist", "show", "attendance", "sold-out"],
  },
  {
    id: "leopard-jumpsuit-night",
    hero: true,
    src: "/images/ella/ella-langley-stage-wide-crowd.jpg",
    width: 1056,
    height: 542,
    alt: "Ella Langley singing with one arm raised in a leopard-print jumpsuit and sunglasses, her name lit on the backdrop behind the band",
    caption: "Ella Langley headlining, name up in lights behind the band.",
    rights: "owned",
    focus: "50% 25%",
    tags: ["headline", "tickets", "tour", "presale", "on-sale", "set-time", "night", "openers"],
  },
  {
    id: "miranda-lambert-duet",
    src: "/images/ella/ella-langley-miranda-lambert-duet.jpg",
    width: 760,
    height: 519,
    alt: "Ella Langley and Miranda Lambert holding hands and smiling on stage together under purple lights",
    caption: "Ella Langley on stage with Miranda Lambert.",
    rights: "owned",
    focus: "50% 30%",
    tags: ["miranda", "lambert", "duet", "collab", "collaboration", "featuring", "guest", "shania", "wallen", "hardy", "gretchen"],
  },
  {
    id: "fest-2026",
    hero: true,
    src: "/images/ella/ella-langley-5-oclock-somewhere-fest-2026.jpg",
    width: 1021,
    height: 1534,
    alt: "Ella Langley singing into a handheld microphone in a green dress under warm stage light at Alan Jackson's 5 O'Clock Somewhere Fest in June 2026",
    caption:
      "Ella Langley at Alan Jackson's 5 O'Clock Somewhere Fest in West Palm Beach, Florida, June 12, 2026.",
    rights: "cc",
    photographer: "Rick Munroe",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ella_Langley_2026.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    focus: "50% 18%",
    tags: ["chart", "billboard", "single", "song", "meaning", "lyrics"],
  },
  {
    id: "grand-rapids-2025",
    hero: true,
    src: "/images/ella/ella-langley-grand-rapids-2025.jpg",
    width: 1215,
    height: 1620,
    alt: "Ella Langley playing an acoustic guitar at a microphone stand on a small club stage in Grand Rapids, Michigan in February 2025",
    caption:
      "Ella Langley at The Intersection in Grand Rapids, Michigan, February 27, 2025 — a club show, a year before the arenas.",
    rights: "cc",
    photographer: "BrDen",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ella_Langley_in_Concert_2025.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    focus: "50% 30%",
    tags: ["early", "beginning", "club", "plant", "timeline", "guitar", "writing", "story"],
  },
  {
    id: "white-lace-portrait",
    src: "/images/ella/ella-langley-white-lace-floral-portrait.jpg",
    width: 452,
    height: 678,
    alt: "Ella Langley in a white lace dress with one hand raised to her hair, posed against a wall of flowers",
    caption: "Ella Langley in a floral-set portrait session.",
    rights: "owned",
    focus: "50% 20%",
    tags: ["dandelion", "album", "portrait", "era", "cover", "single"],
  },
  {
    id: "outdoor-deck-portrait",
    src: "/images/ella/ella-langley-outdoor-portrait-deck.jpg",
    width: 452,
    height: 678,
    alt: "Ella Langley lying on a wooden deck outdoors in a red top, propped on her elbows and looking into the camera",
    caption: "Ella Langley in an outdoor portrait session.",
    rights: "owned",
    focus: "50% 30%",
    tags: ["interview", "story", "profile", "hometown", "alabama", "writing", "meaning"],
  },
  {
    id: "white-dress-red-lights",
    src: "/images/ella/ella-langley-white-dress-red-lights.jpg",
    width: 678,
    height: 452,
    alt: "Ella Langley singing with both arms flung wide in a white ruffled dress, washed in red and gold stage light",
    caption: "Ella Langley mid-song under red and gold stage light.",
    rights: "owned",
    focus: "50% 25%",
    tags: ["encore", "show", "recap", "night", "arena", "headline"],
  },
  {
    id: "black-sequin-festival",
    src: "/images/ella/ella-langley-black-sequin-festival.jpg",
    width: 399,
    height: 501,
    alt: "Ella Langley at the microphone in a black sequinned dress with the band behind her on an outdoor stage",
    caption: "Ella Langley on an outdoor stage in black sequins.",
    rights: "owned",
    focus: "50% 22%",
    tags: ["festival", "outdoor", "amphitheatre", "pavilion", "lawn", "set-time"],
  },
  {
    id: "red-telephone-portrait",
    src: "/images/ella/ella-langley-red-telephone-portrait.jpg",
    width: 678,
    height: 452,
    alt: "Ella Langley holding a vintage red telephone receiver to her ear in glasses and a black blazer against a red backdrop",
    caption: "Ella Langley in a red-backdrop press portrait.",
    rights: "owned",
    focus: "50% 35%",
    tags: ["announce", "news", "statement", "interview", "call", "radio", "airplay"],
  },
  {
    id: "cream-tee-floral-set",
    src: "/images/ella/ella-langley-cream-tee-floral-set.jpg",
    width: 596,
    height: 335,
    alt: "Ella Langley smiling in a cream tee in front of flowers and an acoustic guitar on a bright set",
    caption: "Ella Langley on a press set with flowers and a guitar.",
    rights: "owned",
    focus: "50% 35%",
    tags: ["merch", "shop", "brand", "campaign", "partnership", "american-eagle", "style"],
  },
  {
    id: "club-blue-light",
    src: "/images/ella/ella-langley-club-stage-blue-light.jpg",
    width: 556,
    height: 551,
    alt: "Ella Langley at the microphone in a dark lace kimono, lit blue and purple with the crowd silhouetted in front of her",
    caption: "Ella Langley on a blue-lit club stage.",
    rights: "owned",
    focus: "50% 28%",
    tags: ["club", "early", "small", "intimate", "acoustic", "opener"],
  },
  {
    id: "tambourine-corset",
    src: "/images/ella/ella-langley-tambourine-corset.jpg",
    width: 738,
    height: 411,
    alt: "Ella Langley playing a tambourine at the mic stand in a black corset top under warm amber light",
    caption: "Ella Langley on tambourine mid-set.",
    rights: "owned",
    focus: "50% 28%",
    tags: ["band", "setlist", "cover", "song", "played", "debut"],
  },
  {
    id: "black-fringe-magenta",
    src: "/images/ella/ella-langley-black-fringe-magenta.jpg",
    width: 568,
    height: 540,
    alt: "Ella Langley in a black fringed halter top and concho belt, pushing her hair back under magenta stage light",
    caption: "Ella Langley in black fringe under magenta light.",
    rights: "owned",
    focus: "50% 20%",
    tags: ["outfit", "wear", "boots", "belt", "look", "fashion", "style"],
  },
  {
    id: "miranda-pyro-wide",
    src: "/images/ella/ella-langley-miranda-lambert-wide-pyro.jpg",
    width: 678,
    height: 452,
    alt: "Ella Langley and Miranda Lambert performing together on a wide stage with pyrotechnics and the band behind them",
    caption: "Ella Langley and Miranda Lambert on stage together.",
    rights: "owned",
    focus: "50% 40%",
    tags: ["miranda", "lambert", "duet", "collab", "awards", "cma", "acm"],
  },
  {
    id: "miranda-flames",
    src: "/images/ella/ella-langley-miranda-lambert-flames.jpg",
    width: 654,
    height: 468,
    alt: "Ella Langley and Miranda Lambert singing side by side with columns of flame shooting up behind them",
    caption: "Ella Langley and Miranda Lambert mid-performance.",
    rights: "owned",
    focus: "50% 32%",
    tags: ["miranda", "lambert", "duet", "collaboration", "performance", "televised"],
  },
  {
    id: "duet-guitarist",
    src: "/images/ella/ella-langley-duet-cowboy-hat-guitarist.jpg",
    width: 638,
    height: 480,
    alt: "Ella Langley singing a duet with a guitarist in a cowboy hat, both at microphones under pink stage lights",
    caption: "Ella Langley trading verses on a duet.",
    rights: "owned",
    focus: "50% 35%",
    tags: ["duet", "featuring", "riley", "green", "wallen", "guest", "collab", "shania", "gretchen"],
  },
  {
    id: "white-embroidered-dress",
    src: "/images/ella/ella-langley-white-embroidered-dress.jpg",
    width: 451,
    height: 679,
    alt: "Ella Langley singing into a handheld mic in a long white embroidered dress under cool blue and purple light",
    caption: "Ella Langley in white, mid-song.",
    rights: "owned",
    focus: "50% 22%",
    tags: ["ballad", "acoustic", "slow", "meaning", "lyrics", "weren", "wind"],
  },
  {
    id: "closeup-checkered",
    src: "/images/ella/ella-langley-closeup-checkered-backdrop.jpg",
    width: 480,
    height: 359,
    alt: "Close-up of Ella Langley singing into a handheld microphone in front of a bright checkered backdrop",
    caption: "Ella Langley close up on a festival stage.",
    rights: "owned",
    focus: "50% 30%",
    tags: ["viral", "speech", "moment", "clip", "video", "fans"],
  },
  {
    id: "black-leather-arm-raised",
    src: "/images/ella/ella-langley-black-leather-arm-raised.jpg",
    width: 678,
    height: 452,
    alt: "Ella Langley in a black leather outfit and concho belt with one arm raised to the crowd, guitarist behind her in warm light",
    caption: "Ella Langley working the crowd mid-set.",
    rights: "owned",
    focus: "50% 25%",
    tags: ["crowd", "sold-out", "tickets", "resale", "arena", "record", "no-1"],
  },
];

export function getPhoto(id?: string): CreditedPhoto | undefined {
  if (!id) return undefined;
  return ELLA_PHOTOS.find((p) => p.id === id);
}

function scoreForPost(photo: CreditedPhoto, haystack: string): number {
  return photo.tags.reduce((n, t) => (haystack.includes(t) ? n + 1 : n), 0);
}

export interface PhotoAssignable {
  slug: string;
  frontmatter: { title?: string; heroPhoto?: string };
}

/**
 * Assign a photo to every post in one pass over the (date-sorted) feed.
 *
 * Three rules, in order:
 *  1. An explicit `heroPhoto` in frontmatter always wins.
 *  2. Otherwise prefer a photo whose topic tags match the slug/title, so a duet
 *     story gets the duet photo.
 *  3. Never reuse a photo used by any of the three preceding posts, and
 *     otherwise take the least-recently-used photo. Three, not one: /news is a
 *     3-column grid, so post i sits directly BELOW post i-3 — blocking only the
 *     immediate neighbour still left the same picture stacked down a column.
 *
 * Deterministic, so a card thumbnail and that post's lead photo always agree.
 */
export function assignPhotos(posts: PhotoAssignable[]): Map<string, CreditedPhoto> {
  const out = new Map<string, CreditedPhoto>();
  const lastUsedAt = new Map<string, number>();
  const recent: string[] = [];

  posts.forEach((post, i) => {
    const explicit = getPhoto(post.frontmatter.heroPhoto);
    // Card 0 renders as a large featured tile, so it needs a high-res file.
    const candidates = i === 0 ? ELLA_PHOTOS.filter((p) => p.hero) : ELLA_PHOTOS;
    let chosen: CreditedPhoto;

    if (explicit) {
      chosen = explicit;
    } else {
      const haystack = `${post.slug} ${post.frontmatter.title ?? ""}`.toLowerCase();
      const blocked = new Set(recent.slice(-3));
      const eligible = candidates.filter((p) => !blocked.has(p.id));
      const pool = eligible.length ? eligible : candidates;

      let best = pool[0];
      let bestScore = -1;
      let bestIdle = -1;
      for (const p of pool) {
        const score = scoreForPost(p, haystack);
        const idle = i - (lastUsedAt.get(p.id) ?? -ELLA_PHOTOS.length);
        if (score > bestScore || (score === bestScore && idle > bestIdle)) {
          best = p;
          bestScore = score;
          bestIdle = idle;
        }
      }
      chosen = best;
    }

    out.set(post.slug, chosen);
    lastUsedAt.set(chosen.id, i);
    recent.push(chosen.id);
  });

  return out;
}
