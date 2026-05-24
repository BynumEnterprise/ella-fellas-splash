import Link from "next/link";
import type { Comparison } from "@/lib/types";

export function ComparisonCard({ c }: { c: Comparison }) {
  return (
    <Link
      href={`/vs/${c.slug}`}
      className="block bg-paper border border-ink/10 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all"
    >
      <p className="text-xs uppercase tracking-wider text-clay font-medium">{c.category}</p>
      <h3 className="text-lg font-display mt-1 text-denim">Ella Langley vs {c.compareTo}</h3>
      <p className="text-sm text-ink/70 mt-2 line-clamp-2">{c.verdict}</p>
      <p className="mt-3 text-sm font-medium text-primary">Read the comparison &rarr;</p>
    </Link>
  );
}
