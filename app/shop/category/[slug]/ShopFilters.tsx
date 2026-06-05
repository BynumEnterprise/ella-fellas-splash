"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { ShopProduct, SortKey } from "@/lib/shop";
import { PRICE_BUCKETS, priceToNumber, sortProducts } from "@/lib/shop";
import { ProductCard } from "@/components/ProductCard";

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
      <aside>
        <FilterPanel inline />
      </aside>

      <div>
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
              <ProductCard
                key={p.slug}
                product={p}
                source="category"
                showBlurb
              />
            ))}
          </div>
        )}
      </div>

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
