import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Music, ArrowRight } from "lucide-react";
import { OPENERS, getOpener } from "@/lib/openers";
import { getAllTourDates } from "@/lib/data";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

export async function generateStaticParams() {
  return OPENERS.map((o) => ({ slug: o.slug }));
}

function showsFor(name: string) {
  const today = new Date().toISOString().slice(0, 10);
  return getAllTourDates()
    .filter((d) => d.date >= today && (d.openers ?? []).some((o) => o.toLowerCase() === name.toLowerCase()))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const o = getOpener(slug);
  if (!o) return {};
  const n = showsFor(o.name).length;
  const title = `${o.name}: Opening for Ella Langley in 2026 (${n} Show${n === 1 ? "" : "s"})`;
  const desc = `Who is ${o.name}? What they sound like, their songs, and every 2026 Ella Langley date they're opening.`;
  return {
    title: { absolute: `${title} | Ella Fellas` },
    description: desc,
    alternates: { canonical: `${SITE_URL}/openers/${o.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/openers/${o.slug}`,
      images: [`/api/og?title=${encodeURIComponent(o.name)}&kicker=${encodeURIComponent("Opening for Ella Langley 2026")}`],
    },
  };
}

export default async function OpenerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const o = getOpener(slug);
  if (!o) notFound();
  const shows = showsFor(o.name);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Openers", url: `${SITE_URL}/openers` },
          { name: o.name, url: `${SITE_URL}/openers/${o.slug}` },
        ]}
      />
      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/openers" className="hover:text-primary">&larr; All openers</Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">
          Opening for Ella Langley · 2026
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">
          {o.name.toUpperCase()}
        </h1>
        <p className="text-lg text-ink/80 mt-3 leading-relaxed">{o.who}</p>
      </header>

      {o.ellaConnection && (
        <div className="bg-primary/10 border border-primary/40 rounded-lg p-4 mb-6">
          <p className="text-xs uppercase tracking-wider text-clay font-medium mb-1">
            Why they&apos;re on this bill
          </p>
          <p className="text-ink/85 leading-relaxed">{o.ellaConnection}</p>
        </div>
      )}

      <div className="border border-ink/15 rounded-lg p-5 bg-paper mb-6">
        <h2 className="font-display text-xl text-denim tracking-wide mb-2">WORTH KNOWING</h2>
        <p className="text-ink/80 leading-relaxed">{o.signature}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="border border-ink/15 rounded-lg p-4 bg-paper">
          <p className="text-xs uppercase tracking-wider text-clay font-medium mb-2">
            <Music className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" /> Songs to know
          </p>
          <ul className="text-sm text-ink/80 space-y-1">
            {o.notableSongs.map((s) => (
              <li key={s}>&ldquo;{s}&rdquo;</li>
            ))}
          </ul>
        </div>
        <div className="border border-ink/15 rounded-lg p-4 bg-paper">
          <p className="text-xs uppercase tracking-wider text-clay font-medium mb-2">Latest release</p>
          <p className="text-sm text-ink/80">{o.latestRelease ?? "Not announced"}</p>
        </div>
      </div>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-3">
        {o.name.toUpperCase()} IS OPENING THESE {shows.length} SHOW{shows.length === 1 ? "" : "S"}
      </h2>
      {shows.length === 0 ? (
        <p className="text-ink/70 mb-6">No upcoming dates with Ella on the calendar right now.</p>
      ) : (
        <div className="space-y-2 mb-6">
          {shows.map((d) => (
            <Link
              key={d.id}
              href={`/tour/${d.id}/set-times`}
              className="flex items-baseline justify-between gap-3 border border-ink/15 rounded-lg p-3 bg-paper hover:border-primary transition-colors"
            >
              <div>
                <p className="font-display text-lg text-denim leading-tight">
                  {d.city}, {d.state}
                </p>
                <p className="text-xs text-ink/60">{d.venue}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-ink/70">
                  {new Date(`${d.date}T12:00:00Z`).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </p>
                <p className="text-xs text-primary inline-flex items-center gap-1">
                  Set times <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-xs text-ink/50 border-t border-ink/10 pt-4 mb-6">
        <p className="mb-1">
          Sources for the facts on this page — we don&apos;t publish anything we can&apos;t point at:
        </p>
        <ul className="space-y-0.5">
          {o.sources.map((s) => (
            <li key={s}>
              <a
                href={s}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary inline-flex items-center gap-1"
              >
                {new URL(s).hostname.replace(/^www\./, "")}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <AffiliateDisclosure />
    </article>
  );
}
