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
  ticketAffiliatePath: string;
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
  relatedSongs?: string[];
  relatedTours?: string[];
  sources?: string[];
  faq?: FaqItem[];
  /** TourDate.id — powers the show CTA (deep-link tickets + trip planner). */
  showId?: string;
}
