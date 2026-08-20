import Link from "next/link";

import { TourCard } from "@/components/tours/tour-card";
import { TourDepartures } from "@/components/tours/detail/tour-departures";
import { TourItineraryJourney } from "@/components/tours/detail/tour-itinerary-journey";
import type { Tour } from "@/types/tour";
import type { TourDetail } from "@/types/tour-detail";

export function TourDetailIntroSections({ detail }: { detail: TourDetail }) {
  return (
    <div className="space-y-14 sm:space-y-16">
      <DetailSection id="tour-summary" title="Tur hakkında">
        <div className="max-w-3xl space-y-4 text-base leading-7 text-muted"><p>{detail.shortDescription}</p><p>{detail.longDescription}</p></div>
      </DetailSection>

      <DetailSection id="visited-places" title="Gezilecek ülkeler ve şehirler">
        <div className="grid gap-5 sm:grid-cols-2"><PlaceList title="Ülkeler" items={detail.visitedCountries} /><PlaceList title="Şehirler" items={detail.visitedCities.length ? detail.visitedCities : detail.hotelInformation?.map((hotel)=>hotel.location) ?? []} /></div>
      </DetailSection>

      {(detail.hotelInformation || detail.mealInformation) && (
        <DetailSection id="stay-and-meals" title="Konaklama ve yemek">
          <div className="grid gap-5 md:grid-cols-2">
            {detail.hotelInformation && <div className="rounded-lg border border-border bg-surface p-5 sm:p-6"><h3 className="text-lg font-bold text-text">Konaklama</h3><div className="mt-4 space-y-4">{detail.hotelInformation.map((hotel) => <div key={hotel.location}><p className="font-bold text-text">{hotel.location} — {hotel.nights} Gece</p><p className="mt-1 text-sm leading-6 text-muted">{hotel.description}</p></div>)}</div></div>}
            {(detail.mealInformation || detail.itinerary.some((day)=>day.meals)) && <div className="rounded-lg border border-border bg-surface p-5 sm:p-6"><h3 className="text-lg font-bold text-text">Yemek bilgisi</h3><ul className="mt-4 space-y-3">{(detail.mealInformation ?? [...new Set(detail.itinerary.map((day)=>day.meals).filter(Boolean))]).map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-muted"><span aria-hidden="true" className="text-brand">•</span>{item}</li>)}</ul></div>}
          </div>
        </DetailSection>
      )}
    </div>
  );
}

export function TourDetailSections({ detail, similarTours }: { detail: TourDetail; similarTours: readonly Tour[] }) {
  return (
    <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-16 lg:space-y-20">
      <DetailSection id="itinerary" title="Gün gün yolculuk" description="Her güne dokunarak rotanın duraklarını ve program ayrıntılarını inceleyin.">
        <TourItineraryJourney days={detail.itinerary} transfers={detail.dayTransfers} />
      </DetailSection>

      <DetailSection id="services" title="Tur kapsamı">
        <div className="grid gap-5 md:grid-cols-2"><ServiceList title="Fiyata dahil olanlar" items={detail.includedServices} included /><ServiceList title="Fiyata dahil olmayanlar" items={detail.excludedServices} /></div>
      </DetailSection>

      <DetailSection id="important-notes" title="Önemli bilgiler">
        <div className="divide-y divide-border border-y border-border">{detail.importantNotes.map((note) => <details key={note.title} className="group"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold text-text focus-visible:rounded-sm [&::-webkit-details-marker]:hidden"><span>{note.title}</span><span aria-hidden="true" className="text-xl text-brand">+</span></summary><p className="max-w-3xl pb-5 pr-8 text-sm leading-7 text-muted sm:text-base">{note.content}</p></details>)}</div>
      </DetailSection>

      {detail.pdfUrl && <DetailSection id="tour-pdf" title="Tur programı PDF’i"><div className="rounded-lg border border-border bg-surface p-5 shadow-card sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6"><div><h3 className="font-extrabold text-text">Tur Programını İnceleyin</h3><p className="mt-1 text-sm leading-6 text-muted">Güncel programı yeni sekmede görüntüleyebilir veya PDF olarak indirebilirsiniz.</p></div><div className="mt-5 flex flex-wrap gap-3 sm:mt-0 sm:shrink-0"><Link href={detail.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-sm font-bold text-white">Programı Görüntüle</Link><a href={`${detail.pdfUrl}?download=1`} className="inline-flex min-h-11 items-center rounded-md border border-border px-5 text-sm font-bold text-text">PDF İndir</a></div></div></DetailSection>}

      <DetailSection id="other-departures" title="Kalkış Tarihleri"><TourDepartures departures={detail.departures} /></DetailSection>

      {similarTours.length > 0 && <DetailSection id="similar-tours" title="Benzer turlar"><div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">{similarTours.map((tour) => <TourCard key={tour.id} tour={tour} />)}</div></DetailSection>}

      <DetailSection id="tour-faq" title="Turla ilgili sıkça sorulan sorular">
        <div className="max-w-4xl divide-y divide-border border-y border-border">{[...detail.faq].sort((a, b) => a.order - b.order).map((faq) => <details key={faq.id}><summary className="min-h-14 cursor-pointer list-none py-4 font-bold text-text focus-visible:rounded-sm [&::-webkit-details-marker]:hidden">{faq.question}</summary><p className="pb-5 text-sm leading-7 text-muted sm:text-base">{faq.answer}</p></details>)}</div>
      </DetailSection>
    </div>
  );
}

function DetailSection({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return <section aria-labelledby={`${id}-title`}><div className="mb-7"><h2 id={`${id}-title`} className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl">{title}</h2>{description && <p className="mt-3 max-w-2xl leading-7 text-muted">{description}</p>}</div>{children}</section>;
}

function PlaceList({ title, items }: { title: string; items: readonly string[] }) {
  return <div className="rounded-lg border border-border bg-surface p-5"><h3 className="font-bold text-text">{title}</h3><ul className="mt-3 flex flex-wrap gap-2">{items.map((item) => <li key={item} className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted">{item}</li>)}</ul></div>;
}

function ServiceList({ title, items, included = false }: { title: string; items: readonly string[]; included?: boolean }) {
  return <div className="rounded-lg border border-border bg-surface p-5 sm:p-6"><h3 className="text-lg font-bold text-text">{title}</h3><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted"><span aria-hidden="true" className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${included ? "bg-emerald-50 text-emerald-700" : "bg-brand/5 text-brand"}`}>{included ? "✓" : "×"}</span><span>{item}</span></li>)}</ul></div>;
}
