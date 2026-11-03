import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Ella Fellas handles your data: newsletter email, Google Analytics, email open and click tracking, affiliate cookies, the contact form, and your choices. Read our privacy policy.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose-content">
      <h1 className="font-display text-4xl text-denim mb-6">Privacy Policy</h1>
      <p className="text-sm text-ink/60">Last updated: November 2, 2026</p>

      <p>
        ellafellas.com is run by Bynum Enterprises (305 Lost Creek Trl, Greenville, TX 75402, United
        States). This policy explains what we collect when you use the site or get our emails, why
        we collect it, who we share it with, and the choices you have. It is written in plain
        English on purpose. If anything is unclear, ask us through our{" "}
        <a href="/contact#contact-form">contact form</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Newsletter sign-up details</strong> &mdash; your email address, and your city,
          state, and alert radius if you choose to give them. We use these to send the Ella Fellas
          Daily, tour alerts for shows near you, and the confirmation and unsubscribe emails that go
          with them.
        </li>
        <li>
          <strong>Email engagement</strong> &mdash; our email provider, Resend, records when an
          email we sent you is delivered, opened, or bounced, and which links in it you click. These
          events are tied to your email address and stored in our database so we can see what
          readers find useful, stop sending to addresses that bounce, and honor unsubscribes. Opens
          are measured with a tracking pixel; most email apps let you block remote images if you
          would rather not be counted.
        </li>
        <li>
          <strong>Contact form messages</strong> &mdash; the name, email address, topic, and
          message you send us. They are delivered to our inbox by email and kept as long as we need
          them to reply. We also look at your IP address at the moment you submit, purely to limit
          spam; it is not stored with your message.
        </li>
        <li>
          <strong>Site analytics</strong> &mdash; we use Google Analytics 4 to understand which
          pages people read and which links they click (including affiliate links and merch links).
          Google Analytics sets cookies (for example <code>_ga</code>) and collects information such
          as the pages you visit, your approximate location derived from your IP address, your
          browser and device type, and how you arrived at the site. We have not enabled Google
          Signals or advertising features, and we do not upload names or email addresses to Google
          Analytics.
        </li>
        <li>
          <strong>Outbound link logs</strong> &mdash; some links in our emails route through a
          redirect on our own site. When you follow one we record the destination, the campaign it
          came from, your browser&apos;s user agent, and the referring page. This tells us which
          issues and links send readers somewhere useful.
        </li>
        <li>
          <strong>Server logs</strong> &mdash; our host, Vercel, keeps standard request logs
          (IP address, URL, timestamp, user agent) for a short period for security and debugging.
        </li>
      </ul>

      <h2>What we don&apos;t collect</h2>
      <ul>
        <li>Payment information. We never take payments on ellafellas.com. Our merch store at shopellafellas.com runs on Shopify and has its own privacy policy.</li>
        <li>Account passwords. There are no accounts on this site.</li>
        <li>Your browsing activity on other websites.</li>
      </ul>

      <h2>Cookies and similar technologies</h2>
      <p>
        We use a small number of cookies and similar technologies:
      </p>
      <ul>
        <li>
          <strong>Google Analytics</strong> cookies (<code>_ga</code> and <code>_ga_*</code>) to
          distinguish visitors and sessions. You can block them with the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics opt-out browser add-on
          </a>{" "}
          or by blocking cookies in your browser; the site works fine without them.
        </li>
        <li>
          <strong>Affiliate tracking</strong> &mdash; when you click an affiliate link, the
          partner you land on (for example Amazon, TicketNetwork, Expedia, Vrbo, or Hotels.com)
          and its affiliate network may set a cookie on their own domain so that a purchase can be
          credited to us. Those cookies are set and controlled by the partner, under the partner&apos;s
          privacy policy, not by us.
        </li>
        <li>
          <strong>Embedded media</strong> &mdash; YouTube and Spotify embeds may set their own
          cookies when you play them.
        </li>
      </ul>
      <p>We do not run advertising cookies or sell your data to data brokers.</p>

      <h2>Third-party services we use</h2>
      <ul>
        <li><strong>Vercel</strong> &mdash; hosts the site and keeps short-term server logs.</li>
        <li><strong>Supabase</strong> &mdash; stores newsletter subscriber records, email engagement events, and outbound link logs.</li>
        <li><strong>Resend</strong> &mdash; sends our emails and reports delivery, open, click, bounce, and complaint events back to us.</li>
        <li><strong>Google Analytics 4</strong> (Google LLC) &mdash; site analytics, as described above.</li>
        <li>
          <strong>Affiliate programs</strong> &mdash; Amazon Associates; CJ Affiliate (TicketNetwork,
          Vrbo, Hotels.com, EconomyBookings, and other advertisers we may add); the Expedia Group
          affiliate program; and Impact (hotel loyalty programs). Each program tracks clicks and
          purchases for commission attribution under its own privacy policy.
        </li>
        <li><strong>Shopify</strong> &mdash; runs our separate merch store at shopellafellas.com. Its privacy policy applies to purchases there.</li>
      </ul>
      <p>
        We do not sell personal information. We share it only with the service providers above, to
        comply with the law, or to protect the site and its readers.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Subscriber records: until you unsubscribe or ask us to delete them. After you unsubscribe we keep your address on a suppression list so we do not accidentally email you again; tell us if you want it fully erased.</li>
        <li>Email engagement events and outbound link logs: while we run the newsletter, for reporting. We delete them on request.</li>
        <li>Contact form messages: as long as needed to handle your request.</li>
        <li>Google Analytics data: event-level data is kept under the retention setting on our Google Analytics property (2 or 14 months); aggregated reports are kept longer.</li>
      </ul>

      <h2>Your rights and choices</h2>
      <ul>
        <li>
          <strong>Unsubscribe anytime</strong> &mdash; every email has a one-click unsubscribe
          link that takes effect immediately. If the link ever fails, send us the address through our{" "}
          <a href="/contact#contact-form">contact form</a> and we will remove you by hand,
          always within 10 business days.
        </li>
        <li>
          <strong>Access, correct, or delete your data</strong> &mdash; use our{" "}
          <a href="/contact#contact-form">contact form</a> with the email address in question and
          we will send you what we hold, fix it, or erase it within 7 days. We reply only to that
          address.
        </li>
        <li>
          <strong>Change your city or alert radius</strong> &mdash; email us and we will update it.
        </li>
        <li>
          <strong>Opt out of analytics</strong> &mdash; use the Google opt-out add-on or block
          cookies, as described above.
        </li>
        <li>
          <strong>State privacy rights</strong> &mdash; if you live in California or another US
          state with a privacy law, you can exercise the rights above by email. We do not sell or
          share personal information for targeted advertising, so there is nothing to opt out of on
          that front. We will not treat you differently for exercising your rights.
        </li>
        <li>
          <strong>Visitors outside the US</strong> &mdash; the site is run from the United States
          and your data is processed here. If you are in the EEA or UK, the rights above apply to
          you too; our legal basis is your consent (newsletter) and our legitimate interest in
          running and improving the site (analytics and logs).
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        Data is transmitted over HTTPS and stored with providers that use industry-standard
        safeguards. No system is perfectly secure; if we ever learn of a breach affecting your
        data, we will tell you.
      </p>

      <h2>Children</h2>
      <p>
        ellafellas.com is not directed at children under 13 and we do not knowingly collect data
        from them. If you think a child has subscribed, email us and we will remove the record.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We will post updates here with a new &ldquo;last updated&rdquo; date. Material changes
        will also be mentioned in the newsletter.
      </p>

      <h2>Contact</h2>
      <p>
        Bynum Enterprises, 305 Lost Creek Trl, Greenville, TX 75402, United States &middot;{" "}
        <a href="/contact#contact-form">contact form</a>
      </p>
    </article>
  );
}
