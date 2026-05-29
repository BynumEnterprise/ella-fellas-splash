import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateLink } from "@/components/AffiliateLink";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { amazonSearchUrl, amazonUrl } from "@/lib/affiliates";
import {
  SHOP_PRODUCTS,
  SHOP_CATEGORIES,
  getProduct,
  getProductsByCategory,
} from "@/lib/shop";

export async function generateStaticParams() {
  return SHOP_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} — Ella Fellas Shop`,
    description: p.blurb,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = SHOP_CATEGORIES.find((c) => c.slug === product.category);
  const amazonHref = product.asin
    ? amazonUrl(product.asin)
    : amazonSearchUrl(product.query ?? product.name);
  const isRealProduct = !!product.asin;
  const allImages = [product.image, ...(product.gallery ?? [])];
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <article className="bg-paper">
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-6xl px-4 pt-8 text-xs text-ink/60 flex items-center gap-1.5">
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        {category && (
          <>
            <span aria-hidden>&middot;</span>
            <Link href={`/shop#${category.slug}`} className="hover:text-primary">
              {category.title}
            </Link>
          </>
        )}
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          {/* LEFT: Image gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink/5 border border-ink/10 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-denim/90 text-paper text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {allImages.slice(0, 4).map((src, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={i}
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    loading="lazy"
                    className="aspect-square w-full object-cover rounded-md border border-ink/15"
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product detail */}
          <div className="flex flex-col">
            {category && (
              <p className="text-xs uppercase tracking-[0.22em] text-clay font-medium mb-3">
                {category.title}
              </p>
            )}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-denim leading-tight tracking-wide">
              {product.name}
            </h1>
            {product.price && (
              <p className="font-display text-2xl text-primary mt-4 tracking-wider">
                {product.price}
              </p>
            )}
            <p className="text-base text-ink/85 mt-5 leading-relaxed">
              {product.blurb}
            </p>

            {/* Country-styled "why we picked it" callout */}
            <div className="mt-6 p-5 bg-denim/5 border-l-4 border-primary rounded-r-lg">
              <p className="text-xs uppercase tracking-[0.22em] text-clay font-medium mb-2">
                Why the fellas picked it
              </p>
              <p className="text-sm text-ink/85 italic leading-relaxed">{product.why}</p>
            </div>

            {/* Primary CTA */}
            <AffiliateLink
              href={amazonHref}
              source={`amazon-detail-${product.slug}`}
              className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-4 bg-denim text-paper font-display tracking-wide text-base rounded-md hover:bg-denim/90 shadow-md"
              ariaLabel={`Buy ${product.name} on Amazon`}
            >
              {isRealProduct ? "VIEW ON AMAZON" : "FIND ON AMAZON"} &rarr;
            </AffiliateLink>
            <p className="text-xs text-ink/55 mt-3 text-center md:text-left">
              Amazon affiliate link &mdash; you don&apos;t pay more, we get a small commission that
              keeps Ella Fellas free.
            </p>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-paper border border-ink/10 rounded-md">
                <p className="text-[10px] uppercase tracking-[0.15em] text-clay font-medium">Prime ship</p>
                <p className="text-xs text-ink/70 mt-1">1-2 days</p>
              </div>
              <div className="p-3 bg-paper border border-ink/10 rounded-md">
                <p className="text-[10px] uppercase tracking-[0.15em] text-clay font-medium">Returns</p>
                <p className="text-xs text-ink/70 mt-1">30 days</p>
              </div>
              <div className="p-3 bg-paper border border-ink/10 rounded-md">
                <p className="text-[10px] uppercase tracking-[0.15em] text-clay font-medium">Vetted</p>
                <p className="text-xs text-ink/70 mt-1">By fans</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details / what to expect section */}
        <section className="grid md:grid-cols-2 gap-10 py-10 border-t border-ink/10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-denim tracking-wider mb-4">
              WHAT TO EXPECT
            </h2>
            <ul className="space-y-3 text-sm text-ink/85 leading-relaxed">
              <li className="flex gap-3">
                <span className="text-primary font-display text-lg leading-none mt-0.5">&bull;</span>
                <span><strong className="text-denim">Concert-tested.</strong> Field-picked by fans who actually go to Ella shows &mdash; not a generic affiliate dump.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-display text-lg leading-none mt-0.5">&bull;</span>
                <span><strong className="text-denim">Country crowd-ready.</strong> Fits the look at amphitheatres, festivals, and stadium dates.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-display text-lg leading-none mt-0.5">&bull;</span>
                <span><strong className="text-denim">Worth the spend.</strong> {product.price ? `${product.price} range — priced to actually use, not collect dust.` : "Picked for value and longevity."}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-display text-lg leading-none mt-0.5">&bull;</span>
                <span><strong className="text-denim">Amazon delivery.</strong> One-click order, Prime-fast to your door &mdash; no boutique runaround.</span>
              </li>
            </ul>
          </div>
          <div className="bg-denim text-paper rounded-xl p-6 md:p-8 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-3">
              Ready to gear up?
            </p>
            <h3 className="font-display text-2xl md:text-3xl text-paper tracking-wider mb-4 leading-tight">
              ORDER {category ? category.title.split(" ")[0] : "GEAR"} BEFORE THE NEXT SHOW
            </h3>
            <p className="text-sm text-paper/80 mb-5 leading-relaxed">
              Show day comes up faster than you think. Click through to Amazon, lock in the size,
              and have it on the porch before doors open.
            </p>
            <AffiliateLink
              href={amazonHref}
              source={`amazon-detail-cta2-${product.slug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-ink font-display tracking-wide rounded-md hover:bg-primary/90 text-base self-start"
              ariaLabel={`Buy ${product.name} on Amazon`}
            >
              {isRealProduct ? "GET IT ON AMAZON" : "SHOP IT ON AMAZON"} &rarr;
            </AffiliateLink>
          </div>
        </section>

        {/* Related picks in same category */}
        {related.length > 0 && (
          <section className="py-12 border-t border-ink/10">
            <h2 className="font-display text-2xl md:text-3xl text-denim tracking-wider mb-6">
              MORE {category?.title}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/shop/${r.slug}`}
                  className="group block bg-paper border border-ink/12 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-ink/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image}
                      alt={r.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-display text-base text-denim leading-tight">{r.name}</p>
                    {r.price && (
                      <p className="text-xs text-primary mt-1 uppercase tracking-wider">{r.price}</p>
                    )}
                    <p className="text-xs text-primary mt-2 group-hover:underline">See details &rarr;</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AffiliateDisclosure />
      </div>
    </article>
  );
}
