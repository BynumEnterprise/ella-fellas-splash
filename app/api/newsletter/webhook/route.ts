import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

/**
 * POST /api/newsletter/webhook?key=<CRON_SECRET>
 *
 * Receives Resend webhook events and stores the EMAIL ones (email.sent,
 * email.delivered, email.opened, email.clicked, email.bounced, email.complained,
 * email.delivery_delayed, ...) in the email_events table so the owner's
 * analytics dashboard can read opens, clicks, and which links were clicked.
 *
 * The Resend webhook is also subscribed to non-email topics (contact.created,
 * contact.deleted, domain.*, ...). We do NOT store those — but we must still
 * ACKNOWLEDGE them with a 2xx. Returning 4xx made Resend flag the endpoint as
 * failing (Jul 31 2026 alert, "last response: 400") and Resend auto-disables
 * endpoints that keep failing. Rule for this route: the only non-2xx is 401 for
 * a bad key. Anything else we don't understand is logged and acknowledged.
 *
 * Auth: shared-secret `key` query param (same CRON_SECRET the mailer uses).
 * Storage-only endpoint — it never sends email and never mutates subscribers.
 */

/** Reachability probe — Resend/uptime checks get a plain 2xx, no secrets. */
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "resend-webhook" });
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = process.env.CRON_SECRET;
  if (!secret || searchParams.get("key") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    // Acknowledge anyway: a 4xx here would count against the endpoint's health.
    console.error("resend webhook: unparseable body");
    return NextResponse.json({ ok: true, ignored: "unparseable" });
  }

  // Resend event shape: { type: "email.opened", created_at, data: { email_id, to, subject, click?: { link } } }
  const evt = body as {
    type?: string;
    data?: {
      email_id?: string;
      to?: string[] | string;
      email?: string;
      subject?: string;
      click?: { link?: string };
    };
  };

  // Non-email topics (contact.*, domain.*) are subscribed on this endpoint but
  // aren't email analytics — acknowledge without storing.
  if (!evt?.type || !evt.type.startsWith("email.")) {
    return NextResponse.json({ ok: true, ignored: evt?.type ?? "no type" });
  }

  try {
    const to = evt.data?.to;
    const recipient = Array.isArray(to) ? to[0] : (to ?? evt.data?.email ?? null);

    const supabase = getSupabaseServer();
    const { error } = await supabase.from("email_events").insert({
      event_type: evt.type.replace("email.", ""),
      recipient: recipient ?? null,
      email_subject: evt.data?.subject ?? null,
      link_url: evt.data?.click?.link ?? null,
      resend_email_id: evt.data?.email_id ?? null,
      raw: evt,
    });
    if (error) throw error;
  } catch (e) {
    // Never make Resend retry-storm us for a storage hiccup; log and accept.
    console.error("email_events insert failed", e);
  }

  return NextResponse.json({ ok: true });
}
