"use client";
/* eslint-disable @next/next/no-img-element -- Admin previews use internal R2 media URLs. */

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import {
  deleteGalleryImageAction,
  moveGalleryImageAction,
  registerGalleryImageAction,
  setTourCoverImageAction,
  updateGalleryAltTextAction,
  type MediaActionResult,
} from "@/app/admin/(protected)/turlar/media-actions";
import { uploadAdminMedia } from "@/lib/storage/upload";
import {
  formatFileSize,
  isImageMimeType,
  MAX_IMAGE_UPLOAD_COUNT,
  validateImageFile,
} from "@/lib/storage/file-validation";
import type { GalleryAdminRow as GalleryRow } from "@/types/admin-db";
export type GalleryItemView = GalleryRow & { publicUrl: string };
type PendingImage = { id: string; file: File; altText: string; error: string | null; status: "ready" | "uploading" | "success" | "error" };

export function TourGalleryManager({ tourId, images }: { tourId: string; images: readonly GalleryItemView[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [message, setMessage] = useState<MediaActionResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  function selectFiles(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files).slice(0, MAX_IMAGE_UPLOAD_COUNT).map((file) => ({
      id: crypto.randomUUID(),
      file,
      altText: "",
      error: validateImageFile(file),
      status: "ready" as const,
    }));
    setPendingImages(selected);
    setMessage(files.length > MAX_IMAGE_UPLOAD_COUNT ? { success: false, message: "Bir defada en fazla 10 görsel seçebilirsiniz." } : null);
  }

  async function uploadImages() {
    if (pendingImages.length === 0 || isPending || isUploading) return;
    const invalid = pendingImages.some(({ altText, error }) => error || altText.trim().length < 3 || altText.trim().length > 180);
    if (invalid) {
      setPendingImages((current) => current.map((item) => ({ ...item, error: item.error ?? (item.altText.trim().length < 3 ? "Alt metin en az 3 karakter olmalıdır." : item.altText.trim().length > 180 ? "Alt metin en fazla 180 karakter olabilir." : null) })));
      setMessage({ success: false, message: "Yüklemeden önce dosya ve alt metin hatalarını düzeltin." });
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    for (const item of pendingImages) {
      if (!isImageMimeType(item.file.type)) continue;
      setPendingImages((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "uploading", error: null } : entry));
      const storagePath = await uploadAdminMedia(item.file, tourId, "image");
      if (!storagePath) {
        setPendingImages((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "error", error: "Görsel Storage alanına yüklenemedi." } : entry));
        continue;
      }
      const result = await registerGalleryImageAction({ tourId, storagePath, altText: item.altText, mimeType: item.file.type, fileSize: item.file.size });
      setPendingImages((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: result.success ? "success" : "error", error: result.success ? null : result.message } : entry));
      if (result.success) successCount += 1;
    }
    setMessage(successCount > 0 ? { success: true, message: `${successCount} görsel galeriye eklendi.` } : { success: false, message: "Görseller yüklenemedi." });
    if (successCount > 0) {
      if (inputRef.current) inputRef.current.value = "";
      setPendingImages((current) => current.filter(({ status }) => status !== "success"));
      router.refresh();
    }
    setIsUploading(false);
  }

  function runAction(action: () => Promise<MediaActionResult>) {
    startTransition(async () => {
      const result = await action();
      setMessage(result);
      if (result.success) router.refresh();
    });
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6" aria-labelledby="tour-gallery-title">
      <div>
        <p className="text-xs font-extrabold tracking-[0.14em] text-brand uppercase">Medya</p>
        <h2 id="tour-gallery-title" className="mt-1 text-xl font-bold text-text">Tur Galerisi</h2>
        <p className="mt-1 text-sm text-muted">En fazla 5 MB boyutunda JPEG, PNG, WebP veya AVIF görseller yükleyin.</p>
      </div>
      {message && <p role="status" className={`mt-4 rounded-md border px-3 py-2 text-sm font-semibold ${message.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-brand/20 bg-brand/5 text-brand"}`}>{message.message}</p>}
      <div className="mt-5 rounded-md border border-dashed border-border bg-background p-4">
        <label htmlFor="tour-gallery-files" className="text-sm font-bold text-text">Galeri görselleri</label>
        <input ref={inputRef} id="tour-gallery-files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" disabled={isPending || isUploading} onChange={(event) => selectFiles(event.target.files)} className="mt-2 block w-full text-sm file:mr-3 file:min-h-10 file:rounded-md file:border file:border-border file:bg-surface file:px-4 file:font-bold file:text-text" />
        {pendingImages.length > 0 && <div className="mt-4 space-y-3">{pendingImages.map((item) => <div key={item.id} className="grid gap-2 rounded-md border border-border bg-surface p-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,1fr)] md:items-start"><div className="min-w-0"><p className="truncate text-sm font-bold">{item.file.name}</p><p className="mt-1 text-xs text-muted">{item.file.type || "Bilinmeyen tür"} · {formatFileSize(item.file.size)} · {item.status === "uploading" ? "Yükleniyor…" : item.status === "success" ? "Yüklendi" : item.status === "error" ? "Başarısız" : "Hazır"}</p></div><div><label htmlFor={`alt-${item.id}`} className="sr-only">{item.file.name} alt metni</label><input id={`alt-${item.id}`} value={item.altText} maxLength={180} disabled={item.status === "uploading"} onChange={(event) => setPendingImages((current) => current.map((entry) => entry.id === item.id ? { ...entry, altText: event.target.value, error: validateImageFile(entry.file) } : entry))} placeholder="Görseli açıklayan alt metin" className="min-h-10 w-full rounded-md border border-border bg-background px-3 text-sm normal-case outline-none focus:border-brand" />{item.error && <p className="mt-1 text-xs font-semibold text-brand">{item.error}</p>}</div></div>)}</div>}
        <button type="button" disabled={isPending || isUploading || pendingImages.length === 0} onClick={uploadImages} className="mt-4 min-h-11 rounded-md bg-brand px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{isUploading ? "Yükleniyor…" : "Seçilen Görselleri Yükle"}</button>
      </div>
      {images.length === 0 ? <p className="mt-5 rounded-md bg-background px-4 py-6 text-center text-sm text-muted">Henüz galeri görseli eklenmedi.</p> : <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{images.map((image, index) => <GalleryCard key={image.id} image={image} tourId={tourId} first={index === 0} last={index === images.length - 1} disabled={isPending} runAction={runAction} />)}</div>}
    </section>
  );
}

function GalleryCard({ image, tourId, first, last, disabled, runAction }: { image: GalleryItemView; tourId: string; first: boolean; last: boolean; disabled: boolean; runAction: (action: () => Promise<MediaActionResult>) => void }) {
  const [altText, setAltText] = useState(image.alt_text);
  const [confirmDelete, setConfirmDelete] = useState(false);
  return <article className="overflow-hidden rounded-md border border-border bg-background">
    <div className="relative aspect-video overflow-hidden bg-slate-100">
      {/* Public bucket URL; native img avoids adding a remote host to public-site image configuration. */}
      <img src={image.publicUrl} alt={image.alt_text} className="size-full object-cover" />
      {image.is_cover && <span className="absolute top-2 left-2 rounded-full bg-brand px-2.5 py-1 text-xs font-extrabold text-white">Kapak</span>}
    </div>
    <div className="space-y-3 p-4">
      <div><label htmlFor={`gallery-alt-${image.id}`} className="text-xs font-bold text-muted">Alt metin</label><input id={`gallery-alt-${image.id}`} value={altText} minLength={3} maxLength={180} onChange={(event) => setAltText(event.target.value)} className="mt-1 min-h-10 w-full rounded-md border border-border bg-surface px-3 text-sm normal-case outline-none focus:border-brand" /></div>
      <button type="button" disabled={disabled || altText.trim() === image.alt_text || altText.trim().length < 3} onClick={() => runAction(() => updateGalleryAltTextAction(tourId, image.id, altText))} className="min-h-10 w-full rounded-md border border-border px-3 text-sm font-bold disabled:opacity-50">Alt Metni Kaydet</button>
      <div className="grid grid-cols-2 gap-2"><button type="button" disabled={disabled || first} onClick={() => runAction(() => moveGalleryImageAction(tourId, image.id, "previous"))} className="min-h-10 rounded-md border border-border text-sm font-bold disabled:opacity-40">← Sola taşı</button><button type="button" disabled={disabled || last} onClick={() => runAction(() => moveGalleryImageAction(tourId, image.id, "next"))} className="min-h-10 rounded-md border border-border text-sm font-bold disabled:opacity-40">Sağa taşı →</button></div>
      {!image.is_cover && <button type="button" disabled={disabled} onClick={() => runAction(() => setTourCoverImageAction(tourId, image.id))} className="min-h-10 w-full rounded-md border border-brand/30 text-sm font-bold text-brand">Kapak Yap</button>}
      <button type="button" disabled={disabled} onClick={() => setConfirmDelete(true)} className="min-h-10 w-full text-sm font-bold text-brand underline-offset-4 hover:underline">Görseli Sil</button>
    </div>
    {confirmDelete && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmDelete(false); }}><div role="alertdialog" aria-modal="true" aria-labelledby={`delete-title-${image.id}`} className="w-full max-w-md rounded-lg bg-surface p-5 shadow-xl"><h3 id={`delete-title-${image.id}`} className="text-lg font-extrabold">Görsel silinsin mi?</h3><div className="mt-4 flex gap-3"><div className="h-20 w-28 shrink-0 overflow-hidden rounded-md bg-slate-100"><img src={image.publicUrl} alt="" className="size-full object-cover" /></div><div><p className="text-sm text-text">{image.alt_text}</p>{image.is_cover && <p className="mt-1 text-xs font-bold text-brand">Bu görsel mevcut kapaktır.</p>}</div></div><p className="mt-4 text-sm text-muted">Dosya Storage alanından ve galeri kaydından kalıcı olarak silinir.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setConfirmDelete(false)} className="min-h-10 rounded-md border border-border px-4 text-sm font-bold">Vazgeç</button><button type="button" onClick={() => { setConfirmDelete(false); runAction(() => deleteGalleryImageAction(tourId, image.id)); }} className="min-h-10 rounded-md bg-brand px-4 text-sm font-bold text-white">Sil</button></div></div></div>}
  </article>;
}
