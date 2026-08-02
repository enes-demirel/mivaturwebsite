import Link from "next/link";

import { MobileWhatsAppBar } from "@/components/tours/detail/mobile-whatsapp-bar";
import { TourBookingPanel } from "@/components/tours/detail/tour-booking-panel";
import { TourDepartureProvider } from "@/components/tours/detail/tour-departure-provider";
import { TourDetailIntroSections, TourDetailSections } from "@/components/tours/detail/tour-detail-sections";
import { TourGallery } from "@/components/tours/detail/tour-gallery";
import { ReservationForm } from "@/components/tours/detail/reservation-form";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/data/site-config";
import type { Tour } from "@/types/tour";
import type { TourDetail } from "@/types/tour-detail";

const transportationLabels = { plane: "Uçaklı tur", bus: "Otobüslü tur", train: "Trenli tur", mixed: "Karma ulaşım" } as const;
const visaLabels = { "visa-free": "Vizesiz", "visa-required": "Vizeli", special: "Özel vize koşulu" } as const;

export function TourDetailPage({ tour, detail, similarTours }: { tour: Tour; detail: TourDetail; similarTours: readonly Tour[] }) {
  const typeLabel = tour.type === "international" ? "Yurtdışı Turları" : "Yurtiçi Turlar";
  const typeHref = tour.type === "international" ? "/yurtdisi-turlari" : "/yurtici-turlar";

  return (
    <TourDepartureProvider departures={detail.departures}>
      <Container className="pb-32 pt-8 sm:pt-10 lg:pb-20">
        <nav aria-label="Sayfa yolu" className="text-sm text-muted">
          <ol className="flex min-w-0 flex-wrap items-center gap-2"><li><Link href="/" className="hover:text-brand">Ana Sayfa</Link></li><li aria-hidden="true">/</li><li><Link href="/turlar" className="hover:text-brand">Turlar</Link></li><li aria-hidden="true">/</li><li><Link href={typeHref} className="hover:text-brand">{typeLabel}</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="min-w-0 truncate text-text">{tour.title}</li></ol>
        </nav>

        <div className="mt-7 grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
          <div className="min-w-0">
            <p className="text-sm font-extrabold tracking-[0.12em] text-brand uppercase">{tour.region}</p>
            <h1 className="mt-3 max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-text sm:text-5xl lg:text-[3.5rem]">{tour.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted sm:text-lg">{detail.shortDescription}</p>
            <dl className="my-6 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-4 text-sm"><QuickFact label="Süre" value={`${tour.durationDays} gün ${tour.durationNights} gece`} /><QuickFact label="Ulaşım" value={transportationLabels[tour.transportationType]} /><QuickFact label="Vize" value={visaLabels[tour.visaStatus]} /><QuickFact label="Şehir" value={`${detail.visitedCities.length} şehir`} /></dl>
            <TourGallery images={detail.gallery} />
          </div>
          <div id="booking-panel" className="max-h-[calc(100svh-var(--header-height)-3rem)] min-w-0 scroll-mt-[calc(var(--header-height)+1.5rem)] overflow-y-auto lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]"><TourBookingPanel tour={tour} departures={detail.departures} whatsappNumber={siteConfig.whatsappNumber} /></div>
        </div>

        <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:gap-10">
          <aside className="min-w-0 rounded-lg border border-border bg-surface p-5 shadow-card lg:col-start-2 lg:row-start-1" aria-label="Rezervasyon talebi formu">
            <ReservationForm tourSlug={tour.slug} />
          </aside>
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <TourDetailIntroSections detail={detail} />
          </div>
        </div>

        <TourDetailSections detail={detail} similarTours={similarTours} />
      </Container>
      <MobileWhatsAppBar tourTitle={tour.title} whatsappNumber={siteConfig.whatsappNumber} />
    </TourDepartureProvider>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 font-bold text-text">{value}</dd></div>;
}
