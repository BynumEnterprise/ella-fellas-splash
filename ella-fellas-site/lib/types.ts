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
  soldOut: boolean;
  ticketPriceRange: string;
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
}
