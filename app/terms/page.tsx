import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that apply when you use ellafellas.com, the independent Ella Langley fan site run by Bynum Enterprises: content, accuracy, affiliate links, newsletter, intellectual property, and liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl text-denim mb-6">Terms of Use</h1>
      <p className="text-sm text-ink/60">Last updated: November 2, 2026</p>

      <p>
        These terms apply to ellafellas.com (the &ldquo;site&rdquo;), which is published by Bynum
        Enterprises, 305 Lost Creek Trl, Greenville, TX 75402, United States (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;). By using the site you agree to them. Purchases from our merch store at
        shopellafellas.com are governed by that store&apos;s own terms of service, not these.
      </p>

      <h2>1. What the site is</h2>
      <p>
        Ella Fellas is an independent, fan-run news and tour information site about country music
        artist Ella Langley. It is not affiliated with, endorsed by, or sponsored by Ella Langley,
        her management, her label, or her official merchandise. Our{" "}
        <a href="/disclaimer">disclaimer</a> has the details.
      </p>

      <h2>2. Information, not advice</h2>
      <p>
        We work hard to keep tour dates, set times, setlists, ticket prices, and venue details
        accurate, but they change constantly and we cannot guarantee them. Confirm anything that
        matters &mdash; especially times, prices, and venue rules &mdash; with the venue or ticket
        seller before you rely on it. Nothing on the site is professional advice of any kind.
      </p>

      <h2>3. Tickets, travel, and affiliate links</h2>
      <p>
        We do not sell tickets, hotel rooms, or anything else on this site. Links to TicketNetwork,
        Expedia, Vrbo, Hotels.com, EconomyBookings, Amazon, and other partners take you to their
        sites, where their terms and prices apply. Some of those links are affiliate links and may
        earn us a commission; see our <a href="/disclaimer">affiliate disclosure</a>. Any purchase
        you make is a contract between you and that seller.
      </p>

      <h2>4. Newsletter</h2>
      <p>
        If you subscribe to the Ella Fellas Daily or tour alerts, you agree to receive those emails
        until you unsubscribe. Every email contains an unsubscribe link. How we handle your address
        is covered in our <a href="/privacy">privacy policy</a>.
      </p>

      <h2>5. Our content and your use of it</h2>
      <p>
        The articles, guides, graphics, and code on the site belong to Bynum Enterprises unless
        credited otherwise. You may read, link to, and share short excerpts with attribution and a
        link back. You may not copy whole articles, scrape the site at scale, or republish our
        content commercially without written permission. Photos credited to Creative Commons
        licensors may be reused under the terms of their license, which is linked in each caption.
      </p>

      <h2>6. Third-party trademarks and content</h2>
      <p>
        Artist names, song and album titles, tour names, venue names, and company names are
        trademarks of their respective owners and are used here only to identify them. Embedded
        YouTube and Spotify content remains the property of its rights holders and is subject to
        their terms.
      </p>

      <h2>7. Acceptable use</h2>
      <p>
        Do not use the site to do anything unlawful, to interfere with its operation, to attempt to
        access systems or data you are not authorized to access, to send spam through our contact
        form or newsletter sign-up, or to harvest other people&apos;s data.
      </p>

      <h2>8. No warranty; limitation of liability</h2>
      <p>
        The site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties
        of any kind. To the fullest extent permitted by law, Bynum Enterprises is not liable for
        any loss or damage arising from your use of the site or from anything you buy from a
        third party we link to, including missed shows, wrong times, or price changes. Some
        jurisdictions do not allow these limitations, in which case they apply to the extent
        permitted.
      </p>

      <h2>9. Takedowns and corrections</h2>
      <p>
        Rights holders can request removal or correction, and anyone can report an error, through
        our <a href="/contact#contact-form">contact form</a>. See our{" "}
        <a href="/editorial-policy">editorial policy</a> for how corrections are handled.
      </p>

      <h2>10. Changes and governing law</h2>
      <p>
        We may update these terms at any time by posting a new version here with a new date. These
        terms are governed by the laws of the State of Texas, United States, without regard to its
        conflict-of-law rules.
      </p>

      <h2>11. Contact</h2>
      <p>
        Bynum Enterprises, 305 Lost Creek Trl, Greenville, TX 75402, United States &middot;{" "}
        <a href="/contact#contact-form">contact form</a>
      </p>
    </article>
  );
}
