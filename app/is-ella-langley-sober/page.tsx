import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { FaqSchema } from "@/components/schema/FaqSchema";
import { BreadcrumbSchema } from "@/components/schema/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
const TITLE = "Is Ella Langley Sober? The Honest Answer";
const DESC =
  "People ask if Ella Langley is sober because of songs like \"Nicotine\" and \"ain't sober yet.\" Here's the straight answer: there's no public statement — and why the songs aren't one.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Ella Fellas` },
  description: DESC,
  alternates: { canonical: `${SITE_URL}/is-ella-langley-sober` },
  openGraph: { title: TITLE, description: DESC, images: [`/api/og?title=${encodeURIComponent("Is Ella Langley Sober?")}&kicker=${encodeURIComponent("The honest answer")}`] },
};

export default function SoberPage() {
  const faq = [
    { q: "Is Ella Langley sober?", a: "There is no public statement from Ella Langley or her team about her being sober, and no verified reporting either way. Anyone claiming a definitive answer is guessing. What people are usually reacting to is her music, not a personal announcement." },
    { q: "Is the song \"Nicotine\" about addiction or being sober?", a: "\"Nicotine\" is a metaphor. Langley has described it as being about craving a person the way you'd crave a vice — young, rebellious love — not a statement about substances or sobriety. It's a songwriting device, not a confession." },
    { q: "Why do people think Ella Langley might be sober?", a: "Her catalog leans into drinking imagery as a persona — titles like \"ain't sober yet,\" \"hungover,\" and \"i blame the bar.\" Fans reasonably wonder whether that's autobiography or character. Country songwriting has always played both, and there's no public word on where she personally lands, so we won't pretend there is." },
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbSchema items={[{ name: "Is Ella Langley Sober?", url: `${SITE_URL}/is-ella-langley-sober` }]} />
      <FaqSchema items={faq} />
      <nav className="text-xs text-ink/60 mb-4"><Link href="/songs" className="hover:text-primary">&larr; Songs</Link></nav>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-clay font-medium">The honest answer</p>
        <h1 className="font-display text-4xl md:text-5xl text-denim mt-2 leading-tight">IS ELLA LANGLEY SOBER?</h1>
      </header>
      <div className="bg-primary/10 border-2 border-primary/40 rounded-lg p-5 mb-8">
        <p className="text-ink/85 leading-relaxed">
          <strong>Short answer: there&apos;s no public statement, so nobody actually knows.</strong> Ella
          Langley has not said publicly whether she&apos;s sober, and there&apos;s no verified reporting
          on it. We&apos;d rather tell you that than make something up — this whole site runs on not
          inventing facts.
        </p>
      </div>
      <p className="text-ink/80 leading-relaxed mb-4">
        The reason people ask is the music. Songs like <Link href="/songs/nicotine" className="underline text-denim hover:text-primary">&ldquo;Nicotine&rdquo;</Link>,{" "}
        <Link href="/songs/aint-sober-yet" className="underline text-denim hover:text-primary">&ldquo;ain&apos;t sober yet&rdquo;</Link> and her debut album{" "}
        <em>Hungover</em> lean hard into drinking imagery. It&apos;s natural to wonder how much is autobiography.
      </p>
      <p className="text-ink/80 leading-relaxed mb-6">
        But here&apos;s the thing about &ldquo;Nicotine&rdquo; specifically: Langley has described it as a
        metaphor — craving a person like a vice, the pull of young, rebellious love — not a song about
        substances. Country songwriting has always blurred persona and person; the honky-tonk narrator
        isn&apos;t a diary entry. Where Ella herself lands personally, she hasn&apos;t said, and we&apos;re
        not going to guess for her.
      </p>
      <h2 className="font-display text-2xl text-denim tracking-wide mb-4">COMMON QUESTIONS</h2>
      <div className="space-y-4 mb-8">
        {faq.map((f) => (<div key={f.q} className="bg-paper border border-ink/10 rounded-lg p-5"><h3 className="font-display text-lg text-denim leading-snug">{f.q}</h3><p className="text-sm text-ink/80 leading-relaxed mt-2">{f.a}</p></div>))}
      </div>
      <p className="text-sm text-ink/70 mb-6">More: <Link href="/best-songs" className="underline text-denim hover:text-primary">her best songs</Link>, <Link href="/fan-club" className="underline text-denim hover:text-primary">the fan club</Link>.</p>
      <AffiliateDisclosure />
    </article>
  );
}
