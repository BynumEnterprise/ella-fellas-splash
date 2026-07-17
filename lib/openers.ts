/**
 * SUPPORT ACTS ON THE 2026 DANDELION TOUR
 * =======================================
 * Who's opening, per artist. Fans search "who is opening for ella langley in
 * <city>" and there is no good answer anywhere — the openers rotate per date,
 * so the ticket aggregators can't model it and don't try.
 *
 * ZERO FABRICATION: every fact here was verified against a primary or reputable
 * source on 2026-07-17 and the sources are listed on each entry. Where a fact
 * could not be verified (e.g. nobody publishes opener set lengths), the field is
 * simply absent rather than estimated. Do not add a claim here without a source.
 *
 * The `openers` array on each show in data/tour-dates.json is the source of
 * truth for WHO plays WHERE; this file is the artist-level detail.
 */

export interface Opener {
  slug: string;
  name: string;
  /** Who they are, in the language a country fan actually uses. */
  who: string;
  /** Verified song titles. */
  notableSongs: string[];
  /** Verified latest release, or null when we couldn't confirm one. */
  latestRelease: string | null;
  /** The one fact a fan repeats — must be sourced. */
  signature: string;
  /** Why they're on THIS bill (the Ella connection), when there's a real one. */
  ellaConnection?: string;
  sources: string[];
}

export const OPENERS: Opener[] = [
  {
    slug: "gabriella-rose",
    name: "Gabriella Rose",
    who: "Singer-songwriter from Coeur d'Alene, Idaho, born in 2002 and releasing music since 2019. Her sound blends vintage pop, folk and country. She broke through nationally in 2025 as the featured voice on Zach Bryan's duet \"Madeline.\"",
    notableSongs: ["Madeline", "Double Wide"],
    latestRelease: "I Just Wanna Be Loved (2026)",
    signature:
      "She put out her first EP at 16. Her Zach Bryan duet \"Madeline\" debuted at No. 62 on the Billboard Hot 100 — her first Hot 100 entry — and cracked the top 10 on multiple Billboard rock charts. She joined Bryan onstage at MetLife Stadium in July 2025 to sing it.",
    ellaConnection:
      "She's on more of this tour than anyone else — the closest thing the Dandelion Tour has to a house opener.",
    sources: [
      "https://en.wikipedia.org/wiki/Gabriella_Rose",
      "https://www.rollingstone.com/music/music-country/zach-bryan-sings-duet-gabriella-rose-madeline-1235389193/",
    ],
  },
  {
    slug: "kameron-marlowe",
    name: "Kameron Marlowe",
    who: "Country singer-songwriter from Kannapolis, North Carolina, signed to Columbia Nashville. He competed on season 15 of NBC's The Voice — joining Team Blake before Adam Levine stole him — and went out in the Top 24. Three studio albums since 2022.",
    notableSongs: ["Giving You Up", "Strangers", "Steady Heart", "Seventeen", "Burn 'Em All"],
    latestRelease: "Sad Songs for the Soul (2025)",
    signature:
      "Before the music worked, he dropped out of college and sold auto parts for General Motors to support his mom after she was diagnosed with a degenerative disc injury. A Voice talent recruiter found him through his YouTube live videos.",
    ellaConnection:
      "He already has a hit with Ella: their 2024 duet \"Strangers\" is RIAA-certified Gold and reached No. 43 on Hot Country Songs. If you only catch one opener on this tour, the odds of hearing it live are best on his nights.",
    sources: [
      "https://en.wikipedia.org/wiki/Kameron_Marlowe",
      "https://www.riaa.com/gold-platinum/",
    ],
  },
  {
    slug: "ernest",
    name: "ERNEST",
    who: "Ernest Keith Smith — stylized ERNEST — is a Nashville native on Big Loud and one of the most in-demand songwriters in town, with cuts recorded by Morgan Wallen, Jake Owen, Thomas Rhett, Florida Georgia Line and Jelly Roll. His own records lean traditional.",
    notableSongs: ["Flower Shops", "Cowgirls", "Would If I Could", "Hangin' On", "Devil I've Been"],
    latestRelease: "Deep Blue (2026)",
    signature:
      "He co-wrote a run of Morgan Wallen hits including \"More Than My Hometown,\" and Wallen's \"Cowgirls\" featuring ERNEST went 6x Platinum and hit No. 1 on Country Airplay. He survived a heart attack at 19 caused by a viral infection, and later named his son Ryman after the Ryman Auditorium.",
    sources: [
      "https://en.wikipedia.org/wiki/Ernest_(singer)",
      "https://www.cbsnews.com/news/ernest-new-album-heart-attack-at-19-country-music-dreams/",
    ],
  },
  {
    slug: "kaitlin-butts",
    name: "Kaitlin Butts",
    who: "Tulsa, Oklahoma native and one of the most distinctive voices out of the Red Dirt scene — a sub-genre she's spent her career pushing the edges of. She signed with Republic Records in 2025.",
    notableSongs: ["You Ain't Gotta Die", "Come Rest Your Head on My Pillow", "Never Really Mine"],
    latestRelease: "The Yeehaw Sessions (2025)",
    signature:
      "Her 2024 album \"Roadrunner!\" is a 17-track modern reimagining of Rodgers and Hammerstein's musical \"Oklahoma!\" — her favorite musical. It features a duet with Vince Gill and a country cover of Kesha's \"Hunt You Down.\" It is not a normal country record, and that's the point.",
    sources: [
      "https://www.rollingstone.com/music/music-features/kaitlin-butts-red-dirt-roadrunner-album-1235003612/",
      "https://variety.com/2025/music/news/kaitlin-butts-signs-republic-records-you-aint-gotta-die-1236565843/",
    ],
  },
  {
    slug: "laci-kaye-booth",
    name: "Laci Kaye Booth",
    who: "Country singer-songwriter from Livingston, Texas, with a warm, smoky voice and an intimate, introspective style. She came up as a Top 5 finalist on season 17 of American Idol in 2019 and signed a major-label deal off the back of it.",
    notableSongs: ["The Loneliest Girl in the World"],
    latestRelease: "The Loneliest Girl in the World (2024)",
    signature:
      "She auditioned for American Idol with Merle Haggard's \"Mama Tried\" and finished in the Top 5. Her 2024 album leans classic enough that reviewers reached for Patsy Cline and Loretta Lynn comparisons, and Atwood Magazine named it one of the year's best.",
    sources: [
      "https://en.wikipedia.org/wiki/American_Idol_season_17",
      "https://atwoodmagazine.com/lkbw-laci-kaye-booth-the-loneliest-girl-in-the-world-debut-album-review/",
    ],
  },
  {
    slug: "dylan-marlowe",
    name: "Dylan Marlowe",
    who: "Country singer-songwriter from Statesboro, Georgia, signed to Sony Music Nashville. He grew up on country plus his dad's Christian metal drumming, and cites Eric Church and Kenny Chesney alongside Linkin Park and Blink-182.",
    notableSongs: ["Boys Back Home", "Picture Perfect", "Record High"],
    latestRelease: "Mid-Twenties Crisis (2024)",
    signature:
      "He got his first No. 1 as a songwriter — Jon Pardi's \"Last Night Lonely\" — before his own artist career took off. His debut single \"Boys Back Home\" with Dylan Scott hit No. 2 on Country Airplay and went Gold, but it had been recorded in 2021 and shelved; he had to re-cut his vocals when the label swapped it in as his debut.",
    sources: [
      "https://en.wikipedia.org/wiki/Dylan_Marlowe",
      "https://en.wikipedia.org/wiki/Boys_Back_Home",
    ],
  },
];

export function getOpener(slug: string): Opener | undefined {
  return OPENERS.find((o) => o.slug === slug);
}

/** Match a name from tour-dates.json `openers[]` to a profile, when we have one. */
export function openerByName(name: string): Opener | undefined {
  const n = name.trim().toLowerCase();
  return OPENERS.find((o) => o.name.toLowerCase() === n);
}

export const OPENER_SLUGS = OPENERS.map((o) => o.slug);
