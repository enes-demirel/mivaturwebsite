"use client";

import { useState } from "react";

import type { TourDayTransfer, TourDayTransferMode } from "@/types/tour-payment";

type TransferDraft = TourDayTransfer & { enabled: boolean; distanceValue: string };
const modeLabels: Record<TourDayTransferMode, string> = { plane: "Uçak", train: "Tren", bus: "Otobüs", ship: "Gemi" };

export function DayTransfersEditor({ dayNumbers }: { dayNumbers: readonly number[] }) {
  const pairs = dayNumbers.slice(0, -1).map((day, index) => [day, dayNumbers[index + 1]] as const);
  const [transferValues, setTransferValues] = useState<Record<string, TransferDraft>>({});
  const transfers = pairs.map(([fromDayNumber, toDayNumber]) => transferValues[`${fromDayNumber}-${toDayNumber}`] ?? { fromDayNumber, toDayNumber, transportMode: "plane" as const, distanceKm: null, distanceValue: "", enabled: false });

  function update(index: number, value: Partial<TransferDraft>) { const transfer = transfers[index]; const key = `${transfer.fromDayNumber}-${transfer.toDayNumber}`; setTransferValues((current) => ({ ...current, [key]: { ...transfer, ...value } })); }
  if (pairs.length === 0) return <div className="mt-6 rounded-md border border-dashed border-border p-4 text-sm text-muted">Günler arası yolculuk eklemek için en az iki program günü gerekir.</div>;
  return <section className="mt-7 border-t border-border pt-6" aria-labelledby="day-transfers-title"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 id="day-transfers-title" className="font-extrabold text-text">Günler Arası Yolculuk</h3><p className="mt-1 text-sm text-muted">Ardışık günler arasındaki ulaşım bilgisini hazırlayın.</p></div><span className="rounded-full border border-border px-3 py-1 text-xs font-bold text-muted">UI hazırlığı</span></div><div className="mt-4 space-y-3">{transfers.map((transfer, index) => <div key={`${transfer.fromDayNumber}-${transfer.toDayNumber}`} className="rounded-md border border-border bg-background p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-bold">{transfer.fromDayNumber}. Gün → {transfer.toDayNumber}. Gün</p><label className="flex min-h-10 items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={transfer.enabled} onChange={(event) => update(index, { enabled: event.target.checked })} className="size-4 accent-brand" />Yolculuk var</label></div>{transfer.enabled && <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Ulaşım Türü<select value={transfer.transportMode} onChange={(event) => update(index, { transportMode: event.target.value as TourDayTransferMode })} className="mt-1.5 min-h-11 w-full rounded-md border border-border bg-surface px-3 outline-none focus:border-brand">{Object.entries(modeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="text-sm font-semibold">Mesafe (km)<input type="number" inputMode="numeric" min="1" max="30000" step="1" value={transfer.distanceValue} onChange={(event) => { const distanceValue = event.target.value; const parsed = Number(distanceValue); update(index, { distanceValue, distanceKm: distanceValue && Number.isInteger(parsed) && parsed >= 1 && parsed <= 30000 ? parsed : null }); }} className="mt-1.5 min-h-11 w-full rounded-md border border-border bg-surface px-3 outline-none focus:border-brand" /></label></div>}</div>)}</div><p className="mt-3 text-xs text-muted">Bu alanlar henüz veritabanına kaydedilmez.</p></section>;
}
