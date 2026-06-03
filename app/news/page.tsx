import type { Metadata } from "next";
import { getAllNews } from "@/lib/content";
import { NewsCard } from "@/components/NewsCard";

export const metadata: Metadata = {
  title: "Ella Langley News",
  description:
    "Daily Ella Langley news, tour recaps, chart moves, and collaborations.",
  alternates: { canonical: "/news" },
};

export default function NewsIndexPage() {
  const news = getAllNews();
  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-denim">NEWS</h1>
        <p className="text-ink/80 mt-3">
          Daily updates from the Ella Langley world. Tour recaps, chart news, collaborations,
          and the takes nobody else has the time to write.
        </p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((n) => (
          <NewsCard
            key={n.slug}
            slug={n.slug}
            title={n.frontmatter.title}
            excerpt={n.frontmatter.excerpt}
            publishedAt={n.frontmatter.publishedAt}
            category={n.frontmatter.category}
          />
        ))}
      </div>
    </article>
  );
}
