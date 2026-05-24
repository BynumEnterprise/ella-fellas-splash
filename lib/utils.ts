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

export function eventQuery(d: { city: string; state: string; venue: string }): string {
  return `Ella Langley ${d.city} ${d.state} ${d.venue}`;
}
