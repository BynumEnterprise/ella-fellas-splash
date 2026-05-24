type TicketSource = "tickpick" | "vivid" | "seatgeek" | "stubhub" | "ticketmaster";

const IDS = {
  tickpick: process.env.NEXT_PUBLIC_TICKPICK_AFFILIATE_ID ?? "",
  vivid: process.env.NEXT_PUBLIC_VIVID_AFFILIATE_ID ?? "",
  seatgeek: process.env.NEXT_PUBLIC_SEATGEEK_AFFILIATE_ID ?? "",
  stubhub: process.env.NEXT_PUBLIC_STUBHUB_AFFILIATE_ID ?? "",
  ticketmaster: process.env.NEXT_PUBLIC_TICKETMASTER_AFFILIATE_ID ?? "",
  amazon: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG ?? "ellafellas-20",
  booking: process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID ?? "",
};

export function ticketUrl(query: string, source: TicketSource = "tickpick"): string {
  const q = encodeURIComponent(query);
  switch (source) {
    case "tickpick":
      return `https://www.tickpick.com/search?q=${q}${IDS.tickpick ? `&aff=${IDS.tickpick}` : ""}`;
    case "vivid":
      return `https://www.vividseats.com/search?searchTerm=${q}${IDS.vivid ? `&aff=${IDS.vivid}` : ""}`;
    case "seatgeek":
      return `https://seatgeek.com/search?search=${q}${IDS.seatgeek ? `&aid=${IDS.seatgeek}` : ""}`;
    case "stubhub":
      return `https://www.stubhub.com/find/s/?q=${q}${IDS.stubhub ? `&utm_source=${IDS.stubhub}` : ""}`;
    case "ticketmaster":
      return `https://www.ticketmaster.com/search?q=${q}${IDS.ticketmaster ? `&irgwc=1&clickid=${IDS.ticketmaster}` : ""}`;
  }
}

export function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${IDS.amazon}`;
}

export function amazonSearchUrl(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${IDS.amazon}`;
}

export function hotelUrl(city: string): string {
  const q = encodeURIComponent(city);
  return `https://www.booking.com/searchresults.html?ss=${q}${IDS.booking ? `&aid=${IDS.booking}` : ""}`;
}
