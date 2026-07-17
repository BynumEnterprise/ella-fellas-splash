import type { TourDate } from "@/lib/types";

/**
 * SET TIMES
 * =========
 * The whole reason this site ranks. Fans search "what time does <artist> go on"
 * and every result is a ticket reseller who doesn't know. We answer it — and the
 * reason people trust the answer is that we NEVER INVENT A STAGE TIME.
 *
 * The distinction this file enforces:
 *   CONFIRMED  — doors + listed start come from the venue/ticket listing. Real.
 *   ORDER      — who plays in what sequence. Real (from tour-dates.json openers).
 *   STAGE TIME — the minute an artist actually walks on. NOT published in advance
 *                by anyone. We say so instead of guessing.
 *
 * If we ever start printing a made-up "Ella takes the stage at 9:15", the site is
 * worth nothing and the rankings go with it. Everything below is derived from
 * data we already publish on the tour pages.
 */

export interface SetSlot {
  /** Artist name, or "Ella Langley". */
  name: string;
  /** "opener" | "headliner" | "direct-support" */
  role: "opener" | "direct-support" | "headliner";
  /** True only when we have a real clock time from the listing. */
  timeConfirmed: boolean;
  /** e.g. "7:30 PM" — only set when timeConfirmed. */
  time?: string;
  /** What we can honestly say about when they're on. */
  note: string;
}

export interface SetTimesInfo {
  doors?: string;
  listedStart?: string;
  slots: SetSlot[];
  /** True when the venue has published an actual running order. */
  hasConfirmedRunningOrder: boolean;
  /** Plain-English summary of what IS known. */
  summary: string;
  /** Whether Ella headlines this one. */
  ellaHeadlines: boolean;
}

/** "19:30" -> "7:30 PM". Returns undefined for missing/garbage input. */
export function to12h(t?: string): string | undefined {
  if (!t || !/^\d{1,2}:\d{2}$/.test(t)) return undefined;
  const [hRaw, m] = t.split(":");
  const h = Number(hRaw);
  if (Number.isNaN(h) || h > 23) return undefined;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

export function buildSetTimes(d: TourDate): SetTimesInfo {
  const doors = to12h(d.doorsTime);
  const listedStart = to12h(d.showTime);
  const openers = (d.openers ?? []).filter(
    (o) => o && !/^ella langley/i.test(o.trim()),
  );
  const ellaHeadlines = d.tourType === "headlining";
  const slots: SetSlot[] = [];

  openers.forEach((name, i) => {
    const first = i === 0;
    // "Direct support" = the act immediately before the headliner. On a show Ella
    // headlines, that's the last opener. On a show she's supporting, SHE is the
    // direct support and every listed opener is just an opener — otherwise the
    // page claims two different acts are both direct support.
    const lastOpener = i === openers.length - 1;
    slots.push({
      name,
      role: ellaHeadlines && openers.length > 1 && lastOpener ? "direct-support" : "opener",
      timeConfirmed: Boolean(first && listedStart),
      time: first && listedStart ? listedStart : undefined,
      note: first
        ? listedStart
          ? `The listed start time. The first act goes on at or near this — this is the number that matters if you don't want to miss anyone.`
          : `Opens the night. This venue hasn't posted a start time yet.`
        : `Follows ${openers[i - 1]}. Venues don't publish changeover times in advance.`,
    });
  });

  if (ellaHeadlines) {
    slots.push({
      name: "Ella Langley",
      role: "headliner",
      timeConfirmed: false,
      note: openers.length
        ? `Headlines — she's on last, after ${openers.length === 1 ? openers[0] : "the openers"}. Headline sets typically start well after the listed door/start time, but the venue does not publish her stage time in advance and we're not going to invent one.`
        : `Headlines. The venue hasn't posted a running order for this date.`,
    });
  } else if (d.headliner) {
    slots.push({
      name: "Ella Langley",
      role: "direct-support",
      timeConfirmed: false,
      note: `Ella is direct support — she plays right before ${d.headliner}. Be inside by the listed start or you risk missing her.`,
    });
    slots.push({
      name: d.headliner,
      role: "headliner",
      timeConfirmed: false,
      note: `Closes the night.`,
    });
  }

  const parts: string[] = [];
  if (doors) parts.push(`Doors ${doors}`);
  if (listedStart) parts.push(`listed start ${listedStart}`);
  const summary = parts.length
    ? `${parts.join(", ")}. ${
        slots.length
          ? `Running order: ${slots.map((s) => s.name).join(" → ")}.`
          : "Running order not posted yet."
      }`
    : "This venue hasn't posted doors or a start time for this show yet.";

  return {
    doors,
    listedStart,
    slots,
    // We only ever have the listed start, never a per-artist stage time in advance.
    hasConfirmedRunningOrder: false,
    summary,
    ellaHeadlines,
  };
}
