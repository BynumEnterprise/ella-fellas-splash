"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badge?: string;
}

/**
 * Image gallery with clickable thumbnails that swap the hero image.
 * next/image optimizes the Amazon CDN images (remotePatterns allows all https):
 * the product-detail hero is usually the page LCP, so it's marked priority and
 * served as a right-sized WebP/AVIF instead of a full 1500px JPEG.
 */
export function ProductGallery({ images, alt, badge }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeImage = images[activeIdx] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Hero image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-paper border border-ink/10 shadow-sm">
        <Image
          src={activeImage}
          alt={alt}
          fill
          priority
          sizes="(min-width:768px) 480px, 100vw"
          className="object-contain p-4"
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-denim text-paper text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full font-medium shadow">
            {badge}
          </span>
        )}
      </div>

      {/* Thumbnail strip — only render if there's more than one image */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((img, idx) => (
            <button
              key={img + idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`View image ${idx + 1} of ${images.length}`}
              className={`relative aspect-square overflow-hidden rounded-md bg-paper border-2 transition-all ${
                idx === activeIdx
                  ? "border-primary shadow-sm"
                  : "border-ink/10 hover:border-ink/30"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
