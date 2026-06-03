/**
 * Parse raw markdown for H2 headings and return ToC items.
 * Slugification matches rehype-slug / github-slugger:
 *   lowercase, strip non-alphanumeric/space/hyphen, spaces -> hyphens,
 *   collapse hyphens, trim edges.
 */
export interface TocItem {
  text: string;
  id: string;
}

export function extractTocItems(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (!match) continue;
    const raw = match[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
      .trim();
    const id = raw
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (id) items.push({ text: raw, id });
  }
  return items;
}
