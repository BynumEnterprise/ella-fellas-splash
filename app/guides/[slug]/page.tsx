import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllGuideContent, getGuideBySlug } from "@/lib/content";
import { ArticleSchema } from "@/components/schema/ArticleSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { TableOfContents } from "@/components/TableOfContents";
import { TrustByline } from "@/components/TrustByline";
import { TrustSignal } from "@/components/TrustSignal";
import { extractTocItems } from "@/lib/toc";
import { formatDate } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REHYPE_PLUGINS: any[] = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "wrap",
      properties: {
        className: ["anchor"],
        ariaHidden: true,
        tabIndex: -1,
      },
    },
  ],
];

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

  const tocItems = extractTocItems(item.body);

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

      {item.frontmatter.faq && item.frontmatter.faq.length > 0 && (
        <FaqSchema items={item.frontmatter.faq} />
      )}

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/guides" className="hover:text-primary">&larr; All guides</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">
          {item.frontmatter.category}
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          {item.frontmatter.title}
        </h1>
        <p className="text-lg text-ink/80 italic mt-3">{item.frontmatter.excerpt}</p>
        <TrustByline
          publishedAt={item.frontmatter.publishedAt}
          updatedAt={item.frontmatter.updatedAt}
        />
      </header>

      <TableOfContents items={tocItems} />

      <div className="prose-content">
        <MDXRemote
          source={item.body}
          options={{ mdxOptions: { rehypePlugins: REHYPE_PLUGINS } }}
        />
      </div>

      {item.frontmatter.faq && item.frontmatter.faq.length > 0 && (
        <section className="mt-12 pt-8 border-t border-ink/10">
          <h2 className="font-display text-2xl md:text-3xl text-denim mb-5">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {item.frontmatter.faq.map((f, i) => (
              <div key={i} className="bg-paper border border-ink/10 rounded-lg p-5">
                <h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3>
                <p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <TrustSignal />

      <AffiliateDisclosure />
    </article>
  );
}
