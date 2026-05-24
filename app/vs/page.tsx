import type { Metadata } from "next";
import { getAllComparisons } from "@/lib/data";
import { ComparisonCard } from "@/components/ComparisonCard";

export const metadata: Metadata = {
  title: "Ella Langley Compared",
  description:
    "How Ella Langley stacks up against Lainey Wilson, Morgan Wallen, Zach Bryan, Miranda Lambert, and the rest of the country class.",
};

export default function ComparisonsIndexPage() {
  const comps = getAllComparisons();
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-denim">ELLA LANGLEY VS THE FIELD</h1>
        <p className="text-ink/80 mt-3">
          How she actually compares to the other names you&apos;ll hear in the same conversation.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {comps.map((c) => <ComparisonCard key={c.slug} c={c} />)}
      </div>
    </article>
  );
}
