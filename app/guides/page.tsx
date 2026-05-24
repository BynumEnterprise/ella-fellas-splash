import type { Metadata } from "next";
import { getAllGuideContent } from "@/lib/content";
import { GuideCard } from "@/components/GuideCard";

export const metadata: Metadata = {
  title: "Ella Langley Guides",
  description:
    "Long-form guides for Ella Langley fans — concert prep, song rankings, opening acts, presale tactics, and more.",
};

export default function GuidesIndexPage() {
  const guides = getAllGuideContent();
  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-denim">GUIDES</h1>
        <p className="text-ink/80 mt-3">
          The big stuff. Concert prep, song rankings, what to wear, how to score tickets, who&apos;s opening.
        </p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((g) => (
          <GuideCard
            key={g.slug}
            slug={g.slug}
            title={g.frontmatter.title}
            excerpt={g.frontmatter.excerpt}
            category={g.frontmatter.category}
          />
        ))}
      </div>
    </article>
  );
}
