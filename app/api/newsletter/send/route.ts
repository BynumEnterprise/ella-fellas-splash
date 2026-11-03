import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  sendEmail,
  wrapEmail,
  newsletterMarkdownToHtml,
  unsubscribeUrl,
} from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * POST /api/newsletter/send
 *
 * Broadcasts a daily newsletter to every CONFIRMED, NOT-UNSUBSCRIBED
 * subscriber via Resend.
 *
 * Auth: `Authorization: Bearer <CRON_SECRET>`.
 *
 * Body (JSON), all optional:
 *   - date:     "YYYY-MM-DD" — resolve content from content/newsletter/<date>.md
 *   - slug:     filename (without .md) under content/newsletter/
 *   - markdown: raw newsletter markdown (overrides file lookup)
 *   - subject:  email subject (else taken from frontmatter `subject`, else a default)
 *   - to:       a single email address — DIRECT send to that address only
 *               (owner reports, alerts). Subject is sent exactly as given.
 *   - test:     a single email address — PREVIEW of a newsletter issue to that
 *               address only. The subject gets a "[TEST]" prefix ONLY when the
 *               content is an actual issue (resolved via `date`/`slug`); raw
 *               markdown + explicit subject is treated like `to` (no prefix).
 *   - force:    boolean — resend even if this date was already sent
 *
 * Idempotency: a row is written to `newsletter_sends` keyed by `send_date`
 * BEFORE the batch starts (atomic insert — a concurrent duplicate call gets
 * 409). A second call for the same date is refused unless `force: true`.
 * If the batch aborts before a single email goes out (e.g. Resend 401/403),
 * the row is removed so the job can retry after the config is fixed.
 */

type Subscriber = { email: string; unsubscribe_token: string | null };

function resolveMarkdown(body: {
  date?: string;
  slug?: string;
  markdown?: string;
}): { markdown: string; frontmatter: Record<string, unknown>; fromFile: boolean } | null {
  if (body.markdown && body.markdown.trim()) {
    const parsed = matter(body.markdown);
    return { markdown: parsed.content, frontmatter: parsed.data, fromFile: false };
  }
  const name = body.slug ?? body.date;
  if (!name) return null;
  const candidates = [
    path.join(process.cwd(), "content", "newsletter", `${name}.md`),
    path.join(process.cwd(), "..", "content", "newsletter", `${name}.md`),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const parsed = matter(fs.readFileSync(file, "utf8"));
      return { markdown: parsed.content, frontmatter: parsed.data, fromFile: true };
    }
  }
  return null;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com";

export async function POST(req: Request) {
  // --- auth ---
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured" },
      { status: 503 }
    );
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY not configured" },
      { status: 503 }
    );
  }

  let body: {
    date?: string;
    slug?: string;
    markdown?: string;
    subject?: string;
    to?: string;
    test?: string;
    force?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const resolved = resolveMarkdown(body);
  if (!resolved) {
    return NextResponse.json(
      { error: "No newsletter content. Provide `markdown`, or a `date`/`slug` that exists on disk." },
      { status: 400 }
    );
  }

  const sendDate =
    body.date ??
    (typeof resolved.frontmatter.sendDate === "string"
      ? resolved.frontmatter.sendDate
      : new Date().toISOString().slice(0, 10));
  const subject =
    body.subject ??
    (typeof resolved.frontmatter.subject === "string"
      ? resolved.frontmatter.subject
      : `Ella Fellas Daily — ${sendDate}`);
  const preheader =
    typeof resolved.frontmatter.subject === "string" ? resolved.frontmatter.subject : undefined;

  // Campaign tag matches the /api/go `c=` convention so GA4 (utm_campaign) and
  // the first-party click log line up per issue.
  const innerHtml = newsletterMarkdownToHtml(resolved.markdown, { campaign: `daily-${sendDate}` });

  const { getSupabaseServer } = await import("@/lib/supabase");
  const supabase = getSupabaseServer();

  // --- SINGLE-RECIPIENT MODES: no list, no idempotency record ---
  // `to`   = direct send (owner reports / alerts): subject exactly as given.
  // `test` = preview of an issue: "[TEST]" prefix only when previewing a real
  //          issue file (date/slug). Raw markdown + explicit subject through
  //          `test` is an owner report (scripts/cloud/mail.sh pre-Nov-2026),
  //          so it is NOT prefixed — reports used to arrive as "[TEST] …".
  const single = body.to ?? body.test;
  if (single) {
    const isPreview = !!body.test && !body.to && resolved.fromFile;
    const html = wrapEmail({
      innerHtml,
      unsubscribeUrl: `${SITE_URL}/api/newsletter/unsubscribe?token=TEST`,
      preheader,
    });
    const r = await sendEmail({
      to: single,
      subject: isPreview ? `[TEST] ${subject}` : subject,
      html,
    });
    return NextResponse.json({
      mode: body.to ? "direct" : "test",
      to: single,
      ok: r.ok,
      status: r.status,
      error: r.error,
    });
  }

  // --- idempotency guard (atomic) ---
  // Insert first; a unique-violation means another call already owns this
  // date. With force:true we upsert instead and proceed.
  if (body.force) {
    const { error } = await supabase
      .from("newsletter_sends")
      .upsert({ send_date: sendDate, subject, recipient_count: 0 }, { onConflict: "send_date" });
    if (error) {
      return NextResponse.json({ error: `newsletter_sends upsert failed: ${error.message}` }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("newsletter_sends")
      .insert({ send_date: sendDate, subject, recipient_count: 0 });
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: `Newsletter for ${sendDate} was already sent. Pass force:true to resend.` },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: `newsletter_sends insert failed: ${error.message}` }, { status: 500 });
    }
  }

  // --- fetch recipients: confirmed AND never opted out ---
  // `unsubscribed_at is null` is the hard opt-out guard. The daily job bulk
  // sets confirmed=true before each send (owner policy 2026-07-31), which used
  // to re-subscribe everyone who had clicked Unsubscribe (39 people, up to 140
  // emails each, audit 2026-11-02). Opt-outs must survive that.
  const { data: subs, error: subErr } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .eq("confirmed", true)
    .is("unsubscribed_at", null);
  if (subErr) {
    if (!body.force) await supabase.from("newsletter_sends").delete().eq("send_date", sendDate);
    return NextResponse.json({ error: `Subscriber query failed: ${subErr.message}` }, { status: 500 });
  }
  const recipients = (subs ?? []) as Subscriber[];

  await supabase
    .from("newsletter_sends")
    .update({ recipient_count: recipients.length })
    .eq("send_date", sendDate);

  // --- send, sequentially, THROTTLED to respect Resend's 10 req/sec cap ---
  // Resend rejects the tail of a fast loop with 429 rate_limit_exceeded, which
  // silently dropped recipients on every send once the list passed ~10. We
  // (a) pace sends well under 10/sec and (b) retry a rate-limited recipient with
  // escalating backoff instead of giving up on them.
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const isRateLimit = (err?: string) =>
    !!err &&
    (err.includes("429") ||
      err.toLowerCase().includes("rate_limit") ||
      err.toLowerCase().includes("too many requests"));

  const startedAt = Date.now();
  let sent = 0;
  let consecutiveHardFailures = 0;
  let abortedWith: { status: number; error?: string } | null = null;
  const failures: { email: string; error?: string }[] = [];
  for (const sub of recipients) {
    const token = sub.unsubscribe_token ?? "";
    const unsubUrl = unsubscribeUrl(token);
    const html = wrapEmail({ innerHtml, unsubscribeUrl: unsubUrl, preheader });

    let r = await sendEmail({ to: sub.email, subject, html, listUnsubscribeUrl: unsubUrl });
    for (let attempt = 1; attempt <= 5 && !r.ok && isRateLimit(r.error); attempt++) {
      await sleep(1000 * attempt);
      r = await sendEmail({ to: sub.email, subject, html, listUnsubscribeUrl: unsubUrl });
    }
    if (r.ok) {
      sent++;
      consecutiveHardFailures = 0;
    } else {
      failures.push({ email: sub.email, error: r.error });
      // 401/403 (bad or domain-restricted API key), 422 (bad from) etc. fail
      // for EVERY recipient. Don't grind through 400 doomed requests: abort
      // once the first few in a row fail with a non-rate-limit error.
      if (!isRateLimit(r.error) && (r.status === 401 || r.status === 403 || r.status === 422 || r.status === 0)) {
        consecutiveHardFailures++;
        if (consecutiveHardFailures >= 5 && sent === 0) {
          abortedWith = { status: r.status, error: r.error };
          break;
        }
      }
    }

    // Base pacing between recipients: ~6-7 sends/sec, comfortably under 10/sec.
    await sleep(150);
  }

  if (abortedWith && sent === 0) {
    // Nothing went out: release the date so the job can retry once fixed.
    await supabase.from("newsletter_sends").delete().eq("send_date", sendDate);
    return NextResponse.json(
      {
        error: `Send aborted: Resend rejected the first ${consecutiveHardFailures} recipients (HTTP ${abortedWith.status}). Nothing was sent; the date is NOT marked as sent.`,
        resendStatus: abortedWith.status,
        resendError: abortedWith.error,
        sendDate,
      },
      { status: 502 }
    );
  }

  await supabase
    .from("newsletter_sends")
    .update({ sent_count: sent, failed_count: failures.length, completed_at: new Date().toISOString() })
    .eq("send_date", sendDate);

  return NextResponse.json({
    sendDate,
    subject,
    total: recipients.length,
    sent,
    failed: failures.length,
    elapsedSeconds: Math.round((Date.now() - startedAt) / 1000),
    failures: failures.slice(0, 20),
  });
}
