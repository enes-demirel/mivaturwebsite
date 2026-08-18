"use client";

import type { ContentActionResult } from "@/app/admin/(protected)/turlar/content-actions";

export function ActionMessage({ result }: { result: ContentActionResult | null }) {
  if (!result) return null;
  return <p role="status" className={`rounded-md border px-3 py-2 text-sm font-semibold ${result.success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-brand/20 bg-brand/5 text-brand"}`}>{result.message}</p>;
}

export function MoveButtons({ first, last, busy, onPrevious, onNext }: { first: boolean; last: boolean; busy: boolean; onPrevious: () => void; onNext: () => void }) {
  return <div className="flex gap-1"><button type="button" aria-label="Yukarı taşı" disabled={first || busy} onClick={onPrevious} className="min-h-10 rounded-md border border-border px-3 text-sm font-bold disabled:opacity-35">↑</button><button type="button" aria-label="Aşağı taşı" disabled={last || busy} onClick={onNext} className="min-h-10 rounded-md border border-border px-3 text-sm font-bold disabled:opacity-35">↓</button></div>;
}

export const inputClass = "min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm normal-case outline-none focus:border-brand";
export const textareaClass = "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm normal-case outline-none focus:border-brand";
