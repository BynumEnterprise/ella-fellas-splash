import type { Metadata } from "next";
import { getAllNews } from "@/lib/content";
import { NewsCard } from "@/components/NewsCard";
import { assignPhotos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Ella Langley News",
  description:
    "Daily Ella Langley news, tour recaps, chart moves, and collaborations.",
  alternates: { canonical: "/news" },
  openGraph: { url: "/news", images: ["/opengraph-image.png"] },
};

export default function NewsIndexPage() {
  const news = getAllNews();
  const photos = assignPhotos(news);
  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-denim">NEWS</h1>
        <p className="text-ink/80 mt-3">
          Daily updates from the Ella Langley world. Tour recaps, chart news, collaborations,
          and the takes nobody else has the time to write.
        </p>
      </header>
      <h2 className="sr-only">Latest articles</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((n, i) => (
          <div key={n.slug} className={i === 0 ? "md:col-span-2 lg:col-span-3" : ""}>
          <NewsCard
            key={n.slug}
            slug={n.slug}
            title={n.frontmatter.title}
            excerpt={n.frontmatter.excerpt}
            publishedAt={n.frontmatter.publishedAt}
            category={n.frontmatter.category}
            photo={photos.get(n.slug)}
            featured={i === 0}
          />
          </div>
        ))}
      </div>
    </article>
  );
}