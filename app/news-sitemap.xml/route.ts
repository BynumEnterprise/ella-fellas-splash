import { getAllNews } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * GET /news-sitemap.xml — Google News sitemap.
 * Only includes articles published in the last 48 hours (Google News window).
 * Falls back to the 3 most recent posts if nothing is that fresh, so the
 * sitemap is never empty.
 */
export async function GET() {
  const all = getAllNews()
    .filter((n) => n.frontmatter.publishedAt)
    .sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1));

  const now = Date.now();
  let fresh = all.filter(
    (n) => now - new Date(n.frontmatter.publishedAt).getTime() < TWO_DAYS_MS
  );
  if (fresh.length === 0) fresh = all.slice(0, 3);

  const items = fresh
    .map(
      (n) => `  <url>
    <loc>${SITE_URL}/news/${n.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Ella Fellas</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(n.frontmatter.publishedAt).toISOString()}</news:publication_date>
      <news:title>${xmlEscape(n.frontmatter.title)}</news:title>
    </news:news>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=900",
    },
  });
}
