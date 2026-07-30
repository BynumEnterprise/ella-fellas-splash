export type TourType = "headlining" | "support" | "festival";

export interface TourDate {
  id: string;
  date: string;
  city: string;
  state: string;
  venue: string;
  venueAddress: string;
  venueCapacity?: number;
  tour: string;
  tourType: TourType;
  openers: string[];
  headliner?: string;
  doorsTime?: string;
  showTime?: string;
  /**
   * True only when doorsTime/showTime came from the venue or ticket listing for
   * THIS date. False means the row carries the tour-wide default (18:30/19:30)
   * and the times must be presented as typical, never as confirmed fact.
   */
  timesConfirmed?: boolean;
  soldOut: boolean;
  ticketPriceRange: string;
  /** True only when ticketPriceRange was researched for THIS date, not the default. */
  pricesConfirmed?: boolean;
  /**
   * Per-act running order with real clock times, as PUBLISHED BY THE VENUE for
   * this specific date. Populate this ONLY from the venue's own event page (some
   * Live Nation amphitheatres post a full schedule; Ticketmaster and AXS never
   * do). Never from a resale listing, never inferred, never estimated from the
   * listed start. When absent, the set-times surfaces fall back to order-only
   * wording — which is the correct, honest default.
   */
  stageTimes?: StageTime[];
  /** URL of the venue page stageTimes were read from. Required whenever stageTimes is set. */
  stageTimesSource?: string;
  ticketAffiliatePath: string;
}

/** One act's published stage time. See TourDate.stageTimes for sourcing rules. */
export interface StageTime {
  /** Act name. Matched against `openers` / "Ella Langley" / `headliner` case-insensitively. */
  name: string;
  /** 24-hour "HH:MM", same format as doorsTime/showTime. */
  time: string;
  /**
   * True for acts on a secondary/side stage (e.g. BankNH Pavilion's "Hazy Little
   * Stage"). These are NOT added to `openers` — the last entry of `openers` is
   * rendered as direct support, so a side-stage act in there would be mislabelled.
   */
  sideStage?: boolean;
  /** Optional venue label for the side stage, e.g. "Hazy Little Stage". */
  stageName?: string;
}

export interface ChartPeak {
  hot100?: number | null;
  countryAirplay?: number | null;
  hotCountrySongs?: number | null;
}

export interface Song {
  slug: string;
  title: string;
  feat?: string | null;
  album: string;
  albumSlug: string;
  releaseDate: string;
  duration: string;
  writers: string[];
  producer: string;
  spotifyId?: string | null;
  youtubeId?: string | null;
  themes: string[];
  chartPeak?: ChartPeak;
  weeksAtCountryNumberOne?: number;
  weeksAtHot100NumberOne?: number;
  awards?: string[];
  liveDebut?: string;
  tldr: string;
  /** Multi-paragraph long-form breakdown. Paragraphs separated by \n\n. */
  about?: string;
}

export interface Comparison {
  slug: string;
  compareTo: string;
  category: string;
  similarities: string[];
  differences: string[];
  verdict: string;
}

export interface GuideMeta {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  wordCount: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  excerpt: string;
  heroImage?: string;
  /** id from lib/photos.ts — renders a credited lead photo under the headline. */
  heroPhoto?: string;
  /** Optional per-post caption override for the lead photo. */
  heroPhotoCaption?: string;
  relatedSongs?: string[];
  relatedTours?: string[];
  sources?: string[];
  faq?: FaqItem[];
  /** TourDate.id — powers the show CTA (deep-link tickets + trip planner). */
  showId?: string;
}
