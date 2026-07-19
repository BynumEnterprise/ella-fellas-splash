import type { MetadataRoute } from "next";
import { getAllTourDates, getAllSongs, getAllComparisons } from "@/lib/data";
import { getAllNews, getAllGuideContent } from "@/lib/content";
import { OPENERS } from "@/lib/openers";
import { SHOP_CATEGORY_SLUGS } from "@/lib/shop-catalog";
import { getAllProducts } from "@/lib/shop";
import { getAllLooks } from "@/lib/looks";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticUrls = [
    "",
    "/tour",
    "/set-times",
    "/setlists",
    "/ticket-prices",
    "/openers",
    "/plan-your-trip",
    "/songs",
    "/news",
    "/guides",
    "/vs",
    "/shop",
    "/shop/all",
    "/shop/looks",
    "/about",
    "/contact",
    "/disclaimer",
    "/privacy",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? ("daily" as const) : ("weekly" as const),
    priority: p === "" ? 1.0 : 0.7,
  }));

  const shopCategories = SHOP_CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/shop/category/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const products = getAllProducts().map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const looks = getAllLooks().map((l) => ({
    url: `${SITE_URL}/shop/looks/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const todayStr = new Date().toISOString().slice(0, 10);
  const tour = getAllTourDates()
    .filter((d) => d.date >= todayStr)
    .map((d) => ({
    url: `${SITE_URL}/tour/${d.id}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const songs = getAllSongs().map((s) => ({
    url: `${SITE_URL}/songs/${s.slug}`,
    lastModified: new Date(s.releaseDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const comps = getAllComparisons().map((c) => ({
    url: `${SITE_URL}/vs/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const news = getAllNews().map((n) => ({
    url: `${SITE_URL}/news/${n.slug}`,
    lastModified: new Date(n.frontmatter.updatedAt ?? n.frontmatter.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const guides = getAllGuideContent().map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.frontmatter.updatedAt ?? g.frontmatter.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const today = new Date().toISOString().slice(0, 10);
  const setTimes = getAllTourDates()
    .filter((d) => d.date >= today)
    .map((d) => ({
      url: `${SITE_URL}/tour/${d.id}/set-times`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));
  const setlists = getAllTourDates().map((d) => ({
    url: `${SITE_URL}/tour/${d.id}/setlist`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));
  const openers = OPENERS.map((o) => ({
    url: `${SITE_URL}/openers/${o.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...shopCategories, ...products, ...looks, ...tour, ...setTimes, ...setlists, ...openers, ...songs, ...comps, ...news, ...guides];
}
