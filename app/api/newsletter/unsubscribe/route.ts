import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/newsletter/unsubscribe?token={unsubscribe_token}
 *
 * GET  — the footer link. Marks the subscriber unsubscribed and redirects to
 *        /goodbye. A missing/unknown token still redirects: never surface
 *        internal errors to someone who clicked an email link.
 * POST — RFC 8058 one-click unsubscribe. Gmail/Yahoo/Apple POST to the URL in
 *        the List-Unsubscribe header with body `List-Unsubscribe=One-Click`
 *        when the user taps the native "Unsubscribe" button. Must complete
 *        the opt-out with NO further interaction and answer 2xx (no redirect,
 *        no confirmation page). Required by the Gmail/Yahoo bulk-sender rules.
 *
 * Both paths set confirmed=false AND unsubscribed_at=now(). The send route
 * filters on `unsubscribed_at is null`, so an opt-out survives even if an
 * operator later bulk-flips `confirmed` back to true.
 */
async function unsubscribe(token: string | null): Promise<"ok" | "unknown" | "skipped"> {
  if (!token || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Unsubscribe hit without token or service role key");
    return "skipped";
  }
  try {
    const { getSupabaseServer } = await import("@/lib/supabase");
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("subscribers")
      .update({ confirmed: false, unsubscribed_at: new Date().toISOString() })
      .eq("unsubscribe_token", token)
      .select("email");
    if (error) {
      console.error("Unsubscribe update failed:", error);
      return "skipped";
    }
    return data && data.length > 0 ? "ok" : "unknown";
  } catch (err) {
    console.error("Unsubscribe handler threw:", err);
    return "skipped";
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";
  await unsubscribe(url.searchParams.get("token"));
  return NextResponse.redirect(new URL("/goodbye", siteUrl), { status: 302 });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  let token = url.searchParams.get("token");
  // Some clients put the token in the form body instead of the query string.
  if (!token) {
    try {
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/x-www-form-urlencoded")) {
        const form = new URLSearchParams(await req.text());
        token = form.get("token");
      }
    } catch {
      /* ignore — fall through with no token */
    }
  }
  const result = await unsubscribe(token);
  // Always 200: mailbox providers treat non-2xx as "unsubscribe failed" and
  // may fall back to marking the message as spam instead.
  return NextResponse.json({ ok: true, result });
}
