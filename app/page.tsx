import Link from "next/link";
import { Calendar, Disc3, MapPin, Music, Ticket, TrendingUp } from "lucide-react";
import { getUpcomingTourDates, getAllSongs } from "@/lib/data";
import { getAllNews } from "@/lib/content";
import { TourCard } from "@/components/TourCard";
import { NewsCard } from "@/components/NewsCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";

function formatFeedDate(iso: string): string {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Curated full-bleed concert / countryside photography (Unsplash CDN, stable IDs).
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&q=80&auto=format&fit=crop";

export default function HomePage() {
  const upcoming = getUpcomingTourDates(4);
  const allNews = getAllNews();
  const news = allNews.slice(0, 3);
  const feed = allNews.slice(0, 12);
  const nextShow = upcoming[0];
  const allSongs = getAllSongs();
  // "Spinning now" = top single + a deep cut to balance discoverability and credibility.
  const spinningTrack = allSongs.find((s) => s.slug === "you-look-like-you-love-me") ?? allSongs[0];
  const dandelionPicks = allSongs.filter((s) => s.albumSlug === "dandelion").slice(0, 3);

  return (
    <div>
      {/* HERO with image */}
      <section className="relative -mt-px overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt="Country concert crowd at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-denim/80 via-denim/70 to-denim/95" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28 text-center text-paper">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            An unofficial fan site
          </p>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-primary leading-none tracking-wider drop-shadow-lg">
            ELLA FELLAS
          </h1>
          <p className="font-display text-lg md:text-2xl tracking-[0.22em] text-paper mt-4">
            THE UNOFFICIAL ELLA LANGLEY SUPERFAN HQ
          </p>
          <p className="text-base md:text-xl max-w-2xl mx-auto mt-7 text-paper/90 leading-relaxed">
            Daily news, tour stop guides, ticket alerts, and the song-by-song breakdowns you actually
            want to read.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tour"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-ink font-display tracking-wide hover:bg-primary-dark hover:text-paper rounded-md shadow-lg"
            >
              <Ticket className="w-4 h-4" /> SEE THE TOUR
            </Link>
            <Link
              href="#newsletter"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-paper/10 backdrop-blur-sm border border-paper/40 text-paper font-display tracking-wide hover:bg-paper/20 rounded-md"
            >
              JOIN THE DAILY
            </Link>
          </div>

          {/* Stat strip */}
          <div className="mt-12 grid grid-cols-3 gap-3 max-w-xl mx-auto text-paper">
            <StatTile value={`${upcoming.length || 21}`} label="Tour dates" />
            <StatTile value={`${allSongs.length}`} label="Songs broken down" />
            <StatTile value="DAILY" label="News drops" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* Next show banner */}
        {nextShow && (
          <section className="-mt-10 relative z-10 bg-paper border border-ink/15 rounded-xl shadow-xl p-6 md:p-7 mb-14">
            <div className="grid md:grid-cols-[1fr_auto] items-center gap-5">
              <div>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-clay font-medium mb-2">
                  <Calendar className="w-3.5 h-3.5" /> Next show
                </p>
                <p className="font-display text-2xl md:text-3xl text-denim tracking-wider leading-tight">
                  {nextShow.city}, {nextShow.state}
                </p>
                <p className="text-sm text-ink/70 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {nextShow.venue} · {nextShow.tour}
                </p>
              </div>
              <Link
                href={`/tour/${nextShow.id}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90 whitespace-nowrap"
              >
                <Ticket className="w-4 h-4" /> SHOW DETAILS
              </Link>
            </div>
          </section>
        )}

        {/* SPINNING NOW — Spotify embed of the marquee track */}
        <section className="mb-14 grid md:grid-cols-[280px_1fr] gap-6 items-center">
          {/* Stylized album-art tile */}
          <div className="bg-gradient-to-br from-denim via-denim/90 to-ink rounded-2xl aspect-square p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-paper/85">
              <Music className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                Spinning now
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-paper/70 text-xs uppercase tracking-[0.2em] mb-2">
                {spinningTrack.album} · {spinningTrack.releaseDate.slice(0, 4)}
              </p>
              <p className="font-display text-3xl text-paper lowercase leading-none">
                {spinningTrack.title}
              </p>
              {spinningTrack.feat && (
                <p className="text-paper/70 text-sm mt-2">feat. {spinningTrack.feat}</p>
              )}
            </div>
            <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full border-2 border-paper/10" aria-hidden />
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full border-2 border-paper/15" aria-hidden />
          </div>

          <div>
            <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider mb-2">
              SPINNING NOW
            </h2>
            <p className="text-ink/75 leading-relaxed mb-4">
              {spinningTrack.tldr}
            </p>
            {spinningTrack.spotifyId && <SpotifyEmbed id={spinningTrack.spotifyId} />}
            <Link
              href={`/songs/${spinningTrack.slug}`}
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary font-medium hover:underline"
            >
              Read the full breakdown <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {/* DANDELION SHOWCASE */}
        {dandelionPicks.length > 0 && (
          <section className="mb-14">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider inline-flex items-center gap-3">
                <Disc3 className="w-7 h-7 text-primary" />
                START WITH DANDELION
              </h2>
              <Link href="/songs" className="text-sm text-primary hover:underline">
                All songs &rarr;
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {dandelionPicks.map((s) => (
                <Link
                  key={s.slug}
                  href={`/songs/${s.slug}`}
                  className="group block bg-paper border border-ink/12 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="bg-gradient-to-br from-primary via-primary-dark to-clay aspect-[3/2] p-5 flex items-end relative overflow-hidden">
                    <p className="font-display text-2xl text-paper lowercase leading-none relative z-10 drop-shadow">
                      {s.title}
                    </p>
                    <Disc3
                      className="absolute -right-3 -top-3 w-20 h-20 text-paper/25"
                      strokeWidth={1.4}
                      aria-hidden
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-clay font-medium">
                      Dandelion · {s.duration}
                    </p>
                    <p className="text-sm text-ink/75 mt-2 line-clamp-2 leading-relaxed">
                      {s.tldr}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest News */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider">
              LATEST NEWS
            </h2>
            <Link href="/news" className="text-sm text-primary hover:underline">
              All news &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {news.map((n) => (
              <NewsCard
                key={n.slug}
                slug={n.slug}
                title={n.frontmatter.title}
                excerpt={n.frontmatter.excerpt}
                publishedAt={n.frontmatter.publishedAt}
                category={n.frontmatter.category}
              />
            ))}
          </div>
        </section>

        {/* Upcoming Tour */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider inline-flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-primary" />
              UPCOMING DATES
            </h2>
            <Link href="/tour" className="text-sm text-primary hover:underline">
              Full tour &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {upcoming.map((d) => (
              <TourCard key={d.id} d={d} />
            ))}
          </div>
        </section>

        {/* Daily Feed - running blog */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider">
              DAILY FEED
            </h2>
            <Link href="/news" className="text-sm text-primary hover:underline">
              Full archive &rarr;
            </Link>
          </div>
          <p className="text-sm text-ink/65 mb-6 max-w-2xl">
            Fresh Ella Langley updates posted daily. Scroll for the latest news, chart moves, tour
            talk, and what we&apos;re watching.
          </p>
          <div className="border-l-2 border-primary/40 pl-5 space-y-7">
            {feed.map((item) => (
              <article key={item.slug} className="relative">
                <div
                  className="absolute -left-[1.62rem] top-2 w-3 h-3 rounded-full bg-primary border-2 border-paper"
                  aria-hidden="true"
                />
                <p className="text-xs uppercase tracking-[0.15em] text-ink/55">
                  {formatFeedDate(item.frontmatter.publishedAt)}
                  {item.frontmatter.category && (
                    <span className="ml-2 text-primary">· {item.frontmatter.category}</span>
                  )}
                </p>
                <h3 className="font-display text-xl md:text-2xl text-denim mt-1 leading-tight">
                  <Link href={`/news/${item.slug}`} className="hover:underline">
                    {item.frontmatter.title}
                  </Link>
                </h3>
                {item.frontmatter.excerpt && (
                  <p className="text-ink/80 mt-2 leading-relaxed">{item.frontmatter.excerpt}</p>
                )}
                <Link
                  href={`/news/${item.slug}`}
                  className="inline-block mt-2 text-sm text-primary hover:underline"
                >
                  Read the full post &rarr;
                </Link>
              </article>
            ))}
          </div>
          {allNews.length > feed.length && (
            <div className="mt-7 text-center">
              <Link
                href="/news"
                className="inline-block px-5 py-2.5 border border-denim text-denim font-display tracking-wide hover:bg-denim hover:text-paper rounded-md"
              >
                SEE OLDER POSTS
              </Link>
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section
          id="newsletter"
          className="bg-primary/15 border-2 border-primary rounded-2xl p-7 md:p-12 mb-12"
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider">
              JOIN THE FELLAS. DAILY.
            </h2>
            <p className="text-ink/80 mt-2 max-w-xl mx-auto">
              One short email each morning. News, tour radar, the song of the day.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup placement="homepage" />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-paper/10 backdrop-blur-sm border border-paper/20 rounded-lg p-3">
      <p className="font-display text-2xl md:text-3xl tracking-wider leading-none text-primary">
        {value}
      </p>
      <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] mt-1.5 text-paper/80">
        {label}
      </p>
    </div>
  );
}
