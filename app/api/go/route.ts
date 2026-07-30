import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

/**
 * GET /api/go?u=<encoded destination>&sid=<attribution tag>&t=<link type>&c=<campaign>
 *
 * First-party click tracker for the Ella Fellas newsletter. Logs the click into
 * Supabase `email_events` then 302s to the destination.
 *
 * WHY IT EXISTS: Resend only emits email.clicked events when the sending domain has
 * a verified tracking subdomain, which needs a DNS record and forces the From address
 * to match the tracking domain. This route removes that dependency, keeps tracking on
 * ellafellas.com, and captures more than Resend would (which show, which merchant,
 * which send).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ALLOWLIST — WE ONLY EVER REDIRECT TO OUR OWN DOMAINS. THIS IS DELIBERATE.
 * ─────────────────────────────────────────────────────────────────────────────
 * Two independent reasons, and neither is negotiable:
 *
 * 1. AFFILIATE NETWORK POLICY. Amazon's Associates Operating Agreement flatly
 *    prohibits Associates links in email — any email, including newsletters. It is
 *    a material breach and Amazon terminates accounts and forfeits unpaid earnings
 *    for it, without warning. CJ treats email as a "special" promotional method that
 *    requires explicit per-advertiser approval, which we do not have for
 *    TicketNetwork. So an affiliate link must NEVER appear in an email.
 *
 *    The compliant pattern, which this route enforces: the newsletter links to OUR
 *    page (ellafellas.com/tour/<id>, ellafellas.com/shop/<slug>, shopellafellas.com),
 *    and the affiliate link lives on that page. That is ordinary web promotion and
 *    is allowed by both networks. We still learn exactly which show and which send
 *    drove the click, because that is logged here.
 *
 * 2. OPEN-REDIRECT SAFETY. A redirector that forwards anywhere is a phishing tool
 *    that borrows this domain's reputation. Failing closed prevents that.
 *
 * Consequence to understand before editing: adding an affiliate host here would
 * re-open the compliance hole. If a link 400s, that is this route doing its job —
 * fix the link to point at one of our own pages, do not widen the allowlist.
 */

const ALLOWED_HOSTS = new Set([
  "ellafellas.com",
  "www.ellafellas.com",
  "shopellafellas.com",
  "www.shopellafellas.com",
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
    return NextResponse.json(
      {
        error: "destination not allowed",
        hint: "This tracker only forwards to ellafellas.com and shopellafellas.com. Affiliate links must never be placed in email — link to the on-site page that carries the affiliate link instead.",
      },
      { status: 400 },
    );
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
