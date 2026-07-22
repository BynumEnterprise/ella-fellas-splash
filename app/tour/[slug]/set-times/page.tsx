import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, DoorOpen, Music, AlertTriangle, ArrowRight } from "lucide-react";
import { getAllTourDates, getTourDate } from "@/lib/data";
import { buildSetTimes } from "@/lib/set-times";
import { openerByName } from "@/lib/openers";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { AffiliateLink } from "@/components/AffiliateLink";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { MerchCTA } from "@/components/MerchCTA";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

export async function generateStaticParams() {
  const today = new Date().toISOString().slice(0, 10);
  return getAllTourDates()
    .filter((d) => d.date >= today)
    .map((d) => ({ slug: d.id }));
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getTourDate(slug);
  if (!d) return {};
  const st = buildSetTimes(d);
  const title = `Ella Langley ${d.city} Set Times: What Time Does She Go On? (${fmt(d.date).replace(/^\w+, /, "")})`;
  const desc = st.doors
    ? st.timesConfirmed
      ? `Set times for Ella Langley at ${d.venue}, ${d.city} — doors ${st.doors}${st.listedStart ? `, listed start ${st.listedStart}` : ""}, full running order, and when she's actually on. Updated as the venue confirms.`
      : `Set times and running order for Ella Langley at ${d.venue}, ${d.city}. ${d.venue} hasn't confirmed this date's times yet — we show the typical times for this tour and update the moment they're posted.`
    : `Set times and running order for Ella Langley at ${d.venue}, ${d.city}. We post the real times as the venue confirms them — we never invent one.`;
  return {
    title: { absolute: `${title} | Ella Fellas` },
    description: desc.slice(0, 300),
    alternates: { canonical: `${SITE_URL}/tour/${d.id}/set-times` },
    openGraph: {
      title,
      description: desc.slice(0, 300),
      url: `${SITE_URL}/tour/${d.id}/set-times`,
      images: [
        `/api/og?title=${encodeURIComponent(`${d.city} Set Times`)}&kicker=${encodeURIComponent(
          `Ella Langley · ${d.venue}`,
        )}`,
      ],
    },
  };
}

export default async function SetTimesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getTourDate(slug);
  if (!d) notFound();
  const st = buildSetTimes(d);
  const where = `${d.city}, ${d.state}`;

  const faq = [
    {
      q: `What time does Ella Langley go on stage in ${d.city}?`,
      a: st.ellaHeadlines
        ? `Ella headlines this show, so she's on last${
            d.openers?.length ? ` — after ${d.openers.join(" and ")}` : ""
          }. ${d.venue} has not published her exact stage time${
            st.listedStart
              ? st.timesConfirmed
                ? `; the listed start time for the night is ${st.listedStart}`
                : `; ${st.listedStart} is the typical start time on this tour, but ${d.venue} hasn't confirmed this date`
              : ""
          }. Venues almost never post the headliner's stage time in advance, and we don't invent one — we update this page the moment it's confirmed.`
        : `Ella is direct support on this date, which means she plays right before ${
            d.headliner ?? "the headliner"
          }. ${
            st.listedStart
              ? st.timesConfirmed
                ? `The listed start time is ${st.listedStart}. `
                : `The typical start time on this tour is ${st.listedStart}, though this date isn't confirmed yet. `
              : ""
          }Be inside by the listed start — support sets are the easiest thing to miss.`,
    },
    {
      q: `What time do doors open at ${d.venue}?`,
      a: st.doors
        ? st.timesConfirmed
          ? `Doors open at ${st.doors} for this show.`
          : `${d.venue} hasn't published a door time for this date yet. Doors are usually ${st.doors} on this tour, so plan around that and check your ticket — we update this page as soon as the venue confirms.`
        : `${d.venue} hasn't published a door time for this date yet. This page updates when it does.`,
    },
    {
      q: `Who is opening for Ella Langley in ${d.city}?`,
      a: d.openers?.length
        ? `${d.openers.join(" and ")}${
            d.openers.length > 1 ? ` — in that order, with ${d.openers[d.openers.length - 1]} directly before Ella` : ""
          }.`
        : `No support acts have been announced for this date yet.`,
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Tour", url: `${SITE_URL}/tour` },
          { name: `${d.city} ${d.date}`, url: `${SITE_URL}/tour/${d.id}` },
          { name: "Set Times", url: `${SITE_URL}/tour/${d.id}/set-times` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href={`/tour/${d.id}`} className="hover:text-primary">
          &larr; {d.city} show page
        </Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Set times</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          WHAT TIME DOES ELLA GO ON IN {d.city.toUpperCase()}?
        </h1>
        <p className="text-ink/80 mt-3">
          {fmt(d.date)} &middot; {d.venue}, {where}
        </p>
      </header>

      {/* The answer, up top, because that's why they're here. */}
      <div className="bg-paper border-2 border-primary/40 rounded-lg p-5 mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-3">
            <DoorOpen className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-wider text-clay font-medium">
                Doors{st.doors && !st.timesConfirmed ? " (typical)" : ""}
              </p>
              <p className="font-display text-2xl text-denim">
                {st.doors ? `${st.timesConfirmed ? "" : "~"}${st.doors}` : "Not posted yet"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-wider text-clay font-medium">
                {st.listedStart && !st.timesConfirmed ? "Typical start" : "Listed start"}
              </p>
              <p className="font-display text-2xl text-denim">
                {st.listedStart ? `${st.timesConfirmed ? "" : "~"}${st.listedStart}` : "Not posted yet"}
              </p>
            </div>
          </div>
        </div>
        <p className="text-sm text-ink/80 leading-relaxed">{st.summary}</p>
      </div>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-3">RUNNING ORDER</h2>
      {st.slots.length === 0 ? (
        <p className="text-ink/70 mb-6">
          No running order has been announced for this date yet. We&apos;ll post it here as soon as
          the venue does.
        </p>
      ) : (
        <ol className="space-y-3 mb-6">
          {st.slots.map((s, i) => {
            const profile = openerByName(s.name);
            return (
              <li key={`${s.name}-${i}`} className="border border-ink/15 rounded-lg p-4 bg-paper">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <p className="font-display text-xl text-denim">
                    {profile ? (
                      <Link href={`/openers/${profile.slug}`} className="hover:text-primary underline decoration-primary/40 underline-offset-4">
                        {s.name}
                      </Link>
                    ) : (
                      s.name
                    )}
                    {s.role === "headliner" && (
                      <span className="ml-2 text-xs uppercase tracking-wider text-clay">Headliner</span>
                    )}
                    {s.role === "direct-support" && (
                      <span className="ml-2 text-xs uppercase tracking-wider text-clay">Direct support</span>
                    )}
                  </p>
                  <p className={`font-display text-lg ${s.timeConfirmed ? "text-primary" : "text-ink/40"}`}>
                    {s.timeConfirmed ? s.time : "Time not posted"}
                  </p>
                </div>
                <p className="text-sm text-ink/70 mt-1 leading-relaxed">{s.note}</p>
              </li>
            );
          })}
        </ol>
      )}

      <div className="flex items-start gap-2 text-sm text-ink/75 bg-ink/5 border border-ink/15 rounded-md p-4 mb-8">
        <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong>Why we don&apos;t print an exact stage time:</strong> venues and tours don&apos;t
          publish per-artist stage times in advance — they get set the day of the show and change
          with weather, curfews and production. Every site that gives you a confident minute is
          guessing. We publish doors and the listed start because those are real, and we update this
          page when the running order is actually confirmed. If you want the number the moment it
          exists, get on the list below.
        </p>
      </div>

      <div className="bg-primary/10 border border-primary/40 rounded-lg p-5 mb-8">
        <p className="font-display text-xl text-denim tracking-wide mb-1">
          SET TIMES FOR {d.city.toUpperCase()}, THE MOMENT THEY&apos;RE POSTED
        </p>
        <p className="text-sm text-ink/75 mb-3">
          We watch this show and email you when the running order is confirmed. No spam, unsubscribe
          anytime.
        </p>
        <NewsletterSignup placement="set-times" />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {!d.soldOut || d.ticketPriceRange ? (
          <AffiliateLink
            href={ticketNetworkUrl(d.id)}
            source="set-times-tickets"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md hover:bg-primary/90"
          >
            <span aria-hidden="true">🎟</span> {d.soldOut ? "FIND RESALE TICKETS" : "GET TICKETS"}
          </AffiliateLink>
        ) : null}
        <Link
          href={`/tour/${d.id}`}
          className="inline-flex items-center gap-2 px-5 py-3 border-2 border-denim/30 text-denim font-display text-lg tracking-wide rounded-md hover:border-primary hover:text-primary"
        >
          FULL SHOW GUIDE <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={`/plan-my-night?show=${d.id}`}
          className="inline-flex items-center gap-2 px-5 py-3 border-2 border-denim/30 text-denim font-display text-lg tracking-wide rounded-md hover:border-primary hover:text-primary"
        >
          <Music className="w-4 h-4" /> PLAN MY NIGHT
        </Link>
      </div>

      <MerchCTA source="set_times_merch" className="mb-8" />

      <h2 className="font-display text-2xl text-denim tracking-wide mb-3">COMMON QUESTIONS</h2>
      <div className="space-y-4 mb-8">
        {faq.map((f) => (
          <div key={f.q}>
            <h3 className="font-display text-lg text-denim">{f.q}</h3>
            <p className="text-sm text-ink/75 leading-relaxed mt-1">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-ink/70 mb-6">
        Looking for another city? See{" "}
        <Link href="/set-times" className="underline text-denim hover:text-primary">
          set times for every 2026 Ella Langley show
        </Link>
        .
      </p>

      <AffiliateDisclosure />
    </article>
  );
}
