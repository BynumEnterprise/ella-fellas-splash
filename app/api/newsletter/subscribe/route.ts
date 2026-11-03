import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail, wrapEmail, confirmUrl, unsubscribeUrl } from "@/lib/email";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email().max(200),
  city: z.string().max(80).optional(),
  state: z.string().max(40).optional(),
  source: z.string().max(40).optional(),
  /** Honeypot — real visitors never see or fill this. */
  website: z.string().max(200).optional(),
});

/**
 * POST /api/newsletter/subscribe
 *
 * Double opt-in: upsert the subscriber as unconfirmed, then send the
 * confirmation email containing the confirm link. The subscriber is not
 * counted until they click it (see /api/newsletter/confirm, which flips
 * `confirmed` to true, clears any prior opt-out, and sends the welcome email).
 *
 * Re-subscribing with the same email refreshes the confirm token and
 * re-sends the confirmation email — the recovery path for people whose
 * original confirm email never arrived. A previously UNSUBSCRIBED address
 * can come back the same way; the opt-out only clears when they confirm.
 *
 * Abuse controls (best-effort, no schema changes):
 *   - honeypot field `website`: filled → pretend success, do nothing
 *   - per-IP limiter: 5 signups / 10 min per serverless instance
 *   - per-address cooldown: if a confirmation email went to this address in
 *     the last 10 minutes (email_events), don't send another one — stops the
 *     endpoint being used to spam a third party with confirm emails.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  }
  return false;
}

function confirmationEmailHtml(confirmToken: string, unsubscribeToken: string): string {
  const inner = `
    <h2 style="font-family:Impact,sans-serif;color:#2F4858;letter-spacing:0.04em;font-size:24px;margin:0 0 16px 0;">One click and you're in.</h2>
    <p style="font-size:16px;line-height:1.55;margin:0 0 16px 0;">Tap the button to confirm your email and start getting the Ella Fellas Daily &mdash; tour and presale alerts, chart and awards news, setlists, and a song every morning.</p>
    <p style="margin:0 0 24px 0;">
      <a href="${confirmUrl(confirmToken)}" style="display:inline-block;background:#2F4858;color:#FAF7F0;font-family:Impact,sans-serif;letter-spacing:0.08em;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;">CONFIRM MY EMAIL &rarr;</a>
    </p>
    <p style="font-size:13px;line-height:1.55;color:rgba(26,26,26,0.6);margin:0 0 12px 0;">If the button doesn't work, paste this into your browser:<br />${confirmUrl(confirmToken)}</p>
    <p style="font-size:13px;line-height:1.55;color:rgba(26,26,26,0.6);margin:0;">Didn't sign up? Ignore this email and you won't hear from us again.</p>`;
  return wrapEmail({
    innerHtml: inner,
    unsubscribeUrl: unsubscribeUrl(unsubscribeToken),
    preheader: "Confirm your email to join the Fellas",
  });
}

const OK_MESSAGE = "You're on the list. Check your inbox to confirm.";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    const { email, city, state, source, website } = parsed.data;

    // Honeypot: bots fill every field. Pretend success, send nothing.
    if (website) return NextResponse.json({ message: OK_MESSAGE });

    const ip =
      (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many signups from this connection. Try again in a few minutes." }, { status: 429 });
    }

    const normalizedEmail = email.toLowerCase();
    const confirmToken = crypto.randomUUID();
    const unsubscribeToken = crypto.randomUUID();

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { getSupabaseServer } = await import("@/lib/supabase");
      const supabase = getSupabaseServer();

      const { data: existing } = await supabase
        .from("subscribers")
        .select("unsubscribe_token, confirmed, unsubscribed_at")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (existing?.confirmed && !existing.unsubscribed_at) {
        return NextResponse.json({ message: "You're already on the list." });
      }

      // Cooldown: one confirmation email per address per 10 minutes.
      const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
      const { count: recentConfirms } = await supabase
        .from("email_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "sent")
        .eq("recipient", normalizedEmail)
        .ilike("email_subject", "Confirm your email%")
        .gte("created_at", since);
      if ((recentConfirms ?? 0) > 0) {
        return NextResponse.json({ message: OK_MESSAGE });
      }

      const finalUnsubToken = existing?.unsubscribe_token ?? unsubscribeToken;

      const { error } = await supabase.from("subscribers").upsert(
        {
          email: normalizedEmail,
          city: city ?? null,
          state: state ?? null,
          confirmed: false,
          confirm_token: confirmToken,
          unsubscribe_token: finalUnsubToken,
          source: source ?? "unknown",
        },
        { onConflict: "email" }
      );
      if (error) {
        console.error("Supabase subscriber upsert failed:", error);
        return NextResponse.json(
          { error: "Something went wrong. Try again?" },
          { status: 500 }
        );
      }

      const result = await sendEmail({
        to: normalizedEmail,
        subject: "Confirm your email — Ella Fellas",
        html: confirmationEmailHtml(confirmToken, finalUnsubToken),
        listUnsubscribeUrl: unsubscribeUrl(finalUnsubToken),
      });
      if (!result.ok) {
        console.error("Confirmation email failed:", result.status, result.error);
        // 403 = API key not allowed for this From domain, 429 = rate limited.
        // Tell the visitor honestly rather than "check your inbox" for an
        // email that never left.
        return NextResponse.json(
          { error: "We couldn't send the confirmation email right now. Please try again in a minute." },
          { status: 502 }
        );
      }
    } else {
      console.log(`[NEWSLETTER SIGNUP] email=${normalizedEmail} city=${city ?? ""} source=${source ?? ""}`);
    }

    return NextResponse.json({ message: OK_MESSAGE });
  } catch (err) {
    console.error("Newsletter signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again?" },
      { status: 500 }
    );
  }
}
