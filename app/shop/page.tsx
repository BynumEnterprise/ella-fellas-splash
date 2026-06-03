import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import {
  SHOP_CATEGORIES,
  getProductsByCategory,
  getFeaturedProducts,
} from "@/lib/shop";

export const metadata: Metadata = {
  title: "The Fellas Shop — boutique gear for country fans",
  description:
    "Hand-picked men's gear for the Ella Langley superfan: concert essentials, western wear, whiskey & bar, ranch decor, vinyl, and 200+ curated picks across 10 categories.",
  alternates: { canonical: "/shop" },
  openGraph: { url: "/shop" },
};

export default function ShopPage() {
  const featured = getFeaturedProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* HERO */}
      <header className="mb-14 text-center max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-clay font-bold mb-3">
          The Fellas Shop
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-denim leading-none tracking-wider">
          BOUTIQUE PICKS FOR<br className="hidden md:inline" /> THE COUNTRY FAN
        </h1>
        <p className="text-lg text-ink/80 mt-6 leading-relaxed">
          200+ curated picks across 10 categories &mdash; from concert earplugs
          to whiskey glasses to ranch decor. Built by fellas who go to shows.
          Every link is an Amazon affiliate; you pay the same Amazon price.
        </p>
      </header>

      {/* Category nav strip */}
      <nav
        aria-label="Shop categories"
        className="flex flex-wrap justify-center gap-2 mb-14"
      >
        {SHOP_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop/category/${cat.slug}`}
            className="text-xs uppercase tracking-[0.16em] px-3.5 py-2 bg-paper border border-ink/15 rounded-full text-ink/75 hover:border-primary hover:text-primary transition-colors font-bold"
          >
            <span className="mr-1.5" aria-hidden>{cat.glyph}</span>
            {cat.title}
          </Link>
        ))}
      </nav>

      {/* FEATURED STRIP — top picks across categories */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold">
              Editor&apos;s picks
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider mt-1">
              FEATURED THIS WEEK
            </h2>
          </div>
          <p className="text-xs text-ink/60 hidden md:block">
            Our 8 most-recommended items right now
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              className="group block bg-paper border border-ink/12 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all"
            >
              <div className="aspect-square overflow-hidden bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="font-display text-sm text-denim leading-snug line-clamp-2">
                  {p.name}
                </p>
                {p.price && (
                  <p className="text-xs text-primary mt-1.5 uppercase tracking-wider font-bold">
                    {p.price}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORY GRID — 10 boutique category cards */}
      <section className="mb-16">
        <div className="mb-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold">
            All categories
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider mt-1">
            SHOP THE FULL CATALOG
          </h2>
          <p className="text-ink/70 mt-2 max-w-2xl">
            10 categories, 200+ products. Each one curated for the country fan
            who knows what they want and doesn&apos;t want to scroll through 50
            knockoffs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SHOP_CATEGORIES.map((cat) => {
            const products = getProductsByCategory(cat.slug);
            const previews = products.slice(0, 3);
            return (
              <Link
                key={cat.slug}
                href={`/shop/category/${cat.slug}`}
                className="group bg-paper border border-ink/12 rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all flex flex-col"
              >
                {/* Preview image strip — 3 product thumbs */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-ink/3">
                  {previews.map((p) => (
                    <div
                      key={p.slug}
                      className="aspect-square overflow-hidden bg-paper rounded-md"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-contain p-1.5"
                      />
                    </div>
                  ))}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl" aria-hidden>
                      {cat.glyph}
                    </span>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold">
                      {products.length} picks
                    </p>
                  </div>
                  <h3 className="font-display text-2xl text-denim tracking-wide leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-ink/65 italic mt-1">
                    {cat.tagline}
                  </p>
                  <p className="text-sm text-ink/75 mt-3 leading-relaxed flex-1">
                    {cat.intro}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-display tracking-wide text-primary group-hover:gap-2.5 transition-all">
                    SHOP THE CATEGORY &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Official merch callout */}
      <div className="bg-primary/10 border-2 border-primary rounded-xl p-7 md:p-10 mb-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold mb-2">
          One more thing
        </p>
        <h2 className="font-display text-3xl text-denim mb-2 tracking-wider">
          LOOKING FOR OFFICIAL ELLA MERCH?
        </h2>
        <p className="text-ink/80 mb-5 max-w-xl mx-auto">
          We&apos;re an unofficial fan site. For official Ella Langley apparel
          and tour merch, go straight to the source.
        </p>
        <a
          href="https://ellalangley.us"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90"
        >
          ELLALANGLEY.US &rarr;
        </a>
      </div>

      <AffiliateDisclosure />

      <p className="text-xs text-ink/50 mt-8 text-center">
        Looking for something specific?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Tell us what to add
        </Link>
        .
      </p>
    </div>
  );
}