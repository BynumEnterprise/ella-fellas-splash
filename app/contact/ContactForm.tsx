"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact, type ContactState } from "./actions";
import { CONTACT_TOPICS, normalizeTopic, type ContactTopic } from "./topics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const INITIAL: ContactState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL);
  // Time-trap stamp is set on mount (client only), so a static page can't leak
  // a build-time value and no-JS bots submit without one.
  const [started, setStarted] = useState("");
  // Deep links (/contact?topic=takedown) preselect the topic. Read on the
  // client so the page stays static.
  const [topic, setTopic] = useState<ContactTopic>("general");
  useEffect(() => {
    setStarted(String(Date.now()));
    try {
      const t = new URLSearchParams(window.location.search).get("topic");
      if (t) setTopic(normalizeTopic(t));
    } catch {
      // ignore malformed query strings
    }
  }, []);

  // generate_lead fires ONLY after the server confirms a real send — never on
  // page view or on a blocked/honeypot submit.
  const fired = useRef(false);
  useEffect(() => {
    if (state.status !== "ok" || fired.current) return;
    fired.current = true;
    try {
      window.gtag?.("event", "generate_lead", {
        lead_source: "contact_form",
        page_path: window.location.pathname,
      });
    } catch {
      // analytics must never break the form
    }
  }, [state.status]);

  if (state.status === "ok") {
    return (
      <div id="contact-form" role="status" className="not-prose bg-primary/10 border border-primary rounded-md p-4 text-denim font-medium">
        {state.message}
      </div>
    );
  }

  const field =
    "w-full px-3 py-2 border-2 border-denim/30 focus:border-primary outline-none rounded-md bg-paper text-ink";

  return (
    <form id="contact-form" action={formAction} className="not-prose space-y-3 my-6">
      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="started" value={started} />
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="block mb-1 text-ink/80">Name</span>
          <input name="name" type="text" autoComplete="name" maxLength={100} className={field} />
        </label>
        <label className="block text-sm">
          <span className="block mb-1 text-ink/80">Email (so we can reply)</span>
          <input name="email" type="email" required autoComplete="email" maxLength={200} className={field} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="block mb-1 text-ink/80">Topic</span>
        <select
          name="topic"
          className={field}
          value={topic}
          onChange={(e) => setTopic(normalizeTopic(e.target.value))}
        >
          {CONTACT_TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="block mb-1 text-ink/80">Message</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className={field} />
      </label>
      <button
        type="submit"
        disabled={pending || !started}
        className="px-6 py-2 bg-primary text-ink font-display tracking-wide text-lg hover:bg-primary-dark hover:text-paper transition-colors rounded-md disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-clay">
          {state.message}
        </p>
      )}
    </form>
  );
}
