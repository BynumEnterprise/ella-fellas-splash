import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllNews, getNewsBySlug } from "@/lib/content";
import { ArticleSchema } from "@/components/schema/ArticleSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNewsBySlug(slug);
  if (!n) return {};
  return {
    title: n.frontmatter.title,
    description: n.frontmatter.excerpt,
    openGraph: {
      type: "article",
      title: n.frontmatter.title,
      description: n.frontmatter.excerpt,
      publishedTime: n.frontmatter.publishedAt,
      url: `/news/${slug}`,
      images: [`/api/og?title=${encodeURIComponent(n.frontmatter.title)}&kicker=${encodeURIComponent("NEWS — " + (n.frontmatter.publishedAt ?? ""))}`],
    },
    alternates: { canonical: `/news/${slug}` },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const url = `${SITE_URL}/news/${item.slug}`;
  const breadcrumbItems = [
    { name: "News", url: `${SITE_URL}/news` },
    { name: item.frontmatter.title, url },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <ArticleSchema
        type="NewsArticle"
        title={item.frontmatter.title}
        excerpt={item.frontmatter.excerpt}
        publishedAt={item.frontmatter.publishedAt}
        updatedAt={item.frontmatter.updatedAt}
        url={url}
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/news" className="hover:text-primary">&larr; All news</Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-clay font-medium">
          <span className="bg-paper border border-denim/30 text-denim px-2 py-0.5 rounded-full">
            {item.frontmatter.category}
          </span>
          <span className="text-ink/60">{formatDate(item.frontmatter.publishedAt, "long")}</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-3 leading-tight">
          {item.frontmatter.title}
        </h1>
        <p className="text-lg text-ink/80 italic mt-3">{item.frontmatter.excerpt}</p>
      </header>

      <div className="prose-content">
        <MDXRemote source={item.body} />
      </div>

      <section className="mt-10 bg-denim text-paper rounded-xl p-6 md:p-8">
        <h2 className="font-display text-2xl text-paper tracking-wider mb-2">
          NEVER MISS AN ELLA UPDATE
        </h2>
        <p className="text-paper/80 text-sm mb-5 leading-relaxed">
          Daily Ella Langley news, tour alerts, and ticket-drop notifications &mdash; straight to your inbox.
        </p>
        <NewsletterSignup placement="news-inline" />
      </section>

      <hr className="my-10" />

      <footer className="text-xs text-ink/60">
        <p className="font-display tracking-wide text-denim mb-1">THE ELLA FELLAS EDITORS</p>
        <p>
          Daily Ella Langley coverage. AI-assisted, human-edited.{" "}
          <Link href="/about" className="text-primary hover:underline">About us</Link>
        </p>
      </footer>
    </article>
  );
}