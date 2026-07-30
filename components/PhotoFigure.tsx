import Image from "next/image";
import { getPhoto, type CreditedPhoto } from "@/lib/photos";

function Credit({ photo }: { photo: CreditedPhoto }) {
  return (
    <span className="block text-[11px] text-ink/55 mt-1">
      Photo:{" "}
      <a
        href={photo.sourceUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="hover:text-primary underline decoration-ink/20"
      >
        {photo.photographer}
      </a>{" "}
      / {photo.sourceName},{" "}
      <a
        href={photo.licenseUrl}
        target="_blank"
        rel="noopener noreferrer nofollow license"
        className="hover:text-primary underline decoration-ink/20"
      >
        {photo.license}
      </a>
    </span>
  );
}

interface FigureProps {
  /** id from lib/photos.ts */
  photo: string;
  /** Override the registry caption for this post's context. */
  caption?: string;
  priority?: boolean;
  /** Render edge-to-edge instead of inset. */
  full?: boolean;
}

/**
 * Every image of Ella on the site goes through here, so the photographer credit
 * and license can never be accidentally dropped.
 */
export function PhotoFigure({ photo, caption, priority = false, full = false }: FigureProps) {
  const p = getPhoto(photo);
  if (!p) return null;
  return (
    <figure className={full ? "my-8" : "my-8 mx-auto max-w-xl"}>
      <div
        className={
          full
            ? "overflow-hidden rounded-xl border border-ink/10 bg-denim/5 max-h-[520px] flex justify-center"
            : "overflow-hidden rounded-xl border border-ink/10 bg-paper"
        }
      >
        <Image
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          sizes="(max-width: 768px) 100vw, 720px"
          priority={priority}
          className={full ? "w-full max-h-[520px] object-cover object-top" : "w-full h-auto"}
        />
      </div>
      <figcaption className="mt-2 text-xs text-ink/70 leading-relaxed">
        {caption ?? p.caption}
        <Credit photo={p} />
      </figcaption>
    </figure>
  );
}
