import type { Metadata } from "next";
import Link from "next/link";
import { getAllTourDates } from "@/lib/data";
import { PlanBuilder } from "@/components/PlanBuilder";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "Plan My Ella Langley Night: Set Times, Packing & Trip Planner";
const DESC =
  "Pick your Ella Langley show and get a personalized game plan — when to leave, what the gate will let you carry, when she's actually on, and where to stay.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/plan-my-night` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${SITE_URL}/plan-my-night`,
    images: [`/api/og?title=${encodeURIComponent("Plan My Night")}&kicker=${encodeURIComponent("Your Ella Langley show, hour by hour")}`],
  },
};

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const sp = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const shows = getAllTourDates()
    .filter((d) => d.date >= today)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Plan My Night", url: `${SITE_URL}/plan-my-night` }]} />

      <nav className="text-xs text-ink/60 mb-4">
        <Link href="/" className="hover:text-primary">
          &larr; Home
        </Link>
      </nav>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Trip planner</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">Plan my night</h1>
        <p className="text-lg text-ink/80 italic mt-3">
          Answer three things and we&apos;ll build your show night around them — leave time, gate rules,
          what to pack, when she&apos;s on, and where to crash.
        </p>
      </header>

      <div className="bg-paper border-2 border-primary/40 rounded-lg p-5 mb-8">
        <PlanBuilder shows={shows} initialShowId={sp?.show} />
      </div>

      <section className="mb-8">
        <h2 className="font-display text-2xl text-denim tracking-wide mb-2">HOW THIS WORKS</h2>
        <p className="text-sm text-ink/75 leading-relaxed">
          Everything here is built from the same show data we publish on the{" "}
          <Link href="/tour" className="underline text-denim hover:text-primary">
            tour pages
          </Link>{" "}
          — venue, capacity, doors and listed start. We compute your leave-time from that, and we work out
          the gate rules from venue size (40,000+ seats means an NFL-style clear-bag policy).
        </p>
        <p className="text-sm text-ink/75 leading-relaxed mt-2">
          What we <em>don&apos;t</em> do is guess. If a venue hasn&apos;t posted its set times, this planner
          says so instead of inventing a number — same rule the rest of the site follows. Read the{" "}
          <Link href="/about" className="underline text-denim hover:text-primary">
            editorial policy
          </Link>
          .
        </p>
      </section>

      <AffiliateDisclosure />
    </div>
  );
}
