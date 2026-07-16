import Link from "next/link";
import { Clock, Backpack, Info } from "lucide-react";
import type { NightPlan } from "@/lib/night-plan";

/**
 * Renders a NightPlan. Server-component friendly (no client JS) so the plan is
 * in the HTML at build time — which means Google indexes it and it loads instantly
 * on the phone someone is holding in a parking lot.
 */
export function NightPlanView({ plan, compact = false }: { plan: NightPlan; compact?: boolean }) {
  return (
    <div>
      {!compact && (
        <>
          <h2 className="font-display text-2xl md:text-3xl text-denim tracking-wide">
            {plan.headline.toUpperCase()}
          </h2>
          <p className="text-ink/75 mt-1 mb-5">{plan.subhead}</p>
        </>
      )}

      {/* Timeline */}
      <ol className="relative border-l-2 border-primary/30 ml-2 space-y-4 mb-6">
        {plan.timeline.map((step, i) => (
          <li key={i} className="ml-5">
            <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-primary" aria-hidden="true" />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span
                className={`font-display tracking-wide ${
                  step.emphasis ? "text-lg text-denim" : "text-base text-denim/80"
                }`}
              >
                {step.time ?? "—"}
              </span>
              <span className={`text-sm font-semibold ${step.emphasis ? "text-clay" : "text-ink/70"}`}>
                {step.label}
              </span>
            </div>
            <p className="text-sm text-ink/75 leading-relaxed mt-0.5">{step.detail}</p>
          </li>
        ))}
      </ol>

      {plan.timesUnconfirmed && (
        <p className="flex items-start gap-2 text-xs text-ink/70 bg-primary/10 border border-primary/30 rounded-md p-3 mb-6">
          <Info className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
          <span>
            We only publish times the venue has actually confirmed. Nothing here is invented &mdash;{" "}
            <Link href="/about" className="underline hover:text-primary">
              that&apos;s our editorial policy
            </Link>
            .
          </span>
        </p>
      )}

      {/* Pack list */}
      {!plan.isPast && plan.pack.length > 0 && (
        <div className="mb-6">
          <h3 className="flex items-center gap-2 font-display text-lg text-denim tracking-wide mb-2">
            <Backpack className="w-4 h-4 text-primary" aria-hidden="true" /> WHAT TO BRING
          </h3>
          <ul className="space-y-2">
            {plan.pack.map((p) => (
              <li key={p.name} className="text-sm">
                {p.shopSlug ? (
                  <Link href={`/shop/${p.shopSlug}`} className="font-semibold text-denim underline underline-offset-2 hover:text-primary">
                    {p.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-denim">{p.name}</span>
                )}
                <span className="text-ink/75"> &mdash; {p.why}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink/50 mt-2">
            Picks link to our shop, where the buy button goes to Amazon. Full list:{" "}
            <Link href="/guides/what-to-bring-ella-langley-concert" className="underline hover:text-primary">
              what to bring
            </Link>
            .
          </p>
        </div>
      )}

      {/* Notes */}
      {plan.notes.length > 0 && (
        <div className="mb-2">
          <h3 className="flex items-center gap-2 font-display text-lg text-denim tracking-wide mb-2">
            <Clock className="w-4 h-4 text-primary" aria-hidden="true" /> GOOD TO KNOW
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-ink/75">
            {plan.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {plan.lodgingPitch && <p className="text-sm text-ink/75 mt-4">{plan.lodgingPitch}</p>}
    </div>
  );
}
