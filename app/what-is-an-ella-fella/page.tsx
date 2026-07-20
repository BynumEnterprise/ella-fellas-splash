import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "What Is an \"Ella Fella\"? Ella Langley's Fans, Explained";
const DESC =
  "What does \"Ella Fella\" mean, where did it come from, and is it an official fan name? The story behind what Ella Langley's fans are called.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/what-is-an-ella-fella` },
  openGraph: { title: TITLE, description: DESC, images: [`/api/og?title=${encodeURIComponent("What Is an Ella Fella?")}&kicker=${encodeURIComponent("Ella Langley's fans, explained")}`] },
};

export default function EllaFellaPage() {
  const faq = [
    { q: "What is an Ella Fella?", a: "\"Ella Fella\" is what Ella Langley's fans got nicknamed — an unofficial, fan-and-internet-coined term for the people who follow her. It started as a nod to her name and her fanbase and stuck. It's not an official designation from Ella or her team; it's the organic one everybody uses." },
    { q: "Are Ella Langley's fans officially called Ella Fellas?", a: "No — there's no official fan name the way Taylor Swift has \"Swifties.\" \"Ella Fellas\" is the organic term that caught on. So it's what people call her fans, just not something her team declared." },
    { q: "Where did the term come from?", a: "It spread the way most fan names do now — a catchy play on her name that fans and country outlets picked up and repeated until it became the default. This site is literally named for it: we're the unofficial Ella Fellas HQ." },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "What Is an Ella Fella?", url: `${SITE_URL}/what-is-an-ella-fella` }]} />
      <FaqSchema items={faq} />
      <nav className="text-xs text-ink/60 mb-4"><Link href="/" className="hover:text-primary">&larr; Home</Link></nav>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">Explained</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">WHAT IS AN &ldquo;ELLA FELLA&rdquo;?</h1>
      </header>
      <div className="bg-primary/10 border-2 border-primary/40 rounded-lg p-5 mb-8">
        <p className="text-ink/85 leading-relaxed">
          An <strong>&ldquo;Ella Fella&rdquo;</strong> is what Ella Langley&apos;s fans got nicknamed —
          the organic, fan-coined term for the people who follow her. It&apos;s not an official fan name
          (she&apos;s never declared one), but it&apos;s the one that caught on. And yes: it&apos;s why
          this site is called Ella Fellas.
        </p>
      </div>
      <p className="text-ink/80 leading-relaxed mb-4">
        Fan names used to be handed down by the artist. Now they mostly bubble up from the crowd — a
        catchy play on the name that fans and outlets repeat until it&apos;s just what everyone says.
        &ldquo;Ella Fellas&rdquo; is that: a nod to Ella Langley and the people who show up for her, sturdy
        enough that a whole fan site (this one) runs on it.
      </p>
      <p className="text-ink/80 leading-relaxed mb-6">
        Want the fuller picture — the official fan club, presale access, and how to actually plug in? That
        all lives on our <Link href="/fan-club" className="underline text-denim hover:text-primary">fan club page</Link>.
      </p>
      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">COMMON QUESTIONS</h2>
      <div className="space-y-4 mb-8">
        {faq.map((f) => (<div key={f.q} className="bg-paper border border-ink/10 rounded-lg p-5"><h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3><p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p></div>))}
      </div>
      <AffiliateDisclosure />
    </article>
  );
}
