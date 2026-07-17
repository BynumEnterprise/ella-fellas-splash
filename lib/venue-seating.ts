import type { TourDate } from "@/lib/types";

/**
 * Venue-specific "where to sit" data for upcoming shows.
 *
 * ZERO-FABRICATION RULE: every section number/name here was verified against a
 * published seating chart (rateyourseats.com, aviewfrommyseat.com, the venue's
 * official chart, or the tour's published stage map) on 2026-07-17. Where the
 * concert stage orientation could NOT be verified, the copy says so and points
 * at the event map instead of guessing. Final layouts can shift per show, so
 * every block ends with a "double-check the seat map at checkout" line in the UI.
 */

export interface SeatPick {
  /** e.g. "Closest to the stage" */
  label: string;
  /** Exact sections/rows, e.g. "Floor 1–4, then Sections 106 & 120" */
  sections: string;
  /** One tight sentence of why. */
  note: string;
}

export interface VenueSeating {
  /** How this building is laid out, in one line. */
  layout: string;
  picks: SeatPick[];
  /** One venue-specific buying tip. */
  headsUp?: string;
}

// ── Shared entries for venues with multiple dates ────────────────────────────

const NEVILLE: VenueSeating = {
  layout:
    "College arena: lettered floor-ring Sections A–N, lower bowl 101–118, upper bowl 201–223.",
  picks: [
    {
      label: "Closest to the stage",
      sections: "The concert floor (built over the court, ringed by Sections A–N)",
      note: "Small room — the floor puts you feet from the stage.",
    },
    {
      label: "Best view for the money",
      sections: "Lower bowl 101–118 — fans rate 102, 110 & 111 highest for view",
      note: "The stage end varies here, so confirm your section faces it on the event map.",
    },
    {
      label: "Budget pick",
      sections: "Upper bowl 201–223 — fans rate 217, 222 & 223 highest",
      note: "Compact building; even the 200s stay close.",
    },
  ],
  headsUp:
    "Ella plays two nights here (Aug 28–29) — if one night's floor is gone, check the other before paying resale markup.",
};

const GREEK: VenueSeating = {
  layout:
    "Open-air amphitheater: GA Pit, then A sections (AL/AC/AR), B sections (BL/BLC/BRC/BR), C sections (CL/CLC/CRC/CR), with North & South Terraces at the rear.",
  picks: [
    {
      label: "Closest to the stage",
      sections: "GA Pit, then rows A–D of AC (center) or AL/AR",
      note: "The first A rows sit almost on top of the stage.",
    },
    {
      label: "Best view for the money",
      sections: "BLC & BRC (the center B sections)",
      note: "Slightly elevated with the most balanced full-stage view in the house.",
    },
    {
      label: "Budget pick",
      sections: "C sections (CL/CLC/CRC/CR) or the North/South Terraces",
      note: "The terraces are the cheapest way in and still face the stage head-on.",
    },
  ],
  headsUp:
    "Lower seat numbers sit closer to stage-center here, and the C sections have a walkway break between rows J and K — row K loses a little intimacy but gains legroom.",
};

// ── Per-venue entries ────────────────────────────────────────────────────────

const BY_VENUE: Record<string, VenueSeating> = {
  // ——— ARENAS (headlining, end-stage) ———
  "Moody Center": {
    layout:
      "Arena: Floor 1–10, lower bowl 101–124, upper bowl 205–220. The stage sits in front of Section 101.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 1–5, then Sections 106 & 120",
        note: "106/120 are the best close side views; 105 & 121 can end up partly behind the stage line.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 112–114, dead-center opposite the stage",
        note: "Straight-on view of the whole production from the lower bowl.",
      },
      {
        label: "Budget pick",
        sections: "Sections 211–214 (center of the upper horseshoe)",
        note: "The upper deck has no behind-stage seats at all — every 200s seat faces the stage.",
      },
    ],
    headsUp: "Skip 105 and 121 unless the event map shows them clear of the stage line.",
  },
  "Hilliard Center": {
    layout:
      "Arena: Concert Floor 1–6 (end-stage setup), lower bowl 101–117 (Club 114–116), upper bowl 201–217.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 1–2 (front of the six-section floor)",
        note: "The floor is the sure bet here — closest and centered.",
      },
      {
        label: "Best view for the money",
        sections: "Lower bowl — fans rate 103, 104, 111 & 112 highest",
        note: "Stage orientation isn't published for this room, so match your section to the event map.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 201–217 — fans rate 202 & 215 highest",
        note: "Small enough that the 200s stay very watchable.",
      },
    ],
    headsUp:
      "The building was just renamed Hilliard Center (formerly American Bank Center) — tickets and maps may show either name.",
  },
  "Dickies Arena": {
    layout:
      "Arena: Floor 1–6, lower bowl 101–132 (plus end sections 14–16 & 30–32), upper bowl 201–232.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 1–4",
        note: "Floor sections face the stage directly, but they're flat — taller crowds block rear-floor views.",
      },
      {
        label: "Best view for the money",
        sections: "Section 114 and neighbors 113–115; side-center 106–108 & 122–124",
        note: "114 faces the stage dead-on with nothing in the way.",
      },
      {
        label: "Budget pick",
        sections: "Elevated end Sections 14–16",
        note: "Farther back but straight-on and unobstructed — strong value.",
      },
    ],
    headsUp:
      "The floor has zero rise — if you're under 5'8\", the first rows of 114 beat the back half of the floor.",
  },
  "Simmons Bank Arena": {
    layout:
      "Arena: floor rows 1–45, lower bowl 101–126, upper bowl 201–225. Section 126 sits behind/beside the stage for most shows.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor rows 1–10",
        note: "The reserved floor runs a full 45 rows with no rise — the back half is far; stay in single digits.",
      },
      {
        label: "Best view for the money",
        sections: "Section 113 (labeled the head-on view) and neighbors 111–115",
        note: "Directly opposite the stage end.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 211–214 (center)",
        note: "Keeps the straight-on view for the smallest ticket.",
      },
    ],
    headsUp: "Avoid Section 126 — it's the behind/side-stage section for most concerts here.",
  },
  "Neville Arena": NEVILLE,
  "BOK Center": {
    layout:
      "Arena: Floor 1–2 (rows A–K up front), lower bowl 101–122, upper bowl 301–328 — there is no 200 level.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 1–2 rows A–K, then Sections 110–112 & 119–121",
        note: "112 and 119 are the first clear sections flanking the stage.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 109–112 & 119–122",
        note: "Often better sightlines than the rear floor.",
      },
      {
        label: "Budget pick",
        sections: "Upper-center 301–303 & 326–328",
        note: "Skip Section 316 — it lands behind/beside the stage.",
      },
    ],
    headsUp: "Numbering jumps from the 100s straight to the 300s — the '300s' here are only the second deck.",
  },
  "United Supermarkets Arena": {
    layout: "Arena: lower bowl 101–124, upper bowl 201–232, plus an Upper Baseline GA zone.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "The concert floor (laid out per show)",
        note: "Floor config isn't published in advance here — the event map at checkout shows the split.",
      },
      {
        label: "Best view for the money",
        sections: "Lower bowl 101–124, centered on the stage end shown on the event map",
        note: "Pick the section directly opposite the stage once the map is live.",
      },
      {
        label: "Budget pick",
        sections: "Upper Baseline GA",
        note: "A rare arena GA upper end-zone — usually the cheapest way in.",
      },
    ],
    headsUp: "Upper Baseline GA is first-come seating — arrive early to sit low in it.",
  },
  "SJB Pavilion": {
    layout:
      "College arena: Floor 1–3, lower bowl 101–118, upper bowl 201–218, plus All American Club 1–8 between decks.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 1–3",
        note: "Only three floor sections — everyone on the floor is close.",
      },
      {
        label: "Best view for the money",
        sections: "Lower bowl 101–118, centered opposite the stage end on the event map",
        note: "Small footprint; most of the lower bowl is a good seat.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 201–218",
        note: "Fans rate 206 and 215 well; the room is tight enough that the 200s hold up.",
      },
    ],
    headsUp: "All American Club 1–8 (between the bowls) resells for concerts — a sneaky comfort upgrade.",
  },
  "Food City Center": {
    layout:
      "Big college arena: lower bowl 100–131, mid 200–231, upper 300–331. The stage sets up in front of Sections 128–130.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor front rows, then Sections 126–127 and 131/100 flanking the stage",
        note: "129 and 130 are the limited-view sections to avoid.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 112–114, directly opposite the stage",
        note: "Side-centers around 105–107 & 121–123 also hold a clean angle.",
      },
      {
        label: "Budget pick",
        sections: "Upper 312–314 (center)",
        note: "Avoid the 328–330 area — it hangs above/behind the stage.",
      },
    ],
    headsUp:
      "The lower bowl starts at Section 100 (not 101) and the 300 level doubles up with 'A' sections (311A–331A) — read the map carefully.",
  },
  "Appalachian Wireless Arena": {
    layout:
      "Compact arena, tiers named rather than fully numbered: Floor, Lower Level, Lower Balcony, Upper Level, plus Choir Seating behind the stage end for some shows.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "The Floor",
        note: "Often part GA here — early entry gets the rail.",
      },
      {
        label: "Best view for the money",
        sections: "Lower Level",
        note: "Small room — the lower ring is close everywhere.",
      },
      {
        label: "Budget pick",
        sections: "Lower Balcony",
        note: "The value middle tier; the venue publishes an official end-stage chart worth checking.",
      },
    ],
    headsUp: "'Choir Seating' is sold behind the stage at some shows — cheap, but you're watching Ella's back.",
  },
  "Prudential Center": {
    layout:
      "Arena: lower bowl Sections 1–23, then the 100-level mezzanine, with a small 200 level on top. The stage sits in front of Sections 13–14.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor front rows, then Sections 9, 10, 17 & 18",
        note: "The best non-floor concert seats in the building — close and unobstructed.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 9–10 & 17–18",
        note: "Near-stage with a clean angle; Section 11 falls slightly behind the stage.",
      },
      {
        label: "Budget pick",
        sections: "Sections 113 & 127 on the mezzanine, or the 200 level",
        note: "The 200 level is only 9 rows deep — no bad row up there.",
      },
    ],
    headsUp: "Two suite levels sit between the lower bowl and the 100s — the '100s' are higher than they sound.",
  },
  "Bryce Jordan Center": {
    layout:
      "Arena: Floor N1/N2/S1/S2, lower bowl 101–134, upper bowl 201–234. The stage sets up in front of Sections 130–132.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor N1/S1, then Sections 104 & 124",
        note: "104/124 are called the closest-and-best 100-level seats for concerts.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 105, 106, 111 & 112",
        note: "The premium center 100-level picks for end-stage shows.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 201–234 (center sections over the ones above)",
        note: "Corners run cheapest; stay centered for the straight-on view.",
      },
    ],
    headsUp:
      "100-level rows split: A–15 up top, AA–KK below — row KK (not AA) is the one closest to the floor.",
  },
  "Charleston Coliseum": {
    layout: "Arena: lower bowl 101–124, upper bowl 201–224, floor labeled per show.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "The concert floor (labels vary by show)",
        note: "Check the event map — floor layout is set per tour here.",
      },
      {
        label: "Best view for the money",
        sections: "Lower bowl center, Sections 104–120",
        note: "The balanced-sightline range; pick the section opposite the stage on the map.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 201–224",
        note: "Panoramic and cheap; center beats corners.",
      },
    ],
    headsUp: "Flexible-capacity room (up to ~13,500) — rear sections sometimes curtain off; buy center, not edges.",
  },
  "North Charleston Coliseum": {
    layout:
      "Arena: Floor 50–58, lower bowl 102–140 (mostly even numbers), upper bowl 201–240.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 50–58, then Sections 109–110",
        note: "109–110 are the fan-favorite end-stage seats — close with good elevation.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 109–110, double-letter rows",
        note: "Stadium-style rise sees clean over the floor crowd.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 201–240 (center)",
        note: "Most of the building's seats live up here — center holds the view.",
      },
    ],
    headsUp: "The lower bowl skips most odd numbers (102, 104, 106…) — 'one section over' means two numbers here.",
  },
  "Akins Ford Arena": {
    layout:
      "Brand-new (Dec 2024) single-bowl arena, Sections 100–119, about 6,500 seats in the end-stage concert setup.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "The concert floor (layout set per tour)",
        note: "New building — floor splits appear on the event map at checkout.",
      },
      {
        label: "Best view for the money",
        sections: "Bowl Sections 100–119, centered opposite the stage end on the event map",
        note: "One-bowl room: pick center, you can't go far wrong.",
      },
      {
        label: "Budget pick",
        sections: "Upper rows of the same 100–119 bowl",
        note: "Single bowl means even top rows keep a direct view.",
      },
    ],
    headsUp: "Only ~6,500 seats for concerts — this is one of the smallest rooms on the tour, so it sells hard.",
  },
  "VyStar Veterans Memorial Arena": {
    layout: "Arena: Floor 1–9, lower bowl 100–121, upper bowl 300–324 (no 200 level).",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 1–2",
        note: "Lower-numbered floor sections sit closest to the front.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 106–107",
        note: "The premium lower-level center of this building.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 300–324 (center)",
        note: "Section 101 rates poorly for concerts — skip it.",
      },
    ],
    headsUp: "Numbering skips the 200s — upstairs is the 300s, one deck up, not two.",
  },
  "Schottenstein Center": {
    layout:
      "Big arena: Floor 1–9, entry-level 100s, Club level, Terrace 300s. The stage sets up in front of Sections 111–117.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 1–3 (rows A–T), then Sections 107 & 121",
        note: "The first rows of 107/121 are practically on the stage.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 107 & 121",
        note: "Rival the front floor — but avoid seats 12–21 in 107 and 1–10 in 121, which lose the sightline.",
      },
      {
        label: "Budget pick",
        sections: "Terrace 300s (center)",
        note: "Farthest up, best price-per-view in the building.",
      },
    ],
    headsUp:
      "In the two best sections the seat NUMBER matters: 107 seats 12–21 and 121 seats 1–10 sit too far past the stage line.",
  },
  "Vibrant Arena at The MARK": {
    layout:
      "Arena: Concert Floor A–F, lower bowl 101–117, upper bowl 200–216 plus mini 'A' sections 205A–210A and Lounge 201–206.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor A–B (front of the A–F end-stage floor)",
        note: "Standard end-stage floor split — A is the front block.",
      },
      {
        label: "Best view for the money",
        sections: "Lower bowl 101–117 — fans rate 103, 107 & 108 highest",
        note: "Match your section to the stage end on the event map.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 200–216",
        note: "Watch the labels: 205A–210A and 'Lounge 201–206' are different products at different prices.",
      },
    ],
    headsUp: "Two party decks and lounge mini-sections share the upper deck — read the section label before you pay.",
  },
  "Resch Center": {
    layout:
      "Arena with unusual numbering: floor sections use 100-numbers, the LOWER bowl is 201–226, the upper bowl 301–325.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 100 (rows A–Z)",
        note: "Head-on floor view of the end stage.",
      },
      {
        label: "Best view for the money",
        sections: "Section 201 (rows A–Y)",
        note: "The verified head-on lower-bowl view for end-stage shows.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 301–325 (center)",
        note: "Avoid seats near Section 215's end — that's the stage end.",
      },
    ],
    headsUp: "Don't panic at a '200s' ticket here — the 200s ARE the lower bowl at the Resch.",
  },
  "Casey's Center": {
    layout:
      "Arena: lower bowl 101–124, a tiny 200-level balcony (rows A–E only), upper 300s. Sections 119 & 122 sit behind/beside the stage.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor front rows, then the sections flanking the 119–122 stage end",
        note: "Stay a couple sections clear of 119/122 themselves.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 108–112",
        note: "The far-end arc facing the stage.",
      },
      {
        label: "Budget pick",
        sections: "The 200-level balcony (rows A–E)",
        note: "Only five rows deep — every seat up there is on the rail-ish.",
      },
    ],
    headsUp: "Formerly Wells Fargo Arena — maps and old reviews may use the old name.",
  },
  "Pinnacle Bank Arena": {
    layout:
      "Arena: Floor 50–52 / 60–62 / 70–72 (front to back), lower bowl 101–122, upper bowl 201–211. Sections 102 & 104 sit behind/beside the stage.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor 50–52",
        note: "The verified front floor block; 60s middle, 70s rear.",
      },
      {
        label: "Best view for the money",
        sections: "Section 111",
        note: "The head-on lower-bowl view for end-stage concerts.",
      },
      {
        label: "Budget pick",
        sections: "Upper bowl 201–211 (center)",
        note: "Cheapest tier; skip anything adjacent to the 102/104 stage end.",
      },
    ],
    headsUp: "In stage-side Section 102, Row 17 is usually the first row actually sold for concerts.",
  },
  "Grand Casino Arena": {
    layout:
      "NHL-size arena: floor sold as Floor Left/Center/Right, lower bowl 101–126, Club C-sections, 200 level up top. The stage sits near Sections 120–122.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Floor Left / Floor Center / Floor Right (front rows)",
        note: "Floor Center lines up with the runway view.",
      },
      {
        label: "Best view for the money",
        sections: "Lower bowl centered opposite the 120–122 stage end (the ~108–112 arc)",
        note: "Confirm against the event map — this room hosts many stage shapes.",
      },
      {
        label: "Budget pick",
        sections: "200 level (center)",
        note: "Well-liked views up top; avoid Club C34, which sits behind the stage.",
      },
    ],
    headsUp: "Renamed Grand Casino Arena in 2025 (ex-Xcel Energy Center) — both names float around on resale sites.",
  },

  // ——— AMPHITHEATERS ———
  "Koka Booth Amphitheatre": {
    layout:
      "Outdoor amphitheater: GA Pit at the stage, ~1,000 reserved seats/tables behind it, then the GA Lawn.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "GA Pit",
        note: "This show is sold as GA Pit + Reserved + Lawn — the pit is the front.",
      },
      {
        label: "Best view for the money",
        sections: "The reserved seats/tables behind the pit",
        note: "Only about a thousand of them between pit and lawn — the scarcest ticket here.",
      },
      {
        label: "Budget pick",
        sections: "GA Lawn",
        note: "Starts roughly 100 feet from the stage — early arrivals get shockingly close.",
      },
    ],
    headsUp: "Blankets and lawn chairs are allowed on the lawn (rentals ~$5), and the venue is cashless.",
  },
  "BankNH Pavilion": {
    layout:
      "Outdoor pavilion: GA Pit, reserved Sections 1A–1D, 2A–2C, 3A–3E (club/premium in the 3s), plus Reserved Lawn and GA Lawn.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "GA Pit, then Sections 1A–1D",
        note: "The 1-line is the first reserved tier behind the pit.",
      },
      {
        label: "Best view for the money",
        sections: "Sections 2A–2C",
        note: "Head-on views without the pit crush.",
      },
      {
        label: "Budget pick",
        sections: "Reserved Lawn or GA Lawn",
        note: "Reserved Lawn guarantees a spot without racing the gates.",
      },
    ],
    headsUp: "Layout shifts show-to-show here — confirm the section letters on this event's own chart.",
  },
  CMAC: {
    layout:
      "Covered pavilion + lawn: Front 2–5, Middle 1–6 (rows AA–PP), Rear 1–6 (rows AAA–UUU) under the roof; GA Lawn behind.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Front 3 & Front 4",
        note: "Centered on the stage with real seats and single-letter rows.",
      },
      {
        label: "Best view for the money",
        sections: "Middle 2–5",
        note: "Dead-center, each row elevated over the one in front.",
      },
      {
        label: "Budget pick",
        sections: "GA Lawn",
        note: "The only uncovered area — the pavilion's thin support beams barely block anything.",
      },
    ],
    headsUp: "Front 2 and Front 5 are angled (but clear) permanent seats — cheaper than Front 3/4 with 90% of the view.",
  },
  "Red Rocks Amphitheatre": {
    layout:
      "One open-air bowl of 70 numbered bench rows — Row 1 at the stage, Row 70 at the top. The GA/reserved split changes per show.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Rows 1–12",
        note: "Sound can overpower in rows 1–10, and edge seat numbers 1–15 sit far off-center down low.",
      },
      {
        label: "Best view for the money",
        sections: "Rows 12–20, center seats",
        note: "The regulars' pick for view; rows 15–40 are the sound sweet spot.",
      },
      {
        label: "Budget pick",
        sections: "Rows 50–70",
        note: "Cheapest benches with the full Denver-skyline backdrop — bring legs for the climb.",
      },
    ],
    headsUp:
      "Seat 1 in every row is far LEFT facing the stage; blankets max 40×60 in., cushions under 18 in. — this show's GA/reserved split appears on the event map.",
  },
  "The Greek Theatre": GREEK,

  // ——— STADIUMS (opening for Morgan Wallen) ———
  "M&T Bank Stadium": {
    layout:
      "NFL stadium, end-stage: 4 GA pits around the runway stage + reserved floor + a rear B-stage; lower bowl 100s, Club 200s, upper 500s. The stage builds on the north end.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "The 4 GA Pits flanking the main stage and runways",
        note: "Wallen's 2026 stage map runs two runways plus a B-stage at the rear of the floor.",
      },
      {
        label: "Best view for the money",
        sections: "Sideline lower bowl 125–128 or 100–101/152–153; Club 226–227",
        note: "Sidelines face the field lengthwise straight at the stage.",
      },
      {
        label: "Budget pick",
        sections: "Upper sideline 518–528",
        note: "Full-length sightline for a fraction of lower-bowl money; skip the 540s–560s corners.",
      },
    ],
    headsUp:
      "The stage end's seats aren't sold, and Ella opens the SATURDAY night — NFL clear-bag rules apply at the gate.",
  },
  "Lincoln Financial Field": {
    layout:
      "NFL stadium, end-stage: 4 GA pits + reserved floor + rear B-stage; lower bowl 100s (rows 1–35ish), Club C6–C35, upper 201–244.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "The 4 GA Pits at the main stage and runways",
        note: "Same four-pit Still The Problem stage build as every 2026 stop.",
      },
      {
        label: "Best view for the money",
        sections: "Sideline lower bowl 117–122 and 137–140/101–103, or the Club C-sections",
        note: "The strongest concert seats in this building.",
      },
      {
        label: "Budget pick",
        sections: "Upper sideline center, around 223–227",
        note: "Straight-on view for the least money.",
      },
    ],
    headsUp:
      "Skip 123 & 136 — close but a brutal angle — and recent shows had gear blocking parts of 104–107 and 114–117.",
  },

  // ——— FESTIVALS / FAIRS ———
  "Illinois State Fairgrounds (Grandstand)": {
    layout:
      "Fair Grandstand: reserved Track Seats on the dirt up front, standing General Track behind, Grandstand Sections A–G (sold as Blue Ribbon / Tier 1–3), Box Seats on top.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "Track Seats (temporary reserved chairs on the track)",
        note: "Built just for concert nights, directly in front of the stage.",
      },
      {
        label: "Best view for the money",
        sections: "Grandstand Sections C, D & E",
        note: "The center sections — A/B and F/G watch at an angle.",
      },
      {
        label: "Budget pick",
        sections: "Tier 3 upper Grandstand rows, or General Track standing",
        note: "SRO on the dirt is the cheapest way in; no chairs allowed there.",
      },
    ],
    headsUp: "The roof only covers the UPPER grandstand rows — track and lower rows are open to the sky.",
  },
  "LeBreton Flats Park (Ottawa Bluesfest)": {
    layout:
      "All-GA festival field with multiple stages (RBC main stage, LeBreton, Hard Rock, Big Chill), plus paid Betty VIP Club and Hard Rock Platinum zones.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "GA rail at the RBC Stage — or Platinum's front-of-stage Pit",
        note: "The field is first-come; Platinum is the only guaranteed front spot.",
      },
      {
        label: "Best view for the money",
        sections: "Betty VIP Club viewing areas",
        note: "Elevated sightline zones with their own bar and washrooms.",
      },
      {
        label: "Budget pick",
        sections: "GA Day Pass field",
        note: "Show up early and you can walk right up for the opening slots.",
      },
    ],
    headsUp: "VIP gets its own fast-track entrance (Gate 2) — worth it if you hate lines more than crowds.",
  },
  "Virginia Beach Oceanfront": {
    layout:
      "Beach-stage festival: GA on the sand in front of the 4th Street Stage, plus a VIP viewing area with its own bar and lounge.",
    picks: [
      {
        label: "Closest to the stage",
        sections: "GA rail on the sand",
        note: "No reserved seats on the beach — early arrival wins the front.",
      },
      {
        label: "Best view for the money",
        sections: "The VIP viewing area",
        note: "The only structured sightline zone, with A/C restrooms and lounge seating.",
      },
      {
        label: "Budget pick",
        sections: "GA beach + the Early Entry add-on",
        note: "Early Entry buys an extra hour to claim your patch of sand.",
      },
    ],
    headsUp:
      "Main entrance is on the beach between 6th & 7th Street; Front Gate Tickets is the only legitimate seller.",
  },
  "Utah State Fairpark (REDWEST Country Festival)": {
    layout:
      "All-GA fairgrounds festival, two stages, tiered access: GA, GA+ (shade + private bar/bathrooms), VIP (barricade viewing at both stages), VIP+ (premium barricade + acoustic lounge stage).",
    picks: [
      {
        label: "Closest to the stage",
        sections: "VIP/VIP+ barricade zones at the RedWest Stage — or the GA rail",
        note: "VIP explicitly includes the front-barricade position.",
      },
      {
        label: "Best view for the money",
        sections: "GA+ ",
        note: "Shade, shorter lines and its own bar for a small step up from GA.",
      },
      {
        label: "Budget pick",
        sections: "2-Day GA field",
        note: "Full fairpark access both days; free water refill stations on site.",
      },
    ],
    headsUp: "Wristbands ship to your home and re-entry is unlimited all weekend.",
  },
};

/** Look up the seating guide for a show. Matching is by venue name. */
export function seatingForShow(d: Pick<TourDate, "venue">): VenueSeating | null {
  return BY_VENUE[d.venue] ?? null;
}
