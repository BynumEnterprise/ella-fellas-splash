import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { SHOP_CATEGORIES, getProductsByCategory } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Concert Gear & Fan Picks — the Ella Fellas Shop",
  description:
    "Hand-picked men's gear for Ella Langley concerts and country shows: boots, earplugs, hats, portable chargers, and Dandelion vinyl. Browse products on-site, buy via Amazon.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* HERO */}
      <header className="mb-12 text-center max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-clay font-medium mb-3">
          Curated affiliate picks
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-denim leading-none tracking-wider">
          THE FELLAS SHOP
        </h1>
        <p className="text-lg text-ink/80 mt-5 leading-relaxed">
          Stuff we actually recommend for the fellas heading to an Ella Langley show &mdash; concert
          gear, festival packing, and additions to the fan collection.{" "}
          <strong className="text-denim">Click any product to see the details.</strong>
        </p>
        <p className="text-sm text-ink/55 mt-3">
          Every product page has an Amazon affiliate link &mdash; you don&apos;t pay more, we get a
          small commission that keeps Ella Fellas free.
        </p>
      </header>

      {/* Category nav chips */}
      <nav className="flex flex-wrap justify-center gap-2 mb-12">
        {SHOP_CATEGORIES.map((cat) => (
          <a
            key={cat.slug}
            href={`#${cat.slug}`}
            className="text-xs uppercase tracking-[0.18em] px-4 py-2 bg-paper border border-ink/15 rounded-full text-ink/75 hover:border-primary hover:text-primary transition-colors font-medium"
          >
            {cat.title}
          </a>
        ))}
      </nav>

      {SHOP_CATEGORIES.map((cat) => {
        const products = getProductsByCategory(cat.slug);
        return (
          <section key={cat.slug} id={cat.slug} className="mb-16 scroll-mt-24">
            <div className="mb-7">
              <h2 className="font-display text-3xl md:text-4xl text-denim tracking-wider">
                {cat.title}
              </h2>
              <p className="text-ink/75 mt-2 leading-relaxed max-w-3xl">{cat.intro}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  className="group bg-paper border border-ink/12 rounded-xl overflow-hidden flex flex-col hover:border-primary hover:shadow-lg transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-denim/90 text-paper text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
                        {p.badge}
                      </span>
                    )}
                    {p.price && (
                      <span className="absolute bottom-3 right-3 bg-paper/95 text-denim text-xs uppercase tracking-[0.15em] px-2.5 py-1 rounded-full font-display font-medium backdrop-blur-sm border border-ink/10">
                        {p.price}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-display text-lg md:text-xl text-denim leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-sm text-ink/75 mt-2 leading-relaxed flex-1">
                      {p.blurb}
                    </p>
                    <span className="mt-4 inline-flex items-center justify-center gap-1 px-4 py-2.5 bg-denim text-paper font-display tracking-wide text-sm rounded-md group-hover:bg-primary group-hover:text-ink transition-colors">
                      SEE DETAILS &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="bg-primary/10 border-2 border-primary rounded-xl p-7 md:p-10 mb-10 text-center">
        <h2 className="font-display text-3xl text-denim mb-2 tracking-wider">
          LOOKING FOR OFFICIAL MERCH?
        </h2>
        <p className="text-ink/80 mb-5 max-w-xl mx-auto">
          We&apos;re an unofficial fan site. For official Ella Langley apparel and tour merch, go
          straight to the source.
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
