"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  IMAGE_BUCKET,
  IMAGE_MIME_EXTENSIONS,
  isImageMimeType,
  MAX_IMAGE_SIZE,
  MAX_PDF_SIZE,
} from "@/lib/storage/file-validation";
import { isValidTourStoragePath } from "@/lib/storage/path";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type GalleryRow = Database["public"]["Tables"]["tour_gallery"]["Row"];
type GalleryInsert = Database["public"]["Tables"]["tour_gallery"]["Insert"];
type GalleryUpdate = Database["public"]["Tables"]["tour_gallery"]["Update"];

export type MediaActionResult = { success: boolean; message: string };

const uuidSchema = z.uuid();
const altTextSchema = z.string().trim().min(3, "Alt metin en az 3 karakter olmalıdır.").max(180, "Alt metin en fazla 180 karakter olabilir.");

function failure(message = "İşlem tamamlanamadı. Lütfen tekrar deneyin."): MediaActionResult {
  return { success: false, message };
}

function success(message: string): MediaActionResult {
  return { success: true, message };
}

function revalidateTourMedia(tourId: string) {
  revalidatePath(`/admin/turlar/${tourId}`);
  revalidatePath("/admin/turlar");
}

async function removeStorageObject(bucket: string, path: string) {
  const supabase = await createClient();
  await supabase.storage.from(bucket).remove([path]);
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function removeTourPdfFile(
  supabase: SupabaseServerClient,
  tourId: string,
  storagePath: string,
) {
  if (!isValidTourStoragePath(storagePath, tourId, ["pdf"])) {
    return { success: false as const };
  }

  const { data, error } = await supabase.storage
    .from("tour-pdfs")
    .remove([storagePath]);

  if (error || !data?.some(({ name }) => name === storagePath)) {
    return { success: false as const };
  }

  return { success: true as const };
}

async function tourExists(tourId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("tours").select("id").eq("id", tourId).maybeSingle();
  return Boolean(data);
}

async function normalizeGalleryOrder(tourId: string, rows?: readonly Pick<GalleryRow, "id" | "sort_order">[]) {
  const supabase = await createClient();
  let ordered = rows;
  if (!ordered) {
    const { data } = await supabase.from("tour_gallery").select("id, sort_order").eq("tour_id", tourId).order("sort_order").order("created_at");
    ordered = data ?? [];
  }
  for (const [index, row] of ordered.entries()) {
    if (row.sort_order !== index) {
      const update: GalleryUpdate = { sort_order: index };
      await supabase.from("tour_gallery").update(update).eq("id", row.id).eq("tour_id", tourId);
    }
  }
}

export async function registerGalleryImageAction(input: {
  tourId: string;
  storagePath: string;
  altText: string;
  mimeType: string;
  fileSize: number;
}): Promise<MediaActionResult> {
  await requireAdmin();
  const { tourId, storagePath, mimeType, fileSize } = input;
  const altText = altTextSchema.safeParse(input.altText);
  const validMime = isImageMimeType(mimeType);
  const extension = validMime ? IMAGE_MIME_EXTENSIONS[mimeType] : "";
  const validPath = isValidTourStoragePath(storagePath, tourId, ["jpg", "png", "webp", "avif"]);
  if (!uuidSchema.safeParse(tourId).success || !validPath || !validMime || !Number.isSafeInteger(fileSize) || fileSize <= 0 || fileSize > MAX_IMAGE_SIZE || !altText.success) {
    if (validPath) await removeStorageObject(IMAGE_BUCKET, storagePath);
    return failure(altText.success ? "Görsel bilgileri geçersiz." : altText.error.issues[0]?.message);
  }
  if (!storagePath.endsWith(`.${extension}`) || !(await tourExists(tourId))) {
    await removeStorageObject(IMAGE_BUCKET, storagePath);
    return failure("Görsel yolu veya tur kaydı geçersiz.");
  }

  const supabase = await createClient();
  const [{ data: duplicate }, { data: gallery }] = await Promise.all([
    supabase.from("tour_gallery").select("id").eq("storage_path", storagePath).maybeSingle(),
    supabase.from("tour_gallery").select("id, sort_order").eq("tour_id", tourId).order("sort_order", { ascending: false }).limit(1),
  ]);
  if (duplicate) {
    await removeStorageObject(IMAGE_BUCKET, storagePath);
    return failure("Bu görsel daha önce kaydedilmiş.");
  }

  const isCover = !gallery?.length;
  const insert: GalleryInsert = {
    tour_id: tourId,
    storage_path: storagePath,
    alt_text: altText.data,
    sort_order: (gallery?.[0]?.sort_order ?? -1) + 1,
    is_cover: isCover,
  };
  const { data: created, error } = await supabase.from("tour_gallery").insert(insert).select("id").single();
  if (error || !created) {
    await removeStorageObject(IMAGE_BUCKET, storagePath);
    return failure();
  }
  if (isCover) {
    const { error: coverError } = await supabase.from("tours").update({ cover_image_path: storagePath }).eq("id", tourId);
    if (coverError) {
      await supabase.from("tour_gallery").delete().eq("id", created.id).eq("tour_id", tourId);
      await removeStorageObject(IMAGE_BUCKET, storagePath);
      return failure();
    }
  }
  revalidateTourMedia(tourId);
  return success("Görsel galeriye eklendi.");
}

export async function updateGalleryAltTextAction(tourId: string, galleryId: string, altTextValue: string): Promise<MediaActionResult> {
  await requireAdmin();
  const altText = altTextSchema.safeParse(altTextValue);
  if (!uuidSchema.safeParse(tourId).success || !uuidSchema.safeParse(galleryId).success || !altText.success) return failure(altText.success ? "Geçersiz görsel kaydı." : altText.error.issues[0]?.message);
  const supabase = await createClient();
  const { data, error } = await supabase.from("tour_gallery").update({ alt_text: altText.data }).eq("id", galleryId).eq("tour_id", tourId).select("id").maybeSingle();
  if (error || !data) return failure();
  revalidateTourMedia(tourId);
  return success("Alt metin güncellendi.");
}

export async function setTourCoverImageAction(tourId: string, galleryId: string): Promise<MediaActionResult> {
  await requireAdmin();
  if (!uuidSchema.safeParse(tourId).success || !uuidSchema.safeParse(galleryId).success) return failure("Geçersiz görsel kaydı.");
  const supabase = await createClient();
  const { data: rows } = await supabase.from("tour_gallery").select("id, storage_path, is_cover").eq("tour_id", tourId);
  const selected = rows?.find(({ id }) => id === galleryId);
  if (!selected) return failure("Görsel bu tura ait değil.");
  const previous = rows?.find(({ is_cover }) => is_cover);
  const { error: clearError } = await supabase.from("tour_gallery").update({ is_cover: false }).eq("tour_id", tourId);
  if (clearError) return failure();
  const { error: selectError } = await supabase.from("tour_gallery").update({ is_cover: true }).eq("id", galleryId).eq("tour_id", tourId);
  const { error: tourError } = selectError ? { error: selectError } : await supabase.from("tours").update({ cover_image_path: selected.storage_path }).eq("id", tourId);
  if (tourError) {
    await supabase.from("tour_gallery").update({ is_cover: false }).eq("tour_id", tourId);
    if (previous) await supabase.from("tour_gallery").update({ is_cover: true }).eq("id", previous.id).eq("tour_id", tourId);
    return failure();
  }
  revalidateTourMedia(tourId);
  return success("Kapak görseli güncellendi.");
}

export async function moveGalleryImageAction(tourId: string, galleryId: string, direction: "previous" | "next"): Promise<MediaActionResult> {
  await requireAdmin();
  if (!uuidSchema.safeParse(tourId).success || !uuidSchema.safeParse(galleryId).success || !["previous", "next"].includes(direction)) return failure("Geçersiz sıralama isteği.");
  const supabase = await createClient();
  const { data: rows, error } = await supabase.from("tour_gallery").select("id, sort_order").eq("tour_id", tourId).order("sort_order").order("created_at");
  if (error || !rows) return failure();
  await normalizeGalleryOrder(tourId, rows);
  const index = rows.findIndex(({ id }) => id === galleryId);
  const targetIndex = direction === "previous" ? index - 1 : index + 1;
  if (index < 0 || targetIndex < 0 || targetIndex >= rows.length) return failure("Görsel bu yönde taşınamaz.");
  const firstUpdate: GalleryUpdate = { sort_order: targetIndex };
  const secondUpdate: GalleryUpdate = { sort_order: index };
  const first = await supabase.from("tour_gallery").update(firstUpdate).eq("id", rows[index].id).eq("tour_id", tourId);
  const second = await supabase.from("tour_gallery").update(secondUpdate).eq("id", rows[targetIndex].id).eq("tour_id", tourId);
  if (first.error || second.error) {
    await normalizeGalleryOrder(tourId);
    return failure();
  }
  revalidateTourMedia(tourId);
  return success("Görsel sırası güncellendi.");
}

export async function deleteGalleryImageAction(tourId: string, galleryId: string): Promise<MediaActionResult> {
  await requireAdmin();
  if (!uuidSchema.safeParse(tourId).success || !uuidSchema.safeParse(galleryId).success) return failure("Geçersiz görsel kaydı.");
  const supabase = await createClient();
  const { data: image } = await supabase.from("tour_gallery").select("id, storage_path, is_cover").eq("id", galleryId).eq("tour_id", tourId).maybeSingle();
  if (!image || !isValidTourStoragePath(image.storage_path, tourId, ["jpg", "png", "webp", "avif"])) return failure("Görsel bu tura ait değil.");
  const { error: storageError } = await supabase.storage.from(IMAGE_BUCKET).remove([image.storage_path]);
  if (storageError) return failure("Görsel dosyası silinemedi.");
  const { error: deleteError } = await supabase.from("tour_gallery").delete().eq("id", galleryId).eq("tour_id", tourId);
  if (deleteError) return failure("Dosya silindi ancak galeri kaydı güncellenemedi. Lütfen yöneticinize bildirin.");

  const { data: remaining } = await supabase.from("tour_gallery").select("id, storage_path, sort_order, is_cover").eq("tour_id", tourId).order("sort_order").order("created_at");
  await normalizeGalleryOrder(tourId, remaining ?? []);
  if (image.is_cover) {
    const next = remaining?.[0];
    if (next) await supabase.from("tour_gallery").update({ is_cover: true }).eq("id", next.id).eq("tour_id", tourId);
    await supabase.from("tours").update({ cover_image_path: next?.storage_path ?? null }).eq("id", tourId);
  }
  revalidateTourMedia(tourId);
  return success("Görsel silindi.");
}

export async function registerTourPdfAction(input: { tourId: string; storagePath: string; mimeType: string; fileSize: number }): Promise<MediaActionResult> {
  await requireAdmin();
  const validPath = isValidTourStoragePath(input.storagePath, input.tourId, ["pdf"]);
  if (!uuidSchema.safeParse(input.tourId).success || !validPath || input.mimeType !== "application/pdf" || !Number.isSafeInteger(input.fileSize) || input.fileSize <= 0 || input.fileSize > MAX_PDF_SIZE) {
    if (validPath) {
      const cleanupClient = await createClient();
      await removeTourPdfFile(cleanupClient, input.tourId, input.storagePath);
    }
    return failure("PDF bilgileri geçersiz.");
  }
  const supabase = await createClient();
  const { data: tour } = await supabase.from("tours").select("id, pdf_path").eq("id", input.tourId).maybeSingle();
  if (!tour) {
    await removeTourPdfFile(supabase, input.tourId, input.storagePath);
    return failure("Tur kaydı bulunamadı.");
  }
  if (tour.pdf_path && !isValidTourStoragePath(tour.pdf_path, input.tourId, ["pdf"])) {
    await removeTourPdfFile(supabase, input.tourId, input.storagePath);
    return failure("Mevcut PDF kaydı güvenli biçimde doğrulanamadı.");
  }

  const { data: updatedTour, error } = await supabase
    .from("tours")
    .update({ pdf_path: input.storagePath })
    .eq("id", input.tourId)
    .select("id")
    .maybeSingle();
  if (error || !updatedTour) {
    await removeTourPdfFile(supabase, input.tourId, input.storagePath);
    return failure();
  }

  if (tour.pdf_path && tour.pdf_path !== input.storagePath) {
    const oldPdfRemoval = await removeTourPdfFile(supabase, input.tourId, tour.pdf_path);
    if (!oldPdfRemoval.success) {
      const { data: rolledBackTour, error: rollbackError } = await supabase
        .from("tours")
        .update({ pdf_path: tour.pdf_path })
        .eq("id", input.tourId)
        .eq("pdf_path", input.storagePath)
        .select("id")
        .maybeSingle();

      if (!rollbackError && rolledBackTour) {
        await removeTourPdfFile(supabase, input.tourId, input.storagePath);
      }
      return failure("Eski PDF silinemediği için değişiklik tamamlanamadı.");
    }
  }
  revalidateTourMedia(input.tourId);
  return success(tour.pdf_path ? "PDF değiştirildi." : "PDF yüklendi.");
}

export async function deleteTourPdfAction(tourId: string): Promise<MediaActionResult> {
  await requireAdmin();
  if (!uuidSchema.safeParse(tourId).success) return failure("Geçersiz tur kaydı.");
  const supabase = await createClient();
  const { data: tour } = await supabase.from("tours").select("pdf_path").eq("id", tourId).maybeSingle();
  if (!tour?.pdf_path || !isValidTourStoragePath(tour.pdf_path, tourId, ["pdf"])) return failure("Bu tura ait PDF bulunamadı.");
  const pdfRemoval = await removeTourPdfFile(supabase, tourId, tour.pdf_path);
  if (!pdfRemoval.success) return failure("PDF dosyası silinemedi.");
  const { data: updatedTour, error } = await supabase
    .from("tours")
    .update({ pdf_path: null })
    .eq("id", tourId)
    .eq("pdf_path", tour.pdf_path)
    .select("id")
    .maybeSingle();
  if (error || !updatedTour) return failure("Dosya silindi ancak PDF kaydı güncellenemedi. Lütfen yöneticinize bildirin.");
  revalidateTourMedia(tourId);
  return success("PDF silindi.");
}
