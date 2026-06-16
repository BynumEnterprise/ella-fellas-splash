import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Ella Fellas",
  description: "An independent fan-run news site for country music artist Ella Langley.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl md:text-5xl text-denim mb-6">
        Ella Fellas is the unofficial Ella Langley superfan HQ
      </h1>
      <p className="text-lg">
        We&apos;re an independent, fan-run news and tour site for country music artist Ella Langley.
        Built by fans, for the{" "}
        <a href="/guides/what-are-ella-fellas"><strong>Fellas</strong></a> &mdash; the male side of
        her fanbase and anyone else along for the ride.
      </p>

      <h2>Who we are</h2>
      <p>
        The Ella Fellas team are country-music fans who follow Ella Langley&apos;s shows closely. We go
        to the concerts, track every tour stop on the Dandelion Tour and the Morgan Wallen support
        dates, research presale codes before they drop, and field the same questions in fan groups
        over and over &mdash; so we started writing the answers down in one place. Our guides cover
        things we&apos;ve actually had to figure out: what to wear, what to bring, where to sit, which
        boots survive four hours on a concrete floor. If we haven&apos;t been to a show ourselves, we
        source from people who have.
      </p>

      <h2>Why trust us</h2>
      <p>
        We&apos;re not journalists, and we don&apos;t pretend to be. What we are is obsessively up-to-date
        fans who hate bad concert advice. Every guide on this site is written from the perspective
        of someone who has actually stood in that crowd. When we recommend gear, it&apos;s gear we&apos;d
        actually bring &mdash; not whatever has the highest affiliate payout. We disclose every
        affiliate link, link out to official sources rather than paraphrasing them blind, and
        correct our posts when we get something wrong. If you spot an error,{" "}
        <a href="mailto:hi@ellafellas.com">email us</a> and we&apos;ll fix it fast.
      </p>

      <h2>What we do</h2>
      <p>
        We cover Ella Langley&apos;s career closely and continuously: daily news, every tour stop on
        the Dandelion Tour and the Morgan Wallen support dates, every released song, opening-act
        breakdowns, ticket and presale tracking, concert-prep guides, and reasonable takes on the
        biggest country artist of 2026.
      </p>

      <h2>What we don&apos;t do</h2>
      <p>
        We don&apos;t claim to be official. We&apos;re not affiliated with Ella Langley, her management,
        her label (Sony Music Nashville / Columbia / SAWGOD), or her official merchandise line
        (Ella&apos;s Fellas). We don&apos;t sell merch with her name on it. We don&apos;t impersonate her
        or invent insider sources we don&apos;t have. When we&apos;re paraphrasing, we link out.
      </p>

      <h2>How we&apos;re built</h2>
      <p>
        Ella Fellas is built with AI tools to help us cover her career faster and more
        comprehensively than a single fan with a blog ever could. Every article gets a human edit
        for accuracy and tone before it goes out. We&apos;re transparent about this because we&apos;d
        rather you trust us than be surprised.
      </p>

      <h2>For Ella&apos;s team</h2>
      <p>
        If you&apos;re Ella&apos;s team and you&apos;d like something updated, corrected, or removed &mdash;
        email us at <a href="mailto:takedowns@ellafellas.com">takedowns@ellafellas.com</a> and we&apos;ll
        respond within 48 hours. We always link out to the official site at{" "}
        <a href="https://ellalangley.com" target="_blank" rel="noopener">ellalangley.com</a> and the
        official merch at <a href="https://ellalangley.us" target="_blank" rel="noopener">ellalangley.us</a>.
      </p>

      <h2>Affiliate disclosure</h2>
      <p>
        Some of the links on our tour pages and guides are affiliate links &mdash; primarily ticket
        marketplaces and country gear. If you buy through one we may earn a small commission at no
        extra cost to you. We only link to products we&apos;d recommend to a friend.
      </p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:hi@ellafellas.com">hi@ellafellas.com</a> &mdash; for everything else.
      </p>
    </article>
  );
}
