interface TrustBylineProps {
  publishedAt: string;
  updatedAt?: string;
}

function formatShort(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function TrustByline({ publishedAt, updatedAt }: TrustBylineProps) {
  const displayDate = updatedAt ?? publishedAt;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-l-4 border-primary pl-3 py-1 my-4">
      <span className="text-xs font-semibold text-denim uppercase tracking-wider">
        By the Ella Fellas team
      </span>
      <span className="text-xs text-ink/40 hidden sm:inline">&middot;</span>
      <span className="text-xs text-ink/60 italic">
        country fans who track every Ella Langley tour stop
      </span>
      <span className="text-xs text-ink/40 hidden sm:inline">&middot;</span>
      <time
        dateTime={displayDate}
        className="text-xs text-ink/50"
      >
        {updatedAt ? "Updated " : "Published "}{formatShort(displayDate)}
      </time>
    </div>
  );
}
