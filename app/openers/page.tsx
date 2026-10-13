import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OPENERS, openerByName } from "@/lib/openers";
import { getAllTourDates } from "@/lib/data";
import { ticketNetworkUrl } from "@/lib/affiliates";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { AffiliateLink } from "@/components/AffiliateLink";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";
import { formatDate } from "@/lib/utils";

// ISR: "next show" / "updated" copy is date-relative, so rebuild hourly between deploys.
export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

/** Upcoming shows that are still on, soonest first. Computed at build. */
function upcomingShows() {
  const today = new Date().toISOString().slice(0, 10);
  return getAllTourDates()
    .filter((d) => d.date >= today && !d.canceled)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

/** Distinct opener names across the given shows, in first-appearance order. */
function distinctOpeners(shows: ReturnType<typeof upcomingShows>): string[] {
  const seen: string[] = [];
  shows.forEach((d) => (d.openers ?? []).forEach((o) => { if (!seen.includes(o)) seen.push(o); }));
  return seen;
}

function md(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export async function generateMetadata(): Promise<Metadata> {
  const shows = upcomingShows();
  const next = shows.find((d) => (d.openers ?? []).length > 0);
  const names = distinctOpeners(shows);
  const TITLE = next
    ? `Who Is Opening for Ella Langley? ${next.openers.join(" & ")} (${next.city} ${md(next.date)})`
    : "Who Is Opening for Ella Langley? Openers by Show";
  const DESC = names.length
    ? `Who's opening for Ella Langley: ${names.join(", ")} on the remaining Dandelion Tour dates. The exact support acts for every upcoming show, in running order, with set times and tickets.`
    : "Who's opening for Ella Langley on each upcoming show, with set times and tickets.";
  return {
    title: { absolute: `${TITLE} | Ella Fellas` },
    description: DESC,
    alternates: { canonical: `${SITE_URL}/openers` },
    openGraph: {
      title: TITLE,
      description: DESC,
      url: `${SITE_URL}/openers`,
      images: [`/api/og?title=${encodeURIComponent("Who's Opening")}&kicker=${encodeURIComponent("Ella Langley, show by show")}`],
    },
  };
}

export default function OpenersHub() {
  const shows = upcomingShows();
  const names = distinctOpeners(shows);
  const withOpeners = shows.filter((d) => (d.openers ?? []).length > 0);

  const counts = new Map<string, number>();
  shows.forEach((d) => (d.openers ?? []).forEach((o) => counts.set(o, (counts.get(o) ?? 0) + 1)));

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Openers", url: `${SITE_URL}/openers` }]} />
      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/" className="hover:text-primary">&larr; Home</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Support acts</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          WHO&apos;S OPENING FOR ELLA LANGLEY?
        </h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          The openers on Ella Langley&apos;s 2026 Dandelion Tour change city to city — which is
          exactly why the ticket sites can&apos;t tell you who you&apos;re actually getting.
          Here&apos;s the real answer, per artist and per date.
        </p>
      </header>

      {/* Answer-first: who is opening, show by show, before anything else. */}
      <section className="bg-primary/10 border-2 border-primary/50 rounded-lg p-5 mb-8" aria-label="Openers by upcoming show">
        <p className="text-base text-ink/90 leading-relaxed">
          <strong>Short answer:</strong>{" "}
          {names.length > 0 ? (
            <>
              {names.join(" and ").replace(/ and (?=.* and )/g, ", ")} are opening for Ella Langley on her
              remaining dates. The support act changes by show, so check your date:
            </>
          ) : (
            <>no support acts are announced for her remaining dates yet.</>
          )}
        </p>
        {withOpeners.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm">
            {withOpeners.map((d) => (
              <li key={d.id} className="flex flex-wrap items-baseline gap-x-2">
                <Link href={`/tour/${d.id}/set-times`} className="font-semibold text-denim underline decoration-primary/50 underline-offset-2 hover:text-primary">
                  {formatDate(d.date, "short")} &middot; {d.city}, {d.state}
                </Link>
                <span className="text-ink/80">{d.openers.join(", then ")}, then Ella</span>
              </li>
            ))}
          </ul>
        )}
        {shows.some((d) => d.tourType === "festival") && (
          <p className="text-xs text-ink/60 mt-3">
            Festival dates ({shows.filter((d) => d.tourType === "festival").map((d) => `${d.city} ${md(d.date)}`).join(", ")}) have a full festival lineup rather than a dedicated opener.
          </p>
        )}
      </section>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">THE ARTISTS</h2>
      <div className="grid md:grid-cols-2 gap-3 mb-8">
        {OPENERS.map((o) => (
          <Link
            key={o.slug}
            href={`/openers/${o.slug}`}
            className="border border-ink/15 rounded-lg p-4 bg-paper hover:border-primary transition-colors"
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display text-xl text-denim">{o.name}</p>
              <p className="text-xs text-clay uppercase tracking-wider">
                {counts.get(o.name) ?? 0} show{(counts.get(o.name) ?? 0) === 1 ? "" : "s"}
              </p>
            </div>
            <p className="text-sm text-ink/70 mt-1 leading-relaxed line-clamp-3">{o.who}</p>
            <p className="text-sm text-primary font-medium mt-2 inline-flex items-center gap-1">
              Read more <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">WHO&apos;S OPENING FOR ELLA LANGLEY IN EACH CITY?</h2>
      <div className="space-y-2 mb-8">
        {shows.map((d) => (
          <div key={d.id} className="border border-ink/15 rounded-lg p-3 bg-paper">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div>
                <p className="font-display text-lg text-denim leading-tight">
                  {d.city}, {d.state}
                </p>
                <p className="text-xs text-ink/60">
                  {new Date(`${d.date}T12:00:00Z`).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}{" "}
                  &middot; {d.venue}
                </p>
              </div>
              <div className="text-right">
              <p className="text-sm text-ink/80">
                {(d.openers ?? []).length === 0
                  ? "Support TBA"
                  : (d.openers ?? []).map((name, i) => {
                      const p = openerByName(name);
                      return (
                        <span key={name}>
                          {i > 0 && <span className="text-ink/40"> · </span>}
                          {p ? (
                            <Link href={`/openers/${p.slug}`} className="underline decoration-primary/40 underline-offset-4 hover:text-primary">
                              {name}
                            </Link>
                          ) : (
                            name
                          )}
                        </span>
                      );
                    })}
              </p>
              <AffiliateLink
                href={ticketNetworkUrl(d.id)}
                source="openers-row-tickets"
                ariaLabel={`Tickets for Ella Langley in ${d.city}`}
                className="text-xs text-primary font-medium hover:underline"
              >
                {d.soldOut ? "Resale tickets" : "Tickets"} &rarr;
              </AffiliateLink>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AffiliateDisclosure />
    </article>
  );
}
