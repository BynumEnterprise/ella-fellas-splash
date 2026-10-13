import Link from "next/link";
import { XCircle } from "lucide-react";
import type { TourDate } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/**
 * Clear CANCELED banner for a show that was officially called off. Rendered in
 * place of any ticket CTA, so a canceled date never sends a fan to buy seats.
 */
export function CanceledNotice({ d, className = "" }: { d: TourDate; className?: string }) {
  return (
    <section
      className={`bg-clay/10 border-2 border-clay rounded-lg p-5 ${className}`}
      role="status"
      data-show-status="canceled"
    >
      <p className="text-xs uppercase tracking-wider text-clay font-bold mb-1 inline-flex items-center gap-1.5">
        <XCircle className="w-4 h-4" aria-hidden="true" /> CANCELED
      </p>
      <h2 className="font-display text-2xl text-denim">
        The {d.city} show on {formatDate(d.date, "long")} was canceled
      </h2>
      <p className="text-sm text-ink/80 mt-1">
        {d.canceledReason ?? "This show did not go ahead."} Ticket holders should check the
        original point of purchase for refund details.
        {d.canceledSource && (
          <>
            {" "}
            <a
              href={d.canceledSource}
              target="_blank"
              rel="noopener nofollow"
              className="underline decoration-clay/50 underline-offset-2 hover:text-primary"
            >
              Source
            </a>
            .
          </>
        )}
      </p>
      <Link
        href="/tour"
        className="inline-flex items-center justify-center mt-4 px-5 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md shadow-sm hover:bg-primary/90"
      >
        SEE UPCOMING SHOWS &rarr;
      </Link>
    </section>
  );
}
