import { NextResponse } from "next/server";
import { getAllTourDates } from "@/lib/data";
import { parseShowRequest } from "@/lib/plan-parse";
import { buildNightPlan, buildPlanBlocks } from "@/lib/night-plan";

export const dynamic = "force-dynamic";

/**
 * GET/POST /api/plan?q=...
 *
 * The same deterministic resolver the Plan My Night page runs in the browser,
 * exposed as JSON so we can prove in production that a real sentence produces a
 * real plan — and so the answer is testable without a headless browser.
 *
 * It cannot invent anything: every field below comes out of tour-dates.json or
 * is computed from that show's own doors/start times.
 */
function planFor(query: string) {
  const shows = getAllTourDates();
  const parsed = parseShowRequest(query, shows);

  if (!parsed.show) {
    return {
      ok: false as const,
      query,
      understood: parsed.understood,
      confidence: parsed.confidence,
      activities: parsed.activities,
      show: null,
      blocks: [],
      timeline: [],
      alternatives: [],
    };
  }

  const show = parsed.show;
  const plan = buildNightPlan(show, {
    arrival: parsed.activities.hotel ? "staying" : "driving",
    party: "couple",
    firstShow: false,
  });
  const blocks = buildPlanBlocks(show, parsed.activities);

  return {
    ok: true as const,
    query,
    understood: parsed.understood,
    confidence: parsed.confidence,
    assumed: parsed.assumed,
    activities: parsed.activities,
    show: {
      id: show.id,
      date: show.date,
      city: show.city,
      state: show.state,
      venue: show.venue,
      soldOut: show.soldOut,
      ticketUrl: `/tour/${show.id}`,
    },
    headline: plan.headline,
    subhead: plan.subhead,
    blocks,
    timeline: plan.timeline,
    notes: plan.notes,
    timesUnconfirmed: plan.timesUnconfirmed,
    alternatives: parsed.candidates.map((c) => ({
      id: c.id,
      date: c.date,
      city: c.city,
      state: c.state,
      venue: c.venue,
    })),
  };
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  return NextResponse.json(planFor(q));
}

export async function POST(request: Request) {
  let q = "";
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object" && typeof (body as { q?: unknown }).q === "string") {
      q = (body as { q: string }).q;
    }
  } catch {
    // empty or malformed body -> the resolver still returns the next show
  }
  return NextResponse.json(planFor(q));
}
