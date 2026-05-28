import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  city: z.string().max(80).optional(),
  state: z.string().max(40).optional(),
  source: z.string().max(40).optional(),
});

// Sending from bunummailer.com (verified domain) for now.
// Switch to info@ellafellas.com once Resend fully verifies ellafellas.com (requires adding the MX record at Namecheap).
const FROM_ADDRESS = "Ella Fellas <hello@bynummailer.com>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

/**
 * Send a welcome email via Resend. Fire-and-forget — we don't block the
 * signup response on email delivery. Errors are logged but never thrown.
 */
async function sendWelcomeEmail(toEmail: string, unsubscribeToken: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping welcome email");
    return;
  }
  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FAF7F0;font-family:-apple-system,system-ui,sans-serif;color:#1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F0;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid rgba(26,26,26,0.1);border-radius:8px;padding:32px;">
        <tr><td>
          <h1 style="font-family:Impact,sans-serif;color:#C89B3C;letter-spacing:0.08em;font-size:32px;margin:0 0 4px 0;">ELLA FELLAS</h1>
          <p style="color:rgba(26,26,26,0.6);font-size:13px;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 24px 0;">The unofficial Ella Langley superfan HQ</p>
          <h2 style="font-family:Impact,sans-serif;color:#2F4858;letter-spacing:0.04em;font-size:24px;margin:0 0 16px 0;">You're on the list.</h2>
          <p style="font-size:16px;line-height:1.55;margin:0 0 16px 0;">Welcome to the fellas. Here's what you signed up for:</p>
          <ul style="font-size:15px;line-height:1.7;padding-left:20px;margin:0 0 20px 0;">
            <li>Tour drops &mdash; new dates, presales, and where Ella's playing near you</li>
            <li>Album updates &mdash; releases, singles, music videos</li>
            <li>Concert prep guides &mdash; what to wear, what to bring, what to expect</li>
          </ul>
          <p style="font-size:15px;line-height:1.55;margin:0 0 24px 0;">No spam. Unsubscribe anytime with the link below. We're a fan site &mdash; not affiliated with Ella Langley, her label, or her management.</p>
          <p style="margin:0 0 8px 0;">
            <a href="${SITE_URL}/tour" style="display:inline-block;background:#2F4858;color:#FAF7F0;font-family:Impact,sans-serif;letter-spacing:0.08em;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;">SEE THE TOUR &rarr;</a>
          </p>
        </td></tr>
      </table>
      <p style="color:rgba(26,26,26,0.45);font-size:12px;line-height:1.6;margin:24px 0 0 0;max-width:560px;">
        You got this email because you signed up at <a href="${SITE_URL}" style="color:rgba(26,26,26,0.55);">ellafellas.com</a>.<br />
        Not what you wanted? <a href="${unsubscribeUrl}" style="color:rgba(26,26,26,0.55);">Unsubscribe instantly</a>.<br />
        Bynum Enterprises &middot; San Bernardino, CA
      </p>
    </td></tr>
  </table>
</body>
</html>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [toEmail],
        subject: "You're in. Welcome to Ella Fellas.",
        html,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`Resend send failed (${res.status}):`, errText);
    }
  } catch (err) {
    console.error("Resend send threw:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    const { email, city, source } = parsed.data;

    const unsubscribeToken = crypto.randomUUID();

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { getSupabaseServer } = await import("@/lib/supabase");
      const supabase = getSupabaseServer();
      const confirmToken = crypto.randomUUID();
      const { error } = await supabase.from("subscribers").upsert(
        {
          email: email.toLowerCase(),
          city: city ?? null,
          state: null,
          confirmed: false,
          confirm_token: confirmToken,
          unsubscribe_token: unsubscribeToken,
          source: source ?? "unknown",
        },
        { onConflict: "email" }
      );
      if (error) {
        console.error("Supabase subscriber insert failed:", error);
      }
    } else {
      console.log(`[NEWSLETTER SIGNUP] email=${email} city=${city ?? ""} source=${source ?? ""}`);
    }

    void sendWelcomeEmail(email.toLowerCase(), unsubscribeToken);

    return NextResponse.json({
      message: "You're on the list. Check your inbox to confirm.",
    });
  } catch (err) {
    console.error("Newsletter signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again?" },
      { status: 500 }
    );
  }
}
