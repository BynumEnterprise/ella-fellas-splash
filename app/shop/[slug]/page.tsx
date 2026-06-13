import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Star, Check, Truck, RotateCcw, Award, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import { AffiliateLink } from "@/components/AffiliateLink";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { amazonSearchUrl, amazonUrl } from "@/lib/affiliates";
import {
  SHOP_PRODUCTS,
  SHOP_CATEGORIES,
  getProduct,
  getProductsByCategory,
} from "@/lib/shop";
import { getLooksForProduct, getLookProducts } from "@/lib/looks";
import { ProductGallery } from "./ProductGallery";
import { ProductSchema } from "@/components/schema/ProductSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

export async function generateStaticParams() {
  return SHOP_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: { absolute: `${p.name} — Ella Fellas Shop` },
    description: p.blurb,
    openGraph: {
      title: `${p.name} — Ella Fellas`,
      description: p.blurb,
      images: p.image ? [p.image] : [],
      url: `/shop/${slug}`,
    },
    alternates: { canonical: `/shop/${slug}` },
  };
}

function RatingRow({ rating, count }: { rating: number; count: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.4 && rating - fullStars < 0.9;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < fullStars;
          const half = i === fullStars && hasHalf;
          return (
            <Star
              key={i}
              className={`w-4 h-4 ${filled || half ? "fill-primary text-primary" : "text-ink/20"}`}
              strokeWidth={1.5}
              style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
            />
          );
        })}
      </div>
      <span className="text-sm font-semibold text-ink">{rating.toFixed(1)}</span>
      <span className="text-sm text-ink/60">({count.toLocaleString()} Amazon reviews)</span>
    </div>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = SHOP_CATEGORIES.find((c) => c.slug === product.category);
  const isRealProduct = Boolean(product.asin);
  const amazonHref = product.asin
    ? amazonUrl(product.asin)
    : amazonSearchUrl(product.query ?? product.name);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const looks = getLooksForProduct(product.slug);
  const primaryLook = looks[0];
  const completeTheLook = primaryLook
    ? getLookProducts(primaryLook).filter((p) => p.slug !== product.slug).slice(0, 4)
    : [];

  const galleryImages = [product.image, ...(product.gallery ?? [])];
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const pageUrl = `${SITE_URL}/shop/${product.slug}`;
  const breadcrumbItems = [
    { name: "Shop", url: `${SITE_URL}/shop` },
    ...(category
      ? [{ name: category.title, url: `${SITE_URL}/shop#${category.slug}` }]
      : []),
    { name: product.name, url: pageUrl },
  ];
  const ctaLabel = isRealProduct ? "VIEW ON AMAZON" : "FIND ON AMAZON";
  const ctaSubLabel = isRealProduct
    ? "Opens the exact product page · Prime ships fast"
    : "Opens Amazon search · Tag is applied automatically";

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <ProductSchema product={product} url={pageUrl} />
      <BreadcrumbSchema items={breadcrumbItems} />
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
        <span aria-hidden>&middot;</span>
        <span className="text-ink/40 truncate max-w-[60vw]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 mb-14">
        <ProductGallery
          images={galleryImages}
          alt={product.name}
          badge={product.badge}
        />

        <div className="flex flex-col">
          {category && (
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold mb-3">
              {category.title}
            </p>
          )}
          <h1 className="font-display text-3xl md:text-4xl text-denim leading-tight tracking-wide">
            {product.name}
          </h1>
          {product.amazonTitle && (
            <p className="text-xs text-ink/55 mt-1.5 italic">
              Listed on Amazon as: {product.amazonTitle}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-3">
            {product.rating != null && product.reviewCount != null && (
              <RatingRow rating={product.rating} count={product.reviewCount} />
            )}
            {product.price && (
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-denim tracking-wider">
                  {product.price}
                </span>
                <span className="text-xs text-ink/55 uppercase tracking-wider">
                  on Amazon
                </span>
              </div>
            )}
          </div>

          <p className="text-base text-ink/85 mt-5 leading-relaxed">
            {product.blurb}
          </p>

          <AffiliateLink
            href={amazonHref}
            source={`amazon-detail-${product.slug}`}
            className="mt-6 inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-denim text-paper font-display tracking-[0.08em] rounded-md hover:bg-denim/90 text-base shadow-sm hover:shadow-md transition-all"
            ariaLabel={`Buy ${product.name} on Amazon`}
          >
            <ShoppingBag className="w-5 h-5" /> {ctaLabel} &rarr;
          </AffiliateLink>
          <p className="text-[11px] text-ink/55 mt-2.5 text-center">{ctaSubLabel}</p>

          <div className="mt-6 grid grid-cols-3 gap-2 pt-5 border-t border-ink/10">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Truck className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <span className="text-[11px] text-ink/70 leading-tight">
                Prime ships<br />1&ndash;2 days
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <RotateCcw className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <span className="text-[11px] text-ink/70 leading-tight">
                30-day<br />returns
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Award className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <span className="text-[11px] text-ink/70 leading-tight">
                Vetted by<br />the fellas
              </span>
            </div>
          </div>

          <div className="mt-6 p-5 bg-denim/5 border-l-4 border-primary rounded-r-lg">
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold mb-2">
              Why the fellas picked it
            </p>
            <p className="text-sm text-ink/85 leading-relaxed">{product.why}</p>
          </div>

          {primaryLook && (
            <Link
              href={`/shop/looks/${primaryLook.slug}`}
              className="mt-5 flex items-center gap-3 p-4 bg-primary/8 border border-primary/30 rounded-lg hover:bg-primary/15 transition-colors group"
            >
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm text-ink/85 flex-1">
                Part of the{" "}
                <span className="font-display text-denim">{primaryLook.title}</span>{" "}
                look &mdash; see the full outfit.
              </span>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold mb-3">
              What to expect
            </p>
            <ul className="space-y-2 text-sm text-ink/80">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Order today &mdash; Prime members usually get it before the next show.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Real Amazon product page &mdash; not a search result, not a fake listing.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>We test or curate every item ourselves &mdash; no algorithm picks.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Tag is applied at the link &mdash; you pay the same Amazon price either way.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <section className="bg-denim text-paper rounded-xl px-6 py-7 md:px-10 md:py-9 mb-14 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">
        <div className="flex-1">
          <p className="font-display text-xl md:text-2xl tracking-wide">
            Order {product.name.toLowerCase()} before the next show.
          </p>
          <p className="text-sm text-paper/70 mt-1.5">
            Prime ships fast. Returns are free for 30 days. Affiliate tag applied automatically.
          </p>
        </div>
        <AffiliateLink
          href={amazonHref}
          source={`amazon-detail-cta2-${product.slug}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-ink font-display tracking-wide rounded-md hover:bg-primary-dark hover:text-paper shadow"
          ariaLabel={`Buy ${product.name} on Amazon`}
        >
          {ctaLabel} &rarr;
        </AffiliateLink>
      </section>

      {completeTheLook.length > 0 && primaryLook && (
        <section className="mb-14">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Complete the look
              </p>
              <h2 className="font-display text-2xl text-denim tracking-wider mt-1">
                GOES WITH THE {primaryLook.title.toUpperCase()}
              </h2>
            </div>
            <Link
              href={`/shop/looks/${primaryLook.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-display tracking-wide text-primary hover:gap-2.5 transition-all whitespace-nowrap"
            >
              SEE THE FULL LOOK <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {completeTheLook.map((r) => (
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
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display text-sm text-denim leading-snug line-clamp-2">{r.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    {r.price && (
                      <p className="text-xs text-primary uppercase tracking-wider font-medium">{r.price}</p>
                    )}
                    {r.rating != null && (
                      <p className="text-xs text-ink/60 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-primary text-primary" strokeWidth={1.5} />
                        {r.rating.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl text-denim tracking-wider mb-5">
            MORE FROM {category?.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display text-sm text-denim leading-snug">{r.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    {r.price && (
                      <p className="text-xs text-primary uppercase tracking-wider font-medium">{r.price}</p>
                    )}
                    {r.rating != null && (
                      <p className="text-xs text-ink/60 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-primary text-primary" strokeWidth={1.5} />
                        {r.rating.toFixed(1)}
                      </p>
                    )}
                  </div>
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
