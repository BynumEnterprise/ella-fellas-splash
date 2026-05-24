export function YouTubeEmbed({ id, title }: { id: string; title?: string }) {
  return (
    <div className="aspect-video my-6">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title ?? "YouTube video"}
        frameBorder={0}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full rounded-md"
        loading="lazy"
      />
    </div>
  );
}
