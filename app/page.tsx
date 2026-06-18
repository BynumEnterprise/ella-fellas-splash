import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Disc3, MapPin, Music, ShoppingBag, Ticket, TrendingUp } from "lucide-react";
import { getUpcomingTourDates, getAllSongs } from "@/lib/data";
import { getAllNews } from "@/lib/content";
import { getFeaturedProducts } from "@/lib/shop";
import { TourCard } from "@/components/TourCard";
import { NewsCard } from "@/components/NewsCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { formatDate, formatTime } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Your daily Ella Langley fan HQ: 2026 tour dates and tickets, song meanings, concert-prep guides, trip planning, and a curated shop. Independent, fan-run, updated daily.",
  alternates: { canonical: "/" },
};

// Curated full-bleed concert / countryside photography (Unsplash CDN, stable IDs).
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&q=80&auto=format&fit=crop";

// Backdrop imagery for Dandelion song cards — country/concert-themed Unsplash photos.
// Cycled through so each song card on the homepage gets a distinct visual.
const DANDELION_CARD_IMAGES = [
  "https://images.unsplash.com/photo-1544954412-78da2cfa1a0c?w=600&q=80&auto=format&fit=crop", // white dandelion
  "https://images.unsplash.com/photo-1550927049-d07581451e3c?w=600&q=80&auto=format&fit=crop", // dandelion at golden hour
  "https://images.unsplash.com/photo-1735931802315-c69b1b12f413?w=600&q=80&auto=format&fit=crop", // dandelions blowing in wind
];

export default function HomePage() {
  const upcomingTours = getUpcomingTourDates();
  const nextShow = upcomingTours[0];
  const allSongs = getAllSongs();
  const dandelionPicks = allSongs.filter((s) => s.album === "Dandelion").slice(0, 3);
  const news = getAllNews().slice(0, 4);
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      {/* HERO — full bleed image, brand-name overlay */}
      <section className="relative -mt-px overflow-hidden">
        <div className="relative h-[68vh] min-h-[440px] max-h-[640px] w-full">
          <Image
            src={HERO_IMAGE}
            alt="A country concert crowd at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-denim/30 via-denim/55 to-denim" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-4">
                The unofficial Ella Langley superfan HQ
              </p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-paper leading-none tracking-wider drop-shadow-lg">
                ELLA FELLAS
              </h1>
              <p className="text-lg md:text-xl text-paper/90 mt-5 leading-relaxed">
                Tour dates, song breakdowns, concert prep, and what to wear &mdash; for the fellas
                heading to an Ella Langley show.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/tour"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-ink font-display tracking-wide rounded-md hover:bg-primary/90"
                >
                  <Ticket className="w-4 h-4" />
                  TOUR DATES
                </Link>
                <Link
                  href="/songs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-paper/15 backdrop-blur text-paper border border-paper/30 font-display tracking-wide rounded-md hover:bg-paper/25"
                >
                  <Music className="w-4 h-4" />
                  SONG GUIDE
                </Link>
              </div>
              <p className="text-sm text-paper/75 mt-5">
                New here?{" "}
                <Link href="/guides/what-are-ella-fellas" className="text-primary font-medium hover:underline">
                  What &ldquo;Ella Fellas&rdquo; even means &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        {/* NEXT SHOW CARD — sits over the hero edge */}
        {nextShow && (
          <section className="-mt-10 relative z-10 bg-paper border border-ink/15 rounded-xl shadow-xl p-6 md:p-7 mb-14">
            <div className="flex flex-wrap items-start gap-4 justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-clay font-medium mb-2">
                  Next show
                </p>
                <h2 className="font-display text-2xl md:text-3xl text-denim leading-tight">
                  {nextShow.venue}
                </h2>
                <p className="text-sm text-ink/70 mt-1 inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {nextShow.city}, {nextShow.state} &middot; {nextShow.tour}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink/80">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {formatDate(nextShow.date, "long")}
                  </span>
                  {(nextShow.doorsTime || nextShow.showTime) && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {nextShow.doorsTime && <>Doors {formatTime(nextShow.doorsTime)}</>}
                      {nextShow.doorsTime && nextShow.showTime && <> &middot; </>}
                      {nextShow.showTime && <>Show {formatTime(nextShow.showTime)}</>}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/tour/${nextShow.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-denim text-paper font-display tracking-wide text-sm rounded-md hover:bg-denim/90"
              >
                <Ticket className="w-4 h-4" />
                SEE DETAILS
              </Link>
            </div>
          </section>
        )}

        {/* SPOTIFY EMBED — let visitors press play immediately */}
        <section className="mb-14 grid md:grid-cols-[280px_1fr] gap-6 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-clay font-medium mb-2">
              Now spinning
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-denim tracking-wider leading-tight">
              PRESS PLAY ON DANDELION
            </h2>
            <p className="text-sm text-ink/75 mt-2 leading-relaxed">
              Ella&apos;s 2026 second album. Country, but not always quiet. Start here and read the
              song-by-song breakdowns over on the songs page.
            </p>
            <Link
              href="/songs"
              className="inline-block mt-3 text-sm text-primary font-medium hover:underline"
            >
              Read the song guide &rarr;
            </Link>
          </div>
          <SpotifyEmbed id="2PyJAiQjp1OPkow2FJZKHR" />
        </section>

        {/* DANDELION SHOWCASE — now with backdrop imagery on each card */}
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
              {dandelionPicks.map((s, i) => {
                const bg = DANDELION_CARD_IMAGES[i % DANDELION_CARD_IMAGES.length];
                return (
                  <Link
                    key={s.slug}
                    href={`/songs/${s.slug}`}
                    className="group block bg-paper border border-ink/12 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bg}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-denim via-denim/65 to-denim/20" />
                      <div className="absolute inset-0 p-5 flex items-end">
                        <p className="font-display text-2xl text-paper lowercase leading-none relative z-10 drop-shadow-lg">
                          {s.title}
                        </p>
                      </div>
                      <Disc3
                        className="absolute right-3 top-3 w-10 h-10 text-paper/70 drop-shadow"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-clay font-medium">
                        Dandelion &middot; {s.duration}
                      </p>
                      <p className="text-sm text-ink/75 mt-2 line-clamp-2 leading-relaxed">
                        {s.tldr}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* GEAR FOR THE SHOW — featured affiliate products with product detail links */}
        {featuredProducts.length > 0 && (
          <section className="mb-14">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider inline-flex items-center gap-3">
                <ShoppingBag className="w-7 h-7 text-primary" />
                GEAR FOR THE SHOW
              </h2>
              <Link href="/shop" className="text-sm text-primary hover:underline">
                Full shop &rarr;
              </Link>
            </div>
            <p className="text-ink/75 mb-5 max-w-3xl leading-relaxed">
              What the crowd is actually wearing and bringing to Ella shows this tour. Click any
              pick to see the breakdown &mdash; we keep the &quot;buy&quot; button on the detail page
              so you know exactly what you&apos;re getting before you click through to Amazon.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  className="group bg-paper border border-ink/12 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-ink/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-denim/90 text-paper text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
                        {p.badge}
                      </span>
                    )}
                    {p.price && (
                      <span className="absolute bottom-3 right-3 bg-paper/95 text-denim text-[11px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-display font-medium backdrop-blur-sm border border-ink/10">
                        {p.price}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="font-display text-base text-denim leading-tight">{p.name}</p>
                    <p className="text-xs text-ink/65 mt-2 line-clamp-2 leading-relaxed flex-1">
                      {p.blurb}
                    </p>
                    <span className="mt-3 text-xs text-primary uppercase tracking-[0.15em] font-medium group-hover:underline">
                      See details &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* UPCOMING TOUR DATES */}
        {upcomingTours.length > 1 && (
          <section className="mb-14">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider inline-flex items-center gap-3">
                <Ticket className="w-7 h-7 text-primary" />
                UPCOMING TOUR DATES
              </h2>
              <Link href="/tour" className="text-sm text-primary hover:underline">
                Full tour &rarr;
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTours.slice(1, 7).map((show) => (
                <TourCard key={show.id} d={show} />
              ))}
            </div>
          </section>
        )}

        {/* LATEST NEWS */}
        {news.length > 0 && (
          <section className="mb-14">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider inline-flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-primary" />
                LATEST NEWS
              </h2>
              <Link href="/news" className="text-sm text-primary hover:underline">
                All news &rarr;
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {news.map((item) => (
                <NewsCard
                  key={item.slug}
                  slug={item.slug}
                  title={item.frontmatter.title}
                  excerpt={item.frontmatter.excerpt}
                  publishedAt={item.frontmatter.publishedAt}
                  category={item.frontmatter.category}
                />
              ))}
            </div>
          </section>
        )}

        {/* NEWSLETTER SIGNUP */}
        <section className="mb-10 bg-denim text-paper rounded-xl p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-paper tracking-wider mb-3">
            JOIN THE FELLAS
          </h2>
          <p className="text-paper/80 max-w-xl mx-auto mb-6 leading-relaxed">
            Tour drops, album updates, and concert prep guides &mdash; sent only when there&apos;s
            something worth telling you about. No spam. Unsubscribe anytime.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterSignup placement="homepage" />
          </div>
        </section>
      </div>
    </div>
  );
}
