"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { deleteTourPdfAction, registerTourPdfAction, type MediaActionResult } from "@/app/admin/(protected)/turlar/media-actions";
import { createClient } from "@/lib/supabase/client";
import { formatFileSize, PDF_BUCKET, validatePdfFile } from "@/lib/storage/file-validation";
import { createPdfStoragePath } from "@/lib/storage/path";

export function TourPdfManager({ tourId, pdfUrl }: { tourId: string; pdfUrl: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [message, setMessage] = useState<MediaActionResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function selectFile(selected: File | undefined) {
    setFile(selected ?? null);
    setFileError(selected ? validatePdfFile(selected) : null);
    setMessage(null);
  }

  async function uploadPdf() {
    if (!file || busy) return;
    const validationError = validatePdfFile(file);
    if (validationError) { setFileError(validationError); return; }
    setBusy(true);
    const storagePath = createPdfStoragePath(tourId);
    const supabase = createClient();
    // Client checks are UX safeguards; bucket MIME/size limits and Storage RLS are authoritative.
    const { data, error } = await supabase.storage.from(PDF_BUCKET).upload(storagePath, file, { cacheControl: "31536000", contentType: "application/pdf", upsert: false });
    if (error || !data?.path) {
      setMessage({ success: false, message: "PDF Storage alanına yüklenemedi." });
      setBusy(false);
      return;
    }
    const result = await registerTourPdfAction({ tourId, storagePath: data.path, mimeType: file.type, fileSize: file.size });
    setMessage(result);
    setBusy(false);
    if (result.success) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    }
  }

  async function deletePdf() {
    setConfirmDelete(false);
    setBusy(true);
    const result = await deleteTourPdfAction(tourId);
    setMessage(result);
    setBusy(false);
    if (result.success) router.refresh();
  }

  return <section className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6" aria-labelledby="tour-pdf-title">
    <p className="text-xs font-extrabold tracking-[0.14em] text-brand uppercase">Doküman</p><h2 id="tour-pdf-title" className="mt-1 text-xl font-bold text-text">Tur Programı PDF’i</h2><p className="mt-1 text-sm text-muted">En fazla 10 MB boyutunda tek bir PDF yükleyin.</p>
    {message && <p role="status" className={`mt-4 rounded-md border px-3 py-2 text-sm font-semibold ${message.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-brand/20 bg-brand/5 text-brand"}`}>{message.message}</p>}
    {pdfUrl && <div className="mt-5 flex flex-wrap items-center gap-3 rounded-md border border-border bg-background p-4"><div className="min-w-0 flex-1"><p className="font-bold">Tur Programı PDF’i</p><p className="text-sm text-muted">Yüklenmiş PDF kullanılabilir.</p></div><a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-bold hover:border-brand hover:text-brand">PDF’i Görüntüle</a><button type="button" disabled={busy} onClick={() => setConfirmDelete(true)} className="min-h-10 px-2 text-sm font-bold text-brand">PDF’i Sil</button></div>}
    <div className="mt-5 rounded-md border border-dashed border-border bg-background p-4"><label htmlFor="tour-pdf-file" className="text-sm font-bold">{pdfUrl ? "PDF’i Değiştir" : "PDF Yükle"}</label><input ref={inputRef} id="tour-pdf-file" type="file" accept="application/pdf" disabled={busy} onChange={(event) => selectFile(event.target.files?.[0])} className="mt-2 block w-full text-sm file:mr-3 file:min-h-10 file:rounded-md file:border file:border-border file:bg-surface file:px-4 file:font-bold" />{file && <p className="mt-2 text-sm text-muted">{file.name} · {file.type || "Bilinmeyen tür"} · {formatFileSize(file.size)}</p>}{fileError && <p className="mt-1 text-sm font-semibold text-brand">{fileError}</p>}<button type="button" disabled={busy || !file || Boolean(fileError)} onClick={uploadPdf} className="mt-4 min-h-11 rounded-md bg-brand px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Yükleniyor…" : pdfUrl ? "Yeni PDF’i Yükle" : "PDF’i Yükle"}</button></div>
    {confirmDelete && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmDelete(false); }}><div role="alertdialog" aria-modal="true" aria-labelledby="delete-pdf-title" className="w-full max-w-md rounded-lg bg-surface p-5 shadow-xl"><h3 id="delete-pdf-title" className="text-lg font-extrabold">Tur PDF’i silinsin mi?</h3><p className="mt-3 text-sm text-muted">Tur Programı PDF’i Storage alanından kalıcı olarak silinecek.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setConfirmDelete(false)} className="min-h-10 rounded-md border border-border px-4 text-sm font-bold">Vazgeç</button><button type="button" onClick={deletePdf} className="min-h-10 rounded-md bg-brand px-4 text-sm font-bold text-white">Sil</button></div></div></div>}
  </section>;
}
