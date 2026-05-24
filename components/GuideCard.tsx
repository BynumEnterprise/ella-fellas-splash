import Link from "next/link";

interface Props {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
}

export function GuideCard({ slug, title, excerpt, category }: Props) {
  return (
    <Link
      href={`/guides/${slug}`}
      className="block bg-paper border border-ink/10 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all"
    >
      {category && (
        <p className="text-xs uppercase tracking-wider text-clay font-medium">{category}</p>
      )}
      <h3 className="text-lg font-display mt-1 text-denim leading-tight">{title}</h3>
      {excerpt && <p className="text-sm text-ink/80 mt-2 line-clamp-3">{excerpt}</p>}
      <p className="mt-3 text-sm font-medium text-primary">Read the guide &rarr;</p>
    </Link>
  );
}
