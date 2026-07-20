import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { getAllSongs } from "@/lib/data";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "Ella Langley's Collaborations & Duets: Every Feature (2026)";
const DESC =
  "Every Ella Langley duet and collaboration — Riley Green, Morgan Wallen, HARDY, Gretchen Wilson — with the story behind each. Who she's sung with and where to hear it.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/ella-langley-collaborations` },
  openGraph: { title: TITLE, description: DESC, images: [`/api/og?title=${encodeURIComponent("Ella Langley Collaborations")}&kicker=${encodeURIComponent("Every duet & feature")}`] },
};

export default function CollabsPage() {
  const collabs = getAllSongs().filter((s) => s.feat).sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1));
  const partners = [...new Set(collabs.map((s) => s.feat as string))];

  const faq = [
    { q: "Who has Ella Langley collaborated with?", a: `She's recorded duets and features with ${partners.join(", ")}. Her breakout was the Riley Green duet "You Look Like You Love Me," and she's since paired with names across country and rock-country.` },
    { q: "What is Ella Langley's biggest collaboration?", a: `"You Look Like You Love Me" with Riley Green — it hit No. 1 on Country Airplay, was her first Hot 100 entry, and won Musical Event of the Year at the 2024 CMA Awards. It's the collaboration that made her a headliner.` },
    { q: "Did Ella Langley record a song with Morgan Wallen?", a: `Yes — "I Can't Love You Anymore," a duet released April 24, 2026 on the Dandelion reissue, while she was opening his 2026 stadium tour.` },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Collaborations", url: `${SITE_URL}/ella-langley-collaborations` }]} />
      <FaqSchema items={faq} />
      <nav className="text-xs text-ink/60 mb-4"><Link href="/songs" className="hover:text-primary">&larr; All songs</Link></nav>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Collaborations</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">WHO ELLA LANGLEY HAS SUNG WITH</h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          Every duet and feature, newest first — the story behind each pairing and where to hear it.
          The short version: she picks collaborators who push her range, and it keeps working.
        </p>
      </header>
      <div className="space-y-3 mb-8">
        {collabs.map((s) => (
          <Link key={s.slug} href={`/songs/${s.slug}`} className="flex items-start justify-between gap-3 border border-ink/15 rounded-lg p-4 bg-paper hover:border-primary transition-colors">
            <div>
              <p className="text-xs uppercase tracking-wider text-clay">with {s.feat} · {s.releaseDate.slice(0, 4)}</p>
              <p className="font-display text-xl text-denim lowercase leading-tight mt-0.5">{s.title}</p>
              <p className="text-sm text-ink/75 mt-1 leading-relaxed">{s.tldr}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-1" aria-hidden="true" />
          </Link>
        ))}
      </div>
      <div className="bg-primary/10 border border-primary/40 rounded-lg p-4 mb-8">
        <p className="flex items-center gap-2 text-sm text-ink/85"><Users className="w-4 h-4 text-primary" aria-hidden="true" />
          Want the ranked version? See <Link href="/best-songs" className="underline text-denim hover:text-primary ml-1">the best Ella Langley songs</Link>.
        </p>
      </div>
      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">COMMON QUESTIONS</h2>
      <div className="space-y-4 mb-8">
        {faq.map((f) => (<div key={f.q} className="bg-paper border border-ink/10 rounded-lg p-5"><h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3><p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p></div>))}
      </div>
      <AffiliateDisclosure />
    </article>
  );
}
