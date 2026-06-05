import Link from "next/link";
import type { Metadata } from "next";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { LookCard } from "@/components/LookCard";
import { getAllLooks } from "@/lib/looks";

export const metadata: Metadata = {
  title: "Shop the Look — Ella Langley concert outfits | The Fellas Shop",
  description:
    "Ready-made outfit collections for every kind of Ella Langley show — festival heat, arena night, honky-tonk, tailgate, rain-ready and more. Each look is real boots, hats, shirts and gear you can buy on Amazon in one scroll.",
  alternates: { canonical: "/shop/looks" },
};

export default function LooksIndexPage() {
  const looks = getAllLooks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav className="text-xs text-ink/60 mb-5 flex items-center gap-1.5">
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <span aria-hidden>&middot;</span>
        <span className="text-ink/40">Shop the Look</span>
      </nav>

      <header className="mb-12 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-clay font-bold mb-3">
          Shop the Look
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-denim leading-none tracking-wider">
          OUTFITS, BUILT FOR<br className="hidden md:inline" /> THE SHOW
        </h1>
        <p className="text-lg text-ink/80 mt-6 leading-relaxed">
          Stop guessing what to wear. Each look below is a complete outfit plus
          the gear that goes with it &mdash; boots, hat, shirt, belt, the
          essentials &mdash; picked for a specific kind of Ella Langley night.
          Every piece is a real Amazon listing you can grab in one scroll.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {looks.map((look) => (
          <LookCard key={look.slug} look={look} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-block px-6 py-3 border-2 border-denim text-denim font-display tracking-wide rounded-md hover:bg-denim hover:text-paper transition-colors"
        >
          &larr; BACK TO THE FULL SHOP
        </Link>
      </div>

      <div className="mt-12">
        <AffiliateDisclosure />
      </div>
    </div>
  );
}
