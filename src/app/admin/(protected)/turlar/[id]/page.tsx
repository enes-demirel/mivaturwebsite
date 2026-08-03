import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { DeleteTourButton } from "@/components/admin/tours/delete-tour-button";
import { TourForm } from "@/components/admin/tours/tour-form";
import { StatusBadge } from "@/components/admin/tours/tour-list";
import { TourStatusActions } from "@/components/admin/tours/tour-status-actions";
import { createClient } from "@/lib/supabase/server";

type EditTourPageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string; updated?: string; error?: string }> };

export default async function EditTourPage({ params, searchParams }: EditTourPageProps) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const supabase = await createClient();
  const [{ data: tour }, { data: departures }] = await Promise.all([
    supabase.from("tours").select("id, title, slug, type, region, short_description, long_description, duration_days, duration_nights, transportation_type, visa_status, cover_image_path, pdf_path, room_occupancy_label, single_room_supplement, single_room_supplement_currency, featured_home, featured_order, status, seo_title, seo_description, created_at, updated_at").eq("id", id).maybeSingle(),
    supabase.from("tour_departures").select("id, tour_id, start_date, end_date, departure_city, arrival_point, price, currency, previous_price, airline, transportation_note, status, created_at, updated_at").eq("tour_id", id).order("start_date", { ascending: true }),
  ]);
  if (!tour) notFound();
  const query = await searchParams;
  const message = query.created === "1" ? "Tur başarıyla oluşturuldu." : query.updated === "1" ? "Değişiklikler kaydedildi." : query.error === "yayin-eksik" ? "Yayınlamak için temel bilgiler ve en az bir kalkış tarihi gereklidir." : query.error ? "İşlem tamamlanamadı." : null;

  return <div className="mx-auto max-w-6xl"><Link href="/admin/turlar" className="text-sm font-bold text-brand hover:underline">← Tur listesine dön</Link><div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><header><div className="flex items-center gap-3"><p className="text-xs font-extrabold tracking-[0.16em] text-brand uppercase">Tur Düzenle</p><StatusBadge status={tour.status} /></div><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{tour.title}</h1></header><div className="flex flex-wrap items-center gap-2"><TourStatusActions id={tour.id} status={tour.status} />{tour.status === "draft" && <DeleteTourButton id={tour.id} title={tour.title} />}</div></div>{message && <div className={`mt-6 rounded-md border px-4 py-3 text-sm font-semibold ${query.error ? "border-brand/20 bg-brand/5 text-brand" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{message}</div>}<div className="mt-8"><TourForm tour={tour} initialDepartures={departures ?? []} /></div></div>;
}
