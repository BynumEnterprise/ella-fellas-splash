import { readFileSync } from "node:fs";

// Legacy /tickets/<tour-id> URLs (the old ticketAffiliatePath) are still in
// Google's index (27 GSC 404s). Map every id that is still a live tour page to
// its /tour/<id> page; anything else falls through to the /tickets catch-all.
const TOUR_IDS = (() => {
  try {
    const raw = JSON.parse(readFileSync(new URL("./data/tour-dates.json", import.meta.url), "utf8"));
    const list = Array.isArray(raw) ? raw : raw.dates ?? [];
    return list.map((d) => d && d.id).filter((id) => typeof id === "string" && id.length > 0);
  } catch {
    return [];
  }
})();

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
      // 301s for removed pages still in Google's index (GSC 404 report, Jul 2026).
      // (Chicago 5/29, Nashville 7/10, Tampa 7/17, Arlington 7/24 were removed from
      // this list Oct 2026: those shows are back in data/tour-dates.json with live
      // /tour and /setlist pages, and the redirect was hiding them.)
      { source: "/shop/ww-trucker-cap-low-pro", destination: "/shop", permanent: true },
      { source: "/shop/ec-foldable-rain-jacket", destination: "/shop", permanent: true },
      // 301s from GSC 404 report (weekly SEO run, Sep 8 2026)
      // Moline slug was renamed (dropped "-at-the-mark") while the show is still upcoming
      { source: "/tour/moline-vibrant-arena-at-the-mark-2026-09-26", destination: "/tour/moline-vibrant-arena-2026-09-26", permanent: true },
      { source: "/tour/moline-vibrant-arena-at-the-mark-2026-09-26/set-times", destination: "/tour/moline-vibrant-arena-2026-09-26/set-times", permanent: true },
      { source: "/tour/moline-vibrant-arena-at-the-mark-2026-09-26/setlist", destination: "/tour/moline-vibrant-arena-2026-09-26/setlist", permanent: true },
      { source: "/tour/cowboys-music-festival-2026-07-10", destination: "/tour", permanent: true },
      { source: "/tour/cowboys-music-festival-2026-07-10/setlist", destination: "/setlists", permanent: true },
      { source: "/tour/baltimore-mt-bank-stadium-2026-07-18", destination: "/tour", permanent: true },
      { source: "/shop/wfw-felt-wide-brim-hat", destination: "/shop", permanent: true },
      // Consolidate duplicate "Ella Fellas" explainers into the definitive page (Jul 2026)
      { source: "/guides/what-are-ella-fellas", destination: "/what-is-an-ella-fella", permanent: true },
      // Internal-link 404 sweep (Oct 2026): old/misspelled show slugs linked from guides
      { source: "/tour/redwest-festival-2026-10-16", destination: "/tour/salt-lake-city-redwest-festival-2026-10-16", permanent: true },
      { source: "/tour/state-college-bryce-jordan-center-2026-09-11", destination: "/tour/university-park-bryce-jordan-center-2026-09-11", permanent: true },
      { source: "/tour/oxford-sjb-pavilion-2026-09-17", destination: "/tour/oxford-the-pavilion-ole-miss-2026-09-17", permanent: true },
      { source: "/tour/st.-paul-grand-casino-arena-2026-10-31", destination: "/tour/saint-paul-grand-casino-arena-2026-10-31", permanent: true },
      { source: "/tour/chicago-soldier-field-2026-06-20", destination: "/tour", permanent: true },
      { source: "/tour/clemson-memorial-stadium-2026-06-27", destination: "/tour", permanent: true },
      { source: "/about/biography", destination: "/about", permanent: true },
      { source: "/news/2026-09-11-muscadine-bloodline-joins-ella-langley-tour", destination: "/openers", permanent: true },
      { source: "/news/2026-05-26-riley-green-audition-dont-mind-if-i-do", destination: "/news", permanent: true },
      // Legacy /tickets/<id> (GSC: 27 x 404). Known tour ids -> their show page.
      ...TOUR_IDS.map((id) => ({
        source: `/tickets/${id}`,
        destination: `/tour/${id}`,
        permanent: true,
      })),
      // Unknown/retired ids (and anything deeper) -> the tour hub. Kept
      // non-permanent so a future /tickets hub page can take the bare path.
      { source: "/tickets/:path+", destination: "/tour", permanent: true },
      { source: "/tickets", destination: "/tour", permanent: false },
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
