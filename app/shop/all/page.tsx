import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { SHOP_CATEGORIES, getAllProducts } from "@/lib/shop";
import { AllProductsBrowser } from "./AllProductsBrowser";

export const metadata: Metadata = {
  title: "Shop All Products — The Fellas Shop",
  description:
    "Browse every curated pick in The Fellas Shop. Filter by category, price, and star rating, then sort by price or popularity. Western wear, concert essentials, whiskey & bar, vinyl, ranch decor and more — every link buys on Amazon.",
  alternates: { canonical: "/shop/all" },
};

export default function ShopAllPage() {
  const products = getAllProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink/60 mb-5 flex items-center gap-1.5">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span aria-hidden>&middot;</span>
        <span className="text-ink/40">All products</span>
      </nav>

      {/* Hero */}
      <header className="mb-10 pb-8 border-b border-ink/10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-clay font-bold mb-2">
          The full catalog
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-denim leading-none tracking-wider">
          BROWSE EVERYTHING
        </h1>
        <p className="text-base text-ink/80 mt-4 max-w-3xl leading-relaxed">
          Every curated pick across all {SHOP_CATEGORIES.length} categories,
          in one place. Filter by category, price, and rating &mdash; then sort
          to find your thing fast. Every link buys straight on Amazon.
        </p>
      </header>

      <AllProductsBrowser products={products} categories={SHOP_CATEGORIES} />

      <div className="mt-12">
        <AffiliateDisclosure />
      </div>
    </div>
  );
}
