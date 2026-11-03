"use server";

import { headers } from "next/headers";
import { sendEmail, OWNER_INBOX } from "@/lib/email";
import { normalizeTopic, topicLabel } from "./topics";

export interface ContactState {
  status: "idle" | "ok" | "error";
  message: string;
}

// ellafellas.com has no mailboxes (registrar MX, no forwarding): every message
// sent to an @ellafellas.com address bounced "554 Relay access denied" — 47
// fan/press/takedown messages lost Oct 13–Nov 2 2026. The form is the only
// public contact path; it delivers to the monitored owner inbox. Never point
// visitors at an @ellafellas.com address until real forwarding exists.
const CONTACT_TO = OWNER_INBOX;
const MIN_FILL_MS = 3000; // humans don't fill a 3-field form in under 3s
const MAX_FILL_MS = 1000 * 60 * 60 * 6; // stale/replayed form token
const RATE_WINDOW_MS = 1000 * 60 * 10;
const RATE_MAX = 3; // per IP per window (best-effort: per serverless instance)

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const FALLBACK = "Sorry, that didn't go through. Please wait a few minutes and send it again.";

export async function submitContact(
  _prev: ContactState,
  form: FormData,
): Promise<ContactState> {
  const name = String(form.get("name") ?? "").trim().slice(0, 100);
  const email = String(form.get("email") ?? "").trim().slice(0, 200);
  const topic = normalizeTopic(String(form.get("topic") ?? ""));
  const label = topicLabel(topic);
  const message = String(form.get("message") ?? "").trim().slice(0, 5000);
  const honeypot = String(form.get("website") ?? "");
  const startedRaw = Number(form.get("started") ?? 0);

  // Honeypot: real visitors never see or fill the "website" field. Pretend
  // success so bots don't learn to adapt, but send nothing.
  if (honeypot) return { status: "ok", message: "Thanks! We'll be in touch." };

  // Time trap: no JS (no start stamp), instant submit, or a replayed old form.
  const elapsed = Date.now() - startedRaw;
  if (!startedRaw || elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    return { status: "error", message: "Please take a moment and send it again (reload the page if this keeps happening)." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Enter a valid email so we can reply." };
  }
  if (message.length < 10) {
    return { status: "error", message: "Tell us a little more (at least 10 characters)." };
  }
  // Link-stuffed spam
  if ((message.match(/https?:\/\//g) ?? []).length > 3) {
    return { status: "error", message: FALLBACK };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Too many messages from this connection. Please try again in about 10 minutes." };
  }

  const html = `<p><strong>From:</strong> ${esc(name || "(no name)")} &lt;${esc(email)}&gt;</p>
<p><strong>Topic:</strong> ${esc(label)}</p>
<p style="white-space:pre-wrap">${esc(message)}</p>`;
  const res = await sendEmail({
    to: CONTACT_TO,
    replyTo: email,
    subject: `[Ella Fellas contact: ${label}] from ${name || email}`.replace(/[\r\n]+/g, " ").slice(0, 150),
    html,
    text: `From: ${name} <${email}>\nTopic: ${label}\n\n${message}`,
  });
  if (!res.ok) return { status: "error", message: FALLBACK };
  return { status: "ok", message: "Thanks! Message sent. We reply within 2 business days (takedowns and corrections within 48 hours)." };
}
