'use client';

interface TocItem {
  text: string;
  id: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length < 3) return null;

  return (
    <nav
      aria-label="In this guide"
      className="my-8 rounded-lg border border-denim/20 bg-paper px-5 py-4"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-clay">
        In this guide
      </p>
      <ol className="space-y-1.5 list-none m-0 p-0">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-denim hover:text-clay underline underline-offset-2 decoration-denim/30 hover:decoration-clay/60 transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Parse raw markdown body for ## headings and return TocItems.
 * Slugifies the same way github-slugger / rehype-slug does:
 *   - lowercase
 *   - strip characters that are not alphanumeric, spaces, or hyphens
 *   - replace spaces with hyphens
 *   - collapse consecutive hyphens
 *   - trim leading/trailing hyphens
 */
export function extractTocItems(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (!match) continue;
    // Strip any inline markdown (bold, italic, code, links)
    const raw = match[1]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links -> text
      .replace(/`([^`]+)`/g, '$1')             // code
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
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
