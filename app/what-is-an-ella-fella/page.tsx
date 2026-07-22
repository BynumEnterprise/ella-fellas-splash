import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const PAGE_URL = `${SITE_URL}/what-is-an-ella-fella`;
const TITLE = "What Is an Ella Fella? The Ella Fellas — Ella Langley's Fans, Explained";
const DESC =
  "An Ella Fella is a fan of country singer Ella Langley — and the Ella Fellas are her fan community. What the nickname means, where it came from, and how it differs from the official Ella's Fellas merch line.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: PAGE_URL,
    images: [`/api/og?title=${encodeURIComponent("What Is an Ella Fella?")}&kicker=${encodeURIComponent("The Ella Fellas, explained")}`],
  },
};

function DefinedTermSchema() {
  const json = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${PAGE_URL}#terms`,
    name: "Ella Langley fan community terms",
    url: PAGE_URL,
    hasDefinedTerm: [
      {
        "@type": "DefinedTerm",
        name: "Ella Fella",
        url: PAGE_URL,
        description:
          "A fan of country music artist Ella Langley. The term is an organic, fan-coined nickname — especially for the male fans her music pulled into country — not an official designation from the artist or her team.",
        inDefinedTermSet: `${PAGE_URL}#terms`,
      },
      {
        "@type": "DefinedTerm",
        name: "Ella Fellas",
        url: PAGE_URL,
        description:
          "The collective nickname for Ella Langley's fan community. Plural of Ella Fella. Distinct from Ella's Fellas (possessive), which is the branding used by Ella Langley's official merchandise line.",
        inDefinedTermSet: `${PAGE_URL}#terms`,
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

export default function EllaFellaPage() {
  const faq = [
    {
      q: "What is an Ella Fella?",
      a: "An Ella Fella is a fan of country singer Ella Langley. It's the organic, fan-and-internet-coined nickname for the people who follow her — leaning toward the guys in the crowd, but used loosely for anyone who's all in on her music. It's not an official designation from Ella or her team; it's the term everybody uses.",
    },
    {
      q: "What are Ella Langley fans called?",
      a: "Unofficially, Ella Langley fans are called Ella Fellas. There's no artist-declared fan name the way Taylor Swift has \"Swifties\" — \"Ella Fellas\" is the nickname that caught on organically and that fans and country outlets ran with. (Yes, that's where this site got its name.)",
    },
    {
      q: "Are Ella Langley's fans officially called Ella Fellas?",
      a: "No — Ella and her team have never declared an official fan name. \"Ella Fellas\" is the organic term that stuck. Her official merchandise line does use the possessive branding \"Ella's Fellas,\" which nods to the same nickname, but the fan term itself is community-made.",
    },
    {
      q: "Is \"Ella Fellas\" the same as the official \"Ella's Fellas\" merch?",
      a: "No. Ella Langley's official merchandise line is branded \"Ella's Fellas\" (with the possessive) and sells shirts and gear through her official store. \"Ella Fellas\" is the fan community itself. This site, Ella Fellas, is an independent fan site and is not affiliated with Ella Langley, her team, or the official merch line.",
    },
    {
      q: "Where did the term Ella Fella come from?",
      a: "It bubbled up from fan communities online as Ella Langley broke through — the rhyme of \"Ella\" and \"fella\" made it easy to say and easy to remember, and the male fans her Riley Green duet \"you look like you love me\" pulled in gave it a crowd to describe. Fans and country outlets repeated it until it became the default. There's no single official origin moment.",
    },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "What Is an Ella Fella?", url: PAGE_URL }]} />
      <FaqSchema items={faq} />
      <DefinedTermSchema />
      <nav className="text-xs text-ink/60 mb-4"><Link href="/" className="hover:text-primary">&larr; Ella Fellas home</Link></nav>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">The fan nickname, explained</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">WHAT IS AN ELLA FELLA?</h1>
      </header>

      {/* Definition block */}
      <div className="bg-primary/10 border-2 border-primary/40 rounded-lg p-5 mb-8">
        <p className="text-ink/85 leading-relaxed">
          An <strong>Ella Fella</strong> is a fan of country singer Ella Langley — and the{" "}
          <strong>Ella Fellas</strong> are her fan community as a whole. It&apos;s the organic,
          fan-coined nickname for the people who show up for her: leaning toward the guys in the
          crowd, but used loosely for anyone who&apos;s all the way in on her music. It&apos;s not an
          official fan name (she&apos;s never declared one) — it&apos;s the one that caught on. And
          yes: it&apos;s why this site is called <Link href="/" className="underline text-denim hover:text-primary">Ella Fellas</Link>.
        </p>
      </div>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-3">WHY THE NAME STUCK</h2>
      <p className="text-ink/80 leading-relaxed mb-4">
        Fan names used to be handed down by the artist. Now they mostly bubble up from the crowd, and
        two things made this one stick. First, the rhyme: &ldquo;Ella&rdquo; and &ldquo;fella&rdquo;
        practically ask to be put together. Second, the makeup of the crowd. Langley&apos;s breakout
        came on the Riley Green duet &ldquo;you look like you love me,&rdquo; which pulled in a lot of
        guys who don&apos;t normally show up for a female country artist. Those fans needed a way to
        tag themselves, the rhyme was right there, and the name took off from the bottom up.
      </p>
      <p className="text-ink/80 leading-relaxed mb-6">
        By 2026 the term had gone fully mainstream — even former NFL head coach Rex Ryan declared
        himself &ldquo;officially an Ella Fella&rdquo; after catching her live in Baltimore in July
        2026, a clip country outlets ran with. Calling yourself an Ella Fella isn&apos;t something you
        apply for. There&apos;s no membership card and no tier list. If her music is in your rotation,
        you&apos;re one.
      </p>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-3">ELLA FELLAS VS. ELLA&apos;S FELLAS (THE MERCH)</h2>
      <p className="text-ink/80 leading-relaxed mb-4">
        One distinction worth getting right, because the spelling is almost identical. Ella
        Langley&apos;s <strong>official merchandise line</strong> is branded &ldquo;Ella&apos;s
        Fellas&rdquo; — with the possessive — and sells shirts and gear through her official store.
        That&apos;s the label-backed, commercial side, and it&apos;s a nod to the same nickname.
      </p>
      <p className="text-ink/80 leading-relaxed mb-6">
        <strong>&ldquo;Ella Fellas&rdquo;</strong> as a fan term is the community itself. This
        website, also called Ella Fellas, is an independent fan site — not affiliated with Ella
        Langley, her management, her label, or the official &ldquo;Ella&apos;s Fellas&rdquo; merch
        line. So: someone who &ldquo;bought an Ella&apos;s Fellas shirt&rdquo; means the official
        merch; someone who says they&apos;re &ldquo;an Ella Fella&rdquo; means they&apos;re a fan.
        Same sound, different thing.
      </p>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-3">THE ELLA FELLAS COMMUNITY</h2>
      <p className="text-ink/80 leading-relaxed mb-4">
        The community is most visible at the shows — her headline dates and Morgan Wallen support
        slots have turned into the main gathering spots, where sing-alongs are the rule, not the
        exception. Online, fan accounts track every tour stop, presale code, and chart milestone.
      </p>
      <p className="text-ink/80 leading-relaxed mb-6">
        Want to plug in? Start with the{" "}
        <Link href="/fan-club" className="underline text-denim hover:text-primary">official fan club and presale access</Link>, find a show on the{" "}
        <Link href="/tour" className="underline text-denim hover:text-primary">2026 tour dates</Link>, get up to speed with the{" "}
        <Link href="/guides/ella-langley-for-beginners" className="underline text-denim hover:text-primary">beginner&apos;s guide</Link>{" "}
        and the <Link href="/songs" className="underline text-denim hover:text-primary">song guide</Link>, and gear up via{" "}
        <Link href="/ella-langley-merch" className="underline text-denim hover:text-primary">merch &amp; vinyl</Link>{" "}
        or the <Link href="/shop" className="underline text-denim hover:text-primary">concert-fit shop</Link>.
      </p>

      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">COMMON QUESTIONS</h2>
      <div className="space-y-4 mb-8">
        {faq.map((f) => (<div key={f.q} className="bg-paper border border-ink/10 rounded-lg p-5"><h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3><p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p></div>))}
      </div>
      <AffiliateDisclosure />
    </article>
  );
}
