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
    ];
  },
};
export default nextConfig;
