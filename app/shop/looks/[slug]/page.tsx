import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { ProductCard } from "@/components/ProductCard";
import {
  getAllLooks,
  getLook,
  getLookProducts,
  getLookTotal,
} from "@/lib/looks";

export function generateStaticParams() {
  return getAllLooks().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const look = getLook(slug);
  if (!look) return {};
  return {
    title: `${look.title} — Shop the Look | The Fellas Shop`,
    description: look.vibe,
    alternates: { canonical: `/shop/looks/${slug}` },
    openGraph: { title: `${look.title} — Shop the Look`, description: look.vibe },
  };
}

export default async function LookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const look = getLook(slug);
  if (!look) notFound();

  const products = getLookProducts(look);
  const total = getLookTotal(look);
  const otherLooks = getAllLooks().filter((l) => l.slug !== look.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-xs text-ink/60 mb-5 flex items-center gap-1.5 flex-wrap">
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <span aria-hidden>&middot;</span>
        <Link href="/shop/looks" className="hover:text-primary">Shop the Look</Link>
        <span aria-hidden>&middot;</span>
        <span className="text-ink/40">{look.title}</span>
      </nav>

      <header className="mb-10 pb-8 border-b border-ink/10 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-clay font-bold mb-3">
          {look.occasion}
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-denim leading-none tracking-wider">
          {look.title}
        </h1>
        <p className="text-lg text-ink/70 italic mt-2">{look.tagline}</p>
        <p className="text-base text-ink/85 mt-4 leading-relaxed">{look.vibe}</p>
        <div className="flex flex-wrap items-center gap-4 mt-5">
          <span className="text-sm text-ink/70">
            {products.length} pieces &middot;{" "}
            <span className="font-display text-denim text-lg">from ${Math.round(total)}</span>{" "}
            total
          </span>
        </div>
      </header>

      <section className="mb-14">
        <h2 className="font-display text-2xl md:text-3xl text-denim tracking-wider mb-1">
          THE FULL LOOK
        </h2>
        <p className="text-sm text-ink/65 mb-6">
          Tap any piece for details, or hit &ldquo;Check Price on Amazon&rdquo; to grab it.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} source={`look-${look.slug}`} />
          ))}
        </div>
      </section>

      {otherLooks.length > 0 && (
        <section className="mb-12 pt-10 border-t border-ink/10">
          <h2 className="font-display text-2xl text-denim tracking-wider mb-5">
            MORE LOOKS TO SHOP
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherLooks.map((l) => (
              <Link
                key={l.slug}
                href={`/shop/looks/${l.slug}`}
                className="text-xs uppercase tracking-[0.12em] px-4 py-2.5 bg-paper border border-ink/15 rounded-full text-ink/75 hover:border-primary hover:text-primary transition-colors font-bold"
              >
                {l.title}
              </Link>
            ))}
            <Link
              href="/shop/looks"
              className="text-xs uppercase tracking-[0.12em] px-4 py-2.5 bg-denim text-paper rounded-full font-bold hover:bg-denim/90 transition-colors"
            >
              All looks &rarr;
            </Link>
          </div>
        </section>
      )}

      <AffiliateDisclosure />
    </div>
  );
}
