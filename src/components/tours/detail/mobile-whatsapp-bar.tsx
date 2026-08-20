"use client";

import { useTourDeparture } from "@/components/tours/detail/tour-departure-provider";
import { createWhatsAppUrl, formatTourPrice } from "@/lib/tour-detail-utils";

export function MobileWhatsAppBar({ tourTitle, whatsappUrl: whatsappBaseUrl }: { tourTitle: string; whatsappUrl: string }) {
  const { selectedDeparture } = useTourDeparture();
  const whatsappUrl = createWhatsAppUrl(whatsappBaseUrl, tourTitle, selectedDeparture);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-4 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgb(37_35_41_/_0.08)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1"><p className="text-[0.6875rem] text-muted">Kişi başı</p><p className="truncate whitespace-nowrap text-lg font-extrabold text-text tabular-nums">{formatTourPrice(selectedDeparture.price, selectedDeparture.currency)}</p></div>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-brand px-4 text-sm font-bold text-white hover:bg-brand-hover">WhatsApp’tan Bilgi Al</a>
      </div>
    </div>
  );
}
