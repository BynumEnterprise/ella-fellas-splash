import type { StageTime, TourDate } from "@/lib/types";

/**
 * SET TIMES
 * =========
 * The whole reason this site ranks. Fans search "what time does <artist> go on"
 * and every result is a ticket reseller who doesn't know. We answer it — and the
 * reason people trust the answer is that we NEVER INVENT A STAGE TIME.
 *
 * The distinction this file enforces:
 *   CONFIRMED  — doors + listed start come from the venue/ticket listing for THIS
 *                date. Signalled by `timesConfirmed` on the row. Real.
 *   TYPICAL    — the row carries the tour-wide default (doors 18:30 / start 19:30)
 *                because nothing has been published for this date yet. We show it
 *                as a typical time and say so. We do NOT call it confirmed.
 *   ORDER      — who plays in what sequence. Real (from tour-dates.json openers).
 *   STAGE TIME — the minute an artist actually walks on. Usually NOT published in
 *                advance, and when it isn't we say so instead of guessing. But
 *                SOME venues do post a full running order on their own event page
 *                (BankNH Pavilion does; CMAC doesn't; Ticketmaster and AXS never
 *                do). When they have, the row carries `stageTimes` and we print
 *                the venue's numbers — attributed, with the source URL. That is
 *                not a guess, it's the strongest answer on the page, and it is
 *                the ONLY way a per-act time is ever allowed to render.
 *
 * If we ever start printing a made-up "Ella takes the stage at 9:15", the site is
 * worth nothing and the rankings go with it. Everything below is derived from
 * data we already publish on the tour pages.
 */

export interface SetSlot {
  /** Artist name, or "Ella Langley". */
  name: string;
  /** "side-stage" | "opener" | "direct-support" | "headliner" */
  role: "side-stage" | "opener" | "direct-support" | "headliner";
  /** True only when we have a real clock time from the listing or venue schedule. */
  timeConfirmed: boolean;
  /** e.g. "7:30 PM" — only set when timeConfirmed. */
  time?: string;
  /** True when `time` is this act's own venue-published stage time, not the night's listed start. */
  stageTimePublished?: boolean;
  /** Venue's label for a secondary stage, e.g. "Hazy Little Stage". */
  stageName?: string;
  /** What we can honestly say about when they're on. */
  note: string;
}

export interface SetTimesInfo {
  doors?: string;
  listedStart?: string;
  /**
   * True when doors/listedStart were published for this specific date. When
   * false the clock times are the tour-wide default and every surface that
   * renders them must label them as typical, not confirmed.
   */
  timesConfirmed: boolean;
  slots: SetSlot[];
  /** True when the venue has published an actual running order with clock times. */
  hasConfirmedRunningOrder: boolean;
  /**
   * Ella's own venue-published stage time, e.g. "9:00 PM". Set ONLY when the
   * venue posted it. This is the single highest-value string on the site — it is
   * the literal answer to "what time does Ella Langley go on <city>".
   */
  ellaStageTime?: string;
  /** URL of the venue page the stage times came from. Set whenever ellaStageTime/slots carry published times. */
  stageTimesSource?: string;
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

/** Loose act-name match: case/punctuation/"(direct support)" insensitive. */
function actKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

/** Index a row's published stage times by normalised act name. */
function indexStageTimes(stageTimes?: StageTime[]): Map<string, StageTime> {
  const m = new Map<string, StageTime>();
  for (const st of stageTimes ?? []) {
    if (!st?.name || !to12h(st.time)) continue;
    m.set(actKey(st.name), st);
  }
  return m;
}

export function buildSetTimes(d: TourDate): SetTimesInfo {
  const doors = to12h(d.doorsTime);
  const listedStart = to12h(d.showTime);
  const timesConfirmed = d.timesConfirmed === true;
  const openers = (d.openers ?? []).filter(
    (o) => o && !/^ella langley/i.test(o.trim()),
  );
  const ellaHeadlines = d.tourType === "headlining";
  const published = indexStageTimes(d.stageTimes);
  const hasPublished = published.size > 0;
  const slots: SetSlot[] = [];

  /** The venue's posted time for an act, if it posted one. */
  const publishedFor = (name: string) => {
    const hit = published.get(actKey(name));
    return hit ? { time: to12h(hit.time)!, stageName: hit.stageName } : undefined;
  };

  // Side-stage acts (e.g. a plaza stage before the main bill) come first and are
  // deliberately NOT in `openers` — the last entry of `openers` renders as direct
  // support, so putting a side-stage act there would mislabel the bill.
  for (const st of d.stageTimes ?? []) {
    if (!st?.sideStage) continue;
    const t = to12h(st.time);
    if (!t) continue;
    slots.push({
      name: st.name,
      role: "side-stage",
      timeConfirmed: true,
      time: t,
      stageTimePublished: true,
      stageName: st.stageName,
      note: `On the ${st.stageName ?? "second stage"} before the main bill — ${t}, posted by ${d.venue}. Worth being through the gates early for.`,
    });
  }

  openers.forEach((name, i) => {
    const first = i === 0;
    // "Direct support" = the act immediately before the headliner. On a show Ella
    // headlines, that's the last opener. On a show she's supporting, SHE is the
    // direct support and every listed opener is just an opener — otherwise the
    // page claims two different acts are both direct support.
    const lastOpener = i === openers.length - 1;
    const pub = publishedFor(name);
    slots.push({
      name,
      role: ellaHeadlines && openers.length > 1 && lastOpener ? "direct-support" : "opener",
      timeConfirmed: Boolean(pub) || Boolean(first && listedStart && timesConfirmed),
      time: pub ? pub.time : first && listedStart && timesConfirmed ? listedStart : undefined,
      stageTimePublished: Boolean(pub),
      note: pub
        ? first
          ? `Opens the night at ${pub.time} — ${d.venue}'s own posted time for this date.`
          : `On at ${pub.time}, after ${openers[i - 1]} — ${d.venue}'s own posted time for this date.`
        : first
          ? listedStart && timesConfirmed
            ? `The listed start time. The first act goes on at or near this — this is the number that matters if you don't want to miss anyone.`
            : listedStart
              ? `Opens the night. ${listedStart} is the typical start for this tour — the venue hasn't posted this date's time yet, so treat it as a guide and check your ticket.`
              : `Opens the night. This venue hasn't posted a start time yet.`
          : `Follows ${openers[i - 1]}. Venues don't publish changeover times in advance.`,
    });
  });

  const ellaPub = publishedFor("Ella Langley");

  if (ellaHeadlines) {
    slots.push({
      name: "Ella Langley",
      role: "headliner",
      timeConfirmed: Boolean(ellaPub),
      time: ellaPub?.time,
      stageTimePublished: Boolean(ellaPub),
      note: ellaPub
        ? `Headlines at ${ellaPub.time} — that's ${d.venue}'s own posted stage time for this date, not an estimate. Venue schedules can still slide a few minutes on the night, so treat it as the target.`
        : openers.length
          ? `Headlines — she's on last, after ${openers.length === 1 ? openers[0] : "the openers"}. Headline sets typically start well after the listed door/start time, but the venue does not publish her stage time in advance and we're not going to invent one.`
          : `Headlines. The venue hasn't posted a running order for this date.`,
    });
  } else if (d.headliner) {
    const headPub = publishedFor(d.headliner);
    slots.push({
      name: "Ella Langley",
      role: "direct-support",
      timeConfirmed: Boolean(ellaPub),
      time: ellaPub?.time,
      stageTimePublished: Boolean(ellaPub),
      note: ellaPub
        ? `Ella is direct support and ${d.venue} has posted her slot: ${ellaPub.time}, right before ${d.headliner}. Be inside well ahead of it.`
        : `Ella is direct support — she plays right before ${d.headliner}. Be inside by the listed start or you risk missing her.`,
    });
    slots.push({
      name: d.headliner,
      role: "headliner",
      timeConfirmed: Boolean(headPub),
      time: headPub?.time,
      stageTimePublished: Boolean(headPub),
      note: headPub ? `Closes the night at ${headPub.time}, per ${d.venue}.` : `Closes the night.`,
    });
  }

  const parts: string[] = [];
  if (doors) parts.push(`Doors ${timesConfirmed ? "" : "typically "}${doors}`);
  if (listedStart) parts.push(`${timesConfirmed ? "listed start" : "typical start"} ${listedStart}`);
  const order = slots.length
    ? `Running order: ${slots.map((s) => s.name).join(" \u2192 ")}.`
    : "Running order not posted yet.";
  const caveat = timesConfirmed
    ? ""
    : " These are the usual times for this tour — the venue hasn't confirmed this date yet, so check your ticket.";

  // When the venue posted Ella's slot, lead with it — it's the answer people came for.
  const summary = ellaPub
    ? `${d.venue} has posted the full running order for this date: Ella Langley is on at ${ellaPub.time}${
        parts.length ? ` (${parts.join(", ")})` : ""
      }. ${order} These are the venue's own times, not estimates.`
    : parts.length
      ? `${parts.join(", ")}. ${order}${caveat}`
      : "This venue hasn't posted doors or a start time for this show yet.";

  return {
    doors,
    listedStart,
    timesConfirmed,
    slots,
    hasConfirmedRunningOrder: hasPublished,
    ellaStageTime: ellaPub?.time,
    stageTimesSource: hasPublished ? d.stageTimesSource : undefined,
    summary,
    ellaHeadlines,
  };
}
