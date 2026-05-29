import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import {
  SHOP_CATEGORIES,
  getCategory,
  getProductsByCategory,
} from "@/lib/shop";
import { ShopFilters } from "./ShopFilters";

export async function generateStaticParams() {
  return SHOP_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.title} — The Fellas Shop`,
    description: cat.intro,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const products = getProductsByCategory(cat.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink/60 mb-5 flex items-center gap-1.5">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span aria-hidden>&middot;</span>
        <span className="text-ink/40">{cat.title}</span>
      </nav>

      {/* Category hero */}
      <header className="mb-10 pb-8 border-b border-ink/10">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-2xl" aria-hidden>
            {cat.glyph}
          </span>
          <p className="text-[11px] uppercase tracking-[0.22em] text-clay font-bold">
            {products.length} curated picks
          </p>
        </div>
        <h1 className="font-display text-4xl md:text-6xl text-denim leading-none tracking-wider">
          {cat.title}
        </h1>
        <p className="text-lg text-ink/70 italic mt-2">{cat.tagline}</p>
        <p className="text-base text-ink/80 mt-4 max-w-3xl leading-relaxed">
          {cat.intro}
        </p>
      </header>

      {/* Filters + product grid */}
      <ShopFilters products={products} categoryTitle={cat.title} />

      {/* Related categories strip */}
      <section className="mt-16 pt-10 border-t border-ink/10">
        <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold mb-4">
          Keep browsing
        </p>
        <div className="flex flex-wrap gap-2">
          {SHOP_CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/shop/category/${c.slug}`}
              className="text-xs uppercase tracking-[0.16em] px-3.5 py-2 bg-paper border border-ink/15 rounded-full text-ink/75 hover:border-primary hover:text-primary transition-colors font-bold"
            >
              <span className="mr-1.5" aria-hidden>
                {c.glyph}
              </span>
              {c.title}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <AffiliateDisclosure />
      </div>
    </div>
  );
}
