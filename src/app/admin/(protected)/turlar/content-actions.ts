"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import {
  faqSchema,
  hotelSchema,
  importantNoteSchema,
  itinerarySchema,
  serviceSchema,
  serviceTypeSchema,
  type FaqInput,
  type HotelInput,
  type ImportantNoteInput,
  type ItineraryInput,
  type ServiceInput,
} from "@/lib/validation/tour-content";
import type { Database } from "@/types/database.types";

type ItineraryInsert = Database["public"]["Tables"]["tour_itinerary_days"]["Insert"];
type HotelInsert = Database["public"]["Tables"]["tour_hotels"]["Insert"];
type ServiceInsert = Database["public"]["Tables"]["tour_service_items"]["Insert"];
type NoteInsert = Database["public"]["Tables"]["tour_important_notes"]["Insert"];
type FaqInsert = Database["public"]["Tables"]["tour_faqs"]["Insert"];
type ServiceType = z.infer<typeof serviceTypeSchema>;
type Direction = "previous" | "next";

export type ContentActionResult = { success: boolean; message: string; fieldErrors: Record<string, string> };

const uuid = z.uuid();
const directionSchema = z.enum(["previous", "next"]);
const ok = (message: string): ContentActionResult => ({ success: true, message, fieldErrors: {} });
const fail = (message = "İşlem tamamlanamadı. Lütfen tekrar deneyin.", fieldErrors: Record<string, string> = {}): ContentActionResult => ({ success: false, message, fieldErrors });

function validationFailure(error: z.ZodError): ContentActionResult {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fail("Form alanlarını kontrol edin.", fieldErrors);
}

function validIds(tourId: string, recordId?: string) {
  return uuid.safeParse(tourId).success && (!recordId || uuid.safeParse(recordId).success);
}

async function tourExists(tourId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("tours").select("id").eq("id", tourId).maybeSingle();
  return Boolean(data);
}

function refresh(tourId: string) {
  revalidatePath(`/admin/turlar/${tourId}`);
}

function targetFor(rows: readonly { id: string }[], id: string, direction: Direction) {
  const index = rows.findIndex((row) => row.id === id);
  const target = direction === "previous" ? index - 1 : index + 1;
  return index >= 0 && target >= 0 && target < rows.length ? { index, target } : null;
}

async function validateGalleryImage(tourId: string, imagePath: string | null, imageAlt: string | null) {
  if (!imagePath) return { imagePath: null, imageAlt: null };
  if (!imageAlt) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("tour_gallery").select("storage_path").eq("tour_id", tourId).eq("storage_path", imagePath).maybeSingle();
  return data ? { imagePath: data.storage_path, imageAlt } : null;
}

export async function createItineraryDayAction(tourId: string, input: ItineraryInput): Promise<ContentActionResult> {
  await requireAdmin();
  if (!validIds(tourId) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil.");
  const parsed = itinerarySchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  const image = await validateGalleryImage(tourId, parsed.data.image_path, parsed.data.image_alt);
  if (!image) return fail("Seçilen görsel bu tura ait değil.", { image_path: "Geçerli bir galeri görseli seçin." });
  const supabase = await createClient();
  const { data: last } = await supabase.from("tour_itinerary_days").select("day_number").eq("tour_id", tourId).order("day_number", { ascending: false }).limit(1).maybeSingle();
  const payload: ItineraryInsert = { ...parsed.data, image_path: image.imagePath, image_alt: image.imageAlt, tour_id: tourId, day_number: (last?.day_number ?? 0) + 1 };
  const { error } = await supabase.from("tour_itinerary_days").insert(payload);
  if (error) return fail("Program günü eklenemedi. Lütfen tekrar deneyin.");
  refresh(tourId); return ok("Program günü eklendi.");
}

export async function updateItineraryDayAction(tourId: string, id: string, input: ItineraryInput): Promise<ContentActionResult> {
  await requireAdmin();
  if (!validIds(tourId, id) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil.");
  const parsed = itinerarySchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);
  const image = await validateGalleryImage(tourId, parsed.data.image_path, parsed.data.image_alt);
  if (!image) return fail("Seçilen görsel bu tura ait değil.", { image_path: "Geçerli bir galeri görseli seçin." });
  const supabase = await createClient();
  const { data, error } = await supabase.from("tour_itinerary_days").update({ ...parsed.data, image_path: image.imagePath, image_alt: image.imageAlt }).eq("id", id).eq("tour_id", tourId).select("id").maybeSingle();
  if (error || !data) return fail("Program günü güncellenemedi.");
  refresh(tourId); return ok("Program günü güncellendi.");
}

export async function moveItineraryDayAction(tourId: string, id: string, direction: Direction): Promise<ContentActionResult> {
  await requireAdmin();
  if (!validIds(tourId, id) || !directionSchema.safeParse(direction).success || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil.");
  const supabase = await createClient();
  const { data: rows, error } = await supabase.from("tour_itinerary_days").select("id, day_number").eq("tour_id", tourId).order("day_number");
  if (error || !rows) return fail("Program sırası güncellenemedi.");
  const move = targetFor(rows, id, direction);
  if (!move) return fail("Program günü bu yönde taşınamaz.");
  const current = rows[move.index]; const adjacent = rows[move.target];
  const temporary = Math.max(...rows.map((row) => row.day_number)) + 1000;
  const first = await supabase.from("tour_itinerary_days").update({ day_number: temporary }).eq("id", current.id).eq("tour_id", tourId);
  if (first.error) return fail("Program sırası güncellenemedi.");
  const second = await supabase.from("tour_itinerary_days").update({ day_number: current.day_number }).eq("id", adjacent.id).eq("tour_id", tourId);
  if (second.error) {
    await supabase.from("tour_itinerary_days").update({ day_number: current.day_number }).eq("id", current.id).eq("tour_id", tourId).eq("day_number", temporary);
    return fail("Program sırası güncellenemedi.");
  }
  const third = await supabase.from("tour_itinerary_days").update({ day_number: adjacent.day_number }).eq("id", current.id).eq("tour_id", tourId);
  if (third.error) {
    await supabase.from("tour_itinerary_days").update({ day_number: adjacent.day_number }).eq("id", adjacent.id).eq("tour_id", tourId).eq("day_number", current.day_number);
    await supabase.from("tour_itinerary_days").update({ day_number: current.day_number }).eq("id", current.id).eq("tour_id", tourId).eq("day_number", temporary);
    return fail("Program sırası güncellenemedi.");
  }
  refresh(tourId); return ok("Program sırası güncellendi.");
}

export async function deleteItineraryDayAction(tourId: string, id: string): Promise<ContentActionResult> {
  await requireAdmin();
  if (!validIds(tourId, id) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil.");
  const supabase = await createClient();
  const { data, error } = await supabase.from("tour_itinerary_days").delete().eq("id", id).eq("tour_id", tourId).select("id").maybeSingle();
  if (error || !data) return fail("Program günü silinemedi.");
  const { data: rows } = await supabase.from("tour_itinerary_days").select("id, day_number").eq("tour_id", tourId).order("day_number");
  for (const [index, row] of (rows ?? []).entries()) if (row.day_number !== index + 1) await supabase.from("tour_itinerary_days").update({ day_number: index + 1 }).eq("id", row.id).eq("tour_id", tourId);
  refresh(tourId); return ok("Program günü silindi.");
}

export async function createHotelAction(tourId: string, input: HotelInput): Promise<ContentActionResult> {
  await requireAdmin();
  if (!validIds(tourId) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil.");
  const parsed = hotelSchema.safeParse(input); if (!parsed.success) return validationFailure(parsed.error);
  const supabase = await createClient(); const { data: last } = await supabase.from("tour_hotels").select("sort_order").eq("tour_id", tourId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const payload: HotelInsert = { ...parsed.data, tour_id: tourId, sort_order: (last?.sort_order ?? -1) + 1 };
  const { error } = await supabase.from("tour_hotels").insert(payload); if (error) return fail("Konaklama bilgisi kaydedilemedi.");
  refresh(tourId); return ok("Konaklama eklendi.");
}

export async function updateHotelAction(tourId: string, id: string, input: HotelInput): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil.");
  const parsed = hotelSchema.safeParse(input); if (!parsed.success) return validationFailure(parsed.error);
  const supabase = await createClient(); const { data, error } = await supabase.from("tour_hotels").update(parsed.data).eq("id", id).eq("tour_id", tourId).select("id").maybeSingle();
  if (error || !data) return fail("Konaklama bilgisi kaydedilemedi."); refresh(tourId); return ok("Konaklama güncellendi.");
}

export async function moveHotelAction(tourId: string, id: string, direction: Direction): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || !directionSchema.safeParse(direction).success || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil.");
  const supabase = await createClient(); const { data: rows } = await supabase.from("tour_hotels").select("id, sort_order").eq("tour_id", tourId).order("sort_order"); const move = rows ? targetFor(rows, id, direction) : null;
  if (!rows || !move) return fail("Konaklama bu yönde taşınamaz.");
  const a = await supabase.from("tour_hotels").update({ sort_order: move.target }).eq("id", rows[move.index].id).eq("tour_id", tourId); const b = await supabase.from("tour_hotels").update({ sort_order: move.index }).eq("id", rows[move.target].id).eq("tour_id", tourId);
  if (a.error || b.error) return fail("Konaklama sırası güncellenemedi."); refresh(tourId); return ok("Konaklama sırası güncellendi.");
}

export async function deleteHotelAction(tourId: string, id: string): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const supabase = await createClient();
  const { data, error } = await supabase.from("tour_hotels").delete().eq("id", id).eq("tour_id", tourId).select("id").maybeSingle(); if (error || !data) return fail("Konaklama silinemedi.");
  const { data: rows } = await supabase.from("tour_hotels").select("id, sort_order").eq("tour_id", tourId).order("sort_order"); for (const [index, row] of (rows ?? []).entries()) if (row.sort_order !== index) await supabase.from("tour_hotels").update({ sort_order: index }).eq("id", row.id).eq("tour_id", tourId);
  refresh(tourId); return ok("Konaklama silindi.");
}

export async function createServiceAction(tourId: string, type: ServiceType, input: ServiceInput): Promise<ContentActionResult> {
  await requireAdmin(); const validType = serviceTypeSchema.safeParse(type); if (!validIds(tourId) || !validType.success || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil.");
  const parsed = serviceSchema.safeParse(input); if (!parsed.success) return validationFailure(parsed.error); const supabase = await createClient();
  const { data: last } = await supabase.from("tour_service_items").select("sort_order").eq("tour_id", tourId).eq("type", validType.data).order("sort_order", { ascending: false }).limit(1).maybeSingle(); const payload: ServiceInsert = { ...parsed.data, tour_id: tourId, type: validType.data, sort_order: (last?.sort_order ?? -1) + 1 };
  const { error } = await supabase.from("tour_service_items").insert(payload); if (error) return fail("Hizmet maddesi eklenemedi."); refresh(tourId); return ok("Hizmet maddesi eklendi.");
}

export async function updateServiceAction(tourId: string, id: string, type: ServiceType, input: ServiceInput): Promise<ContentActionResult> {
  await requireAdmin(); const validType = serviceTypeSchema.safeParse(type); if (!validIds(tourId, id) || !validType.success || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const parsed = serviceSchema.safeParse(input); if (!parsed.success) return validationFailure(parsed.error); const supabase = await createClient();
  const { data, error } = await supabase.from("tour_service_items").update(parsed.data).eq("id", id).eq("tour_id", tourId).eq("type", validType.data).select("id").maybeSingle(); if (error || !data) return fail("Hizmet maddesi güncellenemedi."); refresh(tourId); return ok("Hizmet maddesi güncellendi.");
}

export async function moveServiceAction(tourId: string, id: string, type: ServiceType, direction: Direction): Promise<ContentActionResult> {
  await requireAdmin(); const validType = serviceTypeSchema.safeParse(type); if (!validIds(tourId, id) || !validType.success || !directionSchema.safeParse(direction).success || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const supabase = await createClient();
  const { data: rows } = await supabase.from("tour_service_items").select("id, sort_order").eq("tour_id", tourId).eq("type", validType.data).order("sort_order"); const move = rows ? targetFor(rows, id, direction) : null; if (!rows || !move) return fail("Hizmet maddesi bu yönde taşınamaz.");
  const a = await supabase.from("tour_service_items").update({ sort_order: move.target }).eq("id", rows[move.index].id).eq("tour_id", tourId).eq("type", validType.data); const b = await supabase.from("tour_service_items").update({ sort_order: move.index }).eq("id", rows[move.target].id).eq("tour_id", tourId).eq("type", validType.data); if (a.error || b.error) return fail("Hizmet sırası güncellenemedi."); refresh(tourId); return ok("Hizmet sırası güncellendi.");
}

export async function deleteServiceAction(tourId: string, id: string, type: ServiceType): Promise<ContentActionResult> {
  await requireAdmin(); const validType = serviceTypeSchema.safeParse(type); if (!validIds(tourId, id) || !validType.success || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const supabase = await createClient();
  const { data, error } = await supabase.from("tour_service_items").delete().eq("id", id).eq("tour_id", tourId).eq("type", validType.data).select("id").maybeSingle(); if (error || !data) return fail("Hizmet maddesi silinemedi."); const { data: rows } = await supabase.from("tour_service_items").select("id, sort_order").eq("tour_id", tourId).eq("type", validType.data).order("sort_order"); for (const [index, row] of (rows ?? []).entries()) if (row.sort_order !== index) await supabase.from("tour_service_items").update({ sort_order: index }).eq("id", row.id).eq("tour_id", tourId).eq("type", validType.data); refresh(tourId); return ok("Hizmet maddesi silindi.");
}

export async function createImportantNoteAction(tourId: string, input: ImportantNoteInput): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const parsed = importantNoteSchema.safeParse(input); if (!parsed.success) return validationFailure(parsed.error); const supabase = await createClient(); const { data: last } = await supabase.from("tour_important_notes").select("sort_order").eq("tour_id", tourId).order("sort_order", { ascending: false }).limit(1).maybeSingle(); const payload: NoteInsert = { ...parsed.data, tour_id: tourId, sort_order: (last?.sort_order ?? -1) + 1 }; const { error } = await supabase.from("tour_important_notes").insert(payload); if (error) return fail("Önemli bilgi eklenemedi."); refresh(tourId); return ok("Önemli bilgi eklendi.");
}

export async function updateImportantNoteAction(tourId: string, id: string, input: ImportantNoteInput): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const parsed = importantNoteSchema.safeParse(input); if (!parsed.success) return validationFailure(parsed.error); const supabase = await createClient(); const { data, error } = await supabase.from("tour_important_notes").update(parsed.data).eq("id", id).eq("tour_id", tourId).select("id").maybeSingle(); if (error || !data) return fail("Önemli bilgi güncellenemedi."); refresh(tourId); return ok("Önemli bilgi güncellendi.");
}

export async function moveImportantNoteAction(tourId: string, id: string, direction: Direction): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || !directionSchema.safeParse(direction).success || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const supabase = await createClient(); const { data: rows } = await supabase.from("tour_important_notes").select("id, sort_order").eq("tour_id", tourId).order("sort_order"); const move = rows ? targetFor(rows, id, direction) : null; if (!rows || !move) return fail("Önemli bilgi bu yönde taşınamaz."); const a = await supabase.from("tour_important_notes").update({ sort_order: move.target }).eq("id", rows[move.index].id).eq("tour_id", tourId); const b = await supabase.from("tour_important_notes").update({ sort_order: move.index }).eq("id", rows[move.target].id).eq("tour_id", tourId); if (a.error || b.error) return fail("Önemli bilgi sırası güncellenemedi."); refresh(tourId); return ok("Önemli bilgi sırası güncellendi.");
}

export async function deleteImportantNoteAction(tourId: string, id: string): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const supabase = await createClient(); const { data, error } = await supabase.from("tour_important_notes").delete().eq("id", id).eq("tour_id", tourId).select("id").maybeSingle(); if (error || !data) return fail("Önemli bilgi silinemedi."); const { data: rows } = await supabase.from("tour_important_notes").select("id, sort_order").eq("tour_id", tourId).order("sort_order"); for (const [index, row] of (rows ?? []).entries()) if (row.sort_order !== index) await supabase.from("tour_important_notes").update({ sort_order: index }).eq("id", row.id).eq("tour_id", tourId); refresh(tourId); return ok("Önemli bilgi silindi.");
}

export async function createFaqAction(tourId: string, input: FaqInput): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const parsed = faqSchema.safeParse(input); if (!parsed.success) return validationFailure(parsed.error); const supabase = await createClient(); const { data: last } = await supabase.from("tour_faqs").select("sort_order").eq("tour_id", tourId).order("sort_order", { ascending: false }).limit(1).maybeSingle(); const payload: FaqInsert = { ...parsed.data, tour_id: tourId, sort_order: (last?.sort_order ?? -1) + 1 }; const { error } = await supabase.from("tour_faqs").insert(payload); if (error) return fail("SSS eklenemedi."); refresh(tourId); return ok("SSS eklendi.");
}

export async function updateFaqAction(tourId: string, id: string, input: FaqInput): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const parsed = faqSchema.safeParse(input); if (!parsed.success) return validationFailure(parsed.error); const supabase = await createClient(); const { data, error } = await supabase.from("tour_faqs").update(parsed.data).eq("id", id).eq("tour_id", tourId).select("id").maybeSingle(); if (error || !data) return fail("SSS güncellenemedi."); refresh(tourId); return ok("SSS güncellendi.");
}

export async function toggleFaqPublishedAction(tourId: string, id: string, published: boolean): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || typeof published !== "boolean" || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const supabase = await createClient(); const { data, error } = await supabase.from("tour_faqs").update({ published }).eq("id", id).eq("tour_id", tourId).select("id").maybeSingle(); if (error || !data) return fail("SSS yayın durumu güncellenemedi."); refresh(tourId); return ok(published ? "SSS yayınlandı." : "SSS taslağa alındı.");
}

export async function moveFaqAction(tourId: string, id: string, direction: Direction): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || !directionSchema.safeParse(direction).success || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const supabase = await createClient(); const { data: rows } = await supabase.from("tour_faqs").select("id, sort_order").eq("tour_id", tourId).order("sort_order"); const move = rows ? targetFor(rows, id, direction) : null; if (!rows || !move) return fail("SSS bu yönde taşınamaz."); const a = await supabase.from("tour_faqs").update({ sort_order: move.target }).eq("id", rows[move.index].id).eq("tour_id", tourId); const b = await supabase.from("tour_faqs").update({ sort_order: move.index }).eq("id", rows[move.target].id).eq("tour_id", tourId); if (a.error || b.error) return fail("SSS sırası güncellenemedi."); refresh(tourId); return ok("SSS sırası güncellendi.");
}

export async function deleteFaqAction(tourId: string, id: string): Promise<ContentActionResult> {
  await requireAdmin(); if (!validIds(tourId, id) || !(await tourExists(tourId))) return fail("Kayıt bulunamadı veya bu tura ait değil."); const supabase = await createClient(); const { data, error } = await supabase.from("tour_faqs").delete().eq("id", id).eq("tour_id", tourId).select("id").maybeSingle(); if (error || !data) return fail("SSS silinemedi."); const { data: rows } = await supabase.from("tour_faqs").select("id, sort_order").eq("tour_id", tourId).order("sort_order"); for (const [index, row] of (rows ?? []).entries()) if (row.sort_order !== index) await supabase.from("tour_faqs").update({ sort_order: index }).eq("id", row.id).eq("tour_id", tourId); refresh(tourId); return ok("SSS silindi.");
}
