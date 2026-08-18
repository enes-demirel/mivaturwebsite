import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { DeleteTourButton } from "@/components/admin/tours/delete-tour-button";
import { TourContentManager } from "@/components/admin/tours/content/tour-content-manager";
import { TourGalleryManager } from "@/components/admin/tours/media/tour-gallery-manager";
import { TourPdfManager } from "@/components/admin/tours/media/tour-pdf-manager";
import { TourForm } from "@/components/admin/tours/tour-form";
import { StatusBadge } from "@/components/admin/tours/tour-list";
import { TourStatusActions } from "@/components/admin/tours/tour-status-actions";
import { createClient } from "@/lib/supabase/server";

type EditTourPageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string; updated?: string; error?: string }> };

export default async function EditTourPage({ params, searchParams }: EditTourPageProps) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const supabase = await createClient();
  const [tourResult, departuresResult, galleryResult, itineraryResult, hotelsResult, servicesResult, notesResult, faqsResult] = await Promise.all([
    supabase.from("tours").select("id, title, slug, type, region, short_description, long_description, duration_days, duration_nights, transportation_type, visa_status, cover_image_path, pdf_path, room_occupancy_label, single_room_supplement, single_room_supplement_currency, featured_home, featured_order, status, seo_title, seo_description, created_at, updated_at").eq("id", id).maybeSingle(),
    supabase.from("tour_departures").select("id, tour_id, start_date, end_date, departure_city, arrival_point, price, currency, previous_price, airline, transportation_note, status, created_at, updated_at").eq("tour_id", id).order("start_date", { ascending: true }),
    supabase.from("tour_gallery").select("id, tour_id, storage_path, alt_text, sort_order, is_cover, created_at").eq("tour_id", id).order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("tour_itinerary_days").select("id, tour_id, day_number, title, route, summary, description, image_path, image_alt, highlights, transportation, accommodation, meals, created_at, updated_at").eq("tour_id", id).order("day_number", { ascending: true }),
    supabase.from("tour_hotels").select("id, tour_id, city, night_count, hotel_name, stars, sort_order").eq("tour_id", id).order("sort_order", { ascending: true }),
    supabase.from("tour_service_items").select("id, tour_id, type, content, sort_order, created_at").eq("tour_id", id).order("type", { ascending: true }).order("sort_order", { ascending: true }),
    supabase.from("tour_important_notes").select("id, tour_id, title, content, sort_order, created_at, updated_at").eq("tour_id", id).order("sort_order", { ascending: true }),
    supabase.from("tour_faqs").select("id, tour_id, question, answer, published, sort_order, created_at, updated_at").eq("tour_id", id).order("sort_order", { ascending: true }),
  ]);
  const tour = tourResult.data;
  const departures = departuresResult.data;
  const gallery = galleryResult.data;
  if (!tour) notFound();
  const query = await searchParams;
  const message = query.created === "1" ? "Tur başarıyla oluşturuldu." : query.updated === "1" ? "Değişiklikler kaydedildi." : query.error === "yayin-eksik" ? "Yayınlamak için temel bilgiler ve en az bir kalkış tarihi gereklidir." : query.error ? "İşlem tamamlanamadı." : null;

  const galleryWithUrls = (gallery ?? []).map((image) => ({ ...image, publicUrl: supabase.storage.from("tour-images").getPublicUrl(image.storage_path).data.publicUrl }));
  const pdfUrl = tour.pdf_path ? supabase.storage.from("tour-pdfs").getPublicUrl(tour.pdf_path).data.publicUrl : null;
  const contentQueryFailed = Boolean(itineraryResult.error || hotelsResult.error || servicesResult.error || notesResult.error || faqsResult.error || galleryResult.error);

  return <div className="mx-auto max-w-6xl"><Link href="/admin/turlar" className="text-sm font-bold text-brand hover:underline">← Tur listesine dön</Link><div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><header><div className="flex items-center gap-3"><p className="text-xs font-extrabold tracking-[0.16em] text-brand uppercase">Tur Düzenle</p><StatusBadge status={tour.status} /></div><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{tour.title}</h1></header><div className="flex flex-wrap items-center gap-2"><TourStatusActions id={tour.id} status={tour.status} />{tour.status === "draft" && <DeleteTourButton id={tour.id} title={tour.title} />}</div></div>{message && <div className={`mt-6 rounded-md border px-4 py-3 text-sm font-semibold ${query.error ? "border-brand/20 bg-brand/5 text-brand" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{message}</div>}<div className="mt-8"><TourForm tour={tour} initialDepartures={departures ?? []} /></div><div className="mt-8 space-y-6"><TourGalleryManager tourId={tour.id} images={galleryWithUrls} /><TourPdfManager tourId={tour.id} pdfUrl={pdfUrl} /></div>{contentQueryFailed ? <div className="mt-10 rounded-lg border border-brand/20 bg-brand/5 p-5 text-sm font-semibold text-brand" role="alert">Tur içerikleri yüklenemedi. Lütfen sayfayı yenileyip tekrar deneyin.</div> : <TourContentManager tourId={tour.id} itinerary={itineraryResult.data ?? []} hotels={hotelsResult.data ?? []} services={servicesResult.data ?? []} notes={notesResult.data ?? []} faqs={faqsResult.data ?? []} gallery={galleryWithUrls} />}</div>;
}
