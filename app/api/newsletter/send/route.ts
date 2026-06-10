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
 * Broadcasts a daily newsletter to every CONFIRMED subscriber via Resend.
 *
 * Auth: `Authorization: Bearer <CRON_SECRET>`.
 *
 * Body (JSON), all optional:
 *   - date:     "YYYY-MM-DD" — resolve content from content/newsletter/<date>.md
 *   - slug:     filename (without .md) under content/newsletter/
 *   - markdown: raw newsletter markdown (overrides file lookup)
 *   - subject:  email subject (else taken from frontmatter `subject`, else a default)
 *   - test:     a single email address — sends ONLY to that address, skips the list
 *   - force:    boolean — resend even if this date was already sent
 *
 * Idempotency: a row is written to `newsletter_sends` keyed by `send_date`.
 * A second call for the same date is refused unless `force: true`.
 */

type Subscriber = { email: string; unsubscribe_token: string | null };

function resolveMarkdown(body: {
  date?: string;
  slug?: string;
  markdown?: string;
}): { markdown: string; frontmatter: Record<string, unknown> } | null {
  if (body.markdown && body.markdown.trim()) {
    const parsed = matter(body.markdown);
    return { markdown: parsed.content, frontmatter: parsed.data };
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
      return { markdown: parsed.content, frontmatter: parsed.data };
    }
  }
  return null;
}

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

  const innerHtml = newsletterMarkdownToHtml(resolved.markdown);

  const { getSupabaseServer } = await import("@/lib/supabase");
  const supabase = getSupabaseServer();

  // --- TEST MODE: send a single copy, no list, no idempotency record ---
  if (body.test) {
    const html = wrapEmail({
      innerHtml,
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://ellafellas.com"}/api/newsletter/unsubscribe?token=TEST`,
      preheader: typeof resolved.frontmatter.subject === "string" ? resolved.frontmatter.subject : undefined,
    });
    const r = await sendEmail({ to: body.test, subject: `[TEST] ${subject}`, html });
    return NextResponse.json({ mode: "test", to: body.test, ok: r.ok, error: r.error });
  }

  // --- idempotency guard ---
  if (!body.force) {
    const { data: prior } = await supabase
      .from("newsletter_sends")
      .select("send_date")
      .eq("send_date", sendDate)
      .maybeSingle();
    if (prior) {
      return NextResponse.json(
        { error: `Newsletter for ${sendDate} was already sent. Pass force:true to resend.` },
        { status: 409 }
      );
    }
  }

  // --- fetch confirmed subscribers ---
  const { data: subs, error: subErr } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .eq("confirmed", true);
  if (subErr) {
    return NextResponse.json({ error: `Subscriber query failed: ${subErr.message}` }, { status: 500 });
  }
  const recipients = (subs ?? []) as Subscriber[];

  // Record the send attempt up front so a crash mid-batch still blocks a
  // duplicate run for the same date.
  await supabase
    .from("newsletter_sends")
    .upsert({ send_date: sendDate, subject, recipient_count: recipients.length }, { onConflict: "send_date" });

  // --- send, sequentially, tolerating individual failures ---
  let sent = 0;
  const failures: { email: string; error?: string }[] = [];
  for (const sub of recipients) {
    const token = sub.unsubscribe_token ?? "";
    const unsubUrl = unsubscribeUrl(token);
    const html = wrapEmail({
      innerHtml,
      unsubscribeUrl: unsubUrl,
      preheader: typeof resolved.frontmatter.subject === "string" ? resolved.frontmatter.subject : undefined,
    });
    const r = await sendEmail({ to: sub.email, subject, html, listUnsubscribeUrl: unsubUrl });
    if (r.ok) sent++;
    else failures.push({ email: sub.email, error: r.error });
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
    failures: failures.slice(0, 20),
  });
}
