import type { Metadata } from "next";
import Link from "next/link";
import { Disc3, Trophy, ArrowRight } from "lucide-react";
import { getAllSongs } from "@/lib/data";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import type { Song } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "The Best Ella Langley Songs, Ranked (2026)";
const DESC =
  "Her biggest hits and best deep cuts, ranked by what actually charted and won — from the CMA-winning \"You Look Like You Love Me\" down. Where to start with Ella Langley.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/best-songs` },
  openGraph: {
    title: TITLE,
    description: DESC,
    images: [`/api/og?title=${encodeURIComponent("Best Ella Langley Songs")}&kicker=${encodeURIComponent("Ranked by what actually charted")}`],
  },
};

/** Rank by real accomplishment: awards, then Country Airplay peak, then Hot 100. */
function score(s: Song): number {
  const cp = s.chartPeak ?? {};
  const awards = s.awards?.length ? 200 : 0;
  const airplay = cp.countryAirplay != null ? (31 - Math.min(cp.countryAirplay, 30)) * 3 : 0;
  const hot100 = cp.hot100 != null ? 101 - Math.min(cp.hot100, 100) : 0;
  return awards + airplay + hot100;
}

export default function BestSongsPage() {
  const ranked = [...getAllSongs()].sort((a, b) => score(b) - score(a));
  const top = ranked.filter((s) => score(s) > 0);
  const rest = ranked.filter((s) => score(s) === 0);

  const faq = [
    {
      q: "What is Ella Langley's biggest song?",
      a: "\"You Look Like You Love Me,\" her duet with Riley Green, is her signature hit — it hit No. 1 on Billboard's Country Airplay chart, became her first Hot 100 entry, and won Musical Event of the Year at the 2024 CMA Awards. It's the song that made her a headliner.",
    },
    {
      q: "What song should I start with for Ella Langley?",
      a: "Start with \"You Look Like You Love Me\" for the hit, then \"weren't for the wind\" and \"Choosin' Texas\" for her range, and \"Never Met Anyone Like You\" (with HARDY) if you want the loud one. From there the Dandelion album deep cuts reward repeat listens.",
    },
    {
      q: "How is this ranking decided?",
      a: "By what she actually accomplished — awards first, then Billboard Country Airplay peak, then Hot 100 — not by opinion alone. Album cuts without chart data are listed below the charting singles because they're where you go deeper, not because they're lesser songs.",
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Best Songs", url: `${SITE_URL}/best-songs` }]} />
      <FaqSchema items={faq} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/songs" className="hover:text-primary">&larr; All songs</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">The rankings</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          THE BEST ELLA LANGLEY SONGS
        </h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          Ranked by what actually charted and won — not just vibes. Start at the top, then go deep on
          the album cuts. Tap any song for the full breakdown.
        </p>
      </header>

      <ol className="space-y-3 mb-8">
        {top.map((s, i) => (
          <li key={s.slug}>
            <Link
              href={`/songs/${s.slug}`}
              className="flex items-start gap-4 border border-ink/15 rounded-lg p-4 bg-paper hover:border-primary transition-colors"
            >
              <span className="font-display text-3xl text-primary/70 w-8 shrink-0 text-right leading-none pt-1">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-display text-xl text-denim lowercase leading-tight">
                  {s.title}
                  {s.feat ? <span className="text-ink/60 text-base"> · feat. {s.feat}</span> : null}
                </p>
                <p className="text-sm text-ink/75 mt-1 leading-relaxed">{s.tldr}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-clay">
                  {s.awards?.map((a) => (
                    <span key={a} className="inline-flex items-center gap-1">
                      <Trophy className="w-3 h-3" aria-hidden="true" /> {a}
                    </span>
                  ))}
                  {s.chartPeak?.countryAirplay != null && (
                    <span>#{s.chartPeak.countryAirplay} Country Airplay</span>
                  )}
                  {s.chartPeak?.hot100 != null && <span>#{s.chartPeak.hot100} Hot 100</span>}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">
        <Disc3 className="w-6 h-6 inline mr-2 text-primary" aria-hidden="true" />
        GO DEEPER — THE ALBUM CUTS
      </h2>
      <div className="grid sm:grid-cols-2 gap-2 mb-8">
        {rest.map((s) => (
          <Link
            key={s.slug}
            href={`/songs/${s.slug}`}
            className="flex items-center justify-between gap-2 border border-ink/10 rounded-lg px-4 py-3 bg-paper hover:border-primary transition-colors"
          >
            <span className="font-display text-denim lowercase">{s.title}</span>
            <ArrowRight className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="bg-paper border border-ink/15 rounded-lg p-5 mb-8">
        <p className="text-sm text-ink/80 leading-relaxed">
          Want them on your shelf? Both albums are on vinyl:{" "}
          <Link href="/shop/fc-dandelion-vinyl" className="underline text-denim hover:text-primary">Dandelion</Link>{" "}
          and{" "}
          <Link href="/shop/fc-hungover-vinyl" className="underline text-denim hover:text-primary">Hungover</Link>.
        </p>
      </div>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">COMMON QUESTIONS</h2>
      <div className="space-y-4 mb-8">
        {faq.map((f) => (
          <div key={f.q} className="bg-paper border border-ink/10 rounded-lg p-5">
            <h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3>
            <p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p>
          </div>
        ))}
      </div>

      <AffiliateDisclosure />
    </article>
  );
}
