import type { TourDate } from "@/lib/types";

/**
 * NATURAL-LANGUAGE SHOW RESOLVER
 * ==============================
 * Turns "I wanna go to the next show and get tickets and go out for dinner
 * before and then drinks after" into a REAL show from tour-dates.json plus what
 * the person actually asked for.
 *
 * WHY THIS IS NOT AN LLM: it physically cannot invent a show, a date or a set
 * time - it only ever returns an object that already exists in our tour data.
 * That's the same rule the rest of the site runs on, and it's the whole reason
 * anyone trusts us on set times.
 *
 * IT ALSO NEVER DEAD-ENDS. Before, anything without an explicit city/venue/date
 * ("next show", "this weekend", "tickets and dinner") bounced to the manual
 * picker with "we couldn't match that" - a broken planner, not an honest one.
 * Now: explicit match first, then relative references, then a clearly-labelled
 * assumption ("Assuming you mean X - pick another below"), so every ask
 * produces a plan the visitor can correct in one tap.
 */

export type Intent =
  | "tickets"
  | "stay"
  | "food"
  | "drinks"
  | "parking"
  | "times"
  | "wear"
  | "bring"
  | "openers";

export type Confidence = "exact" | "relative" | "assumed" | "ambiguous" | "none";

export type When = "before" | "after";

/** What the visitor asked us to build, independent of which show it is. */
export interface Activities {
  tickets: boolean;
  dinner: boolean;
  dinnerWhen: When;
  drinks: boolean;
  drinksWhen: When;
  hotel: boolean;
  parking: boolean;
  /** true when they named nothing specific - the UI should then show everything */
  none: boolean;
}

export interface ParseResult {
  show: TourDate | null;
  /** other real shows worth offering as a correction, never a replacement */
  candidates: TourDate[];
  intents: Intent[];
  activities: Activities;
  matchedCity: string | null;
  matchedDateISO: string | null;
  confidence: Confidence;
  /** true when we picked the show for them and must say so */
  assumed: boolean;
  /** plain-English "here's what I understood" - always shown to the user */
  understood: string;
}

/* ----------------------------- vocabulary ----------------------------- */

/** Venue nicknames -> a token we can find in TourDate.venue. Multi-word and
 *  checked BEFORE cities, because "lincoln financial" must beat "lincoln". */
const VENUE_ALIASES: { phrase: string; venueMatch: string }[] = [
  { phrase: "red rocks", venueMatch: "red rocks" },
  { phrase: "the greek", venueMatch: "greek theatre" },
  { phrase: "greek", venueMatch: "greek theatre" },
  { phrase: "greek theatre", venueMatch: "greek theatre" },
  { phrase: "greek theater", venueMatch: "greek theatre" },
  { phrase: "lincoln financial", venueMatch: "lincoln financial" },
  { phrase: "the linc", venueMatch: "lincoln financial" },
  { phrase: "m&t", venueMatch: "m&t bank" },
  { phrase: "mt bank", venueMatch: "m&t bank" },
  { phrase: "m and t", venueMatch: "m&t bank" },
  { phrase: "cmac", venueMatch: "cmac" },
  { phrase: "koka booth", venueMatch: "koka booth" },
  { phrase: "neville", venueMatch: "neville" },
  { phrase: "banknh", venueMatch: "banknh" },
  { phrase: "bank of new hampshire", venueMatch: "banknh" },
  { phrase: "dickies", venueMatch: "dickies" },
  { phrase: "moody center", venueMatch: "moody" },
  { phrase: "bok center", venueMatch: "bok" },
  { phrase: "prudential", venueMatch: "prudential" },
  { phrase: "bryce jordan", venueMatch: "bryce jordan" },
  { phrase: "schottenstein", venueMatch: "schottenstein" },
  { phrase: "vystar", venueMatch: "vystar" },
  { phrase: "simmons bank", venueMatch: "simmons" },
  { phrase: "resch", venueMatch: "resch" },
  { phrase: "bluesfest", venueMatch: "bluesfest" },
  { phrase: "redwest", venueMatch: "redwest" },
  { phrase: "td coliseum", venueMatch: "td coliseum" },
  { phrase: "appalachian wireless", venueMatch: "appalachian" },
  { phrase: "grand casino", venueMatch: "grand casino" },
  { phrase: "pinnacle bank", venueMatch: "pinnacle" },
  { phrase: "united supermarkets", venueMatch: "united supermarkets" },
  { phrase: "vibrant arena", venueMatch: "vibrant" },
  { phrase: "akins ford", venueMatch: "akins" },
  { phrase: "food city", venueMatch: "food city" },
  { phrase: "caseys", venueMatch: "casey" },
  { phrase: "casey's", venueMatch: "casey" },
  { phrase: "hilliard", venueMatch: "hilliard" },
  { phrase: "sjb", venueMatch: "sjb" },
  { phrase: "state fairgrounds", venueMatch: "fairgrounds" },
];

/** City nicknames -> the exact TourDate.city value. */
const CITY_ALIASES: { phrase: string; city: string }[] = [
  { phrase: "la", city: "Los Angeles" },
  { phrase: "l.a.", city: "Los Angeles" },
  { phrase: "los angeles", city: "Los Angeles" },
  { phrase: "philly", city: "Philadelphia" },
  { phrase: "philadelphia", city: "Philadelphia" },
  { phrase: "north charleston", city: "North Charleston" },
  { phrase: "charleston sc", city: "North Charleston" },
  { phrase: "charleston, sc", city: "North Charleston" },
  { phrase: "charleston wv", city: "Charleston" },
  { phrase: "charleston, wv", city: "Charleston" },
  { phrase: "west virginia", city: "Charleston" },
  { phrase: "slc", city: "Salt Lake City" },
  { phrase: "salt lake", city: "Salt Lake City" },
  { phrase: "st paul", city: "St. Paul" },
  { phrase: "st. paul", city: "St. Paul" },
  { phrase: "saint paul", city: "St. Paul" },
  { phrase: "minneapolis", city: "St. Paul" },
  { phrase: "north little rock", city: "North Little Rock" },
  { phrase: "little rock", city: "North Little Rock" },
  { phrase: "corpus", city: "Corpus Christi" },
  { phrase: "dfw", city: "Fort Worth" },
  { phrase: "ft worth", city: "Fort Worth" },
  { phrase: "ft. worth", city: "Fort Worth" },
  { phrase: "denver", city: "Morrison" },
  { phrase: "morrison", city: "Morrison" },
];

const INTENT_WORDS: { intent: Intent; words: string[] }[] = [
  { intent: "tickets", words: ["ticket", "tix", "seats", "buy", "get in", "resale", "presale", "go to the show", "see her", "see ella"] },
  { intent: "stay", words: ["stay", "hotel", "sleep", "room", "airbnb", "overnight", "crash", "lodging", "rental", "night before", "night after"] },
  { intent: "food", words: ["eat", "restaurant", "dinner", "supper", "food", "breakfast", "coffee", "lunch", "brunch", "grab a bite", "bite to eat"] },
  { intent: "drinks", words: ["drink", "drinks", "bar", "bars", "beer", "cocktail", "honky tonk", "honky-tonk", "whiskey", "nightcap", "pregame", "pre-game", "after party", "afterparty"] },
  { intent: "parking", words: ["park", "parking", "drive", "driving", "transit", "uber", "lyft", "train"] },
  { intent: "times", words: ["what time", "set time", "start time", "when does", "how early", "doors", "come on", "go on", "stage time"] },
  { intent: "wear", words: ["wear", "outfit", "dress code", "what to wear"] },
  { intent: "bring", words: ["bring", "pack", "bag", "carry", "allowed"] },
  { intent: "openers", words: ["opener", "opening", "who's playing", "whos playing", "lineup", "support act"] },
];

const MONTHS: Record<string, number> = {
  january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4,
  may: 5, june: 6, jun: 6, july: 7, jul: 7, august: 8, aug: 8,
  september: 9, sep: 9, sept: 9, october: 10, oct: 10, november: 11, nov: 11,
  december: 12, dec: 12,
};

const WEEKDAYS: Record<string, number> = {
  sunday: 0, sun: 0, monday: 1, mon: 1, tuesday: 2, tue: 2, tues: 2,
  wednesday: 3, wed: 3, thursday: 4, thu: 4, thurs: 4, friday: 5, fri: 5,
  saturday: 6, sat: 6,
};

/** "next show", "the next one", "whenever she's next out" - a relative ask. */
const NEXT_SHOW_RE =
  /\b(next show|next one|next gig|next concert|next date|next tour date|nearest show|closest show|soonest|upcoming show|next upcoming|whenever)\b/;

/* ------------------------------- helpers ------------------------------- */

function norm(s: string): string {
  return s.toLowerCase().replace(/[‘’']/g, "'").replace(/\s+/g, " ").trim();
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function dateLabel(isoDate: string): string {
  return new Date(isoDate + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Dates the text could mean. Empty = no explicit date mentioned. */
export function extractDates(q: string, todayISO: string): string[] {
  const out: string[] = [];
  const today = new Date(todayISO + "T12:00:00Z");
  const year = today.getUTCFullYear();

  // "july 18", "jul 18th"
  const md = q.match(/\b([a-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b/);
  if (md && MONTHS[md[1]]) {
    const m = MONTHS[md[1]];
    const day = parseInt(md[2], 10);
    for (const y of [year, year + 1]) {
      const cand = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (cand >= todayISO) { out.push(cand); break; }
    }
  }

  // "18 july"
  const dm = q.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?([a-z]{3,9})\b/);
  if (!out.length && dm && MONTHS[dm[2]]) {
    const m = MONTHS[dm[2]];
    const day = parseInt(dm[1], 10);
    for (const y of [year, year + 1]) {
      const cand = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (cand >= todayISO) { out.push(cand); break; }
    }
  }

  // "7/18" or "7-18"
  const num = q.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);
  if (!out.length && num) {
    const m = parseInt(num[1], 10);
    const day = parseInt(num[2], 10);
    if (m >= 1 && m <= 12 && day >= 1 && day <= 31) {
      let y = num[3] ? parseInt(num[3].length === 2 ? "20" + num[3] : num[3], 10) : year;
      let cand = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (!num[3] && cand < todayISO) {
        y += 1;
        cand = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }
      out.push(cand);
    }
  }

  if (!out.length && /\b(today|tonight)\b/.test(q)) out.push(todayISO);
  if (!out.length && /\btomorrow\b/.test(q)) {
    const t = new Date(today); t.setUTCDate(t.getUTCDate() + 1); out.push(iso(t));
  }

  // bare weekday -> the next one within 8 days
  if (!out.length) {
    for (const [name, dow] of Object.entries(WEEKDAYS)) {
      if (new RegExp(`\\b${name}\\b`).test(q)) {
        const t = new Date(today);
        for (let i = 0; i < 8; i++) {
          if (t.getUTCDay() === dow && iso(t) >= todayISO) { out.push(iso(t)); break; }
          t.setUTCDate(t.getUTCDate() + 1);
        }
        break;
      }
    }
  }

  return out;
}

/**
 * Loose time windows: "this weekend", "next weekend", "next month",
 * "in October". Returns an inclusive ISO range, or null.
 */
export function extractWindow(
  q: string,
  todayISO: string,
): { start: string; end: string; label: string } | null {
  const today = new Date(todayISO + "T12:00:00Z");

  const weekendFrom = (offsetWeeks: number) => {
    // Friday of the upcoming weekend (today if it IS Friday), through Sunday.
    const t = new Date(today);
    const dow = t.getUTCDay(); // 0 Sun .. 6 Sat
    const toFriday = dow === 6 ? -1 : dow === 0 ? -2 : (5 - dow + 7) % 7;
    t.setUTCDate(t.getUTCDate() + toFriday + offsetWeeks * 7);
    const start = new Date(t);
    const end = new Date(t);
    end.setUTCDate(end.getUTCDate() + 2); // Sunday
    return { start: iso(start), end: iso(end) };
  };

  if (/\bthis weekend\b/.test(q)) {
    return { ...weekendFrom(0), label: "this weekend" };
  }
  if (/\b(next weekend|the weekend after)\b/.test(q)) {
    return { ...weekendFrom(1), label: "next weekend" };
  }
  if (/\bweekend\b/.test(q)) {
    return { ...weekendFrom(0), label: "that weekend" };
  }

  if (/\bnext month\b/.test(q)) {
    const y = today.getUTCFullYear();
    const m = today.getUTCMonth() + 2; // next calendar month, 1-indexed
    const yy = m > 12 ? y + 1 : y;
    const mm = m > 12 ? m - 12 : m;
    const start = `${yy}-${String(mm).padStart(2, "0")}-01`;
    const endDate = new Date(Date.UTC(yy, mm, 0)); // day 0 of the following month
    return { start, end: iso(endDate), label: "next month" };
  }
  if (/\bthis month\b/.test(q)) {
    const y = today.getUTCFullYear();
    const mm = today.getUTCMonth() + 1;
    return { start: todayISO, end: iso(new Date(Date.UTC(y, mm, 0))), label: "this month" };
  }

  // "in October" / "sometime in oct" - a bare month with no day number.
  const bare = q.match(/\b(?:in|during|sometime in|around)\s+([a-z]{3,9})\b/);
  if (bare && MONTHS[bare[1]] && !/\b[a-z]{3,9}\.?\s+\d{1,2}\b/.test(q)) {
    const m = MONTHS[bare[1]];
    const y = today.getUTCFullYear();
    const yy = m < today.getUTCMonth() + 1 ? y + 1 : y;
    const start = `${yy}-${String(m).padStart(2, "0")}-01`;
    return { start, end: iso(new Date(Date.UTC(yy, m, 0))), label: bare[1] };
  }

  return null;
}

export function extractIntents(q: string): Intent[] {
  const found: Intent[] = [];
  for (const { intent, words } of INTENT_WORDS) {
    if (words.some((w) => q.includes(w))) found.push(intent);
  }
  return found;
}

/**
 * What to build, separate from which show. "dinner before and then drinks after"
 * is two different blocks at two different times - the old parser collapsed both
 * into one "food" flag and lost half the ask.
 */
/**
 * "dinner before and then drinks after" is two blocks at two different points in
 * the night. Read the word nearest each noun, stopping at the next activity word
 * so "dinner before ... drinks after" doesn't hand "after" to dinner.
 */
const OTHER_ACTIVITY_RE =
  /\b(drink|drinks|bar|bars|beer|cocktail|dinner|supper|restaurant|food|eat|hotel|room|parking)\b/;

function whenFor(q: string, nounRe: RegExp, fallback: When): When {
  const m = nounRe.exec(q);
  if (!m) return fallback;

  const from = m.index + m[0].length;
  const tail = q.slice(from, from + 40);
  const cut = tail.search(OTHER_ACTIVITY_RE);
  const seg = cut >= 0 ? tail.slice(0, cut) : tail;

  const b = seg.indexOf("before");
  const a = seg.indexOf("after");
  if (b >= 0 && (a < 0 || b < a)) return "before";
  if (a >= 0) return "after";

  // "after the show grab a beer" — the qualifier can also sit in front.
  const head = q.slice(Math.max(0, m.index - 20), m.index);
  if (/\bafter\b/.test(head) && !/\bbefore\b/.test(head)) return "after";
  if (/\bbefore\b/.test(head) && !/\bafter\b/.test(head)) return "before";
  return fallback;
}

/**
 * What to build, separate from which show. The old parser collapsed dinner and
 * drinks into one "food" flag and lost half of every ask.
 */
export function extractActivities(q: string, intents: Intent[]): Activities {
  const dinner = intents.includes("food");
  const drinks = intents.includes("drinks");

  const a: Activities = {
    tickets: intents.includes("tickets"),
    dinner,
    // Default order-of-night: dinner before the show, drinks after it.
    dinnerWhen: whenFor(q, /\b(dinner|supper|restaurant|food|eat|bite)\b/, "before"),
    drinks,
    drinksWhen: /\b(pregame|pre-game)\b/.test(q)
      ? "before"
      : whenFor(q, /\b(drinks|drink|bar|bars|beer|cocktail|nightcap)\b/, "after"),
    hotel: intents.includes("stay"),
    parking: intents.includes("parking"),
    none: false,
  };
  a.none = !a.tickets && !a.dinner && !a.drinks && !a.hotel && !a.parking;
  return a;
}

/* -------------------------------- main -------------------------------- */

export function parseShowRequest(raw: string, shows: TourDate[], todayISO?: string): ParseResult {
  const today = todayISO ?? new Date().toISOString().slice(0, 10);
  const q = norm(raw);
  const upcoming = shows
    .filter((s) => s.date >= today)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const intents = extractIntents(q);
  const activities = extractActivities(q, intents);
  const dates = extractDates(q, today);
  const window = extractWindow(q, today);
  const wantsNext = NEXT_SHOW_RE.test(q) || /\bthe next one\b/.test(q);

  const label = (s: TourDate) => `${s.city}, ${s.state} - ${dateLabel(s.date)} at ${s.venue}`;

  const result = (
    show: TourDate | null,
    confidence: Confidence,
    understood: string,
    extras?: { candidates?: TourDate[]; matchedCity?: string | null; assumed?: boolean },
  ): ParseResult => ({
    show,
    candidates: extras?.candidates ?? [],
    intents,
    activities,
    matchedCity: extras?.matchedCity ?? null,
    matchedDateISO: show?.date ?? dates[0] ?? null,
    confidence,
    assumed: extras?.assumed ?? false,
    understood,
  });

  // The only honest dead end left: we genuinely have no future dates on file.
  if (!upcoming.length) {
    return result(
      null,
      "none",
      "There aren't any upcoming dates on the schedule right now. Join the list and we'll email you the second new dates drop.",
    );
  }

  const next = upcoming[0];

  if (!q) {
    return result(next, "assumed", `Starting with the next show - ${label(next)}. Pick another below if that's not it.`, {
      assumed: true,
      candidates: upcoming.slice(1, 6),
    });
  }

  /* ---------- 1) venue, then city: the explicit path ---------- */

  let pool: TourDate[] = [];
  let matchedLabel: string | null = null;
  let matchedByPlace = false;

  for (const { phrase, venueMatch } of VENUE_ALIASES) {
    if (q.includes(phrase)) {
      const hits = upcoming.filter((s) => norm(s.venue).includes(venueMatch));
      if (hits.length) { pool = hits; matchedLabel = hits[0].venue; matchedByPlace = true; break; }
    }
  }

  if (!pool.length) {
    const aliases = [...CITY_ALIASES].sort((a, b) => b.phrase.length - a.phrase.length);
    for (const { phrase, city } of aliases) {
      if (new RegExp(`\\b${esc(phrase)}\\b`).test(q)) {
        const hits = upcoming.filter((s) => s.city === city);
        if (hits.length) { pool = hits; matchedLabel = city; matchedByPlace = true; break; }
      }
    }
  }

  if (!pool.length) {
    const cities = Array.from(new Set(upcoming.map((s) => s.city))).sort((a, b) => b.length - a.length);
    const wordRe = (c: string) => new RegExp(`\\b${esc(norm(c))}\\b`);
    let mentioned = cities.filter((c) => wordRe(c).test(q));

    // AMBIGUOUS-STEM GUARD. "charleston" is a real city (WV) AND the tail of
    // "North Charleston" (SC). We no longer refuse to answer - we answer with
    // the soonest of the two, say we assumed, and put the other one one tap away.
    if (mentioned.length === 1) {
      const m = norm(mentioned[0]);
      const supersets = cities.filter((c) => c !== mentioned[0] && norm(c).endsWith(" " + m));
      const disambiguated = /\b(north|south|east|west)\b/.test(q);
      if (supersets.length && !disambiguated) mentioned = [mentioned[0], ...supersets];
    }

    if (mentioned.length) {
      pool = upcoming.filter((s) => mentioned.includes(s.city));
      matchedLabel = mentioned.length === 1 ? mentioned[0] : mentioned.join(" or ");
      matchedByPlace = true;
    }
  }

  /* ---------- 2) narrow by an explicit date / loose window ---------- */

  const inWindow = (s: TourDate) => !!window && s.date >= window.start && s.date <= window.end;

  if (pool.length && dates.length) {
    const narrowed = pool.filter((s) => dates.includes(s.date));
    if (narrowed.length) {
      pool = narrowed;
    } else if (!wantsNext) {
      // They named a place AND a date that don't line up. Give them the real
      // date for that place rather than nothing.
      const s = pool[0];
      return result(
        s,
        "assumed",
        `We don't have an Ella date in ${matchedLabel ?? s.city} on ${dateLabel(dates[0])}. The ${s.city} show is ${dateLabel(s.date)} at ${s.venue} - planning that one. Pick another below if that's not it.`,
        { assumed: true, matchedCity: matchedLabel, candidates: pool.slice(1, 6) },
      );
    }
  }

  if (pool.length && window) {
    const narrowed = pool.filter(inWindow);
    if (narrowed.length) pool = narrowed;
  }

  /* ---------- 3) no place named: date, window, or "next show" ---------- */

  if (!pool.length && dates.length) {
    const onDate = upcoming.filter((s) => dates.includes(s.date));
    if (onDate.length) {
      pool = onDate;
    } else {
      const after = upcoming.find((s) => s.date >= dates[0]) ?? next;
      return result(
        after,
        "assumed",
        `No Ella show on ${dateLabel(dates[0])} - the next one after that is ${label(after)}. Pick another below if that's not it.`,
        { assumed: true, candidates: upcoming.filter((s) => s.id !== after.id).slice(0, 6) },
      );
    }
  }

  if (!pool.length && window) {
    const inside = upcoming.filter(inWindow);
    if (inside.length) {
      const s = inside[0];
      return result(s, "relative", `${label(s)} - that's the show ${window.label}.`, {
        candidates: inside.filter((c) => c.id !== s.id).slice(0, 6),
      });
    }
    const after = upcoming.find((s) => s.date >= window.start) ?? next;
    return result(
      after,
      "assumed",
      `Nothing on the schedule ${window.label} - the next show is ${label(after)}. Pick another below if that's not it.`,
      { assumed: true, candidates: upcoming.filter((s) => s.id !== after.id).slice(0, 6) },
    );
  }

  /* ---------- 4) resolve the pool down to one real show ---------- */

  if (pool.length > 1) {
    // A bare day number ("the 14th") can only filter shows we already matched.
    const dayOnly = q.match(/\b(?:on\s+)?(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)\b/);
    if (dayOnly) {
      const day = parseInt(dayOnly[1], 10);
      const byDay = pool.filter((s) => parseInt(s.date.slice(8, 10), 10) === day);
      if (byDay.length) pool = byDay;
    }
  }

  if (pool.length === 1) {
    const s = pool[0];
    return result(s, "exact", `${label(s)}.`, { matchedCity: matchedLabel });
  }

  if (pool.length > 1) {
    const s = pool[0];
    // "next philly show", or a two-nighter with no night specified: take the
    // soonest, name it plainly, and keep the others one tap away.
    if (wantsNext) {
      return result(s, "relative", `Next ${matchedLabel ?? "show"}: ${label(s)}.`, {
        matchedCity: matchedLabel,
        candidates: pool.filter((c) => c.id !== s.id).slice(0, 6),
      });
    }
    return result(
      s,
      "ambiguous",
      `${matchedLabel ?? "That"} has ${pool.length} dates - planning the first, ${label(s)}. Tap another if you meant that one.`,
      {
        assumed: true,
        matchedCity: matchedLabel,
        candidates: pool.filter((c) => c.id !== s.id).slice(0, 6),
      },
    );
  }

  /* ---------- 5) nothing matched: never dead-end ---------- */

  if (wantsNext) {
    return result(next, "relative", `Next show: ${label(next)}.`, {
      candidates: upcoming.slice(1, 6),
    });
  }

  // They asked for something real (tickets, dinner, drinks, a hotel) but named
  // no place we play. Build the next show and say plainly that we assumed it.
  const namedSomewhere = !matchedByPlace && /\b(in|at|near|around)\s+[a-z]/.test(q);
  const lead = namedSomewhere
    ? `We don't have a date in that city on this run - assuming the next show, ${label(next)}.`
    : `Assuming you mean the next show - ${label(next)}.`;
  return result(next, "assumed", `${lead} Pick another below if that's not it.`, {
    assumed: true,
    candidates: upcoming.slice(1, 6),
  });
}
