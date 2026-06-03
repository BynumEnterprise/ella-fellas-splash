import type { Metadata } from "next";

export const metadata: Metadata = { title: "Disclaimer", alternates: { canonical: "/disclaimer" } };

export default function DisclaimerPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl text-denim mb-6">Disclaimer</h1>

      <h2>Fan site, not official</h2>
      <p>
        Ella Fellas (ellafellas.com) is an independent, fan-run news and tour information site for
        country music artist Ella Langley. We are <strong>not</strong> affiliated with, endorsed by,
        or sponsored by Ella Langley, her management, her record label (Sony Music Nashville /
        Columbia / SAWGOD), or her official merchandise line (Ella&apos;s Fellas).
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
        names only to identify the artist and her work in factual reporting and editorial commentary.
      </p>

      <h2>Affiliate disclosure</h2>
      <p>
        This site contains affiliate links to ticket marketplaces (TickPick, Vivid Seats, SeatGeek,
        Ticketmaster), Amazon, and travel booking platforms. If you click an affiliate link and make
        a purchase, we may earn a commission at no additional cost to you. Affiliate revenue helps
        keep this site running. We only link to products and services we&apos;d recommend to a friend.
      </p>

      <h2>Accuracy</h2>
      <p>
        We do our best to keep tour dates, ticket prices, and other facts accurate, but information
        changes constantly. Always verify ticket prices and availability with the official venue or
        ticket provider before purchasing.
      </p>

      <h2>AI-assisted content</h2>
      <p>
        We use AI tools to help research and draft articles. Every published piece is reviewed by a
        human editor for accuracy and tone before going live. We mention this because we&apos;d rather
        be transparent than have you guess.
      </p>

      <h2>Takedown requests</h2>
      <p>
        If you&apos;re Ella Langley, a member of her team, or a rights holder and you&apos;d like
        something removed or corrected, email{" "}
        <a href="mailto:takedowns@ellafellas.com">takedowns@ellafellas.com</a> and we&apos;ll respond
        within 48 hours.
      </p>
    </article>
  );
}
