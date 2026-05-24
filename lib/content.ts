import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ArticleFrontmatter } from "@/lib/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ContentItem {
  slug: string;
  frontmatter: ArticleFrontmatter;
  body: string;
}

function readDirectory(subdir: string): ContentItem[] {
  const dir = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const parsed = matter(raw);
    const slug = file.replace(/\.md$/, "");
    return {
      slug,
      frontmatter: { ...(parsed.data as ArticleFrontmatter), slug },
      body: parsed.content,
    };
  });
}

export function getAllNews(): ContentItem[] {
  return readDirectory("news").sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt)
  );
}

export function getNewsBySlug(slug: string): ContentItem | undefined {
  return getAllNews().find((n) => n.slug === slug);
}

export function getAllGuideContent(): ContentItem[] {
  return readDirectory("guides").sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt)
  );
}

export function getGuideBySlug(slug: string): ContentItem | undefined {
  return getAllGuideContent().find((g) => g.slug === slug);
}
