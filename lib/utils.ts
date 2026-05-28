import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(dateStr: string, format: "short" | "long" = "short"): string {
  const d = new Date(dateStr + "T12:00:00Z");
  if (format === "long") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Convert a 24-hour "HH:MM" time string to a 12-hour AM/PM display.
 * "18:30" -> "6:30 PM", "07:00" -> "7 AM", "12:00" -> "12 PM".
 * Returns the input unchanged if it can't be parsed.
 */
export function formatTime(t?: string): string {
  if (!t) return "";
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return t;
  const h24 = Number(m[1]);
  const mins = Number(m[2]);
  if (Number.isNaN(h24) || Number.isNaN(mins)) return t;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return mins === 0 ? `${h12} ${period}` : `${h12}:${String(mins).padStart(2, "0")} ${period}`;
}

interface EventQueryInput {
  city: string;
  state: string;
  venue: string;
  tourType?: "headlining" | "support" | "festival";
  tour?: string;
  headliner?: string;
  date?: string;
}

/**
 * Build a query string for a ticket provider's search.
 * Strategy: pick the most-searchable artist/event name based on tour type.
 * - Headlining shows -> "Ella Langley {city}"
 * - Support shows -> "{Headliner} {city}" (Ella isn't the searchable headliner; tickets sold under the headliner)
 * - Festivals -> "{Festival name} {city}"
 * City alone (not city+state+venue) returns far more matches across providers.
 */
export function eventQuery(d: EventQueryInput): string {
  if (d.tourType === "support" && d.headliner) {
    return `${d.headliner} ${d.city}`;
  }
  if (d.tourType === "festival" && d.tour) {
    const cleanTour = d.tour.replace(/\s*\([^)]+\)/g, "").trim();
    return `${cleanTour} ${d.city}`;
  }
  return `Ella Langley ${d.city}`;
}

/**
 * Build a venue-based query - better for date-specific lookups since venue names
 * uniquely identify a show within a city.
 */
export function venueQuery(d: { venue: string; city: string }): string {
  return `${d.venue} ${d.city}`;
}
