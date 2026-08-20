"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { TourGalleryImage } from "@/types/tour-detail";

export function TourGallery({ images }: { images: readonly TourGalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeImage = images[activeIndex] ?? images[0];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxOpen && !dialog.open) dialog.showModal();
    if (!lightboxOpen && dialog.open) dialog.close();
  }, [lightboxOpen]);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % images.length);
  }

  return (
    <div className="min-w-0">
      <button type="button" onClick={() => setLightboxOpen(true)} aria-label={`${activeImage.alt} görselini büyüt`} className="relative block aspect-[3/2] w-full overflow-hidden rounded-lg border border-border bg-surface text-left outline-none focus-visible:ring-3 focus-visible:ring-brand/25">
        <Image src={activeImage.src} alt={activeImage.alt} fill priority unoptimized={activeImage.src.startsWith("/media/")} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        <span className="absolute right-3 bottom-3 rounded-full bg-text/80 px-3 py-1.5 text-xs font-bold text-white">Büyüt</span>
      </button>
      <div className="destination-strip mt-3 flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Tur görselleri">
        {images.map((image, index) => (
          <button key={image.src} type="button" onClick={() => setActiveIndex(index)} aria-current={index === activeIndex ? "true" : undefined} aria-label={`${index + 1}. görseli göster`} className="relative aspect-[3/2] w-28 shrink-0 snap-start overflow-hidden rounded-md border-2 border-border bg-surface outline-none transition-colors aria-current:border-brand focus-visible:ring-3 focus-visible:ring-brand/25 motion-reduce:transition-none sm:w-32">
            <Image src={image.src} alt="" fill unoptimized={image.src.startsWith("/media/")} sizes="128px" className="object-cover" />
          </button>
        ))}
      </div>
      <dialog ref={dialogRef} onClose={() => setLightboxOpen(false)} onCancel={() => setLightboxOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setLightboxOpen(false); }} aria-label="Tur görsel galerisi" className="m-auto h-full max-h-none w-full max-w-none border-0 bg-text/95 p-4 text-white backdrop:bg-text/70 sm:p-8">
        <div className="mx-auto flex h-full max-w-7xl flex-col">
          <div className="flex items-center justify-between gap-4"><p className="text-sm font-semibold">{activeIndex + 1} / {images.length}</p><button type="button" onClick={() => setLightboxOpen(false)} className="inline-flex size-11 items-center justify-center rounded-full border border-white/30 text-2xl outline-none hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/40" aria-label="Galeriyi kapat">×</button></div>
          <div className="relative my-4 min-h-0 flex-1"><Image src={activeImage.src} alt={activeImage.alt} fill unoptimized={activeImage.src.startsWith("/media/")} sizes="100vw" className="object-contain" /></div>
          <div className="flex items-center justify-between gap-4"><button type="button" onClick={showPrevious} className="min-h-11 rounded-full border border-white/30 px-5 text-sm font-bold outline-none hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/40">← Önceki</button><p className="min-w-0 truncate text-center text-sm">{activeImage.alt}</p><button type="button" onClick={showNext} className="min-h-11 rounded-full border border-white/30 px-5 text-sm font-bold outline-none hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/40">Sonraki →</button></div>
        </div>
      </dialog>
    </div>
  );
}
