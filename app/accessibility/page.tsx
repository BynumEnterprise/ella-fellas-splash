import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Ella Fellas aims to meet WCAG 2.1 AA. What we do for accessibility, known limitations, and how to tell us about a problem.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl text-denim mb-6">Accessibility Statement</h1>
      <p className="text-sm text-ink/60">Last updated: November 2, 2026</p>

      <p>
        We want every fan to be able to use ellafellas.com, whatever device or assistive technology
        they use. Our goal is to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at
        level AA, and we keep working toward it.
      </p>

      <h2>What we do</h2>
      <ul>
        <li>Semantic HTML with a logical heading order on every page, and a &ldquo;skip to content&rdquo; path via the keyboard.</li>
        <li>All functionality &mdash; navigation, search, the newsletter form, the contact form, and the trip planner &mdash; works with a keyboard alone, with visible focus states.</li>
        <li>Descriptive alt text on photos, and captions that credit the photographer.</li>
        <li>Text and background colors chosen to meet the AA contrast ratio, and text that can be resized to 200% without loss of content.</li>
        <li>Pages that work on phones and small screens, with no horizontal scrolling at standard zoom.</li>
        <li>Links that make sense out of context, and buttons with accessible names.</li>
        <li>No autoplaying audio or video; embedded YouTube and Spotify players start only when you press play.</li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>Embedded YouTube and Spotify players are third-party content and may not fully meet WCAG; links to the same content on those services are provided alongside the embeds where possible.</li>
        <li>Venue seating diagrams are images; the key facts in them are repeated in the surrounding text.</li>
        <li>Some older articles may have headings or alt text that fall short of the standard above. We fix them as we find them.</li>
      </ul>

      <h2>Tell us about a problem</h2>
      <p>
        If you hit something on the site that does not work for you, use our{" "}
        <a href="/contact#contact-form">contact form</a> with the page URL, what you were
        trying to do, and the browser and assistive technology you use. We will reply within a few
        days and fix what we can. If you need information from a page in a different format, ask
        and we will send it.
      </p>

      <h2>Technical details</h2>
      <p>
        The site is built with Next.js and standard HTML, CSS, and JavaScript, and is checked in
        current versions of Chrome, Safari, Firefox, and Edge on desktop and mobile, with
        automated accessibility audits run through Lighthouse. We have not yet commissioned a
        formal third-party audit. This statement was written on November 2, 2026, and is reviewed
        when the site changes significantly.
      </p>
    </article>
  );
}
