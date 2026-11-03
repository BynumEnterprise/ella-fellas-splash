import { NextResponse } from "next/server";
import { sendEmail, wrapEmail, unsubscribeUrl } from "@/lib/email";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

/**
 * GET /api/newsletter/confirm?token={confirm_token}
 *
 * Looks up the subscriber row by confirm_token, marks them confirmed (and
 * clears any earlier opt-out — clicking Confirm is a fresh, explicit opt-in),
 * then sends the welcome email. Redirects to /thanks-for-confirming on
 * success or failure — we don't expose internal errors to someone who
 * clicked an email link.
 */
function welcomeEmailHtml(unsubToken: string): string {
  const inner = `
    <h2 style="font-family:Impact,sans-serif;color:#2F4858;letter-spacing:0.04em;font-size:24px;margin:0 0 16px 0;">You're on the list.</h2>
    <p style="font-size:16px;line-height:1.55;margin:0 0 16px 0;">Welcome to the fellas. Here's what you signed up for:</p>
    <ul style="font-size:15px;line-height:1.7;padding-left:20px;margin:0 0 20px 0;">
      <li>Tour drops &mdash; new dates and presale alerts the minute they're announced, plus set times and setlists once she's back on the road</li>
      <li>Music and awards news &mdash; new songs, chart moves, CMA and ACM season</li>
      <li>Concert prep guides &mdash; what to wear, what to bring, what to expect</li>
    </ul>
    <p style="font-size:15px;line-height:1.55;margin:0 0 16px 0;">The Daily lands every weekday morning. Reply to any issue and a real person reads it.</p>
    <p style="font-size:15px;line-height:1.55;margin:0 0 24px 0;">No spam. Unsubscribe anytime with the link below. We're a fan site &mdash; not affiliated with Ella Langley, her label, or her management.</p>
    <p style="margin:0 0 8px 0;">
      <a href="${SITE_URL}/tour" style="display:inline-block;background:#2F4858;color:#FAF7F0;font-family:Impact,sans-serif;letter-spacing:0.08em;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;">SEE THE TOUR DATES &rarr;</a>
    </p>`;
  return wrapEmail({
    innerHtml: inner,
    unsubscribeUrl: unsubscribeUrl(unsubToken),
    preheader: "Welcome to the Fellas — you're confirmed",
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (token && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { getSupabaseServer } = await import("@/lib/supabase");
      const supabase = getSupabaseServer();

      const { data: row } = await supabase
        .from("subscribers")
        .select("email, unsubscribe_token, confirmed")
        .eq("confirm_token", token)
        .maybeSingle();

      if (row) {
        const { error } = await supabase
          .from("subscribers")
          .update({ confirmed: true, confirmed_at: new Date().toISOString(), unsubscribed_at: null })
          .eq("confirm_token", token);
        if (error) {
          console.error("Confirm update failed:", error);
        } else if (!row.confirmed && row.unsubscribe_token) {
          const result = await sendEmail({
            to: row.email,
            subject: "You're in. Welcome to Ella Fellas.",
            html: welcomeEmailHtml(row.unsubscribe_token),
            listUnsubscribeUrl: unsubscribeUrl(row.unsubscribe_token),
          });
          if (!result.ok) {
            console.error("Welcome email failed:", result.error);
          }
        }
      } else {
        console.warn("Confirm hit with unknown token");
      }
    } catch (err) {
      console.error("Confirm handler threw:", err);
    }
  } else {
    console.warn("Confirm hit without token or service role key");
  }

  return NextResponse.redirect(new URL("/thanks-for-confirming", SITE_URL), { status: 302 });
}
