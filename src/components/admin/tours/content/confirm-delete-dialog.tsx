"use client";

import { useEffect, useRef } from "react";

export function ConfirmDeleteDialog({ open, title, description, busy, onCancel, onConfirm }: { open: boolean; title: string; description: string; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const busyRef = useRef(busy);
  const cancelCallbackRef = useRef(onCancel);

  useEffect(() => {
    busyRef.current = busy;
    cancelCallbackRef.current = onCancel;
  }, [busy, onCancel]);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelRef.current?.focus();
    function keyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busyRef.current) { event.preventDefault(); cancelCallbackRef.current(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (focusable.length === 0) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", keyDown);
    return () => { document.removeEventListener("keydown", keyDown); returnFocusRef.current?.focus(); };
  }, [open]);

  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}><div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="content-delete-title" aria-describedby="content-delete-description" className="w-full max-w-md rounded-lg bg-surface p-5 shadow-xl"><h3 id="content-delete-title" className="text-lg font-extrabold text-text">{title}</h3><p id="content-delete-description" className="mt-3 text-sm leading-6 text-muted">{description}</p><div className="mt-5 flex justify-end gap-2"><button ref={cancelRef} type="button" disabled={busy} onClick={onCancel} className="min-h-10 rounded-md border border-border px-4 text-sm font-bold disabled:opacity-50">Vazgeç</button><button type="button" disabled={busy} onClick={onConfirm} className="min-h-10 rounded-md bg-brand px-4 text-sm font-bold text-white disabled:opacity-50">{busy ? "Siliniyor…" : "Sil"}</button></div></div></div>;
}
