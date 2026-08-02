"use client";

import { DepartureSelector } from "@/components/tours/detail/departure-selector";
import { useTourDeparture } from "@/components/tours/detail/tour-departure-provider";
import { createWhatsAppUrl, formatTourPrice } from "@/lib/tour-detail-utils";
import type { Tour } from "@/types/tour";
import type { TourDeparture } from "@/types/tour-detail";

export function TourBookingPanel({ tour, departures, whatsappNumber }: { tour: Tour; departures: readonly TourDeparture[]; whatsappNumber: string | null }) {
  const { selectedDeparture } = useTourDeparture();
  const whatsappUrl = createWhatsAppUrl(whatsappNumber, tour.title, selectedDeparture);

  return (
    <aside className="rounded-lg border border-border bg-surface p-5 shadow-card" aria-label="Tur tarihi ve rezervasyon">
      <DepartureSelector departures={departures} />
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-border py-4 text-sm">
        <div><dt className="text-muted">Çıkış</dt><dd className="mt-1 font-bold text-text">{selectedDeparture.departureCity}</dd></div>
        <div><dt className="text-muted">Varış</dt><dd className="mt-1 font-bold text-text">{selectedDeparture.arrivalPoint}</dd></div>
        <div className="col-span-2"><dt className="text-muted">Ulaşım</dt><dd className="mt-1 font-semibold leading-6 text-text">{selectedDeparture.bookingTransportationLabel ?? selectedDeparture.transportationNote}</dd></div>
        {selectedDeparture.airline && <div className="col-span-2"><dt className="text-muted">Havayolu</dt><dd className="mt-1 font-bold text-text">{selectedDeparture.airline}</dd></div>}
      </dl>
      <div className="mt-4">
        <p className="text-xs text-muted">Kişi başı fiyat</p>
        {selectedDeparture.previousPrice && <p className="mt-1 whitespace-nowrap text-sm text-muted line-through tabular-nums">{formatTourPrice(selectedDeparture.previousPrice, selectedDeparture.currency)}</p>}
        <p className="mt-1 whitespace-nowrap text-3xl font-extrabold tracking-tight text-text tabular-nums">{formatTourPrice(selectedDeparture.price, selectedDeparture.currency)}</p>
        {selectedDeparture.roomOccupancyLabel && <p className="mt-2 text-xs leading-5 text-muted">{selectedDeparture.roomOccupancyLabel}</p>}
        {selectedDeparture.singleRoomSupplement && <p className="mt-3 text-sm font-semibold text-text">Tek kişilik oda farkı: <span className="whitespace-nowrap tabular-nums">{formatTourPrice(selectedDeparture.singleRoomSupplement, selectedDeparture.currency)}</span></p>}
      </div>
      {whatsappUrl ? (
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md border border-brand bg-brand px-5 text-center text-sm font-bold text-white transition-colors hover:bg-brand-hover focus-visible:ring-3 focus-visible:ring-brand/25">WhatsApp’tan Bilgi Al</a>
      ) : (
        <span aria-disabled="true" className="mt-5 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-md border border-border bg-border/40 px-5 text-center text-sm font-bold text-muted">WhatsApp’tan Bilgi Al</span>
      )}
    </aside>
  );
}
