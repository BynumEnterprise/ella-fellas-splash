import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { CreditedPhoto } from "@/lib/photos";

interface Props {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  /** Resolved by assignPhotos() on the index so no two neighbours repeat. */
  photo?: CreditedPhoto;
  /** Render the first card as a large featured tile. */
  featured?: boolean;
}

export function NewsCard({ slug, title, excerpt, publishedAt, category, photo, featured = false }: Props) {
  return (
    <Link
      href={`/news/${slug}`}
      className="block bg-paper border border-ink/10 rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all"
    >
      {photo && (
        <div className={`relative w-full bg-denim/5 ${featured ? "h-64 md:h-80" : "h-40"}`}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            style={{ objectPosition: photo.focus }}
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-clay font-medium">
        <span className="bg-paper border border-denim/30 text-denim px-2 py-0.5 rounded-full">
          {category}
        </span>
        <span className="text-ink/60">{formatDate(publishedAt)}</span>
      </div>
      <h3 className={`font-display mt-2 text-denim leading-tight ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>{title}</h3>
      <p className="text-sm text-ink/80 mt-2 line-clamp-3">{excerpt}</p>
      <p className="mt-3 text-sm font-medium text-primary">Read &rarr;</p>
      {photo && (
        <p className="mt-2 text-[10px] text-ink/45">
          {photo.rights === "cc"
            ? `Photo: ${photo.photographer} / ${photo.sourceName}, ${photo.license}`
            : "Ella Fellas photo"}
        </p>
      )}
      </div>
    </Link>
  );
}
