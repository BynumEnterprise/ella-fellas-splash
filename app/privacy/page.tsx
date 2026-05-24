import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl text-denim mb-6">Privacy Policy</h1>
      <p className="text-sm text-ink/60">Last updated: May 2026</p>

      <h2>What we collect</h2>
      <p>When you use ellafellas.com, we collect:</p>
      <ul>
        <li>
          <strong>Email address and optional city/state</strong> — only if you sign up for our
          newsletter or tour alerts. We use these to send you the newsletter and city-specific
          tour notifications.
        </li>
        <li>
          <strong>Anonymous analytics</strong> — page views and aggregate visitor stats via
          privacy-preserving analytics. We don&apos;t track you across other sites.
        </li>
        <li>
          <strong>Affiliate click data</strong> — we record which affiliate links are clicked (not
          who clicked them) so we know which products are useful to recommend.
        </li>
      </ul>

      <h2>What we don&apos;t collect</h2>
      <ul>
        <li>Your IP address (beyond standard server logs that are auto-rotated)</li>
        <li>Your browsing history outside this site</li>
        <li>Your name, phone number, address, or any payment info (we never accept payments)</li>
      </ul>

      <h2>Third-party services we use</h2>
      <ul>
        <li><strong>Vercel</strong> — hosts this site</li>
        <li><strong>Supabase</strong> — stores newsletter subscriber data (email + optional city)</li>
        <li><strong>Resend</strong> — delivers newsletter emails</li>
        <li><strong>Affiliate networks</strong> (TickPick, Amazon Associates, Impact Radius, Awin, Partnerize) — track clicks and conversions for commission attribution. Each has its own privacy policy.</li>
      </ul>

      <h2>Your rights</h2>
      <ul>
        <li>
          <strong>Unsubscribe anytime</strong> — every email has a one-click unsubscribe link.
        </li>
        <li>
          <strong>Delete your data</strong> — email{" "}
          <a href="mailto:hi@ellafellas.com">hi@ellafellas.com</a> and we&apos;ll wipe your
          subscriber record from Supabase within 7 days.
        </li>
        <li>
          <strong>Update your preferences</strong> — change your city or alert radius via a link in
          any of our emails.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use only essential cookies (for the newsletter form). We don&apos;t use tracking cookies,
        ad cookies, or third-party cookies (other than those set by YouTube and Spotify when you
        play their embeds).
      </p>

      <h2>CAN-SPAM compliance</h2>
      <p>
        Every email we send includes a physical mailing address (Bynum Enterprises, 305 Lost Creek
        Trl, Greenville, TX 75402) and a working unsubscribe link, as required by the CAN-SPAM Act.
      </p>

      <h2>Children</h2>
      <p>
        ellafellas.com is not directed at children under 13. We don&apos;t knowingly collect data
        from children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We&apos;ll post any updates here with a new &quot;last updated&quot; date. Material changes
        will also be announced in the newsletter.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email{" "}
        <a href="mailto:hi@ellafellas.com">hi@ellafellas.com</a>.
      </p>
    </article>
  );
}
