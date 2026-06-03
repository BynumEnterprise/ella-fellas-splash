import type { Song } from "@/lib/types";

// Convert an "M:SS" or "MM:SS" duration to an ISO-8601 duration (e.g. PT3M12S).
function isoDuration(duration?: string): string | undefined {
  if (!duration) return undefined;
  const parts = duration.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return undefined;
  let mins = 0;
  let secs = 0;
  if (parts.length === 2) {
    [mins, secs] = parts;
  } else if (parts.length === 3) {
    const [h, m, s] = parts;
    mins = h * 60 + m;
    secs = s;
  } else {
    return undefined;
  }
  return `PT${mins}M${secs}S`;
}

export function MusicRecordingSchema({ s, url }: { s: Song; url: string }) {
  const sameAs: string[] = [];
  if (s.spotifyId) sameAs.push(`https://open.spotify.com/track/${s.spotifyId}`);
  if (s.youtubeId) sameAs.push(`https://www.youtube.com/watch?v=${s.youtubeId}`);

  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: s.title,
    url,
    byArtist: { "@type": "MusicGroup", name: "Ella Langley" },
    inAlbum: { "@type": "MusicAlbum", name: s.album },
    datePublished: s.releaseDate,
  };

  const dur = isoDuration(s.duration);
  if (dur) json.duration = dur;
  if (sameAs.length > 0) json.sameAs = sameAs;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
