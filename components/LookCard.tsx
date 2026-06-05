import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLookProducts, getLookTotal, type Look } from "@/lib/looks";

interface Props {
  look: Look;
}

export function LookCard({ look }: Props) {
  const products = getLookProducts(look);
  const thumbs = products.slice(0, 4);
  const total = getLookTotal(look);

  return (
    <Link
      href={`/shop/looks/${look.slug}`}
      className="group bg-paper border border-ink/12 rounded-xl overflow-hidden flex flex-col hover:border-primary hover:shadow-lg transition-all"
    >
      <div className="grid grid-cols-2 gap-px bg-ink/8">
        {thumbs.map((p) => (
          <div key={p.slug} className="aspect-square overflow-hidden bg-paper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <p className="text-[11px] uppercase tracking-[0.18em] text-clay font-bold">
          {look.occasion}
        </p>
        <h3 className="font-display text-2xl text-denim tracking-wide leading-tight mt-1">
          {look.title}
        </h3>
        <p className="text-sm text-ink/65 italic mt-1">{look.tagline}</p>
        <p className="text-sm text-ink/80 mt-3 leading-relaxed flex-1 line-clamp-3">
          {look.vibe}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/8">
          <span className="text-sm text-ink/70">
            {products.length} pieces &middot;{" "}
            <span className="font-display text-denim">from ${Math.round(total)}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-display tracking-wide text-primary group-hover:gap-2 transition-all">
            Shop it <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
