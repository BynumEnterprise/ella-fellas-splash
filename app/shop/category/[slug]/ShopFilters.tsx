"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star, SlidersHorizontal, X } from "lucide-react";
import type { ShopProduct, SortKey } from "@/lib/shop";
import { PRICE_BUCKETS, priceToNumber, sortProducts } from "@/lib/shop";

interface Props {
  products: ShopProduct[];
  categoryTitle: string;
}

export function ShopFilters({ products, categoryTitle }: Props) {
  const [activePrices, setActivePrices] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("popular");
  const [openMobileFilters, setOpenMobileFilters] = useState(false);

  const togglePrice = (id: string) => {
    setActivePrices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    let arr = products;
    if (activePrices.length > 0) {
      const buckets = PRICE_BUCKETS.filter((b) => activePrices.includes(b.id));
      arr = arr.filter((p) => {
        const n = priceToNumber(p.price);
        return buckets.some((b) => n >= b.min && n < b.max);
      });
    }
    return sortProducts(arr, sort);
  }, [products, activePrices, sort]);

  const FilterPanel = ({ inline }: { inline?: boolean }) => (
    <div
      className={
        inline
          ? "hidden lg:flex flex-col gap-7 sticky top-6 self-start"
          : "flex flex-col gap-7"
      }
    >
      {/* Price filter */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold mb-3">
          Price
        </p>
        <div className="flex flex-col gap-2">
          {PRICE_BUCKETS.map((b) => {
            const checked = activePrices.includes(b.id);
            return (
              <label
                key={b.id}
                className={`flex items-center gap-2.5 cursor-pointer text-sm py-1.5 px-2.5 rounded-md border transition-all ${
                  checked
                    ? "border-primary bg-primary/10 text-denim font-medium"
                    : "border-ink/15 hover:border-ink/30 text-ink/80"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePrice(b.id)}
                  className="w-4 h-4 accent-primary"
                />
                {b.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Active filters / reset */}
      {activePrices.length > 0 && (
        <button
          type="button"
          onClick={() => setActivePrices([])}
          className="text-xs text-primary hover:underline self-start flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-8">
      {/* DESKTOP filter sidebar */}
      <aside>
        <FilterPanel inline />
      </aside>

      <div>
        {/* Top bar: results count + sort + mobile filter button */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p className="text-sm text-ink/70">
            <span className="font-bold text-denim">{filtered.length}</span> of{" "}
            {products.length} {categoryTitle.toLowerCase()} picks
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenMobileFilters(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs uppercase tracking-wider px-3 py-2 bg-paper border border-ink/15 rounded-md hover:border-primary"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              {activePrices.length > 0 && (
                <span className="ml-0.5 bg-primary text-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activePrices.length}
                </span>
              )}
            </button>
            <label className="text-xs uppercase tracking-wider text-ink/60">
              Sort
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-xs uppercase tracking-wider px-3 py-2 bg-paper border border-ink/15 rounded-md focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="popular">Popular</option>
              <option value="rating">Top rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-ink/15 rounded-xl">
            <p className="text-ink/60">No picks match those filters.</p>
            <button
              type="button"
              onClick={() => setActivePrices([])}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Link
                key={p.slug}
                href={`/shop/${p.slug}`}
                className="group bg-paper border border-ink/12 rounded-xl overflow-hidden flex flex-col hover:border-primary hover:shadow-md transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-denim text-paper text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full font-medium">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-display text-base text-denim leading-snug line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-xs text-ink/65 mt-1.5 line-clamp-2 flex-1">
                    {p.blurb}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink/8">
                    <div className="flex items-center gap-1">
                      {p.rating != null && (
                        <>
                          <Star className="w-3 h-3 fill-primary text-primary" strokeWidth={1.5} />
                          <span className="text-[11px] text-ink/70 font-medium">
                            {p.rating.toFixed(1)}
                          </span>
                          {p.reviewCount != null && (
                            <span className="text-[11px] text-ink/45">
                              ({p.reviewCount > 999 ? `${(p.reviewCount / 1000).toFixed(1)}k` : p.reviewCount})
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {p.price && (
                      <span className="font-display text-sm text-denim tracking-wider">
                        {p.price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* MOBILE filter drawer */}
      {openMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-ink/40"
            onClick={() => setOpenMobileFilters(false)}
            aria-hidden
          />
          <div className="w-72 max-w-[80vw] bg-paper p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <p className="font-display text-lg text-denim tracking-wide">
                FILTERS
              </p>
              <button
                type="button"
                onClick={() => setOpenMobileFilters(false)}
                className="text-ink/60 hover:text-denim"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
            <button
              type="button"
              onClick={() => setOpenMobileFilters(false)}
              className="mt-6 w-full px-5 py-3 bg-denim text-paper font-display tracking-wide rounded-md"
            >
              SHOW {filtered.length} PICKS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
