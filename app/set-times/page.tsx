import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { getAllTourDates } from "@/lib/data";
import { buildSetTimes } from "@/lib/set-times";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "Ella Langley Set Times 2026: What Time Does She Go On, By City";
const DESC =
  "Doors, listed start and full running order for every 2026 Ella Langley show — city by city. We publish the real times and never invent a stage time.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/set-times` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/set-times`,
    images: [`/api/og?title=${encodeURIComponent("Set Times by City")}&kicker=${encodeURIComponent("Every 2026 Ella Langley show")}`],
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

export default function SetTimesHub() {
  const today = new Date().toISOString().slice(0, 10);
  const shows = getAllTourDates()
    .filter((d) => d.date >= today)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Set Times", url: `${SITE_URL}/set-times` }]} />
      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/" className="hover:text-primary">&larr; Home</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Set times</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          ELLA LANGLEY SET TIMES, BY CITY
        </h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          What time do doors open, who plays first, and when is Ella actually on? Here&apos;s every
          2026 date with the times the venue has confirmed — and an honest note where they
          haven&apos;t.
        </p>
      </header>

      <div className="bg-paper border-2 border-primary/40 rounded-lg p-5 mb-8">
        <h2 className="font-display text-xl text-denim tracking-wide mb-2">HOW THIS WORKS</h2>
        <p className="text-sm text-ink/80 leading-relaxed">
          Doors and listed start times come straight from the venue and ticket listings — those are
          real, and they&apos;re what you actually need to plan around. Per-artist stage times are a
          different thing: tours set them the day of the show, and they move with weather, curfews
          and production. Nobody publishes them in advance, so any site handing you a confident
          &ldquo;she&apos;s on at 9:15&rdquo; three weeks out is making it up. We don&apos;t. We
          publish what&apos;s confirmed, say plainly when something isn&apos;t, and update the
          moment it is.
        </p>
      </div>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">
        EVERY 2026 SHOW ({shows.length})
      </h2>
      <div className="space-y-2 mb-8">
        {shows.map((d) => {
          const st = buildSetTimes(d);
          return (
            <Link
              key={d.id}
              href={`/tour/${d.id}/set-times`}
              className="block border border-ink/15 rounded-lg p-4 bg-paper hover:border-primary transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-wider text-clay">{fmt(d.date)}</p>
                  <p className="font-display text-xl text-denim leading-tight mt-0.5">
                    {d.city}, {d.state}
                  </p>
                  <p className="text-sm text-ink/70">{d.venue}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink/70">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-primary" aria-hidden="true" />
                    Doors {st.doors ? `${st.timesConfirmed ? "" : "~"}${st.doors}` : "TBA"}
                    {st.listedStart
                      ? ` · Start ${st.timesConfirmed ? "" : "~"}${st.listedStart}`
                      : ""}
                    {st.doors && !st.timesConfirmed ? (
                      <span className="block text-[11px] text-ink/45 mt-0.5">
                        typical — not yet confirmed
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-ink/50 mt-0.5">
                    {d.openers?.length ? d.openers.join(" · ") : "Support TBA"}
                  </p>
                  <p className="text-sm text-primary font-medium mt-1 inline-flex items-center gap-1">
                    Set times <ArrowRight className="w-3.5 h-3.5" />
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-primary/10 border border-primary/40 rounded-lg p-5 mb-8">
        <p className="font-display text-xl text-denim tracking-wide mb-1">
          GET SET TIMES THE MOMENT THEY&apos;RE POSTED
        </p>
        <p className="text-sm text-ink/75 mb-3">
          Pick your show and we&apos;ll email you the running order as soon as it&apos;s confirmed.
        </p>
        <NewsletterSignup placement="set-times-hub" />
      </div>

      <AffiliateDisclosure />
    </article>
  );
}
