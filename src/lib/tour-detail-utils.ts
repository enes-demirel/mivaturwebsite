import type { Currency } from "@/types/tour";
import type { TourDeparture } from "@/types/tour-detail";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatTourPrice(price: number, currency: Currency) {
  const symbols: Record<Currency, string> = { TRY: "₺", EUR: "€", USD: "$" };
  const amount = new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(price);
  return `${amount} ${symbols[currency]}`;
}

export function formatDepartureRange(departure: TourDeparture, short = false) {
  const formatter = short ? shortDateFormatter : dateFormatter;
  return `${formatter.format(new Date(`${departure.startDate}T00:00:00Z`))} – ${formatter.format(new Date(`${departure.endDate}T00:00:00Z`))}`;
}

export function createWhatsAppUrl(
  number: string | null,
  tourTitle: string,
  departure: TourDeparture,
) {
  if (!number) return null;
  const message = `Merhaba, ${tourTitle} hakkında bilgi almak istiyorum.\nTercih edilen tarih: ${formatDepartureRange(departure)}`;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
