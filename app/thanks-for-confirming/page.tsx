import Link from "next/link";
export const metadata = { title: "Thanks for confirming" };
export default function ThanksPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl text-denim">You&apos;re officially in.</h1>
      <p className="mt-4 text-ink/80">
        First daily lands in your inbox tomorrow morning. See you there.
      </p>
      <Link href="/" className="inline-block mt-6 px-5 py-2.5 bg-primary text-ink font-display tracking-wide rounded-md hover:bg-primary-dark hover:text-paper">
        BACK TO HOME
      </Link>
    </article>
  );
}
