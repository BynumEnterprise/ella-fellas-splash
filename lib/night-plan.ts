import type { TourDate } from "@/lib/types";

/**
 * NIGHT PLAN ENGINE
 * =================
 * Turns a show + a few visitor choices into a concrete game plan.
 *
 * DESIGN RULE (non-negotiable): this engine is DETERMINISTIC and grounded ONLY
 * in data we actually hold (tour-dates.json). It never invents a set time. When
 * the venue hasn't confirmed something we say so — exactly like the guides do.
 * The whole site's credibility rests on "we don't make up set times", and a
 * planner that guesses would burn that for a gimmick.
 *
 * Everything below is derived from fields we already have: venue name, capacity,
 * tourType, doorsTime/showTime, date, soldOut.
 */

export type Arrival = "local" | "driving" | "staying";
export type Party = "solo" | "couple" | "group";

export interface PlanChoices {
  arrival: Arrival;
  party: Party;
  firstShow: boolean;
}

export const DEFAULT_CHOICES: PlanChoices = {
  arrival: "driving",
  party: "couple",
  firstShow: false,
};

export interface TimelineStep {
  time: string | null; // null = we can't compute it honestly
  label: string;
  detail: string;
  emphasis?: boolean;
}

export interface PackItem {
  name: string;
  why: string;
  /** shop slug -> the product page carries the tagged Amazon buy button */
  shopSlug?: string;
}

export interface NightPlan {
  headline: string;
  subhead: string;
  timeline: TimelineStep[];
  pack: PackItem[];
  notes: string[];
  /** true when the venue hasn't posted times — we show guidance, not fake numbers */
  timesUnconfirmed: boolean;
  isPast: boolean;
  stadiumRules: boolean;
  outdoor: boolean;
  lodgingPitch: string | null;
}

/* ---------------------------------- utils --------------------------------- */

function parseHHMM(t?: string): number | null {
  if (!t) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function fmt(mins: number | null): string | null {
  if (mins == null) return null;
  const wrapped = ((mins % 1440) + 1440) % 1440;
  let h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function isOutdoorVenue(venue: string): boolean {
  const v = venue.toLowerCase();
  return (
    v.includes("amphitheat") ||
    v.includes("pavilion") ||
    v.includes("stadium") ||
    v.includes("field") ||
    v.includes("park") ||
    v.includes("fairground") ||
    v.includes("grandstand") ||
    v.includes("cmac") ||
    v.includes("red rocks")
  );
}

/** Big NFL/college stadiums run a clear-bag policy at the gate. */
export function hasStadiumBagRules(d: TourDate): boolean {
  return (d.venueCapacity ?? 0) >= 40000;
}

function monthOf(dateStr: string): number {
  return parseInt(dateStr.slice(5, 7), 10);
}

/* --------------------------------- engine --------------------------------- */

export function buildNightPlan(d: TourDate, choices: PlanChoices = DEFAULT_CHOICES): NightPlan {
  const today = new Date().toISOString().slice(0, 10);
  const isPast = d.date < today;

  const doors = parseHHMM(d.doorsTime);
  const show = parseHHMM(d.showTime);
  const timesUnconfirmed = show == null;

  const outdoor = isOutdoorVenue(d.venue);
  const stadiumRules = hasStadiumBagRules(d);
  const isSupport = d.tourType === "support";
  const month = monthOf(d.date);

  /* ---- timeline ---- */
  const timeline: TimelineStep[] = [];

  // Leave-by: security + parking eats ~90 min at stadiums, ~60 elsewhere.
  const bufferBefore = stadiumRules ? 90 : 60;
  const anchor = doors ?? show;
  if (anchor != null) {
    timeline.push({
      time: fmt(anchor - bufferBefore),
      label: "Head out",
      detail: stadiumRules
        ? "Stadium lots and security lines are the whole delay. Leaving now is the difference between a relaxed walk-up and a jog."
        : "Enough runway for parking and the door line without rushing.",
    });
  }

  if (doors != null) {
    timeline.push({
      time: fmt(doors),
      label: "Doors open",
      detail: "You don't need to be first in — but this is when the line starts moving.",
    });
  }

  if (show != null) {
    timeline.push({
      time: fmt(show),
      label: "Show starts",
      detail: isSupport
        ? "Openers run in sequence from here. This is the number that matters."
        : "The opener goes on. Ella follows.",
      emphasis: true,
    });

    // Ella's slot — clearly labelled as an estimate, never stated as fact.
    if (isSupport) {
      timeline.push({
        time: null,
        label: "Ella's set (direct support)",
        detail:
          "She plays right before the headliner — after dark, to a full house. Stadiums post the night-of running order; we don't invent it. Be inside by the listed start and you cannot miss her.",
        emphasis: true,
      });
      timeline.push({
        time: null,
        label: `${d.headliner ?? "The headliner"} closes`,
        detail: "Roughly two hours. Plan your exit before the encore if you're driving home.",
      });
    } else {
      timeline.push({
        time: null,
        label: "Ella headlines",
        detail:
          "Usually about an hour after the listed start, once support has played — around 16-18 songs across ~90 minutes. Venues confirm exact times night-of.",
        emphasis: true,
      });
    }
  } else {
    timeline.push({
      time: null,
      label: "Times not posted yet",
      detail:
        "The venue hasn't published doors/show times for this date. We'd rather tell you that than guess — we update this page the day they confirm, and the newsletter sends set-time alerts before the show.",
      emphasis: true,
    });
  }

  /* ---- what to pack ---- */
  const pack: PackItem[] = [];

  if (stadiumRules) {
    pack.push({
      name: "Clear stadium-approved bag",
      why: "This venue seats 40,000+ — that means an NFL-style clear-bag policy at the gate. It's the single most common reason people get turned around.",
      shopSlug: "ec-clear-stadium-bag",
    });
  }

  pack.push({
    name: "Concert earplugs",
    why: "Drops the volume without muffling her vocals. You hear every word and your ears aren't ringing on the drive home.",
    shopSlug: "ec-loop-experience-2",
  });

  pack.push({
    name: "Portable charger",
    why:
      choices.arrival === "driving"
        ? "Long day, lots of filming, and you still need a map home."
        : "Doors to encore is a long stretch for a phone that's filming everything.",
    shopSlug: "ec-anker-powercore-10k",
  });

  if (outdoor) {
    if (month >= 5 && month <= 9) {
      pack.push({
        name: "Empty water bottle",
        why: "Outdoor summer show — most venues let an empty bottle through and fill stations beat $7 arena water.",
        shopSlug: "ec-hydroflask-24",
      });
    }
    pack.push({
      name: "Rain poncho",
      why: "Outdoor venue. One rain delay pays for the whole pack, and ponchos beat a soaked drive home.",
      shopSlug: "ec-rain-poncho-5pk",
    });
    if (month >= 10 || month <= 4) {
      pack.push({
        name: "A real layer",
        why: "Outdoor, and it's not summer. It drops fast after sunset — colder than the forecast makes it sound once you're standing still.",
      });
    }
  }

  if (choices.firstShow) {
    pack.push({
      name: "Cash-free payment ready",
      why: "First show? Most venues are cashless now for food and drink. Have a card or phone wallet loaded before you're in line.",
    });
  }

  /* ---- notes ---- */
  const notes: string[] = [];
  if (stadiumRules) notes.push("Clear-bag policy: bags must be clear and roughly 12\" x 6\" x 12\" or smaller, or a small clutch.");
  if (isSupport) notes.push(`Ella is direct support here — ${d.headliner ?? "the headliner"} closes the night. Her set is the one people regret missing.`);
  if (d.soldOut) notes.push("Sold out at face value — resale is the way in, and prices move daily.");
  if (choices.arrival === "driving") notes.push("Driving in and out the same night? Decide your exit before the encore — the lot empties all at once.");
  if (outdoor) notes.push("Outdoor venue: check the forecast two days out, not the morning of.");

  /* ---- lodging angle ---- */
  let lodgingPitch: string | null = null;
  if (choices.arrival === "staying") {
    lodgingPitch =
      choices.party === "group"
        ? `A whole-home rental usually beats separate hotel rooms once there are a few of you splitting it — and you're not coordinating three check-ins after the show. Aim within ~1.5 miles of ${d.venue} so the post-show surge doesn't get you.`
        : `Staying over is the right call — the post-show drive is the worst part of any show. Book close to ${d.venue} and walk back.`;
  }

  /* ---- headline copy ---- */
  const headline = isPast
    ? `${d.city} is in the books`
    : timesUnconfirmed
      ? `Your ${d.city} night — what we know so far`
      : `Your ${d.city} night, hour by hour`;

  const subhead = isPast
    ? "This show has already happened. Here's what the night looked like — and where to catch her next."
    : isSupport
      ? `Be inside by the listed start or you miss Ella. Everything else is downstream of that.`
      : `${d.venue}. Here's when to leave, what to bring, and when she's actually on.`;

  return {
    headline,
    subhead,
    timeline,
    pack,
    notes,
    timesUnconfirmed,
    isPast,
    stadiumRules,
    outdoor,
    lodgingPitch,
  };
}

/**
 * Two-night stands: same venue, consecutive dates (Baltimore 7/17-18,
 * Auburn 8/28-29, LA Greek 10/13-14). Fans genuinely ask "which night is Ella?"
 * and nobody answers it cleanly.
 */
export function findStandSiblings(d: TourDate, all: TourDate[]): TourDate[] {
  return all
    .filter((o) => o.id !== d.id && o.venue === d.venue && o.city === d.city)
    .filter((o) => Math.abs(new Date(o.date).getTime() - new Date(d.date).getTime()) <= 3 * 864e5)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
