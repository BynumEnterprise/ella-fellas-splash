export function SpotifyEmbed({ id }: { id: string }) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`}
      width="100%"
      height="152"
      frameBorder={0}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="rounded-md my-4"
      title="Spotify player"
    />
  );
}
