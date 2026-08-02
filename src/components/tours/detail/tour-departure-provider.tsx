"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { TourDeparture } from "@/types/tour-detail";

type DepartureContextValue = {
  selectedDeparture: TourDeparture;
  selectDeparture: (id: string) => void;
};

const DepartureContext = createContext<DepartureContextValue | null>(null);

export function TourDepartureProvider({ departures, children }: { departures: readonly TourDeparture[]; children: React.ReactNode }) {
  const initialDeparture = departures.find((departure) => departure.status === "available") ?? departures[0];
  const [selectedId, setSelectedId] = useState(initialDeparture.id);
  const selectedDeparture = useMemo(
    () => departures.find((departure) => departure.id === selectedId) ?? initialDeparture,
    [departures, initialDeparture, selectedId],
  );

  return (
    <DepartureContext value={{ selectedDeparture, selectDeparture: setSelectedId }}>
      {children}
    </DepartureContext>
  );
}

export function useTourDeparture() {
  const value = useContext(DepartureContext);
  if (!value) throw new Error("useTourDeparture must be used within TourDepartureProvider");
  return value;
}
