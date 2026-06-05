"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBox({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={`flex items-center ${className}`}
    >
      <label htmlFor="site-search" className="sr-only">
        Search Ella Fellas
      </label>
      <input
        id="site-search"
        type="search"
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search…"
        aria-label="Search Ella Fellas"
        className="w-32 lg:w-44 bg-paper border border-ink/15 rounded-full px-3 py-1.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
      />
    </form>
  );
}
