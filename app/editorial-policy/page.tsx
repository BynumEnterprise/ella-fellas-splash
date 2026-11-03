import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy & Corrections",
  description:
    "How Ella Fellas produces its Ella Langley news, setlists, set times, and guides: AI-assisted drafting, verification against cited sources, what we never publish, and how to request a correction.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl text-denim mb-6">Editorial Policy &amp; Corrections</h1>
      <p className="text-sm text-ink/60">Last updated: November 2, 2026</p>

      <p>
        Ella Fellas is a small, independent fan site. This page explains, plainly, how the words on
        it get made, what standards they are held to, and what to do if we get something wrong.
      </p>

      <h2>How our content is produced</h2>
      <p>
        We use AI tools to help research, draft, and update most of what we publish &mdash; daily
        news round-ups, setlist and set-time pages, show previews and recaps, song pages, and
        concert guides. Those tools work from a fixed set of sources we point them at, and every
        piece is checked against the sources it cites before it goes live. A person is
        responsible for what is published and for fixing it when it is wrong.
      </p>
      <p>We think you should know that, so you can weigh what you read here accordingly.</p>

      <h2>Where our facts come from</h2>
      <ul>
        <li>
          <strong>Setlists</strong> come from setlist.fm and from press coverage of the show. We do
          not reconstruct a setlist from memory or guess at songs. Song titles are checked against
          the artist&apos;s released catalog.
        </li>
        <li>
          <strong>Set times, doors, and lineups</strong> come from the venue, the promoter, the
          artist&apos;s official channels, or a named publication. When a running order has not been
          published, the page says so instead of estimating it.
        </li>
        <li>
          <strong>Tour dates and ticket availability</strong> come from the artist&apos;s official
          tour listing and the venues. Prices shown are indicative and change constantly; the
          ticket seller&apos;s page is the source of truth.
        </li>
        <li>
          <strong>News</strong> (chart positions, awards, releases, quotes) is sourced from named
          outlets and official announcements, and each article links to where the information came
          from so you can read the original.
        </li>
        <li>
          <strong>Guides</strong> (what to wear, what to bring, where to sit) draw on venue
          policies, published fan reports, and our own research. Venue bag and camera rules are
          always linked to the venue&apos;s own page because they change.
        </li>
      </ul>

      <h2>What we never publish</h2>
      <ul>
        <li>Invented quotes, insider sources we do not have, or rumors presented as fact.</li>
        <li>A setlist or set time we cannot source.</li>
        <li>Speculation about the artist&apos;s personal life beyond what she has said publicly.</li>
        <li>Press, wire, or agency photos, or social media screenshots, without permission. See our <a href="/disclaimer">photo and media policy</a>.</li>
      </ul>

      <h2>Dates and updates</h2>
      <p>
        Articles and guides show a published date and, when changed, a last-updated date. Tour and
        show pages are refreshed as venues confirm details, and canceled or postponed shows are
        marked as such rather than quietly removed.
      </p>

      <h2>Affiliate links and independence</h2>
      <p>
        We earn commissions from some links (tickets, travel, gear) and we sell our own merch. That
        income never decides what we cover or what we recommend; pages with affiliate links carry a
        disclosure, and our <a href="/disclaimer">affiliate disclosure</a> lists every partner.
        Nobody pays us to write about them, and we do not run sponsored content without labeling it.
      </p>

      <h2>Corrections</h2>
      <p>
        If you spot an error &mdash; a wrong date, a song that was not played, a quote that is off
        &mdash; send it through our <a href="/contact?topic=correction#contact-form">contact form</a> (topic: Corrections) with the page URL and
        what needs fixing. We aim to correct factual errors within 48 hours. Significant
        corrections are noted on the page itself; typo-level fixes are made silently.
      </p>

      <h2>Takedowns and rights holders</h2>
      <p>
        Requests from Ella Langley&apos;s team or any rights holder go through our{" "}
        <a href="/contact?topic=takedown#contact-form">contact form</a> (topic: Photo or content takedown) and are answered
        within 48 hours.
      </p>

      <h2>Who is responsible</h2>
      <p>
        Ella Fellas is published by Bynum Enterprises, 305 Lost Creek Trl, Greenville, TX 75402,
        United States. General questions: our <a href="/contact#contact-form">contact form</a>.
      </p>
    </article>
  );
}
