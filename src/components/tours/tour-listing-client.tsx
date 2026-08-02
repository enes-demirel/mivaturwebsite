"use client";

import { useMemo, useState } from "react";

import { ActiveFilterChips } from "@/components/tours/active-filter-chips";
import { MobileFilterDrawer } from "@/components/tours/mobile-filter-drawer";
import { TourEmptyState } from "@/components/tours/tour-empty-state";
import { TourFilters } from "@/components/tours/tour-filters";
import { TourResultsGrid } from "@/components/tours/tour-results-grid";
import {
  countActiveFilters,
  filterTours,
  getTourFilterOptions,
} from "@/lib/filter-tours";
import type { Tour } from "@/types/tour";
import {
  emptyTourFilters,
  type TourFilterState,
} from "@/types/tour-filter";

type TourListingClientProps = {
  tours: readonly Tour[];
  showTypeFilter: boolean;
};

export function TourListingClient({
  tours,
  showTypeFilter,
}: TourListingClientProps) {
  const [filters, setFilters] = useState<TourFilterState>(emptyTourFilters);
  const options = useMemo(() => getTourFilterOptions(tours), [tours]);
  const filteredTours = useMemo(() => filterTours(tours, filters), [tours, filters]);
  const activeCount = countActiveFilters(filters);

  function clearFilters() {
    setFilters(emptyTourFilters);
  }

  return (
    <div className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start xl:gap-10">
      <aside className="hidden lg:block" aria-label="Tur filtreleri">
        <div className="sticky top-[calc(var(--header-height)+1.5rem)] max-h-[calc(100svh-var(--header-height)-3rem)] overflow-y-auto overscroll-contain rounded-lg border border-border bg-surface p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-text">Filtreler</h2>
            {activeCount > 0 && (
              <button type="button" onClick={clearFilters} className="text-xs font-bold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                Temizle
              </button>
            )}
          </div>
          <TourFilters filters={filters} options={options} showTypeFilter={showTypeFilter} idPrefix="desktop-filter" onChange={setFilters} />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <p className="font-bold text-text" aria-live="polite">
            {filteredTours.length} tur bulundu
          </p>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button type="button" onClick={clearFilters} className="text-sm font-bold text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden">
                Tümünü temizle
              </button>
            )}
            <MobileFilterDrawer filters={filters} options={options} showTypeFilter={showTypeFilter} activeCount={activeCount} resultCount={filteredTours.length} onChange={setFilters} onClear={clearFilters} />
          </div>
        </div>

        {activeCount > 0 && (
          <div className="mt-4">
            <ActiveFilterChips filters={filters} onChange={setFilters} />
          </div>
        )}

        <div className="mt-6">
          {filteredTours.length > 0 ? (
            <TourResultsGrid tours={filteredTours} />
          ) : (
            <TourEmptyState onClear={clearFilters} />
          )}
        </div>
      </div>
    </div>
  );
}
