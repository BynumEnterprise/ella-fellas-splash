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
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink/60 mb-6 flex items-center gap-1.5">
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

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink/5 border border-ink/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-denim/90 text-paper text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Detail */}
        <div className="flex flex-col">
          {category && (
            <p className="text-xs uppercase tracking-[0.18em] text-clay font-medium mb-3">
              {category.title}
            </p>
          )}
          <h1 className="font-display text-3xl md:text-4xl text-denim leading-tight tracking-wide">
            {product.name}
          </h1>
          {product.price && (
            <p className="font-display text-xl text-primary mt-3 tracking-wider">
              {product.price}
            </p>
          )}
          <p className="text-base text-ink/85 mt-5 leading-relaxed">
            {product.blurb}
          </p>

          <div className="mt-6 p-5 bg-paper border border-ink/10 rounded-lg">
            <p className="text-xs uppercase tracking-[0.18em] text-clay font-medium mb-2">
              Why we picked it
            </p>
            <p className="text-sm text-ink/80 italic leading-relaxed">{product.why}</p>
          </div>

          <AffiliateLink
            href={amazonHref}
            source={`amazon-detail-${product.slug}`}
            className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90 text-base"
            ariaLabel={`Buy ${product.name} on Amazon`}
          >
            BUY ON AMAZON &rarr;
          </AffiliateLink>
          <p className="text-xs text-ink/55 mt-3">
            Amazon affiliate link &mdash; you don&apos;t pay more, we get a small commission that
            keeps Ella Fellas free.
          </p>
        </div>
      </div>

      {/* Related picks in same category */}
      {related.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl text-denim tracking-wider mb-5">
            MORE {category?.title}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/shop/${r.slug}`}
                className="group block bg-paper border border-ink/12 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-ink/5">
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
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <AffiliateDisclosure />
    </article>
  );
}
