import { ContentSectionCard } from "@/components/admin/tours/content/content-section-card";
import { HotelsManager } from "@/components/admin/tours/content/hotels-manager";
import { ImportantNotesManager } from "@/components/admin/tours/content/important-notes-manager";
import { ItineraryManager } from "@/components/admin/tours/content/itinerary-manager";
import { ServicesManager } from "@/components/admin/tours/content/services-manager";
import { TourFaqsManager } from "@/components/admin/tours/content/tour-faqs-manager";
import type { GalleryItemView } from "@/components/admin/tours/media/tour-gallery-manager";
import type { Database } from "@/types/database.types";
import type { TransferRow } from "@/lib/db/repositories/tour-content";

type Itinerary = Database["public"]["Tables"]["tour_itinerary_days"]["Row"];
type Hotel = Database["public"]["Tables"]["tour_hotels"]["Row"];
type Service = Database["public"]["Tables"]["tour_service_items"]["Row"];
type Note = Database["public"]["Tables"]["tour_important_notes"]["Row"];
type Faq = Database["public"]["Tables"]["tour_faqs"]["Row"];

export function TourContentManager({ tourId, itinerary, hotels, services, notes, faqs, gallery, transfers = [] }: { tourId: string; itinerary: readonly Itinerary[]; hotels: readonly Hotel[]; services: readonly Service[]; notes: readonly Note[]; faqs: readonly Faq[]; gallery: readonly GalleryItemView[]; transfers?: readonly TransferRow[] }) {
  const included = services.filter(({ type }) => type === "included").length;
  const excluded = services.filter(({ type }) => type === "excluded").length;
  const badges = [`${itinerary.length} Gün`, `${hotels.length} Konaklama`, `${included} Dahil`, `${excluded} Hariç`, `${notes.length} Not`, `${faqs.length} SSS`];
  return <section className="mt-10" aria-labelledby="tour-content-title"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-extrabold tracking-[0.14em] text-brand uppercase">Detaylı Yönetim</p><h2 id="tour-content-title" className="mt-1 text-2xl font-extrabold text-text">Tur İçeriği</h2><p className="mt-1 text-sm text-muted">Program, konaklama ve yolcu bilgilendirme içeriklerini yönetin.</p></div><div className="flex flex-wrap gap-2">{badges.map((badge) => <span key={badge} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted">{badge}</span>)}</div></div><div className="mt-6 space-y-4"><ContentSectionCard id="itinerary-section-title" title="Gün Gün Program" summary={`${itinerary.length} program günü`} defaultOpen><ItineraryManager tourId={tourId} days={itinerary} gallery={gallery} transfers={transfers} /></ContentSectionCard><ContentSectionCard id="hotels-section-title" title="Konaklama" summary={`${hotels.length} konaklama kaydı`}><HotelsManager tourId={tourId} hotels={hotels} /></ContentSectionCard><ContentSectionCard id="services-section-title" title="Dahil / Hariç" summary={`${included} dahil, ${excluded} hariç hizmet`}><ServicesManager tourId={tourId} services={services} /></ContentSectionCard><ContentSectionCard id="notes-section-title" title="Önemli Bilgiler" summary={`${notes.length} önemli bilgi`}><ImportantNotesManager tourId={tourId} notes={notes} /></ContentSectionCard><ContentSectionCard id="faqs-section-title" title="Sıkça Sorulan Sorular" summary={`${faqs.length} soru`}><TourFaqsManager tourId={tourId} faqs={faqs} /></ContentSectionCard></div></section>;
}
