import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer & Affiliate Disclosure",
  description:
    "Ella Fellas is an independent, fan-run Ella Langley site — not affiliated with Ella Langley, her label, or her official merch. Read our full disclaimer, affiliate disclosure, and photo credits.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl text-denim mb-6">Disclaimer &amp; Affiliate Disclosure</h1>
      <p className="text-sm text-ink/60">Last updated: November 2, 2026</p>

      <h2>Fan site, not official</h2>
      <p>
        Ella Fellas (ellafellas.com) is an independent, fan-run news and tour information site for
        country music artist Ella Langley, operated by Bynum Enterprises of Greenville, Texas. We are{" "}
        <strong>not</strong> affiliated with, endorsed by, or sponsored by Ella Langley, her
        management, her record label (Sony Music Nashville / Columbia / SAWGOD), or her official
        merchandise line (Ella&apos;s Fellas).
      </p>
      <p>
        For official information visit{" "}
        <a href="https://ellalangley.com" target="_blank" rel="noopener">ellalangley.com</a>. For
        official merchandise visit{" "}
        <a href="https://ellalangley.us" target="_blank" rel="noopener">ellalangley.us</a>.
      </p>

      <h2>Trademarks</h2>
      <p>
        All trademarks, including &quot;Ella Langley&quot;, &quot;Ella&apos;s Fellas&quot;, album
        titles, song titles, and tour names, are property of their respective owners. We use these
        names only to identify the artist and her work in factual reporting and editorial
        commentary. Our own merch store, Ella Fellas at shopellafellas.com, sells original western
        designs and does not use the artist&apos;s name, likeness, lyrics, or logos.
      </p>

      <h2>Affiliate disclosure</h2>
      <p>
        Some links on this site are affiliate links. If you click one and buy something, we may earn
        a commission at no additional cost to you. Affiliate revenue is how this site pays for
        itself. Every page that carries affiliate links shows a disclosure line near the top, and
        affiliate relationships never decide what we write: we only link to things we would tell a
        friend to buy.
      </p>
      <p>
        <strong>As an Amazon Associate I earn from qualifying purchases.</strong> Ella Fellas /
        Bynum Enterprises is a participant in the Amazon Services LLC Associates Program, an
        affiliate advertising program designed to provide a means for sites to earn advertising fees
        by advertising and linking to amazon.com.
      </p>
      <p>Our other affiliate partners are:</p>
      <ul>
        <li>
          <strong>TicketNetwork</strong> (via CJ Affiliate) &mdash; the ticket marketplace linked
          from our tour, set-times, and setlist pages. TicketNetwork is a resale marketplace; prices
          can be above or below face value and are set by sellers, not by us or the venue.
        </li>
        <li>
          <strong>Expedia, Vrbo, and Hotels.com</strong> (Expedia Group affiliate program and CJ
          Affiliate) and <strong>EconomyBookings</strong> (CJ Affiliate) &mdash; the hotel, vacation
          rental, flight, and rental-car links in our Plan Your Trip modules.
        </li>
        <li>
          <strong>Hotel loyalty programs</strong> (IHG, Hilton, Marriott via Impact) &mdash;
          occasional links for buying loyalty points.
        </li>
      </ul>
      <p>
        Links to our own merch store, shopellafellas.com, are not affiliate links &mdash; that is our
        store, and we earn the sale directly.
      </p>

      <h2>Accuracy</h2>
      <p>
        We do our best to keep tour dates, set times, ticket prices, and other facts accurate, but
        information changes constantly and venues move things without notice. Always verify ticket
        prices, availability, and times with the official venue or ticket provider before buying or
        heading out. Nothing on this site is professional, legal, or financial advice.
      </p>

      <h2>How our content is produced</h2>
      <p>
        We use AI tools to help research, draft, and update articles, and every published piece is
        checked against the named sources it cites before it goes live. Setlists come from
        setlist.fm and press coverage; set times, lineups, and dates come from the venue, the
        artist&apos;s official channels, or a named publication. When something is not confirmed we
        say so on the page instead of guessing. Our full{" "}
        <a href="/editorial-policy">editorial policy and corrections process</a> explains how this
        works. If we get something wrong, tell us through our{" "}
        <a href="/contact?topic=correction#contact-form">contact form</a> and we will correct it.
      </p>

      <h2>Photos and media</h2>
      <p>
        Photos of Ella Langley on this site are either our own or Creative Commons images, and each
        one carries the photographer, source, and license in its caption. We do not use press,
        wire, or agency photos, or screenshots of social media posts, without permission. YouTube
        and Spotify content is embedded through the official players and remains the property of
        its rights holders. If you own a photo or other media shown here and believe it has been
        used in error, send a takedown request through our{" "}
        <a href="/contact?topic=takedown#contact-form">contact form</a>.
      </p>

      <h2>External links</h2>
      <p>
        We link to venues, ticket sellers, news outlets, and other third-party sites. We do not
        control those sites and are not responsible for their content, availability, or privacy
        practices.
      </p>

      <h2>Takedown requests</h2>
      <p>
        If you&apos;re Ella Langley, a member of her team, or a rights holder and you&apos;d like
        something removed or corrected, use our{" "}
        <a href="/contact?topic=takedown#contact-form">contact form</a> (topic: Photo or content takedown) and we&apos;ll respond
        within 48 hours.
      </p>

      <p className="text-sm text-ink/70">
        See also our <a href="/terms">terms of use</a>, <a href="/privacy">privacy policy</a>,{" "}
        <a href="/editorial-policy">editorial policy</a>, and{" "}
        <a href="/accessibility">accessibility statement</a>.
      </p>
    </article>
  );
}
