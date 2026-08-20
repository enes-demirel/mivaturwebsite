import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Tour, TourCurrency } from "@/types/tour";

const currencySymbols: Record<TourCurrency, string> = {
  TRY: "₺",
  EUR: "€",
  USD: "$",
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const numberFormatter = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0,
});

type TourCardProps = {
  tour: Tour;
};

export function TourCard({ tour }: TourCardProps) {
  const formattedDate = tour.nearestDepartureDate ? dateFormatter.format(new Date(`${tour.nearestDepartureDate}T00:00:00Z`)) : null;
  const formattedPrice = `${numberFormatter.format(tour.price)} ${currencySymbols[tour.currency]}`;

  return (
    <article className="h-full">
      <Card className="h-full overflow-hidden p-0!">
        <Link
          href={`/turlar/${tour.slug}`}
          className="group flex h-full flex-col rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-brand/25 focus-visible:ring-offset-2"
          aria-label={`${tour.title} turunu incele`}
        >
          <div className="relative aspect-video overflow-hidden bg-border/30">
            <Image
              src={tour.image}
              alt={tour.imageAlt}
              fill
              sizes="(min-width: 1280px) 280px, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
            {tour.badges.length > 0 && (
              <div className="absolute top-3 left-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
                {tour.badges.slice(0, 2).map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/80 bg-surface/95 px-2.5 py-1 text-[0.6875rem] font-bold text-text shadow-sm backdrop-blur-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <h3 className="text-lg leading-6 font-bold tracking-tight text-text transition-colors group-hover:text-brand sm:text-xl">
              {tour.title}
            </h3>
            <p className="mt-3 text-sm font-semibold text-text">
              {tour.durationDays} Gün <span aria-hidden="true">•</span>{" "}
              {tour.durationNights} Gece
            </p>
            {formattedDate ? <p className="mt-3 text-sm leading-6 text-muted">
              En yakın tarih:{" "}
              <time dateTime={tour.nearestDepartureDate}>{formattedDate}</time>
            </p> : <p className="mt-3 text-sm leading-6 text-muted">Yeni dönem tarihleri için bizimle iletişime geçin.</p>}
            {tour.departureCount > 1 && (
              <p className="mt-1 text-sm text-muted">
                {tour.departureCount} farklı kalkış tarihi
              </p>
            )}

            <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-6 sm:gap-4">
              {tour.price > 0 ? <p className="min-w-max shrink-0">
                <span className="block whitespace-nowrap text-[0.6875rem] text-muted sm:text-xs">
                  {tour.pricePrefix}
                </span>
                <span
                  className="mt-1 block whitespace-nowrap text-lg font-extrabold tracking-tight text-text tabular-nums sm:text-xl"
                  aria-label={`${tour.pricePrefix}: ${formattedPrice}`}
                >
                  {formattedPrice}
                </span>
              </p> : <p className="text-sm font-semibold text-muted">Fiyat bilgisi yakında</p>}
              <span className="shrink-0 whitespace-nowrap text-[0.8125rem] font-bold text-brand sm:text-sm">
                Turu İncele <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </Link>
      </Card>
    </article>
  );
}
