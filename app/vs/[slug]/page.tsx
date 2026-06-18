import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllComparisons, getComparison } from "@/lib/data";
import { FaqSchema } from "@/components/schema/FaqSchema";
import type { FaqItem } from "@/lib/types";

export async function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};
  return {
    title: `Ella Langley vs ${c.compareTo}`,
    description: c.verdict,
    alternates: { canonical: `/vs/${slug}` },
    openGraph: { url: `/vs/${slug}`, images: ["/opengraph-image.png"] },
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  // Build FAQ items from comparison data
  const faqItems: FaqItem[] = [
    {
      q: `Is Ella Langley similar to ${c.compareTo}?`,
      a: c.similarities.join(". ") + ".",
    },
    {
      q: `How are Ella Langley and ${c.compareTo} different?`,
      a: c.differences.join(". ") + ".",
    },
    {
      q: `Who should I see live?`,
      a: c.verdict,
    },
    {
      q: `If I like ${c.compareTo}, will I like Ella Langley?`,
      a: `${c.category} fans often enjoy both. ${c.verdict}`,
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <FaqSchema items={faqItems} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/vs" className="hover:text-primary">&larr; All comparisons</Link>
      </nav>

      <header className="mb-6">
        <p className="text-sm text-clay uppercase tracking-wider font-medium">{c.category}</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2">
          Ella Langley vs {c.compareTo}
        </h1>
      </header>

      {/* At a glance: two-column side-by-side */}
      <section className="my-8 border border-ink/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-ink/10">
          <div className="bg-denim/5 px-4 py-3 text-center">
            <p className="font-display text-base text-denim tracking-wide">ELLA LANGLEY</p>
          </div>
          <div className="bg-clay/5 px-4 py-3 text-center">
            <p className="font-display text-base text-clay tracking-wide">{c.compareTo.toUpperCase()}</p>
          </div>
        </div>
        <div className="divide-y divide-ink/10">
          {c.similarities.map((s, i) => (
            <div key={`sim-${i}`} className="grid grid-cols-2 divide-x divide-ink/10">
              <div className="px-4 py-3 text-sm flex items-start gap-2">
                <span className="text-primary flex-shrink-0 mt-0.5">=</span>
                <span>{s}</span>
              </div>
              <div className="px-4 py-3 text-sm flex items-start gap-2">
                <span className="text-primary flex-shrink-0 mt-0.5">=</span>
                <span>{s}</span>
              </div>
            </div>
          ))}
          {c.differences.map((d, i) => (
            <div key={`diff-${i}`} className="grid grid-cols-2 divide-x divide-ink/10">
              <div className="bg-denim/5 px-4 py-3 text-sm flex items-start gap-2">
                <span className="text-denim flex-shrink-0 mt-0.5">&rsaquo;</span>
                <span>{d.split(";")[0]?.trim() ?? d}</span>
              </div>
              <div className="bg-clay/5 px-4 py-3 text-sm flex items-start gap-2">
                <span className="text-clay flex-shrink-0 mt-0.5">&rsaquo;</span>
                <span>{d.split(";")[1]?.trim() ?? d}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-ink/5 px-4 py-2 text-center">
          <p className="text-xs text-ink/50 uppercase tracking-wider">Rows with = are shared traits; rows with &rsaquo; are where they split</p>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <section className="bg-paper border border-ink/10 rounded-lg p-5">
          <h2 className="font-display text-xl text-denim mb-3">WHERE THEY OVERLAP</h2>
          <ul className="space-y-2 text-sm">
            {c.similarities.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary flex-shrink-0">&bull;</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-paper border border-ink/10 rounded-lg p-5">
          <h2 className="font-display text-xl text-denim mb-3">WHERE THEY DIVERGE</h2>
          <ul className="space-y-2 text-sm">
            {c.differences.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-clay flex-shrink-0">&bull;</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-denim text-paper rounded-lg p-6 my-8">
        <h2 className="font-display text-2xl text-primary mb-3">VERDICT</h2>
        <p className="text-lg leading-relaxed">{c.verdict}</p>
      </section>

      {/* Internal links: tour + songs */}
      <section className="my-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/tour"
          className="flex-1 bg-primary/15 border border-primary/30 rounded-lg p-4 hover:bg-primary/25 transition-colors"
        >
          <p className="font-display text-denim text-lg">See Ella Langley live &rarr;</p>
          <p className="text-sm text-ink/70 mt-1">Tour dates, tickets, venue guides</p>
        </Link>
        <Link
          href="/songs"
          className="flex-1 bg-paper border border-ink/10 rounded-lg p-4 hover:bg-ink/5 transition-colors"
        >
          <p className="font-display text-denim text-lg">Start with these songs &rarr;</p>
          <p className="text-sm text-ink/70 mt-1">Every song ranked, plus vinyl at the shop</p>
        </Link>
      </section>

      {/* Visible FAQ */}
      <section className="mt-10 pt-8 border-t border-ink/10">
        <h2 className="font-display text-2xl text-denim mb-5">FREQUENTLY ASKED</h2>
        <div className="space-y-4">
          {faqItems.map((f, i) => (
            <div key={i} className="bg-paper border border-ink/10 rounded-lg p-5">
              <h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3>
              <p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

