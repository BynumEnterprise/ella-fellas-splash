"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { ShopProduct, SortKey, ShopCategory } from "@/lib/shop";
import {
  PRICE_BUCKETS,
  RATING_FILTERS,
  priceToNumber,
  sortProducts,
} from "@/lib/shop";
import { ProductCard } from "@/components/ProductCard";

interface Props {
  products: ShopProduct[];
  categories: ShopCategory[];
}

const SORT_LABELS: Record<SortKey, string> = {
  popular: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Highest rated",
};

export function AllProductsBrowser({ products, categories }: Props) {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activePrices, setActivePrices] = useState<string[]>([]);
  const [activeRating, setActiveRating] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("popular");
  const [openMobileFilters, setOpenMobileFilters] = useState(false);

  // Per-category counts (over the full catalog, not the filtered set).
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return counts;
  }, [products]);

  const toggle = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const clearAll = () => {
    setActiveCategories([]);
    setActivePrices([]);
    setActiveRating(null);
  };

  const hasFilters =
    activeCategories.length > 0 ||
    activePrices.length > 0 ||
    activeRating !== null;

  const filtered = useMemo(() => {
    let arr = products;

    if (activeCategories.length > 0) {
      arr = arr.filter((p) => activeCategories.includes(p.category));
    }

    if (activePrices.length > 0) {
      const buckets = PRICE_BUCKETS.filter((b) => activePrices.includes(b.id));
      arr = arr.filter((p) => {
        const n = priceToNumber(p.price);
        return buckets.some((b) => n >= b.min && n < b.max);
      });
    }

    if (activeRating) {
      const rf = RATING_FILTERS.find((r) => r.id === activeRating);
      if (rf) arr = arr.filter((p) => (p.rating ?? 0) >= rf.min);
    }

    return sortProducts(arr, sort);
  }, [products, activeCategories, activePrices, activeRating, sort]);

  // ---- Active-filter chips -------------------------------------------------
  const chips: { key: string; label: string; remove: () => void }[] = [];
  for (const slug of activeCategories) {
    const cat = categories.find((c) => c.slug === slug);
    chips.push({
      key: `cat-${slug}`,
      label: cat ? cat.title : slug,
      remove: () => toggle(slug, setActiveCategories),
    });
  }
  for (const id of activePrices) {
    const b = PRICE_BUCKETS.find((b) => b.id === id);
    if (b)
      chips.push({
        key: `price-${id}`,
        label: b.label,
        remove: () => toggle(id, setActivePrices),
      });
  }
  if (activeRating) {
    const rf = RATING_FILTERS.find((r) => r.id === activeRating);
    if (rf)
      chips.push({
        key: `rating-${activeRating}`,
        label: rf.label,
        remove: () => setActiveRating(null),
      });
  }

  const activeCount =
    activeCategories.length + activePrices.length + (activeRating ? 1 : 0);

  // ---- Filter panel (shared by sidebar + mobile drawer) --------------------
  const FilterPanel = ({ inline }: { inline?: boolean }) => (
    <div
      className={
        inline
          ? "hidden lg:flex flex-col gap-7 sticky top-6 self-start"
          : "flex flex-col gap-7"
      }
    >
      {/* Category */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold mb-3">
          Category
        </p>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const checked = activeCategories.includes(cat.slug);
            const count = categoryCounts.get(cat.slug) ?? 0;
            return (
              <label
                key={cat.slug}
                className={`flex items-center gap-2.5 cursor-pointer text-sm py-1.5 px-2.5 rounded-md border transition-all ${
                  checked
                    ? "border-primary bg-primary/10 text-denim font-medium"
                    : "border-ink/15 hover:border-ink/30 text-ink/80"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(cat.slug, setActiveCategories)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="flex-1">{cat.title}</span>
                <span className="text-[11px] text-ink/45">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
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
                  onChange={() => toggle(b.id, setActivePrices)}
                  className="w-4 h-4 accent-primary"
                />
                {b.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold mb-3">
          Customer rating
        </p>
        <div className="flex flex-col gap-2">
          {RATING_FILTERS.map((r) => {
            const checked = activeRating === r.id;
            return (
              <label
                key={r.id}
                className={`flex items-center gap-2.5 cursor-pointer text-sm py-1.5 px-2.5 rounded-md border transition-all ${
                  checked
                    ? "border-primary bg-primary/10 text-denim font-medium"
                    : "border-ink/15 hover:border-ink/30 text-ink/80"
                }`}
              >
                <input
                  type="radio"
                  name="rating-filter"
                  checked={checked}
                  onChange={() => setActiveRating(checked ? null : r.id)}
                  onClick={() => {
                    if (checked) setActiveRating(null);
                  }}
                  className="w-4 h-4 accent-primary"
                />
                {r.label}
              </label>
            );
          })}
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-primary hover:underline self-start flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-8">
      <aside>
        <FilterPanel inline />
      </aside>

      <div>
        {/* Toolbar: count + sort + mobile filter trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-sm text-ink/70">
            Showing{" "}
            <span className="font-bold text-denim">{filtered.length}</span> of{" "}
            {products.length} products
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenMobileFilters(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs uppercase tracking-wider px-3 py-2 bg-paper border border-ink/15 rounded-md hover:border-primary"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              {activeCount > 0 && (
                <span className="ml-0.5 bg-primary text-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeCount}
                </span>
              )}
            </button>
            <label
              htmlFor="all-sort"
              className="text-xs uppercase tracking-wider text-ink/60"
            >
              Sort
            </label>
            <select
              id="all-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-xs uppercase tracking-wider px-3 py-2 bg-paper border border-ink/15 rounded-md focus:outline-none focus:border-primary cursor-pointer"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active-filter chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.remove}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-2.5 py-1.5 bg-denim/8 border border-denim/20 text-denim rounded-full hover:bg-denim/15 transition-colors"
              >
                {chip.label}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] uppercase tracking-wider text-primary hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Grid / empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-ink/15 rounded-xl">
            <p className="font-display text-2xl text-denim tracking-wide mb-1">
              NOTHING MATCHES
            </p>
            <p className="text-ink/60">
              No products match those filters. Try loosening them up.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-denim text-paper text-xs uppercase tracking-wider font-display rounded-md hover:bg-denim/90"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.slug}
                product={p}
                source="shop-all"
                showBlurb
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      {openMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-ink/40"
            onClick={() => setOpenMobileFilters(false)}
            aria-hidden
          />
          <div className="w-72 max-w-[82vw] bg-paper p-5 overflow-y-auto">
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
              SHOW {filtered.length} PRODUCTS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
