"use client";

import { useTourDeparture } from "@/components/tours/detail/tour-departure-provider";
import { formatDepartureRange } from "@/lib/tour-detail-utils";
import type { TourDeparture } from "@/types/tour-detail";

export function DepartureSelector({ departures }: { departures: readonly TourDeparture[] }) {
  const { selectedDeparture, selectDeparture } = useTourDeparture();

  return (
    <div>
      <label htmlFor="tour-departure" className="text-sm font-bold text-text">
        Kalkış tarihi
      </label>
      <select id="tour-departure" value={selectedDeparture.id} onChange={(event) => selectDeparture(event.target.value)} className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-text outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15">
        {departures.map((departure) => (
          <option key={departure.id} value={departure.id} disabled={departure.status === "sold-out"}>
            {formatDepartureRange(departure, true)} · {departure.departureCity}{departure.status === "planned" ? " · Planlanıyor" : departure.status === "sold-out" ? " · Tükendi" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
