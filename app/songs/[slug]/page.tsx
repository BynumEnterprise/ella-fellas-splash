import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllSongs, getSong } from "@/lib/data";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

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

export default async function SongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSong(slug);
  if (!s) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/songs" className="hover:text-primary">&larr; All songs</Link>
      </nav>

      <header className="mb-6">
        <p className="text-sm text-clay uppercase tracking-wider font-medium">
          {s.album} · {s.releaseDate.slice(0, 4)}{s.feat ? ` · feat. ${s.feat}` : ""}
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-denim lowercase leading-none mt-2">
          {s.title}
        </h1>
        <p className="text-xs text-ink/60 mt-3">
          Written by {s.writers.join(", ")} · Produced by {s.producer} · {s.duration}
        </p>
      </header>

      <p className="text-xl italic text-denim border-l-4 border-primary pl-4 my-6">
        {s.tldr}
      </p>

      {s.spotifyId && <SpotifyEmbed id={s.spotifyId} />}

      {s.themes.length > 0 && (
        <section className="my-6">
          <h2 className="font-display text-xl text-denim mb-2">THEMES</h2>
          <div className="flex flex-wrap gap-2">
            {s.themes.map((t) => (
              <span key={t} className="text-xs bg-denim text-paper px-3 py-1 rounded-full uppercase tracking-wide">
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {s.chartPeak && (
        <section className="my-6">
          <h2 className="font-display text-xl text-denim mb-3">CHART PERFORMANCE</h2>
          <ul className="space-y-1.5 text-sm">
            {s.chartPeak.hot100 != null && (
              <li><strong className="font-display text-primary">#{s.chartPeak.hot100}</strong> Billboard Hot 100</li>
            )}
            {s.chartPeak.countryAirplay != null && (
              <li><strong className="font-display text-primary">#{s.chartPeak.countryAirplay}</strong> Country Airplay</li>
            )}
            {s.chartPeak.hotCountrySongs != null && (
              <li><strong className="font-display text-primary">#{s.chartPeak.hotCountrySongs}</strong> Hot Country Songs</li>
            )}
            {s.weeksAtCountryNumberOne && (
              <li><strong className="font-display text-primary">{s.weeksAtCountryNumberOne}</strong> weeks at #1 country</li>
            )}
            {s.weeksAtHot100NumberOne && (
              <li><strong className="font-display text-primary">{s.weeksAtHot100NumberOne}</strong> weeks at #1 Hot 100</li>
            )}
          </ul>
        </section>
      )}

      {s.awards && s.awards.length > 0 && (
        <section className="my-6">
          <h2 className="font-display text-xl text-denim mb-2">AWARDS</h2>
          <ul className="text-sm space-y-1">
            {s.awards.map((a) => <li key={a}>&bull; {a}</li>)}
          </ul>
        </section>
      )}

      {s.youtubeId && <YouTubeEmbed id={s.youtubeId} title={s.title} />}

      {s.liveDebut && (
        <section className="my-6 bg-paper border border-ink/10 rounded-lg p-4">
          <h2 className="font-display text-lg text-denim mb-1">LIVE DEBUT</h2>
          <p className="text-sm text-ink/80">{s.liveDebut}</p>
        </section>
      )}
    </article>
  );
}
