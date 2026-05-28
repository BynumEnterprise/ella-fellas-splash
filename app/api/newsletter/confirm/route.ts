import { NextResponse } from "next/server";

/**
 * GET /api/newsletter/confirm?token={confirm_token}
 *
 * Looks up the subscriber row by confirm_token and marks them confirmed.
 * Redirects to /thanks-for-confirming on success or failure — we don't
 * want to expose internal errors to someone who clicked an email link.
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
        .update({ confirmed: true, confirmed_at: new Date().toISOString() })
        .eq("confirm_token", token);
      if (error) {
        console.error("Confirm update failed:", error);
      }
    } catch (err) {
      console.error("Confirm handler threw:", err);
    }
  } else {
    console.warn("Confirm hit without token or service role key");
  }

  return NextResponse.redirect(new URL("/thanks-for-confirming", siteUrl), { status: 302 });
}
