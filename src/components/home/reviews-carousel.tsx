"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type ReviewsCarouselProps = {
  children: ReactNode;
  itemCount: number;
};

function getItemsPerPage() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

export function ReviewsCarousel({ children, itemCount }: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(itemCount);

  const updateCarouselState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const nextPageCount = Math.ceil(itemCount / getItemsPerPage());
    const nextPage = Math.min(
      nextPageCount - 1,
      Math.round(track.scrollLeft / Math.max(1, track.clientWidth)),
    );

    setPageCount(nextPageCount);
    setCurrentPage(Math.max(0, nextPage));
  }, [itemCount]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateCarouselState();
    track.addEventListener("scroll", updateCarouselState, { passive: true });
    window.addEventListener("resize", updateCarouselState);

    return () => {
      track.removeEventListener("scroll", updateCarouselState);
      window.removeEventListener("resize", updateCarouselState);
    };
  }, [updateCarouselState]);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <div className="mt-8 min-w-0 sm:mt-10">
      <div
        ref={trackRef}
        className="reviews-track grid w-full snap-x snap-mandatory auto-cols-[100%] grid-flow-col gap-5 overflow-x-auto overscroll-x-contain pb-2 md:auto-cols-[calc((100%-1.25rem)/2)] lg:auto-cols-[calc((100%-2.5rem)/3)]"
        aria-label="Misafir yorumları"
        tabIndex={0}
      >
        {children}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted" aria-live="polite">
          {currentPage + 1} / {pageCount}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={currentPage === 0}
            aria-label="Önceki yorumları göster"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-lg text-text transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={currentPage >= pageCount - 1}
            aria-label="Sonraki yorumları göster"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-lg text-text transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
