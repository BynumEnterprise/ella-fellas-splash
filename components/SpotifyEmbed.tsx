"use client";
import { useState } from "react";

/**
 * Click-to-load Spotify player (facade).
 *
 * The real embed is a full Next.js app inside an iframe (~800 KB of JS, ~1 s of
 * main-thread work on a mid-range phone). Loading it with the page pushed the
 * homepage's mobile Lighthouse LCP past 10 s and added third-party cookies.
 * Nothing from Spotify loads until the visitor asks for it. The placeholder is
 * the same 152 px tall as the player, so swapping it in shifts nothing.
 * "Open in Spotify" keeps a no-JS path to the track.
 */
export function SpotifyEmbed({ id, label }: { id: string; label?: string }) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="block rounded-md my-4"
        title={label ? `Spotify player: ${label}` : "Spotify player"}
      />
    );
  }

  return (
    <div className="my-4 h-[152px] rounded-md bg-[#121212] text-paper flex items-center gap-4 px-4 sm:px-5">
      <button
        type="button"
        onClick={() => setActive(true)}
        className="group flex flex-1 min-w-0 items-center gap-4 text-left rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1ed760]"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1ed760] text-[#121212] transition-transform group-hover:scale-105">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="block font-display text-xl tracking-wide leading-tight truncate">
            {label ?? "Listen on Spotify"}
          </span>
          <span className="block text-xs text-paper/80 mt-1">Tap to load the Spotify player</span>
        </span>
      </button>
      <a
        href={`https://open.spotify.com/track/${id}`}
        target="_blank"
        rel="noopener"
        className="shrink-0 py-2 text-xs text-paper/85 underline underline-offset-2 hover:text-paper"
      >
        Open in Spotify
      </a>
    </div>
  );
}
