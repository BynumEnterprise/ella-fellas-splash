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
