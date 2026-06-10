import { NextResponse } from "next/server";
import { sendEmail, wrapEmail, unsubscribeUrl } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

/**
 * GET /api/newsletter/confirm?token={confirm_token}
 *
 * Looks up the subscriber row by confirm_token, marks them confirmed, and
 * sends the welcome email. Redirects to /thanks-for-confirming on success
 * or failure — we don't expose internal errors to someone who clicked an
 * email link.
 */
function welcomeEmailHtml(unsubToken: string): string {
  const inner = `
    <h2 style="font-family:Impact,sans-serif;color:#2F4858;letter-spacing:0.04em;font-size:24px;margin:0 0 16px 0;">You're on the list.</h2>
    <p style="font-size:16px;line-height:1.55;margin:0 0 16px 0;">Welcome to the fellas. Here's what you signed up for:</p>
    <ul style="font-size:15px;line-height:1.7;padding-left:20px;margin:0 0 20px 0;">
      <li>Tour drops &mdash; new dates, presales, and where Ella's playing near you</li>
      <li>Album updates &mdash; releases, singles, music videos</li>
      <li>Concert prep guides &mdash; what to wear, what to bring, what to expect</li>
    </ul>
    <p style="font-size:15px;line-height:1.55;margin: