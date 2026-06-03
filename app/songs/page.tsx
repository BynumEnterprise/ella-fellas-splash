import Link from "next/link";
import type { Metadata } from "next";
import { Disc3, Sparkles, TrendingUp } from "lucide-react";
import { getAllSongs } from "@/lib/data";
import type { Song } from "@/lib/types";

export const metadata: Metadata = {
  title: "Ella Langley Songs",
  description:
    "Every Ella Langley song — Hungover (2024) and Dandelion (2026). Breakdowns, chart performance, and live debut info.",
  alternates: { canonical: "/songs" },
  openGraph: { url: "/songs" },
};

interface AlbumMeta {
  slug: string;
  title: string;
  year: string;
  tagline: string;
  bg: string;
  textOn: string;
}

const ALBUMS: AlbumMeta[] = [
  {
    slug: "dandelion",
    title: "DANDELION",
    year: "2026",
    tagline: "The breakout LP. Triple #1, Lori McKenna co-writes, sold-out arenas.",
    bg: "bg-gradient-to-br from-primary via-primary-dark to-clay",
    textOn: "text-paper",
  },
  {
    slug: "hungover",
    title: "HUNGOVER",
    year: "2024",
    tagline: "The debut. The Riley Green duet that started it all, plus the deep cuts that signaled what was coming.",
    bg: "bg-gradient-to-br from-denim via-denim/90 to-ink",
    textOn: "text-paper",
  },
];

function highestPeak(s: Song): string | null {
  if (!s.chartPeak) return null;
  if (s.chartPeak.hot100) return `#${s.chartPeak.hot100} Hot 100`;
  if (s.chartPeak.countryAirplay) return `#${s.chartPeak.countryAirplay} Country`;
  if (s.chartPeak.hotCountrySongs) return `#${s.chartPeak.hotCountrySongs} Hot Country`;
  return null;
}

export default function SongsIndexPage() {
  const allSongs = getAllSongs();

  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      {/* HERO */}
      <header className="text-center max-w-3xl mx-auto mb-14">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-clay font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Every song, ranked, broken down
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-denim tracking-wider leading-none">
          THE SONGS
        </h1>
        <p className="text-lg text-ink/80 mt-5 leading-relaxed">
          Two albums, {allSongs.length} tracks, three #1 singles. Pick a record, pick a song, get the
          full breakdown — chart performance, writers, the live story, the why.
        </p>
      </header>

      {ALBUMS.map((album) => {
        const tracks = allSongs.filter((s) => s.albumSlug === album.slug);
        if (tracks.length === 0) return null;
        return (
          <section key={album.slug} id={album.slug} className="mb-16">
            {/* Album hero */}
            <div className={`${album.bg} rounded-2xl p-6 md:p-10 mb-6 relative overflow-hidden shadow-xl`}>
              <div className="flex items-start justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <p className={`${album.textOn}/70 text-xs uppercase tracking-[0.25em] mb-2`}>
                    Album · {album.year}
                  </p>
                  <h2 className={`${album.textOn} font-display text-4xl md:text-6xl tracking-wider leading-none`}>
                    {album.title}
                  </h2>
                  <p className={`${album.textOn}/85 mt-4 max-w-xl leading-relaxed`}>
                    {album.tagline}
                  </p>
                  <p className={`${album.textOn}/65 text-xs uppercase tracking-wider mt-3`}>
                    {tracks.length} tracks
                  </p>
                </div>
                <Disc3
                  className={`${album.textOn} w-20 h-20 md:w-28 md:h-28 opacity-30 flex-shrink-0`}
                  strokeWidth={1.2}
                  aria-hidden
                />
              </div>
              <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full border-2 border-paper/10" aria-hidden />
              <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full border-2 border-paper/15" aria-hidden />
            </div>

            {/* Track grid */}
            <ol className="grid md:grid-cols-2 gap-3">
              {tracks.map((s, idx) => {
                const peak = highestPeak(s);
                return (
                  <li key={s.slug}>
                    <Link
                      href={`/songs/${s.slug}`}
                      className="group flex items-start gap-4 bg-paper border border-ink/10 rounded-lg p-4 md:p-5 hover:border-primary hover:shadow-md transition-all"
                    >
                      <span className="font-display text-3xl md:text-4xl text-ink/25 leading-none flex-shrink-0 w-10 text-right">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h3 className="font-display text-lg md:text-xl text-denim lowercase leading-tight group-hover:text-primary transition-colors">
                            {s.title}
                          </h3>
                          {s.feat && (
                            <span className="text-xs text-ink/55 italic">feat. {s.feat}</span>
                          )}
                        </div>
                        <p className="text-sm text-ink/70 mt-1.5 line-clamp-2 leading-relaxed">
                          {s.tldr}
                        </p>
                        <div className="flex items-center gap-3 mt-2.5 text-[11px] uppercase tracking-[0.12em] text-ink/55">
                          <span>{s.duration}</span>
                          {peak && (
                            <span className="inline-flex items-center gap-1 text-primary font-medium">
                              <TrendingUp className="w-3 h-3" />
                              {peak}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <div className="mt-14 text-center border-t border-ink/10 pt-10">
        <p className="text-sm text-ink/60">
          Want a ranked argument instead of an album list?{" "}
          <Link href="/guides/best-ella-langley-songs-ranked" className="text-primary hover:underline font-medium">
            Read the full ranking
          </Link>
          .
        </p>
      </div>
    </article>
  );
}