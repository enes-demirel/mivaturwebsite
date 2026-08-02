"use client";

import { useTourDeparture } from "@/components/tours/detail/tour-departure-provider";
import { formatDepartureRange, formatTourPrice } from "@/lib/tour-detail-utils";
import type { TourDeparture } from "@/types/tour-detail";

export function TourDepartures({ departures }: { departures: readonly TourDeparture[] }) {
  const { selectedDeparture, selectDeparture } = useTourDeparture();

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-surface">
      {departures.map((departure) => {
        const isSelected = departure.id === selectedDeparture.id;
        return (
          <div key={departure.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0"><p className="font-bold text-text"><time dateTime={departure.startDate}>{formatDepartureRange(departure)}</time></p><p className="mt-1 text-sm text-muted">{departure.departureCity} çıkışlı · {departure.arrivalPoint}</p></div>
            <div className="flex items-center justify-between gap-4 sm:justify-end"><p className="shrink-0 whitespace-nowrap font-extrabold text-text tabular-nums">{formatTourPrice(departure.price, departure.currency)}</p>{departures.length === 1 ? <span className="shrink-0 rounded-full border border-brand/20 bg-brand/5 px-3 py-2 text-xs font-bold text-brand">Seçili tarih</span> : <button type="button" disabled={departure.status === "sold-out" || isSelected} onClick={() => { selectDeparture(departure.id); document.getElementById("booking-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="min-h-11 shrink-0 rounded-md border border-border px-4 text-sm font-bold text-text transition-colors hover:border-brand hover:text-brand disabled:cursor-default disabled:opacity-55">{isSelected ? "Seçili tarih" : departure.status === "sold-out" ? "Tükendi" : "Bu tarihi seç"}</button>}</div>
          </div>
        );
      })}
    </div>
  );
}
