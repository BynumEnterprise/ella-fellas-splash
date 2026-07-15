import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

/**
 * POST /api/newsletter/webhook?key=<CRON_SECRET>
 *
 * Receives Resend webhook events (email.sent, email.delivered, email.opened,
 * email.clicked, email.bounced, email.complained) and stores them in the
 * email_events table so the owner's analytics dashboard can read opens,
 * clicks, and which links were clicked, per send.
 *
 * Auth: shared-secret `key` query param (same CRON_SECRET the mailer uses).
 * Storage-only endpoint — it never sends email and never mutates subscribers.
 */
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
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  // Resend event shape: { type: "email.opened", created_at, data: { email_id, to: [..], subject, click?: { link } } }
  const evt = body as {
    type?: string;
    data?: {
      email_id?: string;
      to?: string[];
      subject?: string;
      click?: { link?: string };
    };
  };
  if (!evt?.type || !evt.type.startsWith("email.")) {
    return NextResponse.json({ error: "not an email event" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from("email_events").insert({
      event_type: evt.type.replace("email.", ""),
      recipient: evt.data?.to?.[0] ?? null,
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
