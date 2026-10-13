import tourDatesData from "@/data/tour-dates.json";
import songsData from "@/data/songs.json";
import comparisonsData from "@/data/comparisons.json";
import guidesData from "@/data/guides.json";
import type { TourDate, Song, Comparison, GuideMeta } from "@/lib/types";

const tourDates = tourDatesData as TourDate[];
const songs = songsData as Song[];
const comparisons = comparisonsData as Comparison[];
const guides = guidesData as GuideMeta[];

export function getAllTourDates(): TourDate[] {
  return [...tourDates].sort((a, b) => a.date.localeCompare(b.date));
}

export function getTourDate(id: string): TourDate | undefined {
  return tourDates.find((d) => d.id === id);
}

/** True when a show was officially canceled (see TourDate.canceled). */
export function isCanceled(d: TourDate): boolean {
  return d.canceled === true;
}

/**
 * Upcoming shows people can actually attend. Canceled shows are EXCLUDED by
 * default so every "next show" / ticket CTA built on this never points at a
 * canceled date. Pass includeCanceled when a list should show them (with a
 * CANCELED badge).
 */
export function getUpcomingTourDates(
  n: number = 5,
  fromDate?: string,
  includeCanceled: boolean = false,
): TourDate[] {
  const today = fromDate ?? new Date().toISOString().slice(0, 10);
  return getAllTourDates()
    .filter((d) => d.date >= today && (includeCanceled || !isCanceled(d)))
    .slice(0, n);
}

/** The next show that is still on (not canceled), or undefined. */
export function getNextShow(fromDate?: string): TourDate | undefined {
  return getUpcomingTourDates(1, fromDate)[0];
}

/** Shows before today, most recent first (canceled ones included). */
export function getPastTourDates(fromDate?: string): TourDate[] {
  const today = fromDate ?? new Date().toISOString().slice(0, 10);
  return getAllTourDates()
    .filter((d) => d.date < today)
    .reverse();
}

export function getAllSongs(): Song[] {
  return [...songs];
}

export function getSong(slug: string): Song | undefined {
  return songs.find((s) => s.slug === slug);
}

export function getSongsByAlbum(albumSlug: string): Song[] {
  return songs.filter((s) => s.albumSlug === albumSlug);
}

export function getAllComparisons(): Comparison[] {
  return [...comparisons];
}

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getAllGuides(): GuideMeta[] {
  return [...guides].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getGuideMeta(slug: string): GuideMeta | undefined {
  return guides.find((g) => g.slug === slug);
}
