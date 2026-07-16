import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuideContent, getAllNews } from "@/lib/content";
import { getAllSongs, getAllComparisons, getAllTourDates } from "@/lib/data";
import { getAllProducts } from "@/lib/shop";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search Ella Fellas — find guides, songs, tour stops, news, shop picks, and comparisons across the unofficial Ella Langley superfan HQ.",
  // Search result pages should not be indexed (thin, query-driven), but links
  // out should still be followed. Self-canonical points at the bare /search URL.
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/search` },
};

interface Result {
  title: string;
  href: string;
  excerpt?: string;
  tag?: string;
}

interface Group {
  type: string;
  results: Result[];
}

/**
 * INTENT EXPANSION
 * ================
 * People don't search the words we wrote. They ask questions: "what do I bring
 * to an outdoor show", "when should I get there", "is it sold out". A literal
 * substring match returns nothing for those, which reads as "this site has no
 * answer" — when in fact we have a whole guide for it.
 *
 * So: map real question-shaped phrasing onto the vocabulary our pages actually
 * use, then match on the union. Deterministic, no embeddings, no API cost.
 */
const INTENTS: { triggers: string[]; expand: string[] }[] = [
  { triggers: ["bring", "pack", "packing", "carry", "allowed", "bag", "purse", "backpack", "clear bag"],
    expand: ["what to bring", "checklist", "clear bag", "earplugs", "charger", "essentials"] },
  { triggers: ["wear", "outfit", "dress", "clothes", "boots", "hat", "what should i wear"],
    expand: ["what to wear", "outfit", "boots", "hat", "western"] },
  { triggers: ["time", "start", "late", "early", "when", "come on", "go on", "stage time", "get there", "doors"],
    expand: ["set times", "doors", "openers", "start time", "lineup"] },
  { triggers: ["open", "opener", "opening", "support", "who is playing", "lineup"],
    expand: ["openers", "lineup", "support", "direct support"] },
  { triggers: ["stay", "hotel", "sleep", "airbnb", "rental", "where to stay", "crash"],
    expand: ["plan your trip", "traveling", "where to stay", "hotels"] },
  { triggers: ["park", "parking", "drive", "transit", "uber", "lyft", "getting there"],
    expand: ["parking", "transit", "getting to", "directions"] },
  { triggers: ["ticket", "sold out", "resale", "presale", "code", "cheap", "price", "seats"],
    expand: ["tickets", "sold out", "presale codes", "best seats", "resale"] },
  { triggers: ["setlist", "songs", "play live", "what does she play"],
    expand: ["setlist", "songs", "2026 setlist"] },
  { triggers: ["who is", "about ella", "new to", "beginner", "start with"],
    expand: ["who is ella langley", "for beginners", "bio"] },
  { triggers: ["meaning", "about the song", "lyrics"],
    expand: ["meaning", "song", "breakdown"] },
];

/** Query + everything that query probably means, lowercased. */
export function expandQuery(query: string): string[] {
  const q = query.toLowerCase().trim();
  const terms = new Set<string>([q]);
  for (const intent of INTENTS) {
    if (intent.triggers.some((t) => q.includes(t))) {
      intent.expand.forEach((e) => terms.add(e));
    }
  }
  // individual words too, so "outdoor amphitheater" still hits "amphitheater"
  q.split(/\s+/).filter((w) => w.length > 3).forEach((w) => terms.add(w));
  return Array.from(terms);
}

function matches(query: string, ...fields: (string | undefined | null)[]): boolean {
  const hay = fields
    .filter((f): f is string => Boolean(f))
    .join(" ")
    .toLowerCase();
  return expandQuery(query).some((t) => hay.includes(t));
}

function buildGroups(query: string): Group[] {
  const groups: Group[] = [];

  // --- Guides ---
  const guides = getAllGuideContent()
    .filter((g) =>
      matches(
        query,
        g.frontmatter.title,
        g.frontmatter.excerpt,
        g.frontmatter.category,
        g.body
      )
    )
    .map<Result>((g) => ({
      title: g.frontmatter.title,
      href: `/guides/${g.slug}`,
      excerpt: g.frontmatter.excerpt,
      tag: g.frontmatter.category,
    }));
  if (guides.length) groups.push({ type: "Guides", results: guides });

  // --- Songs ---
  const songs = getAllSongs()
    .filter((s) =>
      matches(
        query,
        s.title,
        s.feat,
        s.album,
        s.tldr,
        s.about,
        (s.themes ?? []).join(" ")
      )
    )
    .map<Result>((s) => ({
      title: s.title,
      href: `/songs/${s.slug}`,
      excerpt: s.tldr,
      tag: s.album,
    }));
  if (songs.length) groups.push({ type: "Songs", results: songs });

  // --- Shop ---
  const shop = getAllProducts()
    .filter((p) =>
      matches(query, p.name, p.blurb, p.why, p.amazonTitle, p.category)
    )
    .map<Result>((p) => ({
      title: p.name,
      href: `/shop/${p.slug}`,
      excerpt: p.blurb,
      tag: p.price,
    }));
  if (shop.length) groups.push({ type: "Shop", results: shop });

  // --- Tour ---
  const tour = getAllTourDates()
    .filter((d) =>
      matches(
        query,
        d.city,
        d.state,
        d.venue,
        d.tour,
        (d.openers ?? []).join(" "),
        d.headliner
      )
    )
    .map<Result>((d) => ({
      title: `${d.city}, ${d.state} — ${d.venue}`,
      href: `/tour/${d.id}`,
      excerpt: `${d.tour} · ${d.date}`,
      tag: d.soldOut ? "Sold out" : d.ticketPriceRange,
    }));
  if (tour.length) groups.push({ type: "Tour", results: tour });

  // --- News ---
  const news = getAllNews()
    .filter((n) =>
      matches(
        query,
        n.frontmatter.title,
        n.frontmatter.excerpt,
        n.frontmatter.category,
        n.body
      )
    )
    .map<Result>((n) => ({
      title: n.frontmatter.title,
      href: `/news/${n.slug}`,
      excerpt: n.frontmatter.excerpt,
      tag: n.frontmatter.category,
    }));
  if (news.length) groups.push({ type: "News", results: news });

  // --- Comparisons ---
  const comparisons = getAllComparisons()
    .filter((c) =>
      matches(
        query,
        c.compareTo,
        c.category,
        c.verdict,
        (c.similarities ?? []).join(" "),
        (c.differences ?? []).join(" ")
      )
    )
    .map<Result>((c) => ({
      title: `Ella Langley vs ${c.compareTo}`,
      href: `/vs/${c.slug}`,
      excerpt: c.verdict,
      tag: c.category,
    }));
  if (comparisons.length) groups.push({ type: "Comparisons", results: comparisons });

  return groups;
}

const POPULAR = [
  { href: "/tour", label: "Tour dates" },
  { href: "/songs", label: "Songs" },
  { href: "/guides", label: "Concert guides" },
  { href: "/shop", label: "Shop" },
  { href: "/news", label: "News" },
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const rawQuery = (raw ?? "").trim();
  const query = rawQuery.toLowerCase();

  const groups = query ? buildGroups(query) : [];
  const totalResults = groups.reduce((n, g) => n + g.results.length, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/" className="hover:text-primary">&larr; Home</Link>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-denim">
          {rawQuery ? <>Search results for &ldquo;{rawQuery}&rdquo;</> : "Search"}
        </h1>
        {rawQuery && (
          <p className="text-sm text-ink/60 mt-2">
            {totalResults} {totalResults === 1 ? "result" : "results"} across the site
          </p>
        )}
      </header>

      {/* On-page search form (works without JS too) */}
      <form action="/search" method="get" role="search" className="mb-10 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={rawQuery}
          placeholder="Search guides, songs, tour stops, shop…"
          aria-label="Search Ella Fellas"
          className="flex-1 bg-paper border border-ink/15 rounded-full px-4 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
        />
        <button
          type="submit"
          className="bg-primary text-paper rounded-full px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Empty query */}
      {!rawQuery && (
        <div className="text-ink/70">
          <p className="mb-4">Type something above to search the site.</p>
          <PopularLinks />
        </div>
      )}

      {/* No results */}
      {rawQuery && totalResults === 0 && (
        <div className="text-ink/70">
          <p className="mb-2">
            No matches for &ldquo;{rawQuery}&rdquo;. Try a different word, or jump to a
            popular section:
          </p>
          <PopularLinks />
          <p className="mt-4 text-sm">
            Planning a specific show?{" "}
            <Link href="/plan" className="font-semibold text-denim underline underline-offset-2 hover:text-primary">
              Build your night plan
            </Link>{" "}
            &mdash; it answers when to leave, what to pack, and when she&apos;s on.
          </p>
        </div>
      )}

      {/* Results */}
      {groups.map((group) => (
        <section key={group.type} className="mb-10">
          <h2 className="font-display text-2xl text-denim mb-1">
            {group.type}{" "}
            <span className="text-base text-ink/50 font-body">({group.results.length})</span>
          </h2>
          <ul className="divide-y divide-ink/10 border-t border-ink/10 mt-3">
            {group.results.map((r) => (
              <li key={r.href} className="py-3">
                <Link href={r.href} className="group block">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-ink font-medium group-hover:text-primary transition-colors">
                      {r.title}
                    </span>
                    {r.tag && (
                      <span className="text-xs text-clay uppercase tracking-wide flex-shrink-0">
                        {r.tag}
                      </span>
                    )}
                  </div>
                  {r.excerpt && (
                    <p className="text-sm text-ink/60 mt-1 line-clamp-2">{r.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function PopularLinks() {
  return (
    <ul className="flex flex-wrap gap-2 mt-2">
      {POPULAR.map((p) => (
        <li key={p.href}>
          <Link
            href={p.href}
            className="inline-block bg-paper border border-ink/15 rounded-full px-4 py-1.5 text-sm text-ink hover:text-primary hover:border-primary/40 transition-colors"
          >
            {p.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
