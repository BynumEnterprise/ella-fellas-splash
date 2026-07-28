"use client";

import { useState } from "react";
import {
  Ticket,
  Hotel,
  Car,
  Plane,
  Utensils,
  Beer,
  Compass,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { shopUrl } from "@/lib/merch-store";

export interface TripPlannerLinks {
  tickets: string;
  stay: string;
  hotels?: string;
  flights?: string;
  car?: string;
}

interface Props {
  city: string;
  venue: string;
  doors?: string;
  show?: string;
  timesConfirmed?: boolean;
  links: TripPlannerLinks;
  children?: React.ReactNode;
}

const chip =
  "px-3 py-2 text-sm rounded-full border transition-colors cursor-pointer select-none";
const chipOn = "bg-denim text-paper border-denim";
const chipOff = "bg-paper text-denim border-ink/25 hover:border-primary";
const cta =
  "inline-flex items-center gap-2 px-4 py-2.5 bg-denim text-paper font-display tracking-wide rounded-md hover:bg-denim/90";
const ctaPrimary =
  "inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-paper font-display tracking-wide rounded-md hover:bg-primary/90";

const GMAPS = "https://www.google.com/maps/search/?api=1&query=";

/**
 * In-page trip planner. The fan answers a few taps (how they are getting there,
 * whether they are staying over, what else they want to do) and we build the
 * night in place — no page change — surfacing only the booking links that match
 * their answers.
 *
 * Deliberately deterministic: it sequences the times this show actually has and
 * says so plainly when the venue has not confirmed them. It never invents set
 * times, restaurants or prices; food and bars point at live Google Maps.
 */
export function TripPlannerPanel({
  city,
  venue,
  doors,
  show,
  timesConfirmed,
  links,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [travel, setTravel] = useState<"driving" | "flying" | null>(null);
  const [overnight, setOvernight] = useState<boolean | null>(null);
  const [needTickets, setNeedTickets] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [drinks, setDrinks] = useState(false);
  const [gear, setGear] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const answered =
    travel !== null || overnight !== null || needTickets || dinner || drinks || gear;
  const near = (term: string) =>
    GMAPS + encodeURIComponent(term + " near " + venue + ", " + city);

  const steps: string[] = [];
  if (dinner) {
    steps.push(
      doors
        ? "Eat early — aim to be done by " + doors + (timesConfirmed ? "." : " (typical doors).")
        : "Eat early — plan to be done before doors.",
    );
  }
  steps.push(
    doors
      ? timesConfirmed
        ? "Doors " + doors + " — get in early; the first opener starts at the listed time."
        : "Doors are typically around " + doors + ", but " + venue + " has not confirmed this date. Trust your ticket."
      : venue + " has not posted times for this date yet — the time on your ticket is the one to trust.",
  );
  if (show) {
    steps.push(
      timesConfirmed
        ? "Show " + show + " — openers run in order, so be in position by then."
        : "Show time is typically around " + show + "; check your ticket before you leave.",
    );
  }
  steps.push(
    "Ella headlines after the openers — we do not print a stage time we cannot source.",
  );
  if (gear)
    steps.push(
      "Order your shirt now — it is printed to order, so give it a few days before show day.",
    );
  if (drinks) steps.push("Head somewhere close after the encore and let the lot clear out.");
  if (overnight) steps.push("Stay within ~1.5 miles so the post-show surge does not get you.");

  return (
    <section className="mb-8 bg-paper border-2 border-primary/40 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-primary/5"
      >
        <span>
          <span className="block text-xs uppercase tracking-wider text-clay font-medium">
            PLAN YOUR TRIP
          </span>
          <span className="block font-display text-2xl text-denim">
            Plan your night in {city}
          </span>
          <span className="block text-sm text-ink/75 mt-1">
            A few taps and we build the running order — tickets, stay and ride included.
          </span>
        </span>
        <ChevronDown
          className={"w-6 h-6 text-denim flex-shrink-0 transition-transform " + (open ? "rotate-180" : "")}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          <p className="font-display text-lg text-denim mb-2">Getting there</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => setTravel(travel === "driving" ? null : "driving")}
              className={chip + " " + (travel === "driving" ? chipOn : chipOff)}
            >
              Driving
            </button>
            <button
              type="button"
              onClick={() => setTravel(travel === "flying" ? null : "flying")}
              className={chip + " " + (travel === "flying" ? chipOn : chipOff)}
            >
              Flying in
            </button>
          </div>

          <p className="font-display text-lg text-denim mb-2">Staying over?</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => setOvernight(overnight === true ? null : true)}
              className={chip + " " + (overnight === true ? chipOn : chipOff)}
            >
              Staying the night
            </button>
            <button
              type="button"
              onClick={() => setOvernight(overnight === false ? null : false)}
              className={chip + " " + (overnight === false ? chipOn : chipOff)}
            >
              Heading home after
            </button>
          </div>

          <p className="font-display text-lg text-denim mb-2">Anything else?</p>
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              type="button"
              onClick={() => setNeedTickets((v) => !v)}
              className={chip + " " + (needTickets ? chipOn : chipOff)}
            >
              Still need tickets
            </button>
            <button
              type="button"
              onClick={() => setDinner((v) => !v)}
              className={chip + " " + (dinner ? chipOn : chipOff)}
            >
              Dinner before
            </button>
            <button
              type="button"
              onClick={() => setDrinks((v) => !v)}
              className={chip + " " + (drinks ? chipOn : chipOff)}
            >
              Drinks after
            </button>
            <button
              type="button"
              onClick={() => setGear((v) => !v)}
              className={chip + " " + (gear ? chipOn : chipOff)}
            >
              Need something to wear
            </button>
          </div>

          {answered && (
            <div className="border-t border-ink/15 pt-5">
              <h3 className="font-display text-xl text-denim mb-3">Your night in {city}</h3>
              <ol className="space-y-2 mb-5">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink/85">
                    <span className="font-display text-primary flex-shrink-0">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <div className="flex flex-wrap gap-2">
                {needTickets && (
                  <a
                    href={links.tickets}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    data-affiliate-source="planner-tickets"
                    className={ctaPrimary}
                  >
                    <Ticket className="w-4 h-4" /> GET TICKETS
                  </a>
                )}
                {overnight && (
                  <a
                    href={links.stay}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    data-affiliate-source="planner-stay"
                    className={cta}
                  >
                    <Hotel className="w-4 h-4" /> WHERE TO STAY
                  </a>
                )}
                {overnight && links.hotels && (
                  <a
                    href={links.hotels}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    data-affiliate-source="planner-hotels"
                    className={cta}
                  >
                    <Hotel className="w-4 h-4" /> HOTELS NEARBY
                  </a>
                )}
                {travel === "flying" && links.flights && (
                  <a
                    href={links.flights}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    data-affiliate-source="planner-flights"
                    className={cta}
                  >
                    <Plane className="w-4 h-4" /> FIND FLIGHTS
                  </a>
                )}
                {travel === "flying" && links.car && (
                  <a
                    href={links.car}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    data-affiliate-source="planner-car"
                    className={cta}
                  >
                    <Car className="w-4 h-4" /> RENTAL CAR
                  </a>
                )}
                {dinner && (
                  <a href={near("restaurants")} target="_blank" rel="noopener noreferrer" className={cta}>
                    <Utensils className="w-4 h-4" /> FOOD NEAR THE VENUE
                  </a>
                )}
                {drinks && (
                  <a href={near("bars")} target="_blank" rel="noopener noreferrer" className={cta}>
                    <Beer className="w-4 h-4" /> BARS NEARBY
                  </a>
                )}
                {gear && (
                  <a
                    href={shopUrl("/", "planner_gear_merch")}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-affiliate-source="planner_gear_merch"
                    className={cta}
                  >
                    <ShoppingBag className="w-4 h-4" /> SHOP ELLA FELLAS MERCH
                  </a>
                )}
              </div>

              <p className="text-xs italic text-ink/60 mt-4">
                Some links are affiliate links — we may earn a commission at no extra cost to you.
                Food and bar results are live Google Maps searches.
              </p>
            </div>
          )}

          {children && (
            <div className="border-t border-ink/15 mt-5 pt-4">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex items-center gap-1.5 text-sm font-display tracking-wide text-primary hover:underline"
              >
                <Compass className="w-4 h-4" />
                {showAll ? "HIDE FULL TRIP OPTIONS" : "SEE ALL TRIP OPTIONS (MAP, STAYS, MORE)"}
              </button>
              {showAll && <div className="mt-4">{children}</div>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
