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
      {
        source: "/guides/what-to-bring-to-an-ella-langley-concert",
        destination: "/guides/what-to-bring-ella-langley-concert",
        permanent: true,
      },
      { source: "/things-to-do", destination: "/plan-your-trip", permanent: true },
      { source: "/travel", destination: "/plan-your-trip", permanent: true },
      { source: "/experiences", destination: "/plan-your-trip", permanent: true },
      { source: "/plan", destination: "/plan-your-trip", permanent: true },
      { source: "/tours", destination: "/tour", permanent: true },
      { source: "/favicon.ico", destination: "/icon.png", permanent: true },
      // 301s for removed pages still in Google's index (GSC 404 report, Jul 2026)
      { source: "/tour/chicago-soldier-field-2026-05-29", destination: "/tour", permanent: true },
      { source: "/tour/nashville-nissan-stadium-2026-07-10", destination: "/tour", permanent: true },
      { source: "/tour/tampa-raymond-james-stadium-2026-07-17", destination: "/tour", permanent: true },
      { source: "/tour/arlington-att-stadium-2026-07-24", destination: "/tour", permanent: true },
      { source: "/shop/ww-trucker-cap-low-pro", destination: "/shop", permanent: true },
      { source: "/shop/ec-foldable-rain-jacket", destination: "/shop", permanent: true },
      // Consolidate duplicate "Ella Fellas" explainers into the definitive page (Jul 2026)
      { source: "/guides/what-are-ella-fellas", destination: "/what-is-an-ella-fella", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};
export default nextConfig;
