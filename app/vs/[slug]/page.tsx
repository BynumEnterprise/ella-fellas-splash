import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllComparisons, getComparison } from "@/lib/data";

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
    openGraph: { url: `/vs/${slug}` },
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/vs" className="hover:text-primary">&larr; All comparisons</Link>
      </nav>

      <header className="mb-6">
        <p className="text-sm text-clay uppercase tracking-wider font-medium">{c.category}</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2">
          Ella Langley vs {c.compareTo}
        </h1>
      </header>

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
    </article>
  );
}