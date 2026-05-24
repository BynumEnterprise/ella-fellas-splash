import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl text-denim mb-6">Get in touch</h1>
      <p>
        We&apos;d love to hear from you. The fastest way to reach us is email — pick the right address
        for what you need:
      </p>
      <ul>
        <li>
          <strong>General questions, tips, song requests:</strong>{" "}
          <a href="mailto:hi@ellafellas.com">hi@ellafellas.com</a>
        </li>
        <li>
          <strong>Sponsorship / newsletter ads:</strong>{" "}
          <a href="mailto:sponsor@ellafellas.com">sponsor@ellafellas.com</a>
        </li>
        <li>
          <strong>Takedown requests (Ella&apos;s team):</strong>{" "}
          <a href="mailto:takedowns@ellafellas.com">takedowns@ellafellas.com</a> — 48 hr response
        </li>
        <li>
          <strong>Press / interviews:</strong>{" "}
          <a href="mailto:press@ellafellas.com">press@ellafellas.com</a>
        </li>
      </ul>
      <p>
        We read everything. Replies usually within a day, sometimes faster if it&apos;s a tour day.
      </p>
    </article>
  );
}
