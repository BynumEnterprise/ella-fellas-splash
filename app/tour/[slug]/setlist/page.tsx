import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListMusic, ExternalLink, Clock } from "lucide-react";
import { getAllTourDates, getTourDate } from "@/lib/data";
import { getSetlist, mostRecentSetlist } from "@/lib/setlists";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

export async function generateStaticParams() {
  return getAllTourDates().map((d) => ({ slug: d.id }));
}

function fmt(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getTourDate(slug);
  if (!d) return {};
  const has = Boolean(getSetlist(d.id));
  const dateShort = fmt(d.date).replace(/^\w+, /, "");
  const title = `Ella Langley Setlist: ${d.city} ${dateShort} (${d.venue})`;
  const desc = has
    ? `The full setlist Ella Langley played at ${d.venue} in ${d.city} on ${dateShort} — every song, in order.`
    : `The setlist from Ella Langley's ${d.city} show at ${d.venue} — posted within a couple of hours of the encore. Plus what she's been playing on the Dandelion Tour so far.`;
  return {
    title: { absolute: `${title} | Ella Fellas` },
    description: desc,
    alternates: { canonical: `${SITE_URL}/tour/${d.id}/setlist` },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/tour/${d.id}/setlist`,
      images: [`/api/og?title=${encodeURIComponent(`${d.city} Setlist`)}&kicker=${encodeURIComponent(`Ella Langley · ${dateShort}`)}`],
    },
  };
}

export default async function SetlistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getTourDate(slug);
  if (!d) notFound();

  const entry = getSetlist(d.id);
  const all = getAllTourDates();
  const recent = mostRecentSetlist(all);
  const today = new Date().toISOString().slice(0, 10);
  const isPast = d.date < today;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Tour", url: `${SITE_URL}/tour` },
          { name: `${d.city} ${d.date}`, url: `${SITE_URL}/tour/${d.id}` },
          { name: "Setlist", url: `${SITE_URL}/tour/${d.id}/setlist` },
        ]}
      />
      <nav className="text-xs text-ink/60 mb-4">
        <Link href={`/tour/${d.id}`} className="hover:text-primary">&larr; {d.city} show page</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Setlist</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          ELLA LANGLEY SETLIST &mdash; {d.city.toUpperCase()}
        </h1>
        <p className="text-ink/80 mt-3">
          {fmt(d.date)} &middot; {d.venue}, {d.city}, {d.state}
        </p>
      </header>

      {entry ? (
        <div className="bg-paper border-2 border-primary/40 rounded-lg p-5 mb-6">
          <h2 className="font-display text-2xl text-denim tracking-wide mb-3">
            <ListMusic className="w-5 h-5 inline mr-2 text-primary" aria-hidden="true" />
            WHAT SHE PLAYED
          </h2>
          <ol className="space-y-1.5">
            {entry.songs.map((song, i) => (
              <li key={`${song}-${i}`} className="flex gap-3 text-ink/85">
                <span className="text-ink/40 text-sm w-5 shrink-0 text-right">{i + 1}.</span>
                <span>{song}</span>
              </li>
            ))}
          </ol>
          {entry.encore && entry.encore.length > 0 && (
            <>
              <p className="text-xs uppercase tracking-wider text-clay font-medium mt-4 mb-1">Encore</p>
              <ol className="space-y-1.5">
                {entry.encore.map((song, i) => (
                  <li key={`enc-${song}-${i}`} className="flex gap-3 text-ink/85">
                    <span className="text-ink/40 text-sm w-5 shrink-0 text-right">{i + 1}.</span>
                    <span>{song}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
          {entry.notes && <p className="text-sm text-ink/75 mt-4 leading-relaxed">{entry.notes}</p>}
          <p className="text-xs text-ink/50 mt-4">
            Source: {entry.source} &middot; recorded {entry.recordedAt}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-paper border-2 border-primary/40 rounded-lg p-5 mb-6">
            <h2 className="font-display text-xl text-denim tracking-wide mb-2">
              <Clock className="w-4 h-4 inline mr-2 text-primary" aria-hidden="true" />
              {isPast ? "WE'RE STILL CONFIRMING THIS ONE" : "NOT PLAYED YET"}
            </h2>
            <p className="text-sm text-ink/80 leading-relaxed">
              {isPast
                ? `This show has happened, but we don't have a confirmed setlist for it yet. We publish a setlist only when we can source it from the actual night — we don't reconstruct one from other shows and call it fact.`
                : `This show is on ${fmt(d.date)}. The setlist goes up here within a couple of hours of the encore — we're not going to guess it in advance, because a predicted setlist isn't a setlist.`}
            </p>
          </div>

          {recent && (
            <div className="border border-ink/15 rounded-lg p-5 bg-paper mb-6">
              <p className="text-xs uppercase tracking-wider text-clay font-medium mb-1">
                What she&apos;s actually been playing
              </p>
              <h2 className="font-display text-xl text-denim tracking-wide mb-1">
                MOST RECENT SETLIST &mdash; {recent.show.city.toUpperCase()}
              </h2>
              <p className="text-xs text-ink/60 mb-3">
                {fmt(recent.show.date)} &middot; {recent.show.venue}
              </p>
              <ol className="space-y-1.5">
                {recent.entry.songs.map((song, i) => (
                  <li key={`${song}-${i}`} className="flex gap-3 text-ink/85">
                    <span className="text-ink/40 text-sm w-5 shrink-0 text-right">{i + 1}.</span>
                    <span>{song}</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-ink/50 mt-3">
                Source: {recent.entry.source}. Setlists shift night to night — treat this as a strong
                hint, not a promise.
              </p>
              <Link
                href={`/tour/${recent.show.id}/setlist`}
                className="text-sm text-primary font-medium hover:underline inline-block mt-2"
              >
                See that show in full &rarr;
              </Link>
            </div>
          )}
        </>
      )}

      <div className="bg-primary/10 border border-primary/40 rounded-lg p-5 mb-8">
        <p className="font-display text-xl text-denim tracking-wide mb-1">
          GET THE {d.city.toUpperCase()} SETLIST THE NIGHT IT HAPPENS
        </p>
        <p className="text-sm text-ink/75 mb-3">
          We post it within a couple of hours of the encore and email it straight out. No spam,
          unsubscribe anytime.
        </p>
        <NewsletterSignup placement="setlist" />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href={`/tour/${d.id}/set-times`}
          className="inline-flex items-center gap-2 px-5 py-3 border-2 border-denim/30 text-denim font-display text-lg tracking-wide rounded-md hover:border-primary hover:text-primary"
        >
          SET TIMES FOR THIS SHOW
        </Link>
        <Link
          href="/songs"
          className="inline-flex items-center gap-2 px-5 py-3 border-2 border-denim/30 text-denim font-display text-lg tracking-wide rounded-md hover:border-primary hover:text-primary"
        >
          SONG MEANINGS <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <AffiliateDisclosure />
    </article>
  );
}
