interface Props {
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  url: string;
  type?: "NewsArticle" | "Article";
}

export function ArticleSchema({
  title,
  excerpt,
  publishedAt,
  updatedAt,
  url,
  type = "Article",
}: Props) {
  const json = {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    description: excerpt,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    url,
    author: {
      "@type": "Organization",
      name: "Ella Fellas Team",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Ella Fellas",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
