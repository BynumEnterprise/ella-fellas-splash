import type { TourDate } from "@/lib/types";

/**
 * NATURAL-LANGUAGE SHOW RESOLVER
 * ==============================
 * Turns "I wanna go to the Baltimore show Saturday, need tickets and a hotel"
 * into a REAL show from tour-dates.json plus what the person actually asked for.
 *
 * WHY THIS IS NOT AN LLM: it physically cannot invent a show, a date or a set
 * time — it only ever returns an object that already exists in our tour data, or
 * nothing. When it isn't sure it SAYS so and asks, rather than guessing. That's
 * the same rule the rest of the site runs on, and it's the whole reason anyone
 * trusts us on set times.
 */

export type Intent = "tickets" | "stay" | "food" | "parking" | "times" | "wear" | "bring" | "openers";

export type Confidence = "exact" | "ambiguous" | "none";

export interface ParseResult {
  show: TourDate | null;
  /** populated when the ask matches more than one real show */
  candidates: TourDate[];
  intents: Intent[];
  matchedCity: string | null;
  matchedDateISO: string | null;
  confidence: Confidence;
  /** plain-English "here's what I understood" — always shown to the user */
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
  { intent: "tickets", words: ["ticket", "tix", "seats", "buy", "get in", "resale", "presale"] },
  { intent: "stay", words: ["stay", "hotel", "sleep", "room", "airbnb", "overnight", "crash", "lodging", "rental", "night before", "night after"] },
  { intent: "food", words: ["eat", "restaurant", "dinner", "food", "drink", "bar", "breakfast", "coffee", "lunch", "grab a bite"] },
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

/* ------------------------------- helpers ------------------------------- */

function norm(s: string): string {
  return s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Dates the text could mean. Empty = no date mentioned. */
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

  // "this weekend" -> Fri/Sat/Sun ahead
  if (!out.length && /\bthis weekend\b/.test(q)) {
    const t = new Date(today);
    for (let i = 0; i < 8; i++) {
      const dow = t.getUTCDay();
      if (dow === 5 || dow === 6 || dow === 0) out.push(iso(t));
      t.setUTCDate(t.getUTCDate() + 1);
      if (out.length >= 3) break;
    }
  }

  return out;
}

export function extractIntents(q: string): Intent[] {
  const found: Intent[] = [];
  for (const { intent, words } of INTENT_WORDS) {
    if (words.some((w) => q.includes(w))) found.push(intent);
  }
  return found;
}

/* -------------------------------- main -------------------------------- */

export function parseShowRequest(raw: string, shows: TourDate[], todayISO?: string): ParseResult {
  const today = todayISO ?? new Date().toISOString().slice(0, 10);
  const q = norm(raw);
  const upcoming = shows.filter((s) => s.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));

  const intents = extractIntents(q);
  const dates = extractDates(q, today);

  const empty = (msg: string): ParseResult => ({
    show: null, candidates: [], intents, matchedCity: null,
    matchedDateISO: dates[0] ?? null, confidence: "none", understood: msg,
  });

  if (!q) return empty("");

  // 1) Venue first — "lincoln financial" must beat the city "Lincoln".
  let pool: TourDate[] = [];
  let matchedLabel: string | null = null;
  for (const { phrase, venueMatch } of VENUE_ALIASES) {
    if (q.includes(phrase)) {
      const hits = upcoming.filter((s) => norm(s.venue).includes(venueMatch));
      if (hits.length) { pool = hits; matchedLabel = hits[0].venue; break; }
    }
  }

  // 2) City aliases (longest phrase first so "north charleston" beats "charleston")
  if (!pool.length) {
    const aliases = [...CITY_ALIASES].sort((a, b) => b.phrase.length - a.phrase.length);
    for (const { phrase, city } of aliases) {
      if (new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(q)) {
        const hits = upcoming.filter((s) => s.city === city);
        if (hits.length) { pool = hits; matchedLabel = city; break; }
      }
    }
  }

  // 3) Plain city names from the data.
  if (!pool.length) {
    const cities = Array.from(new Set(upcoming.map((s) => s.city))).sort((a, b) => b.length - a.length);
    const wordRe = (c: string) => new RegExp(`\\b${norm(c).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    let mentioned = cities.filter((c) => wordRe(c).test(q));

    // AMBIGUOUS-STEM GUARD. "charleston" is a real city (WV, Sep 12) AND the tail of
    // "North Charleston" (SC, Jul 25). Silently picking one is a confident wrong
    // answer — the exact thing we refuse to do. If the person didn't disambiguate
    // (north/south/a state), surface both and ask.
    if (mentioned.length === 1) {
      const m = norm(mentioned[0]);
      const supersets = cities.filter((c) => c !== mentioned[0] && norm(c).endsWith(" " + m));
      const disambiguated = /\b(north|south|east|west)\b/.test(q);
      if (supersets.length && !disambiguated) mentioned = [mentioned[0], ...supersets];
    }

    if (mentioned.length) {
      pool = upcoming.filter((s) => mentioned.includes(s.city));
      matchedLabel = mentioned.length === 1 ? mentioned[0] : mentioned.join(" or ");
    }
  }

  // 4) Date-only ask ("what's on saturday")
  if (!pool.length && dates.length) {
    pool = upcoming.filter((s) => dates.includes(s.date));
    if (!pool.length) {
      return empty("We couldn't find an Ella show on that date. Pick a show below and we'll build the night around it.");
    }
  }

  if (!pool.length) {
    return empty("We couldn't match that to a show on the schedule. Pick yours below — we only plan shows we actually have data for.");
  }

  // Narrow by date when we have one (handles Auburn / LA two-nighters)
  if (dates.length) {
    const narrowed = pool.filter((s) => dates.includes(s.date));
    if (narrowed.length) pool = narrowed;
  }

  // Still ambiguous? A bare day number ("the 14th", "on the 29th") can only ever
  // filter shows we already matched, so it can't invent anything.
  if (pool.length > 1) {
    const dayOnly = q.match(/\b(?:on\s+)?(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)\b/);
    if (dayOnly) {
      const day = parseInt(dayOnly[1], 10);
      const byDay = pool.filter((s) => parseInt(s.date.slice(8, 10), 10) === day);
      if (byDay.length) pool = byDay;
    }
  }

  const dateLabel = (s: TourDate) =>
    new Date(s.date + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

  if (pool.length === 1) {
    const s = pool[0];
    return {
      show: s, candidates: [], intents, matchedCity: matchedLabel,
      matchedDateISO: s.date, confidence: "exact",
      understood: `${s.city}, ${s.state} — ${dateLabel(s)} at ${s.venue}.`,
    };
  }

  return {
    show: null, candidates: pool, intents, matchedCity: matchedLabel,
    matchedDateISO: dates[0] ?? null, confidence: "ambiguous",
    understood: `${matchedLabel ?? "That"} has ${pool.length} shows — which one?`,
  };
}
