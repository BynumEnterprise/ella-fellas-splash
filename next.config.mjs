/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  },
  async redirects() {
    return [
      // Consolidate the duplicate "what to bring" guide into the canonical one (SEO: avoid cannibalization).
      {
        source: "/guides/what-to-bring-to-an-ella-langley-concert",
        destination: "/guides/what-to-bring-ella-langley-concert",
        permanent: true,
      },
      // Travel-intent paths → the Plan Your Trip hub (so any travel URL resolves, never 404s).
      { source: "/things-to-do", destination: "/plan-your-trip", permanent: true },
      { source: "/travel", destination: "/plan-your-trip", permanent: true },
      { source: "/experiences", destination: "/plan-your-trip", permanent: true },
      { source: "/plan", destination: "/plan-your-trip", permanent: true },
      // "/tours" (plural) is a common mistype of the tour-dates page.
      { source: "/tours", destination: "/tour", permanent: true },
    ];
  },
};
export default nextConfig;
