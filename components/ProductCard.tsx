import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import { AffiliateLink } from "@/components/AffiliateLink";
import { amazonSearchUrl, amazonUrl } from "@/lib/affiliates";
import type { ShopProduct } from "@/lib/shop";

interface Props {
  product: ShopProduct;
  source?: string;
  showBlurb?: boolean;
}

export function ProductCard({ product: p, source = "card", showBlurb = false }: Props) {
  const amazonHref = p.asin
    ? amazonUrl(p.asin)
    : amazonSearchUrl(p.query ?? p.name);

  return (
    <div className="group bg-paper border border-ink/12 rounded-xl overflow-hidden flex flex-col hover:border-primary hover:shadow-md transition-all">
      <Link
        href={`/shop/${p.slug}`}
        className="block relative aspect-square overflow-hidden bg-paper"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
        />
        {p.badge && (
          <span className="absolute top-3 left-3 bg-denim text-paper text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full font-medium">
            {p.badge}
          </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/shop/${p.slug}`} className="block">
          <h3 className="font-display text-base text-denim leading-snug line-clamp-2 hover:text-primary transition-colors">
            {p.name}
          </h3>
        </Link>

        {showBlurb && p.blurb && (
          <p className="text-xs text-ink/65 mt-1.5 line-clamp-2">{p.blurb}</p>
        )}

        <div className="flex items-center justify-between mt-2.5">
          {p.price ? (
            <span className="font-display text-lg text-denim tracking-wide">
              {p.price}
            </span>
          ) : (
            <span className="text-xs text-ink/50">See price on Amazon</span>
          )}
          {p.rating != null && (
            <span className="text-[11px] text-ink/65 flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-primary text-primary" strokeWidth={1.5} />
              {p.rating.toFixed(1)}
              {p.reviewCount != null && (
                <span className="text-ink/45 ml-0.5">
                  ({p.reviewCount > 999 ? `${(p.reviewCount / 1000).toFixed(1)}k` : p.reviewCount})
                </span>
              )}
            </span>
          )}
        </div>

        <AffiliateLink
          href={amazonHref}
          source={`${source}-${p.slug}`}
          className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-denim text-paper text-xs uppercase tracking-[0.08em] font-display rounded-md hover:bg-denim/90 transition-colors"
          ariaLabel={`Shop ${p.name} on Amazon`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Check Price on Amazon &rarr;
        </AffiliateLink>
        <Link
          href={`/shop/${p.slug}`}
          className="mt-1.5 text-center text-[11px] text-ink/55 hover:text-primary transition-colors"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
