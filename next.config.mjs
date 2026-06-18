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
