"use client";
import { useState } from "react";

export function NewsletterSignup({ placement = "inline" }: { placement?: string }) {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const r = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, source: placement }),
      });
      const j = await r.json();
      if (r.ok) {
        try {
          if (typeof window !== "undefined" && window.gtag) {
            // `placement` already goes to Supabase; sending it to GA too means we
            // can see WHICH signup box converts, not just that one did.
            window.gtag("event", "newsletter_signup", {
              page_path: window.location.pathname,
              placement,
            });
          }
        } catch {
          // ignore — analytics must not block UX
        }
        setState("ok");
        setMessage(j.message ?? "You're on the list. Check your inbox to confirm.");
        setEmail("");
        setCity("");
      } else {
        setState("err");
        setMessage(j.error ?? "Something went wrong. Try again?");
      }
    } catch (err) {
      setState("err");
      setMessage("Network error. Try again?");
    }
  }

  if (state === "ok") {
    return (
      <div className="bg-primary/10 border border-primary rounded-md p-4 text-denim font-medium text-center">
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id={`newsletter-email-${placement}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="flex-1 px-4 py-3 border-2 border-denim/30 focus:border-primary outline-none rounded-md bg-paper text-ink"
          aria-label="Email address"
        />
        <input
          id={`newsletter-city-${placement}`}
          name="city"
          type="text"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City (optional)"
          className="sm:w-48 px-4 py-3 border-2 border-denim/30 focus:border-primary outline-none rounded-md bg-paper text-ink"
          aria-label="City"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="px-6 py-3 bg-primary text-ink font-display tracking-wide text-lg hover:bg-primary-dark hover:text-paper transition-colors rounded-md disabled:opacity-60"
        >
          {state === "loading" ? "Joining..." : "Join the Fellas"}
        </button>
      </div>
      <p className="text-xs text-ink/60">
        Get daily updates, tour alerts, and ticket drop notifications. No spam. Unsubscribe anytime.
      </p>
      {state === "err" && (
        <p className="text-sm text-clay">{message}</p>
      )}
    </form>
  );
}
