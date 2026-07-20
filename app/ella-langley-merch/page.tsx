import type { Metadata } from "next";
import Link from "next/link";
import { Disc3, Shirt, ShoppingBag, ExternalLink } from "lucide-react";
import { getProduct } from "@/lib/shop";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "Where to Buy Ella Langley Merch & Vinyl (2026)";
const DESC =
  "The real places to get Ella Langley vinyl, tees and merch — the Dandelion and Hungover LPs on Amazon, official apparel from her store, and concert-ready gear for show night.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/ella-langley-merch` },
  openGraph: {
    title: TITLE,
    description: DESC,
    images: [`/api/og?title=${encodeURIComponent("Ella Langley Merch & Vinyl")}&kicker=${encodeURIComponent("Where to actually buy it")}`],
  },
};

export default function MerchPage() {
  const dandelion = getProduct("fc-dandelion-vinyl");
  const hungover = getProduct("fc-hungover-vinyl");
  const vinyl = [dandelion, hungover].filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  const faq = [
    {
      q: "Where can I buy Ella Langley vinyl?",
      a: "Both of her albums are pressed on vinyl and available on Amazon: Dandelion (her 2026 second album) and Hungover (her debut, on plum-colored vinyl). Those are the two we link to below because they're real, in-stock pressings — not a placeholder search.",
    },
    {
      q: "Where do you get official Ella Langley merch (tees, hoodies)?",
      a: "Official apparel — tour tees, hoodies, hats — comes from her own official store at ellalangley.com. We don't sell official merch and we won't send you to a knockoff; for the real thing, her store is the source.",
    },
    {
      q: "What should I actually bring/wear to an Ella Langley show?",
      a: "That's a different question with a real answer — see our what-to-wear guide and the shop, where every pick is a verified product (boots, hats, clear bags for stadium shows, earplugs). It's concert-ready gear, not official merch, but it's the stuff that makes show night better.",
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Ella Langley Merch", url: `${SITE_URL}/ella-langley-merch` }]} />
      <FaqSchema items={faq} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/shop" className="hover:text-primary">&larr; The shop</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Merch &amp; vinyl</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          WHERE TO BUY ELLA LANGLEY MERCH &amp; VINYL
        </h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          The straight answer on where to actually get it — the vinyl you can buy today, the official
          apparel store, and the concert gear that makes show night better.
        </p>
      </header>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">
        <Disc3 className="w-6 h-6 inline mr-2 text-primary" aria-hidden="true" /> THE VINYL
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {vinyl.map((p) => (
          <Link
            key={p.slug}
            href={`/shop/${p.slug}`}
            className="group border border-ink/15 rounded-xl overflow-hidden bg-paper hover:border-primary hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden bg-ink/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <p className="font-display text-lg text-denim leading-tight">{p.name}</p>
              {p.price && <p className="text-sm text-clay mt-1">{p.price}</p>}
              <span className="mt-2 inline-block text-xs text-primary uppercase tracking-[0.15em] font-medium group-hover:underline">
                See it &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="border border-ink/15 rounded-lg p-5 bg-paper">
          <p className="flex items-center gap-2 font-display text-lg text-denim mb-2">
            <Shirt className="w-5 h-5 text-primary" aria-hidden="true" /> Official apparel
          </p>
          <p className="text-sm text-ink/80 leading-relaxed mb-3">
            Tour tees, hoodies and hats come from her own store. For the real thing (not a knockoff),
            go straight to the source.
          </p>
          <a
            href="https://www.ellalangley.com/"
            target="_blank"
            rel="noopener nofollow"
            className="inline-flex items-center gap-1 text-sm font-medium text-denim underline hover:text-primary"
          >
            ellalangley.com store <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
        <div className="border border-ink/15 rounded-lg p-5 bg-paper">
          <p className="flex items-center gap-2 font-display text-lg text-denim mb-2">
            <ShoppingBag className="w-5 h-5 text-primary" aria-hidden="true" /> Show-night gear
          </p>
          <p className="text-sm text-ink/80 leading-relaxed mb-3">
            Not merch, but the stuff that actually makes the night — boots, hats, stadium-legal clear
            bags, earplugs. Every pick is a verified product.
          </p>
          <Link href="/shop" className="inline-block text-sm font-medium text-denim underline hover:text-primary">
            Browse the shop &rarr;
          </Link>
        </div>
      </div>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">COMMON QUESTIONS</h2>
      <div className="space-y-4 mb-8">
        {faq.map((f) => (
          <div key={f.q} className="bg-paper border border-ink/10 rounded-lg p-5">
            <h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3>
            <p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-ink/70 mb-6">
        More:{" "}
        <Link href="/best-songs" className="underline text-denim hover:text-primary">her best songs</Link>,{" "}
        <Link href="/guides/what-to-wear-to-an-ella-langley-concert" className="underline text-denim hover:text-primary">what to wear</Link>,{" "}
        <Link href="/fan-club" className="underline text-denim hover:text-primary">the fan club</Link>.
      </p>

      <AffiliateDisclosure />
    </article>
  );
}
