"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { TourDate } from "@/lib/types";
import { buildNightPlan, type Arrival, type Party } from "@/lib/night-plan";
import { NightPlanView } from "@/components/NightPlan";
import { NewsletterSignup } from "@/components/NewsletterSignup";

/**
 * Interactive night planner.
 *
 * Runs 100% in the browser off data we already ship — no API call, no inference,
 * no cost per visitor, and it physically cannot invent a set time.
 */
export function PlanBuilder({ shows, initialShowId }: { shows: TourDate[]; initialShowId?: string }) {
  const [showId, setShowId] = useState<string>(
    initialShowId && shows.some((s) => s.id === initialShowId) ? initialShowId : ""
  );
  const [arrival, setArrival] = useState<Arrival>("driving");
  const [party, setParty] = useState<Party>("couple");
  const [firstShow, setFirstShow] = useState(false);

  const show = useMemo(() => shows.find((s) => s.id === showId), [shows, showId]);
  const plan = useMemo(
    () => (show ? buildNightPlan(show, { arrival, party, firstShow }) : null),
    [show, arrival, party, firstShow]
  );

  const pill = (active: boolean) =>
    `px-3 py-2 rounded-full text-sm border transition ${
      active
        ? "bg-denim text-paper border-denim font-semibold"
        : "bg-paper text-denim border-ink/25 hover:border-primary"
    }`;

  return (
    <div>
      {/* Step 1 — which show */}
      <div className="mb-5">
        <label htmlFor="show" className="block font-display text-lg text-denim tracking-wide mb-1">
          1. WHICH SHOW ARE YOU GOING TO?
        </label>
        <select
          id="show"
          value={showId}
          onChange={(e) => setShowId(e.target.value)}
          className="w-full px-4 py-3 border-2 border-denim/30 focus:border-primary outline-none rounded-md bg-paper text-ink"
        >
          <option value="">Pick your show…</option>
          {shows.map((s) => (
            <option key={s.id} value={s.id}>
              {new Date(s.date + "T12:00:00Z").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              })}{" "}
              — {s.city}, {s.state} · {s.venue}
              {s.soldOut ? " (sold out)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2 — three questions */}
      {show && (
        <div className="mb-6 space-y-4">
          <div>
            <p className="font-display text-lg text-denim tracking-wide mb-2">2. HOW ARE YOU DOING THE NIGHT?</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setArrival("local")} className={pill(arrival === "local")}>
                I live here
              </button>
              <button type="button" onClick={() => setArrival("driving")} className={pill(arrival === "driving")}>
                Driving in &amp; back
              </button>
              <button type="button" onClick={() => setArrival("staying")} className={pill(arrival === "staying")}>
                Staying the night
              </button>
            </div>
          </div>

          <div>
            <p className="font-display text-lg text-denim tracking-wide mb-2">3. WHO&apos;S WITH YOU?</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setParty("solo")} className={pill(party === "solo")}>
                Just me
              </button>
              <button type="button" onClick={() => setParty("couple")} className={pill(party === "couple")}>
                Two of us
              </button>
              <button type="button" onClick={() => setParty("group")} className={pill(party === "group")}>
                A group
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={firstShow}
                onChange={(e) => setFirstShow(e.target.checked)}
                className="w-4 h-4 accent-[#b0562e]"
              />
              This is my first Ella show
            </label>
          </div>
        </div>
      )}

      {/* Result */}
      {show && plan && (
        <div className="border-t-2 border-primary/30 pt-6">
          <div className="bg-paper border border-ink/15 rounded-lg p-5">
            <NightPlanView plan={plan} />
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              href={`/tour/${show.id}`}
              className="inline-flex items-center px-5 py-3 bg-primary text-paper font-display text-lg tracking-wide rounded-md hover:bg-primary/90"
            >
              {show.soldOut ? "FIND RESALE TICKETS" : "GET TICKETS"} &rarr;
            </Link>
            <Link
              href="/guides/what-to-bring-ella-langley-concert"
              className="inline-flex items-center px-5 py-3 border-2 border-denim/30 text-denim font-display text-lg tracking-wide rounded-md hover:border-primary hover:text-primary"
            >
              FULL PACKING LIST
            </Link>
          </div>

          {/* The moment they care most = the moment to ask for the email. */}
          <div className="mt-6 bg-primary/10 border border-primary/40 rounded-lg p-5">
            <p className="font-display text-xl text-denim tracking-wide mb-1">
              WANT SET-TIME ALERTS FOR {show.city.toUpperCase()}?
            </p>
            <p className="text-sm text-ink/75 mb-3">
              Venues confirm the night-of running order late. We&apos;ll email you the moment set times
              for this show are posted — plus the game plan above. No spam, unsubscribe anytime.
            </p>
            <NewsletterSignup placement={`plan-${show.id}`} />
          </div>
        </div>
      )}

      {!show && (
        <p className="text-sm text-ink/60">
          Pick a show and we&apos;ll build the night around it — when to leave, what the gate will and won&apos;t
          let you carry, when she&apos;s actually on, and where to crash after.
        </p>
      )}
    </div>
  );
}
