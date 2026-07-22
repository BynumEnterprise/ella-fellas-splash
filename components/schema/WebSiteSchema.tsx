export function WebSiteSchema() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ella Fellas",
    alternateName: ["Ella Fella", "Ella Fellas HQ"],
    url,
    description:
      "Unofficial fan-run news and tour information site for country music artist Ella Langley.",
    logo: `${url}/logo.png`,
    sameAs: ["https://rz7eec-0u.myshopify.com/"],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ella Fellas",
    url,
    description:
      "Unofficial fan-run news and tour information site for country music artist Ella Langley.",
    publisher: { "@type": "Organization", name: "Ella Fellas", url },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/news?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
