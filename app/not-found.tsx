import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const btn =
  "px-4 py-2.5 bg-ink/10 text-denim font-display tracking-wide rounded-md hover:bg-ink/20 border border-ink/20";

export default function NotFound() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="font-display text-6xl text-primary">404</p>
      <h1 className="font-display text-3xl text-denim mt-2">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-4 text-ink/80">
        It may have moved, or the link was mistyped. Here&apos;s where most Fellas head next:
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90"
        >
          HOME
        </Link>
        <Link href="/tour" className={btn}>2026 TOUR DATES</Link>
        <Link href="/plan-your-trip" className={btn}>PLAN A TRIP</Link>
        <Link href="/guides" className={btn}>FAN GUIDES</Link>
        <Link href="/shop" className={btn}>SHOP</Link>
      </div>
    </article>
  );
}
