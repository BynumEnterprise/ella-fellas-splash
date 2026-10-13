import type { Metadata } from "next";

export const SITE_TITLE_SUFFIX = " | Ella Fellas";
export const MAX_TITLE_LENGTH = 60;

/**
 * Builds a page <title>. Appends " | Ella Fellas" only when the result stays
 * within 60 characters; longer titles drop the suffix so search results don't
 * truncate the meaningful part. Always returned as `absolute` so the root
 * layout template doesn't re-append the suffix.
 */
export function seoTitle(title: string): NonNullable<Metadata["title"]> {
  const clean = title.replace(/\s*\|\s*Ella Fellas\s*$/i, "").trim();
  const withSuffix = `${clean}${SITE_TITLE_SUFFIX}`;
  return { absolute: withSuffix.length > MAX_TITLE_LENGTH ? clean : withSuffix };
}
