import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { getPhoto, pickPhotoForSlug } from "@/lib/photos";

interface Props {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  /** id from lib/photos.ts; falls back to a deterministic pick. */
  heroPhoto?: string;
}

export function NewsCard({ slug, title, excerpt, publishedAt, category, heroPhoto }: Props) {
  const photo = getPhoto(heroPhoto) ?? pickPhotoForSlug(slug);
  return (
    <Link
      href={`/news/${slug}`}
      className="block bg-paper border border-ink/10 rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all"
    >
      {photo && (
        <div className="relative w-full h-40 bg-denim/5">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
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
      <h3 className="text-lg font-display mt-2 text-denim leading-tight">{title}</h3>
      <p className="text-sm text-ink/80 mt-2 line-clamp-3">{excerpt}</p>
      <p className="mt-3 text-sm font-medium text-primary">Read &rarr;</p>
      <p className="mt-2 text-[10px] text-ink/45">
        Photo: {photo.photographer} / {photo.sourceName}, {photo.license}
      </p>
      </div>
    </Link>
  );
}
