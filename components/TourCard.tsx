import Link from "next/link";
import { MapPin, Calendar, Ticket } from "lucide-react";
import type { TourDate } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function TourCard({ d }: { d: TourDate }) {
  return (
    <Link
      href={`/tour/${d.id}`}
      className="block bg-paper border border-ink/10 rounded-lg p-5 hover:border-primary hover:shadow-md transition-all border-l-4 border-l-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-clay font-medium">
            <Calendar className="w-3 h-3" />
            {formatDate(d.date, "long")}
          </div>
          <h3 className="text-xl font-display mt-1.5 text-denim">
            {d.city}, {d.state}
          </h3>
          <p className="text-sm text-ink/70 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {d.venue}
          </p>
          <p className="text-xs text-ink/60 mt-2">{d.tour}</p>
        </div>
        <div className="text-right">
          {d.soldOut ? (
            <span className="inline-block bg-clay text-paper text-xs uppercase font-bold px-2 py-1 rounded-full">
              Sold Out
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
              <Ticket className="w-3.5 h-3.5" />
              Tickets
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
