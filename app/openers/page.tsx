import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OPENERS, openerByName } from "@/lib/openers";
import { getAllTourDates } from "@/lib/data";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "Who Is Opening for Ella Langley in 2026? Every City's Support Act";
const DESC =
  "The openers on Ella Langley's 2026 Dandelion Tour rotate by city — Gabriella Rose, Kameron Marlowe, ERNEST, Kaitlin Butts and more. Here's who plays where.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/openers` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/openers`,
    images: [`/api/og?title=${encodeURIComponent("Who's Opening")}&kicker=${encodeURIComponent("Ella Langley 2026, by city")}`],
  },
};

export default function OpenersHub() {
  const today = new Date().toISOString().slice(0, 10);
  const shows = getAllTourDates()
    .filter((d) => d.date >= today)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

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
          WHO&apos;S OPENING FOR ELLA?
        </h1>
        <p className="text-lg text-ink/80 mt-3 max-w-2xl leading-relaxed">
          The support acts on the Dandelion Tour change city to city — which is exactly why the
          ticket sites can&apos;t tell you who you&apos;re actually getting. Here&apos;s the real
          answer, per artist and per date.
        </p>
      </header>

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

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">WHO PLAYS YOUR CITY</h2>
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
            </div>
          </div>
        ))}
      </div>

      <AffiliateDisclosure />
    </article>
  );
}
