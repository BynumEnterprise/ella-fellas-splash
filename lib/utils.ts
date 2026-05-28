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

interface EventQueryInput {
  city: string;
  state: string;
  venue: string;
  tourType?: "headlining" | "support" | "festival";
  tour?: string;
  headliner?: string;
  date?: string;
}

export function eventQuery(d: EventQueryInput): string {
  if (d.tourType === "support" && d.headliner) return `${d.headliner} ${d.city}`;
  if (d.tourType === "festival" && d.tour) return `${d.tour.replace(/\s*\([^)]+\)/g, "").trim()} ${d.city}`;
  return `Ella Langley ${d.city}`;
}

export function venueQuery(d: { venue: string; city: string }): string {
  return `${d.venue} ${d.city}`;
}
