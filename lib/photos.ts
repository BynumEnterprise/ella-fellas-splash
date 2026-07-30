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
   * Topic hints. If one appears in a post's slug or title, that photo is
   * preferred for the post — a Miranda Lambert duet story should not lead with
   * a solo festival shot when we have the actual duet photo.
   */
  tags: string[];
}

export const ELLA_PHOTOS: CreditedPhoto[] = [
  {
    id: "red-dress-entrance",
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
    let chosen: CreditedPhoto;

    if (explicit) {
      chosen = explicit;
    } else {
      const haystack = `${post.slug} ${post.frontmatter.title ?? ""}`.toLowerCase();
      const blocked = new Set(recent.slice(-3));
      const eligible = ELLA_PHOTOS.filter((p) => !blocked.has(p.id));
      const pool = eligible.length ? eligible : ELLA_PHOTOS;

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
