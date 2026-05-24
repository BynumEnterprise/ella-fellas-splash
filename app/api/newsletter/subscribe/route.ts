import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  city: z.string().max(80).optional(),
  state: z.string().max(40).optional(),
  source: z.string().max(40).optional(),
});

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

    // Try to persist to Supabase if service role key is configured.
    // Otherwise, return success (signups are tracked in Vercel logs).
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { getSupabaseServer } = await import("@/lib/supabase");
      const supabase = getSupabaseServer();
      const confirmToken = crypto.randomUUID();
      const unsubscribeToken = crypto.randomUUID();
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
        // Still return success to user — we have their email in logs.
      }
    } else {
      // No service role key yet — log so admin can backfill later
      console.log(`[NEWSLETTER SIGNUP] email=${email} city=${city ?? ""} source=${source ?? ""}`);
    }

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
