import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * POST /api/newsletter/webhook?key=<CRON_SECRET>
 *
 * Receives Resend webhook events and stores the EMAIL ones (email.sent,
 * email.delivered, email.opened, email.clicked, email.bounced, email.complained,
 * email.delivery_delayed, ...) in the email_events table so the owner's
 * analytics dashboard can read opens, clicks, and which links were clicked.
 *
 * SCOPE: the Resend account also sends for other Bynum properties (Colorado
 * Elopement Guide, Rennt/Renterra) and Resend webhooks are account-wide, so
 * this endpoint receives their events too. Only events whose `from` is an
 * @ellafellas.com sender are stored — before 2026-11-02 the table was polluted
 * with ~1,300 foreign events/month, which skewed bounce rates.
 *
 * LIST HYGIENE (added 2026-11-02): a complaint or a permanent (hard) bounce
 * marks the subscriber unsubscribed on the spot — the Gmail/Yahoo bulk-sender
 * rules require complaint rates under 0.1-0.3%, and continuing to mail a
 * complainer is the fastest way to get the domain throttled. Repeated
 * transient bounces (3+ in 30 days — typo domains like gmail.con, dead or
 * full mailboxes) are treated the same way.
 *
 * The Resend webhook is also subscribed to non-email topics (contact.created,
 * contact.deleted, domain.*, ...). We do NOT store those — but we must still
 * ACKNOWLEDGE them with a 2xx. Returning 4xx made Resend flag the endpoint as
 * failing (Jul 31 2026 alert, "last response: 400") and Resend auto-disables
 * endpoints that keep failing. Rule for this route: the only non-2xx is 401 for
 * a bad key. Anything else we don't understand is logged and acknowledged.
 *
 * Auth: shared-secret `key` query param (same CRON_SECRET the mailer uses).
 */

/** Reachability probe — Resend/uptime checks get a plain 2xx, no secrets. */
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "resend-webhook" });
}

type ResendEvent = {
  type?: string;
  data?: {
    email_id?: string;
    from?: string;
    to?: string[] | string;
    email?: string;
    subject?: string;
    click?: { link?: string };
    bounce?: { type?: string; subType?: string; message?: string };
  };
};

const TRANSIENT_BOUNCE_LIMIT = 3; // per recipient per 30 days

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

  const evt = body as ResendEvent;

  // Non-email topics (contact.*, domain.*) are subscribed on this endpoint but
  // aren't email analytics — acknowledge without storing.
  if (!evt?.type || !evt.type.startsWith("email.")) {
    return NextResponse.json({ ok: true, ignored: evt?.type ?? "no type" });
  }

  // Foreign senders on the shared Resend account: acknowledge, don't store.
  const from = (evt.data?.from ?? "").toLowerCase();
  if (from && !from.includes("@ellafellas.com")) {
    return NextResponse.json({ ok: true, ignored: "foreign-sender" });
  }

  const to = evt.data?.to;
  const recipientRaw = Array.isArray(to) ? to[0] : (to ?? evt.data?.email ?? null);
  // Resend echoes display-name forms ("Name <a@b.c>") for some senders; keep
  // the bare address so joins against subscribers.email work.
  const recipient = recipientRaw
    ? (recipientRaw.match(/<([^>]+)>/)?.[1] ?? recipientRaw).trim().toLowerCase()
    : null;
  const eventType = evt.type.replace("email.", "");

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from("email_events").insert({
      event_type: eventType,
      recipient,
      email_subject: evt.data?.subject ?? null,
      link_url: evt.data?.click?.link ?? null,
      resend_email_id: evt.data?.email_id ?? null,
      raw: evt,
    });
    if (error) throw error;

    // --- suppression ---
    if (recipient && (eventType === "complained" || eventType === "bounced")) {
      const bounceType = (evt.data?.bounce?.type ?? "").toLowerCase();
      let suppress = eventType === "complained" || bounceType.startsWith("permanent");
      let reason = eventType === "complained" ? "complaint" : "hard-bounce";

      if (!suppress && eventType === "bounced") {
        const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
        const { count } = await supabase
          .from("email_events")
          .select("id", { count: "exact", head: true })
          .eq("event_type", "bounced")
          .eq("recipient", recipient)
          .gte("created_at", since);
        if ((count ?? 0) >= TRANSIENT_BOUNCE_LIMIT) {
          suppress = true;
          reason = `${count} transient bounces in 30d`;
        }
      }

      if (suppress) {
        const { data } = await supabase
          .from("subscribers")
          .update({ confirmed: false, unsubscribed_at: new Date().toISOString() })
          .eq("email", recipient)
          .is("unsubscribed_at", null)
          .select("email");
        if (data && data.length > 0) {
          console.warn(`newsletter: suppressed ${recipient} (${reason})`);
        }
      }
    }
  } catch (e) {
    // Never make Resend retry-storm us for a storage hiccup; log and accept.
    console.error("email_events insert failed", e);
  }

  return NextResponse.json({ ok: true });
}
