"use client";

import Image from "next/image";
import { useState } from "react";

import type { TourGalleryImage } from "@/types/tour-detail";

export function TourGallery({ images }: { images: readonly TourGalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="min-w-0">
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-border bg-surface">
        <Image src={activeImage.src} alt={activeImage.alt} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      </div>
      <div className="destination-strip mt-3 flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Tur görselleri">
        {images.map((image, index) => (
          <button key={image.src} type="button" onClick={() => setActiveIndex(index)} aria-current={index === activeIndex ? "true" : undefined} aria-label={`${index + 1}. görseli göster`} className="relative aspect-[3/2] w-28 shrink-0 snap-start overflow-hidden rounded-md border-2 border-border bg-surface outline-none transition-colors aria-current:border-brand focus-visible:ring-3 focus-visible:ring-brand/25 motion-reduce:transition-none sm:w-32">
            <Image src={image.src} alt="" fill sizes="128px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
