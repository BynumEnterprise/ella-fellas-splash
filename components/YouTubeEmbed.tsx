"use client";
import { useState } from "react";

/**
 * Click-to-load YouTube player (facade). The standard embed pulls ~1 MB of
 * player JS plus third-party cookies before anyone presses play. This renders
 * the video's thumbnail (lazy, from i.ytimg.com) in the same 16:9 box and only
 * swaps in the real iframe, autoplaying, after a click, so there is no layout
 * shift and no YouTube cost for visitors who never watch.
 */
export function YouTubeEmbed({ id, title }: { id: string; title?: string }) {
  const [active, setActive] = useState(false);
  const label = title ?? "YouTube video";

  return (
    <div className="aspect-video my-6 relative overflow-hidden rounded-md bg-ink">
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title={label}
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 w-full h-full focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-primary"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            width={480}
            height={360}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-20 items-center justify-center rounded-2xl bg-[#ff0000] text-white shadow-lg transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          <span className="sr-only">Play video: {label}</span>
        </button>
      )}
    </div>
  );
}
