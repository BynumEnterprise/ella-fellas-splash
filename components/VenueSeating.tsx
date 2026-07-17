import { Armchair, Eye, PiggyBank, AlertTriangle } from "lucide-react";
import type { TourDate } from "@/lib/types";
import { seatingForShow } from "@/lib/venue-seating";

const ICONS = [Armchair, Eye, PiggyBank];

/**
 * Venue-specific "where to sit" block for a show — real sections/rows for THIS
 * building, not generic advice. Data lives in lib/venue-seating.ts and every
 * section id there was verified against a published seating chart.
 */
export function VenueSeating({ d }: { d: TourDate }) {
  const seating = seatingForShow(d);
  if (!seating) return null;

  return (
    <div className="mt-5 border border-ink/15 rounded-lg bg-paper p-4">
      <h3 className="font-display text-lg text-denim tracking-wide">
        WHERE TO SIT AT {d.venue.toUpperCase()}
      </h3>
      <p className="text-xs text-ink/60 mt-1 mb-3">{seating.layout}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {seating.picks.map((p, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div key={p.label} className="border border-ink/10 rounded-md p-3">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-clay font-medium">
                <Icon className="w-3.5 h-3.5" aria-hidden="true" /> {p.label}
              </p>
              <p className="font-medium text-denim text-sm mt-1">{p.sections}</p>
              <p className="text-xs text-ink/70 mt-1 leading-relaxed">{p.note}</p>
            </div>
          );
        })}
      </div>
      {seating.headsUp && (
        <p className="flex items-start gap-1.5 text-xs text-ink/75 mt-3">
          <AlertTriangle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <span>{seating.headsUp}</span>
        </p>
      )}
      <p className="text-[11px] text-ink/50 mt-3">
        Sections verified against {d.venue}&apos;s published seating chart. Tours can tweak the
        stage layout &mdash; give the seat map one last look at checkout.
      </p>
    </div>
  );
}
