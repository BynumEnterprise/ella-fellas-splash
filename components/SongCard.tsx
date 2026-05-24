import Link from "next/link";
import type { Song } from "@/lib/types";

export function SongCard({ s }: { s: Song }) {
  return (
    <Link
      href={`/songs/${s.slug}`}
      className="block bg-paper border border-ink/10 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all"
    >
      <p className="text-xs uppercase tracking-wider text-ink/60">
        {s.album}{s.feat ? ` · feat. ${s.feat}` : ""}
      </p>
      <h3 className="text-xl font-display mt-1 text-denim lowercase">{s.title}</h3>
      <p className="text-sm text-ink/70 mt-2 line-clamp-2">{s.tldr}</p>
      <p className="mt-3 text-sm font-medium text-primary">Read the breakdown &rarr;</p>
    </Link>
  );
}
