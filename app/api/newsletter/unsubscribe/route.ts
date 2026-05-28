import { NextResponse } from "next/server";

/**
 * GET /api/newsletter/unsubscribe?token={unsubscribe_token}
 *
 * Looks up the subscriber row by unsubscribe_token, marks them as
 * unsubscribed (confirmed=false), and redirects to /goodbye.
 *
 * If the token is missing, invalid, or doesn't match a row, we still
 * redirect to /goodbye — we never want to surface internal errors to
 * a user who clicked an email link.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

  if (token && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { getSupabaseServer } = await import("@/lib/supabase");
      const supabase = getSupabaseServer();
      const { error } = await supabase
        .from("subscribers")
        .update({ confirmed: false, unsubscribed_at: new Date().toISOString() })
        .eq("unsubscribe_token", token);
      if (error) {
        console.error("Unsubscribe update failed:", error);
      }
    } catch (err) {
      console.error("Unsubscribe handler threw:", err);
    }
  } else {
    console.warn("Unsubscribe hit without token or service role key");
  }

  return NextResponse.redirect(new URL("/goodbye", siteUrl), { status: 302 });
}
