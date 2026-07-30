/**
 * Licensed photo registry.
 *
 * EVERY photo we publish must be one we are legally allowed to publish, with
 * attribution rendered on the page. Right now that means Creative Commons
 * images from Wikimedia Commons, credited TASL-style (Title, Author, Source,
 * License). Press/wire/Getty photos and screenshots of her socials are NOT
 * allowed here — we do not have a license for them.
 *
 * To add a photo:
 *  1. Confirm the license on the Commons file page (CC BY / CC BY-SA / PD only).
 *  2. Save a web-sized copy (max 1400px wide, q82 JPEG) to public/images/ella/.
 *  3. Add an entry below with the photographer, file page URL, and license URL.
 */

export interface CreditedPhoto {
  id: string;
  /** Path under /public. */
  src: string;
  width: number;
  height: number;
  /** Descriptive alt text. Never starts with "image of". */
  alt: string;
  /** Short caption shown under the photo. */
  caption: string;
  /** Photographer / rights holder, exactly as credited at the source. */
  photographer: string;
  /** Link to the source file page. */
  sourceName: string;
  sourceUrl: string;
  /** e.g. "CC BY-SA 4.0" */
  license: string;
  licenseUrl: string;
  /**
   * CSS object-position for cropped contexts (index cards, capped hero).
   * Concert shots put the subject well below centre, so a plain object-cover
   * crop lands on a guitar or an elbow. Point this at her face.
   */
  focus: string;
}

export const ELLA_PHOTOS: CreditedPhoto[] = [
  {
    id: "fest-2026",
    src: "/images/ella/ella-langley-5-oclock-somewhere-fest-2026.jpg",
    width: 1021,
    height: 1534,
    alt: "Ella Langley singing into a microphone stand under stage lights at Alan Jackson's 5 O'Clock Somewhere Fest in West Palm Beach, June 2026",
    caption:
      "Ella Langley on stage at Alan Jackson's 5 O'Clock Somewhere Fest in West Palm Beach, Florida, June 12, 2026.",
    photographer: "Rick Munroe",
    sourceName: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ella_Langley_2026.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    focus: "50% 18%",
  },
  {
    id: "grand-rapids-2025",
    src: "/images/ella/ella-langley-grand-rapids-2025.jpg",
    width: 1215,
    height: 1620,
    alt: "Ella Langley performing with a guitar at The Intersection in Grand Rapids, Michigan in February 2025",
    caption:
      "Ella Langley at The Intersection in Grand Rapids, Michigan, February 27, 2025 — a club show, a year before the arenas.",
    photographer: "BrDen",
    sourceName: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Ella_Langley_in_Concert_2025.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    focus: "50% 30%",
  },
];

export function getPhoto(id?: string): CreditedPhoto | undefined {
  if (!id) return undefined;
  return ELLA_PHOTOS.find((p) => p.id === id);
}

/**
 * Pick by the post's position in the (date-sorted) news feed, so consecutive
 * posts never land on the same photo. Hashing the slug looked random but
 * produced visible runs of the same image down the index page — with a small
 * pool, rotating by position is strictly better. Deterministic, so the card
 * thumbnail and the article's lead photo always agree.
 */
export function pickPhotoByPosition(index: number): CreditedPhoto {
  const i = Number.isFinite(index) && index >= 0 ? index : 0;
  return ELLA_PHOTOS[i % ELLA_PHOTOS.length];
}
