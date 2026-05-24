export function WebSiteSchema() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const json = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ella Fellas",
    url,
    description:
      "Unofficial fan-run news and tour information site for country music artist Ella Langley.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
