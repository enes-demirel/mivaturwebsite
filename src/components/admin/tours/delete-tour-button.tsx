"use client";

import { useRef } from "react";

import { deleteDraftTourAction } from "@/app/admin/(protected)/turlar/actions";

export function DeleteTourButton({ id, title }: { id: string; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return <><button type="button" onClick={() => dialogRef.current?.showModal()} className="min-h-10 rounded-md border border-brand/30 px-4 text-sm font-bold text-brand hover:bg-brand/5">Kalıcı Olarak Sil</button><dialog ref={dialogRef} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-border bg-surface p-0 shadow-2xl backdrop:bg-text/40"><div className="p-6"><h2 className="text-xl font-bold text-text">Taslak tur silinsin mi?</h2><p className="mt-3 text-sm leading-6 text-muted"><strong className="text-text">{title}</strong> kalıcı olarak silinecek. Bu işlem geri alınamaz.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => dialogRef.current?.close()} className="min-h-11 rounded-md border border-border px-4 text-sm font-bold">Vazgeç</button><form action={deleteDraftTourAction}><input type="hidden" name="id" value={id} /><button type="submit" className="min-h-11 rounded-md bg-brand px-4 text-sm font-bold text-white">Turu Sil</button></form></div></div></dialog></>;
}
