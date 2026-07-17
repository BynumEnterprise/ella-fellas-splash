"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, HelpCircle, ArrowDown } from "lucide-react";
import type { TourDate } from "@/lib/types";
import { buildNightPlan, type Arrival, type Party } from "@/lib/night-plan";
import { parseShowRequest, type Intent } from "@/lib/plan-parse";
import { NightPlanView } from "@/components/NightPlan";
import { NearbyPicks } from "@/components/NearbyPicks";
import { AskBox } from "@/components/AskBox";
import { NewsletterSignup } from "@/components/NewsletterSignup";

/**
 * Ask in plain English -> a real show + what you asked for.
 *
 * Runs entirely in the browser off data we already ship: no API call, no cost
 * per visitor, and it cannot invent a show or a set time — it only ever resolves
 * to something already in tour-dates.json, or admits it couldn't and asks.
 */
export function PlanBuilder({
  shows,
  initialShowId,
}: {
  shows: TourDate[];
  initialShowId?: string;
}) {
  const [showId, setShowId] = useState<string>(
    initialShowId && shows.some((s) => s.id === initialShowId)
      ? initialShowId
      : "",
  );
  const [arrival, setArrival] = useState<Arrival>("driving");
  const [party, setParty] = useState<Party>("couple");
  const [firstShow, setFirstShow] = useState(false);
  const [asked, setAsked] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [understood, setUnderstood] = useState<string>("");
  const [candidates, setCandidates] = useState<TourDate[]>([]);
  const [intents, setIntents] = useState<Intent[]>([]);

  // THE BUG THIS FIXES: picking a show built a correct plan ~2,000px BELOW the
  // fold, so nothing moved in the viewport and the planner read as broken. The
  // answer now comes to the visitor instead of waiting to be scrolled to.
  const planRef = useRef<HTMLDivElement>(null);
  const [scrollWanted, setScrollWanted] = useState(false);

  useEffect(() => {
    if (!scrollWanted || !planRef.current) return;
    setScrollWanted(false);
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    planRef.current.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [scrollWanted, showId]);

  function handleAsk(text: string) {
    const r = parseShowRequest(text, shows);
    setAsked(true);
    setResolved(!!r.show);
    setUnderstood(r.understood);
    setCandidates(r.candidates);
    setIntents(r.intents);
    // Clear the previous show unless we resolved a new one. Leaving it up would
    // print a full Tulsa plan under the words "we couldn't match that" — the exact
    // kind of confident-but-wrong answer this whole thing exists to avoid.
    setShowId(r.show ? r.show.id : "");
    // Their words drive the follow-ups too — but they can still override below.
    if (r.intents.includes("stay")) setArrival("staying");
    else if (r.intents.includes("parking")) setArrival("driving");
    if (r.show) setScrollWanted(true);
  }

  const show = useMemo(
    () => shows.find((s) => s.id === showId),
    [shows, showId],
  );
  const plan = useMemo(
    () => (show ? buildNightPlan(show, { arrival, party, firstShow }) : null),
    [show, arrival, party, firstShow],
  );

  // If they asked for something specific, lead with it. If they just picked a
  // show, show them everything.
  const want = {
    stay: intents.includes("stay") || intents.length === 0,
    food: intents.includes("food") || intents.length === 0,
  };

  const pill = (active: boolean) =>
    `px-3 py-2 rounded-full text-sm border transition ${
      active
        ? "bg-denim text-paper border-denim font-semibold"
        : "bg-paper text-denim border-ink/25 hover:border-primary"
    }`;

  const dateLabel = (s: TourDate) =>
    new Date(s.date + "T12:00:00Z").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

  return (
    <div>
      <AskBox onAsk={handleAsk} />

      {/* What we understood — always visible, always correctable. */}
      {asked && understood && (
        <div
          className={`mt-4 flex items-start gap-2 rounded-md p-3 text-sm border ${
            resolved
              ? "bg-primary/10 border-primary/40"
              : "bg-ink/5 border-ink/20"
          }`}
        >
          {resolved ? (
            <CheckCircle2
              className="w-4 h-4 mt-0.5 text-primary flex-shrink-0"
              aria-hidden="true"
            />
          ) : (
            <HelpCircle
              className="w-4 h-4 mt-0.5 text-clay flex-shrink-0"
              aria-hidden="true"
            />
          )}
          <div>
            <p className="text-ink/85">
              {show ? (
                <>
                  Got it — <strong>{understood}</strong>
                </>
              ) : (
                understood
              )}
            </p>
            {candidates.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {candidates.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setShowId(c.id);
                      setCandidates([]);
                      setUnderstood(
                        `${c.city}, ${c.state} — ${dateLabel(c)} at ${c.venue}.`,
                      );
                      setScrollWanted(true);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs border border-denim/30 text-denim hover:border-primary hover:text-primary"
                  >
                    {dateLabel(c)} · {c.city}, {c.state}
                  </button>
                ))}
              </div>
            )}
            {show && (
              <p className="text-xs text-ink/60 mt-1">
                Not right? Change it below.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Show picker — the fallback and the correction path. */}
      <div className="mt-5 mb-5">
        <label
          htmlFor="show"
          className="block font-display text-lg text-denim tracking-wide mb-1"
        >
          {asked ? "OR PICK YOUR SHOW" : "OR JUST PICK YOUR SHOW"}
        </label>
        <select
          id="show"
          value={showId}
          onChange={(e) => {
            setShowId(e.target.value);
            setCandidates([]);
            setUnderstood("");
            if (e.target.value) setScrollWanted(true);
          }}
          className="w-full px-4 py-3 border-2 border-denim/30 focus:border-primary outline-none rounded-md bg-paper text-ink"
        >
          <option value="">Pick your show…</option>
          {shows.map((s) => (
            <option key={s.id} value={s.id}>
              {dateLabel(s)} — {s.city}, {s.state} · {s.venue}
              {s.soldOut ? " (sold out)" : ""}
            </option>
          ))}
        </select>
      </div>

      {show && (
        <div className="mb-6 space-y-4">
          <div>
            <p className="font-display text-lg text-denim tracking-wide mb-2">
              HOW ARE YOU DOING THE NIGHT?
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setArrival("local")}
                className={pill(arrival === "local")}
              >
                I live here
              </button>
              <button
                type="button"
                onClick={() => setArrival("driving")}
                className={pill(arrival === "driving")}
              >
                Driving in &amp; back
              </button>
              <button
                type="button"
                onClick={() => setArrival("staying")}
                className={pill(arrival === "staying")}
              >
                Staying the night
              </button>
            </div>
          </div>
          <div>
            <p className="font-display text-lg text-denim tracking-wide mb-2">
              WHO&apos;S WITH YOU?
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setParty("solo")}
                className={pill(party === "solo")}
              >
                Just me
              </button>
              <button
                type="button"
                onClick={() => setParty("couple")}
                className={pill(party === "couple")}
              >
                Two of us
              </button>
              <button
                type="button"
                onClick={() => setParty("group")}
                className={pill(party === "group")}
              >
                A group
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={firstShow}
              onChange={(e) => setFirstShow(e.target.checked)}
              className="w-4 h-4 accent-[#b0562e]"
            />
            This is my first Ella show
          </label>

          {/* There is no "submit" on purpose — the plan below updates as you tap.
              Say so, and give a way back down to it. */}
          <button
            type="button"
            onClick={() => setScrollWanted(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-denim underline decoration-primary/60 underline-offset-4 hover:text-primary"
          >
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
            Your plan updates as you tap — jump to it
          </button>
        </div>
      )}

      {show && plan && (
        <div ref={planRef} className="border-t-2 border-primary/30 pt-6 scroll-mt-24">
          <h2 className="font-display text-2xl md:text-3xl text-denim tracking-wide mb-1">
            YOUR NIGHT IN {show.city.toUpperCase()}
          </h2>
          <p className="text-sm text-ink/70 mb-4">
            {dateLabel(show)} · {show.venue} — built from this show&apos;s real doors and
            listed start. Change anything above and this updates instantly.
          </p>
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

          {(want.stay || want.food) && (
            <div className="mt-6 bg-paper border border-ink/15 rounded-lg p-5">
              <NearbyPicks d={show} want={want} />
            </div>
          )}

          <div className="mt-6 bg-primary/10 border border-primary/40 rounded-lg p-5">
            <p className="font-display text-xl text-denim tracking-wide mb-1">
              WANT SET-TIME ALERTS FOR {show.city.toUpperCase()}?
            </p>
            <p className="text-sm text-ink/75 mb-3">
              Venues confirm the night-of running order late. We&apos;ll email
              you the moment set times for this show are posted — plus the game
              plan above. No spam, unsubscribe anytime.
            </p>
            <NewsletterSignup placement={`plan-${show.id}`} />
          </div>
        </div>
      )}

      {!show && !asked && (
        <p className="text-sm text-ink/60">
          Tell us the city and day and we&apos;ll build the night around it —
          when to leave, what the gate will and won&apos;t let you carry, when
          she&apos;s actually on, where to eat, and where to crash.
        </p>
      )}
    </div>
  );
}
