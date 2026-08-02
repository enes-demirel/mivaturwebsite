"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TourFilters } from "@/components/tours/tour-filters";
import { Button } from "@/components/ui/button";
import type { TourFilterOptions, TourFilterState } from "@/types/tour-filter";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

type MobileFilterDrawerProps = {
  filters: TourFilterState;
  options: TourFilterOptions;
  showTypeFilter: boolean;
  activeCount: number;
  resultCount: number;
  onChange: (filters: TourFilterState) => void;
  onClear: () => void;
};

export function MobileFilterDrawer({
  filters,
  options,
  showTypeFilter,
  activeCount,
  resultCount,
  onChange,
  onClear,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeDrawer = useCallback((restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDrawer, isOpen]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-tour-filters"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-text transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Filtreler
        {activeCount > 0 && (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand text-[0.6875rem] text-white">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-text/30 backdrop-blur-[2px]"
            aria-label="Filtreleri kapat"
            onClick={() => closeDrawer()}
          />
          <div
            ref={dialogRef}
            id="mobile-tour-filters"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-tour-filters-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-hidden bg-surface shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
              <h2 id="mobile-tour-filters-title" className="text-lg font-bold text-text">
                Filtreler
              </h2>
              <button
                type="button"
                aria-label="Filtreleri kapat"
                onClick={() => closeDrawer()}
                className="inline-flex size-11 items-center justify-center rounded-md border border-border text-xl text-text hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
              <TourFilters filters={filters} options={options} showTypeFilter={showTypeFilter} idPrefix="mobile-filter" onChange={onChange} />
            </div>

            <div className="flex shrink-0 gap-3 border-t border-border bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button type="button" variant="secondary" className="shrink-0" onClick={onClear} disabled={activeCount === 0}>
                Temizle
              </Button>
              <Button type="button" className="min-w-0 flex-1" onClick={() => closeDrawer()}>
                {resultCount} Turu Göster
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
