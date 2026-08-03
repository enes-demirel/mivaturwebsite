"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { createTurkishSlug } from "@/lib/turkish-slug";
import { tourSchema, type ValidatedTour } from "@/lib/validation/tour";
import type { Database } from "@/types/database.types";

type TourInsert = Database["public"]["Tables"]["tours"]["Insert"];
type DepartureInsert = Database["public"]["Tables"]["tour_departures"]["Insert"];

export type TourFormState = {
  message: string | null;
  fieldErrors: Record<string, string>;
};

const uuidSchema = z.uuid();

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function trimmedText(formData: FormData, key: string) {
  return text(formData, key).trim();
}

function parseTourForm(formData: FormData) {
  const departureCountValue = Number.parseInt(text(formData, "departure_count"), 10);
  const departureCount = Number.isSafeInteger(departureCountValue)
    ? Math.max(0, Math.min(departureCountValue, 50))
    : 0;
  const departures = Array.from({ length: departureCount }, (_, index) => ({
    id: text(formData, `departures.${index}.id`),
    start_date: text(formData, `departures.${index}.start_date`),
    end_date: text(formData, `departures.${index}.end_date`),
    departure_city: trimmedText(formData, `departures.${index}.departure_city`),
    arrival_point: trimmedText(formData, `departures.${index}.arrival_point`),
    price: text(formData, `departures.${index}.price`),
    currency: text(formData, `departures.${index}.currency`),
    previous_price: text(formData, `departures.${index}.previous_price`),
    airline: trimmedText(formData, `departures.${index}.airline`),
    transportation_note: trimmedText(
      formData,
      `departures.${index}.transportation_note`,
    ),
    status: text(formData, `departures.${index}.status`),
  })).filter((departure) =>
    [
      departure.start_date,
      departure.end_date,
      departure.departure_city,
      departure.arrival_point,
      departure.price,
      departure.previous_price,
      departure.airline,
      departure.transportation_note,
    ].some((value) => value.trim() !== ""),
  );

  const status = text(formData, "submit_intent") === "published" ? "published" : "draft";
  const parsed = tourSchema.safeParse({
    title: trimmedText(formData, "title"),
    slug: createTurkishSlug(text(formData, "slug")),
    type: text(formData, "type"),
    region: trimmedText(formData, "region"),
    short_description: trimmedText(formData, "short_description"),
    long_description: trimmedText(formData, "long_description"),
    duration_days: text(formData, "duration_days"),
    duration_nights: text(formData, "duration_nights"),
    transportation_type: text(formData, "transportation_type"),
    visa_status: text(formData, "visa_status"),
    room_occupancy_label: trimmedText(formData, "room_occupancy_label"),
    single_room_supplement: text(formData, "single_room_supplement"),
    single_room_supplement_currency: text(formData, "single_room_supplement_currency"),
    featured_home: formData.get("featured_home") === "on",
    featured_order: text(formData, "featured_order"),
    seo_title: trimmedText(formData, "seo_title"),
    seo_description: trimmedText(formData, "seo_description"),
    status,
    departures,
  });

  if (parsed.success) return parsed;
  const fieldErrors: Record<string, string> = {};
  parsed.error.issues.forEach((issue) => {
    const key = issue.path.join(".");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  });
  return { success: false as const, error: { fieldErrors } };
}

function tourPayload(value: ValidatedTour): TourInsert {
  return {
    title: value.title,
    slug: value.slug,
    type: value.type,
    region: value.region,
    short_description: value.short_description,
    long_description: value.long_description,
    duration_days: value.duration_days,
    duration_nights: value.duration_nights,
    transportation_type: value.transportation_type,
    visa_status: value.visa_status,
    room_occupancy_label: value.room_occupancy_label,
    single_room_supplement: value.single_room_supplement,
    single_room_supplement_currency: value.single_room_supplement_currency,
    featured_home: value.featured_home,
    featured_order: value.featured_order,
    status: value.status,
    seo_title: value.seo_title,
    seo_description: value.seo_description,
  };
}

function departurePayload(
  departure: ValidatedTour["departures"][number],
  tourId: string,
): DepartureInsert {
  return {
    tour_id: tourId,
    start_date: departure.start_date,
    end_date: departure.end_date,
    departure_city: departure.departure_city,
    arrival_point: departure.arrival_point,
    price: departure.price,
    currency: departure.currency,
    previous_price: departure.previous_price,
    airline: departure.airline,
    transportation_note: departure.transportation_note,
    status: departure.status,
  };
}

function safeMutationError(code?: string): TourFormState {
  if (code === "23505") {
    return {
      message: "Bu URL adresi başka bir tur tarafından kullanılıyor.",
      fieldErrors: { slug: "Bu slug zaten kullanılıyor." },
    };
  }
  return { message: "İşlem tamamlanamadı. Lütfen tekrar deneyin.", fieldErrors: {} };
}

export async function createTourAction(
  _state: TourFormState,
  formData: FormData,
): Promise<TourFormState> {
  await requireAdmin();
  const parsed = parseTourForm(formData);
  if (!parsed.success) return { message: "Form alanlarını kontrol edin.", fieldErrors: parsed.error.fieldErrors };
  if (parsed.data.status === "published" && parsed.data.departures.length === 0) {
    return { message: "Yayınlamak için en az bir kalkış tarihi ekleyin.", fieldErrors: { departures: "En az bir kalkış zorunludur." } };
  }

  const supabase = await createClient();
  const { data: tour, error: tourError } = await supabase
    .from("tours")
    .insert(tourPayload(parsed.data))
    .select("id")
    .single();
  if (tourError || !tour) return safeMutationError(tourError?.code);

  if (parsed.data.departures.length > 0) {
    const { error: departureError } = await supabase
      .from("tour_departures")
      .insert(parsed.data.departures.map((departure) => departurePayload(departure, tour.id)));
    if (departureError) {
      await supabase.from("tours").delete().eq("id", tour.id).eq("status", parsed.data.status);
      return safeMutationError(departureError.code);
    }
  }

  revalidatePath("/admin/turlar");
  redirect(`/admin/turlar/${tour.id}?created=1`);
}

export async function updateTourAction(
  tourId: string,
  _state: TourFormState,
  formData: FormData,
): Promise<TourFormState> {
  await requireAdmin();
  if (!uuidSchema.safeParse(tourId).success) return safeMutationError();
  const parsed = parseTourForm(formData);
  if (!parsed.success) return { message: "Form alanlarını kontrol edin.", fieldErrors: parsed.error.fieldErrors };
  if (parsed.data.status === "published" && parsed.data.departures.length === 0) {
    return { message: "Yayınlamak için en az bir kalkış tarihi ekleyin.", fieldErrors: { departures: "En az bir kalkış zorunludur." } };
  }

  const supabase = await createClient();
  const { data: existingTour } = await supabase.from("tours").select("id").eq("id", tourId).maybeSingle();
  if (!existingTour) return { message: "Tur bulunamadı.", fieldErrors: {} };
  const { data: existingDepartures, error: existingError } = await supabase.from("tour_departures").select("id").eq("tour_id", tourId);
  if (existingError) return safeMutationError(existingError.code);

  const existingIds = new Set((existingDepartures ?? []).map(({ id }) => id));
  const submittedIds = parsed.data.departures.map(({ id }) => id).filter(Boolean);
  if (submittedIds.some((id) => !existingIds.has(id))) return safeMutationError();

  const { error: tourError } = await supabase.from("tours").update(tourPayload(parsed.data)).eq("id", tourId);
  if (tourError) return safeMutationError(tourError.code);

  const removedIds = [...existingIds].filter((id) => !submittedIds.includes(id));
  if (removedIds.length > 0) {
    const { error } = await supabase.from("tour_departures").delete().eq("tour_id", tourId).in("id", removedIds);
    if (error) return safeMutationError(error.code);
  }

  for (const departure of parsed.data.departures) {
    const payload = departurePayload(departure, tourId);
    const result = departure.id
      ? await supabase.from("tour_departures").update(payload).eq("tour_id", tourId).eq("id", departure.id)
      : await supabase.from("tour_departures").insert(payload);
    if (result.error) return safeMutationError(result.error.code);
  }

  revalidatePath("/admin/turlar");
  revalidatePath(`/admin/turlar/${tourId}`);
  redirect(`/admin/turlar/${tourId}?updated=1`);
}

async function updateStatus(formData: FormData, status: "published" | "draft" | "archived") {
  await requireAdmin();
  const id = text(formData, "id");
  if (!uuidSchema.safeParse(id).success) redirect("/admin/turlar");
  const supabase = await createClient();
  if (status === "published") {
    const { data: tour } = await supabase.from("tours").select("title, slug, short_description, duration_days").eq("id", id).maybeSingle();
    const { count } = await supabase.from("tour_departures").select("id", { count: "exact", head: true }).eq("tour_id", id);
    if (!tour?.title || !tour.slug || !tour.short_description || tour.duration_days <= 0 || !count) {
      redirect(`/admin/turlar/${id}?error=yayin-eksik`);
    }
  }
  const { error } = await supabase.from("tours").update({ status }).eq("id", id);
  if (error) redirect(`/admin/turlar/${id}?error=islem`);
  revalidatePath("/admin/turlar");
  revalidatePath(`/admin/turlar/${id}`);
  redirect(`/admin/turlar/${id}?updated=1`);
}

export async function publishTourAction(formData: FormData) { return updateStatus(formData, "published"); }
export async function moveTourToDraftAction(formData: FormData) { return updateStatus(formData, "draft"); }
export async function archiveTourAction(formData: FormData) { return updateStatus(formData, "archived"); }

export async function deleteDraftTourAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!uuidSchema.safeParse(id).success) redirect("/admin/turlar");
  const supabase = await createClient();
  const { data: tour } = await supabase.from("tours").select("status").eq("id", id).maybeSingle();
  if (tour?.status !== "draft") redirect(`/admin/turlar/${id}?error=silme`);
  const { error } = await supabase.from("tours").delete().eq("id", id).eq("status", "draft");
  if (error) redirect(`/admin/turlar/${id}?error=islem`);
  revalidatePath("/admin/turlar");
  redirect("/admin/turlar");
}
