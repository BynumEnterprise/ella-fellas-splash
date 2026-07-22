"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, HelpCircle, ArrowDown, Ticket, Utensils, Beer, Car } from "lucide-react";
import type { TourDate } from "@/lib/types";
import { buildNightPlan, buildPlanBlocks, type Arrival, type Party, type PlanBlock } from "@/lib/night-plan";
import { parseShowRequest, type Intent, type Activities } from "@/lib/plan-parse";
import { NightPlanView } from "@/components/NightPlan";
import { NearbyPicks } from "@/components/NearbyPicks";
import { AskBox } from "@/components/AskBox";
import { NewsletterSignup } from "@/components/NewsletterSignup";


/** Fire-and-forget GA event. Analytics must never break the UI. */
function track(name: string, params: Record<string, unknown>) {
  try {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    if (typeof window !== "undefined" && w.gtag) w.gtag("event", name, params);
  } catch {
    // ignore
  }
}

const BLOCK_ICON = {
  tickets: Ticket,
  dinner: Utensils,
  drinks: Beer,
  parking: Car,
} as const;

/**
 * Ask in plain English -> a real show + what you asked for.
 *
 * Runs entirely in the browser off data we already ship: no API call, no cost
 * per visitor, and it cannot invent a show or a set time — it only ever resolves
 * to something already in tour-dates.json.
 *
 * IT ALWAYS ANSWERS. "I wanna go to the next show and get tickets and go out for
 * dinner before and then drinks after" used to bounce to the manual picker,
 * because nothing in it names a city. Now relative asks resolve, and anything we
 * still can't pin down falls back to the next show with the assumption stated
 * out loud and the alternatives one tap below the plan.
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
  const [assumed, setAssumed] = useState(false);
  const [understood, setUnderstood] = useState<string>("");
  const [candidates, setCandidates] = useState<TourDate[]>([]);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [activities, setActivities] = useState<Activities | null>(null);

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
    // THE most valuable signal on the site: the exact words fans use, plus how
    // confidently we answered. `plan_ask_assumed` is the content-gap feed now —
    // every row is a real fan question we had to guess our way through.
    track(r.assumed ? "plan_ask_assumed" : "plan_ask_resolved", {
      search_term: text.trim().slice(0, 100).toLowerCase(),
      intents: r.intents.join(",") || "none",
      confidence: r.confidence,
      ...(r.show ? { item_id: r.show.id } : {}),
      candidate_count: r.candidates.length,
    });
    setAsked(true);
    setResolved(!!r.show && !r.assumed);
    setAssumed(r.assumed);
    setUnderstood(r.understood);
    setCandidates(r.candidates);
    setIntents(r.intents);
    setActivities(r.activities);
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
  const blocks: PlanBlock[] = useMemo(
    () => (show && activities ? buildPlanBlocks(show, activities) : []),
    [show, activities],
  );

  // If they asked for something specific, lead with it. If they just picked a
  // show, show them everything.
  const want = {
    stay: activities ? activities.hotel || activities.none : intents.length === 0,
    food: activities ? activities.dinner || activities.drinks || activities.none : intents.length === 0,
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

  const pickAnother = (c: TourDate) => {
    setShowId(c.id);
    setCandidates([]);
    setAssumed(false);
    setResolved(true);
    setUnderstood(`${c.city}, ${c.state} — ${dateLabel(c)} at ${c.venue}.`);
    setScrollWanted(true);
    track("plan_show_select", { item_id: c.id, method: "candidate_chip" });
  };

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
              {show && !assumed ? (
                <>
                  Got it — <strong>{understood}</strong>
                </>
              ) : (
                understood
              )}
            </p>
            {show && (
              <p className="text-xs text-ink/60 mt-1">
                Not right? Change it below — your plan is already built.
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
            setAssumed(false);
            setUnderstood("");
            if (e.target.value) {
              setScrollWanted(true);
              track("plan_show_select", { item_id: e.target.value, method: "dropdown" });
            }
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
                onClick={() => { setArrival("local"); track("plan_option_select", { option_type: "arrival", option_value: "local" }); }}
                className={pill(arrival === "local")}
              >
                I live here
              </button>
              <button
                type="button"
                onClick={() => { setArrival("driving"); track("plan_option_select", { option_type: "arrival", option_value: "driving" }); }}
                className={pill(arrival === "driving")}
              >
                Driving in &amp; back
              </button>
              <button
                type="button"
                onClick={() => { setArrival("staying"); track("plan_option_select", { option_type: "arrival", option_value: "staying" }); }}
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
                onClick={() => { setParty("solo"); track("plan_option_select", { option_type: "party", option_value: "solo" }); }}
                className={pill(party === "solo")}
              >
                Just me
              </button>
              <button
                type="button"
                onClick={() => { setParty("couple"); track("plan_option_select", { option_type: "party", option_value: "couple" }); }}
                className={pill(party === "couple")}
              >
                Two of us
              </button>
              <button
                type="button"
                onClick={() => { setParty("group"); track("plan_option_select", { option_type: "party", option_value: "group" }); }}
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
              onChange={(e) => { setFirstShow(e.target.checked); track("plan_option_select", { option_type: "first_show", option_value: String(e.target.checked) }); }}
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

          {/* What they actually asked for, in the order the night happens. */}
          {blocks.length > 0 && (
            <div className="mb-6 space-y-3">
              {blocks.map((b) => {
                const Icon = BLOCK_ICON[b.key];
                return (
                  <div key={b.key} className="bg-paper border border-ink/15 rounded-lg p-4">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className="flex items-center gap-2 font-display text-lg text-denim tracking-wide">
                        <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                        {b.title.toUpperCase()}
                      </h3>
                      {b.time && (
                        <span className="font-display text-lg text-clay tracking-wide">{b.time}</span>
                      )}
                    </div>
                    <p className="text-sm text-ink/75 leading-relaxed mt-1">{b.body}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {b.links.map((l) =>
                        l.external ? (
                          <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-paper border border-ink/20 rounded-full text-denim hover:bg-ink/10"
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link
                            key={l.href}
                            href={l.href}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-primary text-paper font-semibold rounded-full hover:bg-primary/90"
                          >
                            {l.label} &rarr;
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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

          {/* The picker sits BELOW the plan, never instead of it. */}
          {(assumed || candidates.length > 0) && candidates.length > 0 && (
            <div className="mt-6 bg-ink/5 border border-ink/20 rounded-lg p-4">
              <p className="text-sm text-ink/80 mb-2">
                Not this one? Tap the show you meant and the whole plan rebuilds:
              </p>
              <div className="flex flex-wrap gap-2">
                {candidates.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => pickAnother(c)}
                    className="px-3 py-1.5 rounded-full text-xs border border-denim/30 text-denim hover:border-primary hover:text-primary"
                  >
                    {dateLabel(c)} · {c.city}, {c.state}
                  </button>
                ))}
              </div>
            </div>
          )}

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
