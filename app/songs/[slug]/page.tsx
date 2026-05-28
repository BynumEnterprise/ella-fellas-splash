import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Disc3,
  Mic2,
  Sliders,
  Music,
  TrendingUp,
  Trophy,
  Sparkles,
  PenLine,
} from "lucide-react";
import { getAllSongs, getSong } from "@/lib/data";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import type { Song } from "@/lib/types";

export async function generateStaticParams() {
  return getAllSongs().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSong(slug);
  if (!s) return {};
  return {
    title: `${s.title}${s.feat ? ` (feat. ${s.feat})` : ""} — Ella Langley`,
    description: s.tldr,
  };
}

// Each album gets its own gradient so song heroes feel like part of a record.
function albumArt(albumSlug: string) {
  if (albumSlug === "dandelion") {
    return {
      bg: "bg-gradient-to-br from-primary via-primary-dark to-clay",
      label: "DANDELION",
      year: "2026",
    };
  }
  return {
    bg: "bg-gradient-to-br from-denim via-denim/90 to-ink",
    label: "HUNGOVER",
    year: "2024",
  };
}

function paragraphs(text: string): string[] {
  return text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

function pickRelated(current: Song, all: Song[], n = 4): Song[] {
  // Prefer same-album songs, then cross-album. Skip the current track.
  const sameAlbum = all.filter((s) => s.slug !== current.slug && s.albumSlug === current.albumSlug);
  const other = all.filter((s) => s.slug !== current.slug && s.albumSlug !== current.albumSlug);
  return [...sameAlbum, ...other].slice(0, n);
}

export default async function SongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSong(slug);
  if (!s) notFound();

  const all = getAllSongs();
  const related = pickRelated(s, all);
  const art = albumArt(s.albumSlug);
  const aboutParagraphs = s.about ? paragraphs(s.about) : [];

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <nav className="text-xs text-ink/60 mb-6">
        <Link href="/songs" className="hover:text-primary">
          &larr; All songs
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <Link href="/songs" className="hover:text-primary">
          {s.album}
        </Link>
      </nav>

      {/* HERO */}
      <header className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-8 mb-10 items-start">
        {/* Album art tile */}
        <div
          className={`${art.bg} aspect-square rounded-xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden`}
          aria-hidden="true"
        >
          <div className="flex items-center justify-between text-paper/80">
            <Disc3 className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">{art.year}</span>
          </div>
          <div>
            <p className="font-display text-3xl text-paper tracking-wider leading-none">
              {art.label}
            </p>
            <p className="text-paper/70 text-xs uppercase tracking-[0.18em] mt-2">
              Track from this LP
            </p>
          </div>
          {/* decorative grooves */}
          <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full border-2 border-paper/15" aria-hidden />
          <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full border-2 border-paper/10" aria-hidden />
        </div>

        {/* Title block */}
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-clay font-medium">
            <Music className="w-3.5 h-3.5" />
            {s.album} · {s.releaseDate.slice(0, 4)}
            {s.feat ? ` · feat. ${s.feat}` : ""}
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-denim lowercase leading-none mt-3 tracking-wide">
            {s.title}
          </h1>
          <p className="text-lg italic text-ink/80 mt-5 leading-relaxed border-l-4 border-primary pl-4">
            {s.tldr}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-xs text-ink/65">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Released {s.releaseDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {s.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              Prod. {s.producer}
            </span>
          </div>
        </div>
      </header>

      {/* SPOTIFY PLAYER */}
      {s.spotifyId && (
        <section className="mb-10">
          <SpotifyEmbed id={s.spotifyId} />
        </section>
      )}

      {/* CHART TILES */}
      {s.chartPeak && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-denim mb-4 inline-flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> CHART PERFORMANCE
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {s.chartPeak.hot100 != null && (
              <ChartTile
                value={`#${s.chartPeak.hot100}`}
                label="Billboard Hot 100"
                accent="bg-primary/15 border-primary/40"
              />
            )}
            {s.chartPeak.countryAirplay != null && (
              <ChartTile
                value={`#${s.chartPeak.countryAirplay}`}
                label="Country Airplay"
                accent="bg-denim/10 border-denim/30"
              />
            )}
            {s.chartPeak.hotCountrySongs != null && (
              <ChartTile
                value={`#${s.chartPeak.hotCountrySongs}`}
                label="Hot Country Songs"
                accent="bg-clay/10 border-clay/40"
              />
            )}
            {s.weeksAtCountryNumberOne && (
              <ChartTile
                value={`${s.weeksAtCountryNumberOne} wks`}
                label="At #1 Country"
                accent="bg-emerald-50 border-emerald-200"
              />
            )}
            {s.weeksAtHot100NumberOne && (
              <ChartTile
                value={`${s.weeksAtHot100NumberOne} wks`}
                label="At #1 Hot 100"
                accent="bg-emerald-50 border-emerald-200"
              />
            )}
          </div>
        </section>
      )}

      {/* ABOUT THE SONG */}
      {aboutParagraphs.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl md:text-3xl text-denim mb-5 inline-flex items-center gap-2 tracking-wider">
            <Sparkles className="w-5 h-5 text-clay" /> ABOUT THE SONG
          </h2>
          <div className="prose-like max-w-none space-y-5 text-base md:text-lg text-ink/85 leading-relaxed">
            {aboutParagraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "first-letter:font-display first-letter:text-4xl first-letter:text-primary first-letter:mr-1 first-letter:float-left first-letter:leading-none" : ""}>
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* CREDITS + THEMES side-by-side */}
      <section className="grid md:grid-cols-2 gap-5 mb-10">
        <div className="bg-paper border border-ink/10 rounded-lg p-5">
          <h2 className="font-display text-lg text-denim mb-3 inline-flex items-center gap-2">
            <PenLine className="w-4 h-4 text-primary" /> WRITERS
          </h2>
          <ul className="space-y-2 text-sm">
            {s.writers.map((w) => (
              <li key={w} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
                {w}
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink/55 mt-4 pt-3 border-t border-ink/10 flex items-center gap-1.5">
            <Mic2 className="w-3.5 h-3.5" /> Produced by {s.producer}
          </p>
        </div>

        {s.themes.length > 0 && (
          <div className="bg-paper border border-ink/10 rounded-lg p-5">
            <h2 className="font-display text-lg text-denim mb-3">THEMES</h2>
            <div className="flex flex-wrap gap-2">
              {s.themes.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-denim text-paper px-3 py-1.5 rounded-full uppercase tracking-wide font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* YOUTUBE */}
      {s.youtubeId && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-denim mb-3">WATCH</h2>
          <YouTubeEmbed id={s.youtubeId} title={s.title} />
        </section>
      )}

      {/* AWARDS + LIVE DEBUT */}
      {((s.awards && s.awards.length > 0) || s.liveDebut) && (
        <section className="grid md:grid-cols-2 gap-5 mb-10">
          {s.awards && s.awards.length > 0 && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-5">
              <h2 className="font-display text-lg text-denim mb-3 inline-flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary-dark" /> AWARDS
              </h2>
              <ul className="space-y-1.5 text-sm">
                {s.awards.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <Trophy className="w-3.5 h-3.5 text-primary-dark mt-0.5 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {s.liveDebut && (
            <div className="bg-clay/10 border border-clay/30 rounded-lg p-5">
              <h2 className="font-display text-lg text-denim mb-2 inline-flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-clay" /> LIVE DEBUT
              </h2>
              <p className="text-sm text-ink/80 leading-relaxed">{s.liveDebut}</p>
            </div>
          )}
        </section>
      )}

      {/* RELATED SONGS */}
      {related.length > 0 && (
        <section className="mt-14 pt-10 border-t border-ink/10">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-2xl md:text-3xl text-denim tracking-wider">
              IF YOU LIKE THIS…
            </h2>
            <Link href="/songs" className="text-sm text-primary hover:underline">
              All songs &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((r) => {
              const rArt = albumArt(r.albumSlug);
              return (
                <Link
                  key={r.slug}
                  href={`/songs/${r.slug}`}
                  className="group block bg-paper border border-ink/10 rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all"
                >
                  <div className={`${rArt.bg} aspect-square p-4 flex items-end relative overflow-hidden`}>
                    <p className="font-display text-base text-paper tracking-wider leading-none relative z-10">
                      {rArt.label}
                    </p>
                    <Disc3 className="absolute -right-3 -top-3 w-16 h-16 text-paper/20" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base text-denim lowercase leading-tight group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                    {r.feat && (
                      <p className="text-xs text-ink/60 mt-0.5">feat. {r.feat}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}

function ChartTile({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className={`${accent} border rounded-lg p-4 text-center`}>
      <p className="font-display text-3xl md:text-4xl text-denim leading-none">{value}</p>
      <p className="text-[11px] uppercase tracking-[0.15em] text-ink/65 mt-2 font-medium">
        {label}
      </p>
    </div>
  );
}
