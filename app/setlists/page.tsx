import type { Metadata } from "next";
import Link from "next/link";
import { ListMusic, ArrowRight, Clock } from "lucide-react";
import { getAllTourDates } from "@/lib/data";
import { getSetlist, mostRecentSetlist } from "@/lib/setlists";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "Ella Langley Setlist 2026: Every Show, Song by Song";
const DESC =
  "Every Ella Langley setlist from the 2026 Dandelion Tour — the real songs, in order, posted within a couple of hours of each encore. Plus what she's been opening and closing with.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/setlists` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/setlists`,
    images: [`/api/og?title=${encodeURIComponent("Ella Langley Setlists")}&kicker=${encodeURIComponent("Every 2026 show, song by song")}`],
  },
};

function fmt(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function SetlistsHub() {
  const today = new Date().toISOString().slice(0, 10);
  const all = getAllTourDates();
  const recent = mostRecentSetlist(all);

  const past = all
    .filter((d) => d.date < today)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const upcoming = all
    .filter((d) => d.date >= today)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Setlists", url: `${SITE_URL}/setlists` }]} />
      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/" className="hover:text-primary">&larr; Home</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Setlists</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          ELLA LANGLEY SETLISTS, EVERY SHOW
        </h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          What did she play last night? What&apos;s she opening with, what&apos;s the encore? We post
          every 2026 Dandelion Tour setlist within a couple of hours of the encore &mdash; the real
          order, sourced from the actual night. We never guess one in advance.
        </p>
      </header>

      {recent && (
        <div className="bg-paper border-2 border-primary/40 rounded-lg p-5 mb-8">
          <p className="text-xs uppercase tracking-wider text-clay font-medium mb-1">Most recent</p>
          <h2 className="font-display text-2xl text-denim tracking-wide mb-1">
            <ListMusic className="w-5 h-5 inline mr-2 text-primary" aria-hidden="true" />
            {recent.show.city.toUpperCase()} &mdash; {fmt(recent.show.date)}
          </h2>
          <p className="text-xs text-ink/60 mb-3">{recent.show.venue}</p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
            {recent.entry.songs.map((song, i) => (
              <li key={`${song}-${i}`} className="flex gap-2 text-sm text-ink/85">
                <span className="text-ink/40 w-5 shrink-0 text-right">{i + 1}.</span>
                <span>{song}</span>
              </li>
            ))}
          </ol>
          <Link
            href={`/tour/${recent.show.id}/setlist`}
            className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1 mt-3"
          >
            Full {recent.show.city} setlist <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="font-display text-2xl text-denim tracking-wide mb-4">SHOWS SO FAR</h2>
          <div className="space-y-2 mb-8">
            {past.map((d) => {
              const has = Boolean(getSetlist(d.id));
              return (
                <Link
                  key={d.id}
                  href={`/tour/${d.id}/setlist`}
                  className="flex items-baseline justify-between gap-3 border border-ink/15 rounded-lg p-3 bg-paper hover:border-primary transition-colors"
                >
                  <div>
                    <p className="font-display text-lg text-denim leading-tight">
                      {d.city}, {d.state}
                    </p>
                    <p className="text-xs text-ink/60">{fmt(d.date)} &middot; {d.venue}</p>
                  </div>
                  <p className={`text-sm font-medium inline-flex items-center gap-1 ${has ? "text-primary" : "text-ink/45"}`}>
                    {has ? "View setlist" : "Confirming"} <ArrowRight className="w-3.5 h-3.5" />
                  </p>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">STILL TO COME</h2>
      <div className="space-y-2 mb-8">
        {upcoming.map((d) => (
          <Link
            key={d.id}
            href={`/tour/${d.id}/setlist`}
            className="flex items-baseline justify-between gap-3 border border-ink/15 rounded-lg p-3 bg-paper hover:border-primary transition-colors"
          >
            <div>
              <p className="font-display text-lg text-denim leading-tight">
                {d.city}, {d.state}
              </p>
              <p className="text-xs text-ink/60">{fmt(d.date)} &middot; {d.venue}</p>
            </div>
            <p className="text-sm text-ink/45 inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Setlist night-of
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-primary/10 border border-primary/40 rounded-lg p-5 mb-8">
        <p className="font-display text-xl text-denim tracking-wide mb-1">
          GET EACH SETLIST THE NIGHT IT HAPPENS
        </p>
        <p className="text-sm text-ink/75 mb-3">
          We email the setlist within a couple of hours of the encore. No spam, unsubscribe anytime.
        </p>
        <NewsletterSignup placement="setlists-hub" />
      </div>

      <p className="text-sm text-ink/70 mb-6">
        Heading to a show? Check the{" "}
        <Link href="/set-times" className="underline text-denim hover:text-primary">set times</Link>{" "}
        and{" "}
        <Link href="/openers" className="underline text-denim hover:text-primary">who&apos;s opening</Link>{" "}
        for your city first.
      </p>

      <AffiliateDisclosure />
    </article>
  );
}
