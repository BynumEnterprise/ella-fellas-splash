import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Ella Fellas, the independent Ella Langley fan site: general questions, press, sponsorship, corrections, or photo and content takedown requests. We reply within 2 business days.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Contact Ella Fellas", images: ["/opengraph-image.png"] },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl text-denim mb-6">Get in touch</h1>
      <p>
        The form below is the way to reach us. Pick the topic that fits and your message goes
        straight to the person who runs the site. Every message is read by a human.
      </p>

      <ContactForm />

      <h2>What to include</h2>
      <ul>
        <li>
          <strong>General</strong> &mdash; questions, tips, song requests, site feedback, or
          newsletter help (if an unsubscribe link ever fails, tell us the address and we will remove
          it by hand).
        </li>
        <li>
          <strong>Press</strong> &mdash; your outlet, deadline, and what you need.
        </li>
        <li>
          <strong>Sponsorship</strong> &mdash; newsletter or site sponsorship ideas. We label every
          paid placement and affiliate link.
        </li>
        <li>
          <strong>Corrections</strong> &mdash; the page URL, what is wrong, and a source if you have
          one. See our <a href="/editorial-policy">editorial policy</a>.
        </li>
        <li>
          <strong>Photo or content takedown</strong> &mdash; for Ella Langley&apos;s team and rights
          holders: the page URL, the photo or content in question, and your connection to it.
        </li>
      </ul>

      <h2>Response time</h2>
      <p>
        We reply within 2 business days, usually sooner. Takedown and correction requests are
        handled within 48 hours.
      </p>

      <p className="text-sm text-ink/70">
        Ella Fellas and the Ella Fellas Daily newsletter are an independent fan project published by
        Bynum Enterprises, 305 Lost Creek Trl, Greenville, TX 75402. We are not affiliated with,
        endorsed by, or sponsored by Ella Langley, her management, or her label, and we cannot pass
        messages to her. To reach Ella or her team, use the official channels at{" "}
        <a href="https://ellalangley.com" target="_blank" rel="noopener">ellalangley.com</a>.
      </p>
    </article>
  );
}
