import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllGuideContent, getGuideBySlug } from "@/lib/content";
import { ArticleSchema } from "@/components/schema/ArticleSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllGuideContent().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuideBySlug(slug);
  if (!g) return {};
  return {
    title: g.frontmatter.title,
    description: g.frontmatter.excerpt,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: { url: `/guides/${slug}` },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getGuideBySlug(slug);
  if (!item) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const url = `${SITE_URL}/guides/${item.slug}`;
  const breadcrumbItems = [
    { name: "Guides", url: `${SITE_URL}/guides` },
    { name: item.frontmatter.title, url },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <ArticleSchema
        title={item.frontmatter.title}
        excerpt={item.frontmatter.excerpt}
        publishedAt={item.frontmatter.publishedAt}
        updatedAt={item.frontmatter.updatedAt}
        url={url}
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/guides" className="hover:text-primary">&larr; All guides</Link>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">
          {item.frontmatter.category}
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          {item.frontmatter.title}
        </h1>
        <p className="text-lg text-ink/80 italic mt-3">{item.frontmatter.excerpt}</p>
        <p className="text-xs text-ink/50 mt-3">
          Updated {formatDate(item.frontmatter.updatedAt ?? item.frontmatter.publishedAt, "long")}
        </p>
      </header>

      <div className="prose-content">
        <MDXRemote source={item.body} />
      </div>

      <AffiliateDisclosure />
    </article>
  );
}