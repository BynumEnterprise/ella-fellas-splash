import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Props {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
}

export function NewsCard({ slug, title, excerpt, publishedAt, category }: Props) {
  return (
    <Link
      href={`/news/${slug}`}
      className="block bg-paper border border-ink/10 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-clay font-medium">
        <span className="bg-paper border border-denim/30 text-denim px-2 py-0.5 rounded-full">
          {category}
        </span>
        <span className="text-ink/60">{formatDate(publishedAt)}</span>
      </div>
      <h3 className="text-lg font-display mt-2 text-denim leading-tight">{title}</h3>
      <p className="text-sm text-ink/80 mt-2 line-clamp-3">{excerpt}</p>
      <p className="mt-3 text-sm font-medium text-primary">Read &rarr;</p>
    </Link>
  );
}
