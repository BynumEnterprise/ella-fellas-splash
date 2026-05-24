import type { Metadata } from "next";
import { getAllSongs } from "@/lib/data";
import { SongCard } from "@/components/SongCard";

export const metadata: Metadata = {
  title: "Ella Langley Songs",
  description:
    "Every Ella Langley song — Hungover (2024) and Dandelion (2026). Breakdowns, chart performance, and live debut info.",
};

export default function SongsIndexPage() {
  const songs = getAllSongs();
  const hungover = songs.filter((s) => s.albumSlug === "hungover");
  const dandelion = songs.filter((s) => s.albumSlug === "dandelion");

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-denim">ELLA LANGLEY SONGS</h1>
        <p className="text-ink/80 mt-3">
          Every released track, ranked by record, with breakdowns and chart context.
        </p>
      </header>

      {dandelion.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-denim mb-4">DANDELION (2026)</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {dandelion.map((s) => <SongCard key={s.slug} s={s} />)}
          </div>
        </section>
      )}

      {hungover.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl text-denim mb-4">HUNGOVER (2024)</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {hungover.map((s) => <SongCard key={s.slug} s={s} />)}
          </div>
        </section>
      )}
    </article>
  );
}
