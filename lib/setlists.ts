import type { TourDate } from "@/lib/types";
import setlistData from "@/data/setlists.json";

/**
 * SETLISTS
 * ========
 * The other thing an aggregator structurally cannot do: publish what she played,
 * within minutes of her playing it. Pre-written pages can't do it. We can.
 *
 * ZERO FABRICATION, SAME AS SET TIMES: a setlist only appears here after a real
 * show, sourced from setlist.fm / fan reports / video. We never predict a setlist
 * and present it as fact. Before a show, the page honestly says "not played yet"
 * and shows the most recent ACTUAL setlist as recon — which is what a fan
 * looking ahead genuinely wants anyway.
 *
 * The `ella-fellas-setlist-watch` scheduled job appends entries here after each
 * show. Adding an entry = the page flips from "coming" to the real thing.
 */

export interface SetlistEntry {
  /** TourDate.id this belongs to. */
  showId: string;
  /** Songs in the order played. */
  songs: string[];
  /** Songs played as the encore, if there was one. */
  encore?: string[];
  /** Where we got it — required. No source, no publish. */
  source: string;
  /** ISO date we recorded it. */
  recordedAt: string;
  /** Anything notable: a cover, a guest, a debut. */
  notes?: string;
}

const SETLISTS = setlistData as SetlistEntry[];

export function getSetlist(showId: string): SetlistEntry | undefined {
  return SETLISTS.find((s) => s.showId === showId);
}

export function hasSetlist(showId: string): boolean {
  return SETLISTS.some((s) => s.showId === showId);
}

/**
 * The most recent show that HAS a real setlist — the honest answer to
 * "what is she playing on this tour right now?" before your show happens.
 */
export function mostRecentSetlist(
  allShows: TourDate[],
): { entry: SetlistEntry; show: TourDate } | null {
  const byDate = [...SETLISTS]
    .map((entry) => ({ entry, show: allShows.find((s) => s.id === entry.showId) }))
    .filter((x): x is { entry: SetlistEntry; show: TourDate } => Boolean(x.show))
    .sort((a, b) => (a.show.date < b.show.date ? 1 : -1));
  return byDate[0] ?? null;
}

export function allSetlists(): SetlistEntry[] {
  return SETLISTS;
}
