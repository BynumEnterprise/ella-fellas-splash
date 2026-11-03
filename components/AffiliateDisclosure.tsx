export function AffiliateDisclosure() {
  return (
    <p className="text-xs italic text-ink/60 bg-ink/5 border border-ink/10 rounded p-3 my-6">
      This page contains affiliate links. If you buy through them, we may earn a small commission at
      no extra cost to you. As an Amazon Associate I earn from qualifying purchases. We only link to
      ticket marketplaces, hotels, and gear we&apos;d actually recommend to a friend.{" "}
      <a href="/disclaimer" className="underline hover:text-primary not-italic">
        Full disclosure
      </a>
    </p>
  );
}
