import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

/**
 * GET /api/go?u=<encoded destination>&sid=<cj sub-id>&t=<link type>&c=<campaign>
 *
 * First-party click tracker for the Ella Fellas newsletter.
 *
 * WHY THIS EXISTS: Resend only emits email.clicked events if the SENDING domain
 * has a tracking subdomain configured, which requires a DNS record and forces the
 * From address and the tracking domain to match. Rather than depend on that, every
 * commercial link in the newsletter points here first. We log the click ourselves
 * and 302 on to the real destination, so click data is first-party, lands in the
 * same email_events table the dashboard already reads, and carries far more detail
 * than Resend would give us (which show, which merchant, which send).
 *
 * SECURITY: this is a redirector, so it is strictly allowlisted by destination
 * host. An open redirect would be abusable for phishing that borrows our domain's
 * reputation. Anything not on the allowlist is rejected with 400 and never
 * redirected to. Add hosts here deliberately, never from user input.
 */

const ALLOWED_HOSTS = new Set([
  // CJ Affiliate click domains (TicketNetwork, Pinto Ranch, Vrbo)
  "www.anrdoezrs.net",
  "anrdoezrs.net",
  "www.dpbolvw.net",
  "dpbolvw.net",
  "www.jdoqocy.com",
  "jdoqocy.com",
  "www.kqzyfj.com",
  "kqzyfj.com",
  "www.tkqlhce.com",
  "tkqlhce.com",
  // Awin
  "www.awin1.com",
  "awin1.com",
  // Ticket destinations (also reached directly on occasion)
  "www.ticketnetwork.com",
  "ticketnetwork.com",
  // Owned store + main site
  "shopellafellas.com",
  "www.shopellafellas.com",
  "ellafellas.com",
  "www.ellafellas.com",
  // Amazon affiliate
  "www.amazon.com",
  "amazon.com",
  "amzn.to",
]);

function isAllowed(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!ALLOWED_HOSTS.has(url.hostname.toLowerCase())) return null;
  return url;
}

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("u");
  if (!target) {
    return NextResponse.json({ error: "missing u" }, { status: 400 });
  }

  const dest = isAllowed(target);
  if (!dest) {
    // Never redirect to an unvetted host. Fail closed.
    return NextResponse.json({ error: "destination not allowed" }, { status: 400 });
  }

  const sid = searchParams.get("sid") ?? null;
  const linkType = searchParams.get("t") ?? null;
  const campaign = searchParams.get("c") ?? null;

  // Log, but never let a logging failure block the redirect — a broken click is
  // worse than a missing row.
  try {
    const supabase = getSupabaseServer();
    await supabase.from("email_events").insert({
      event_type: "clicked",
      link_url: dest.toString(),
      email_subject: campaign,
      raw: {
        source: "first_party_redirect",
        sid,
        link_type: linkType,
        campaign,
        merchant: dest.hostname.toLowerCase(),
        user_agent: req.headers.get("user-agent") ?? null,
        referer: req.headers.get("referer") ?? null,
      },
    });
  } catch {
    // swallow — redirect regardless
  }

  return NextResponse.redirect(dest.toString(), 302);
}
