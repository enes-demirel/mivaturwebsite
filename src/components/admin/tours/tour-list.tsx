import Link from "next/link";

import type { DepartureAdminRow as DepartureRow,TourAdminRow as TourRow } from "@/types/admin-db";
export type AdminTourListItem = Pick<TourRow, "id" | "title" | "slug" | "type" | "status" | "duration_days" | "duration_nights" | "updated_at"> & { tour_departures: readonly Pick<DepartureRow, "start_date" | "price" | "currency" | "status">[] };

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" });
const currencySymbols: Record<string, string> = { TRY: "₺", EUR: "€", USD: "$" };

export function TourList({ tours }: { tours: readonly AdminTourListItem[] }) {
  return <div className="grid gap-4">{tours.map((tour) => { const summary = summarizeDepartures(tour.tour_departures); return <article key={tour.id} className="rounded-lg border border-border bg-surface p-5 shadow-card"><div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-text">{tour.title}</h2><StatusBadge status={tour.status} /></div><p className="mt-1 text-xs text-muted">/{tour.slug}</p></div><dl className="grid min-w-0 gap-4 text-sm sm:grid-cols-2 xl:grid-cols-5 xl:items-center"><Item label="Tür" value={tour.type === "international" ? "Yurtdışı" : "Yurtiçi"} /><Item label="Süre" value={`${tour.duration_days} gün · ${tour.duration_nights} gece`} /><Item label="En yakın kalkış" value={summary.date} /><Item label="Başlangıç fiyatı" value={summary.price} /><Item label="Güncellendi" value={dateFormatter.format(new Date(tour.updated_at))} /></dl><Link href={`/admin/turlar/${tour.id}`} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md border border-border px-4 text-sm font-bold hover:border-brand hover:text-brand">Düzenle</Link></div></article>; })}</div>;
}

function summarizeDepartures(departures: AdminTourListItem["tour_departures"]) {
  const today = new Date().toISOString().slice(0, 10);
  const valid = departures.filter((departure) => departure.start_date >= today && departure.status !== "sold-out").sort((a, b) => a.start_date.localeCompare(b.start_date));
  if (valid.length === 0) return { date: "Tarih eklenmedi", price: "Fiyat eklenmedi" };
  const currencies = [...new Set(valid.map(({ currency }) => currency))];
  const price = currencies.length > 1 ? "Birden fazla para birimi" : `${new Intl.NumberFormat("tr-TR").format(Math.min(...valid.map((departure) => departure.price)))} ${currencySymbols[currencies[0]] ?? currencies[0]}`;
  return { date: dateFormatter.format(new Date(`${valid[0].start_date}T00:00:00`)), price };
}
function Item({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 break-words font-semibold text-text">{value}</dd></div>; }
export function StatusBadge({ status }: { status: string }) { const labels: Record<string, string> = { published: "Yayında", draft: "Taslak", archived: "Arşiv" }; return <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[0.6875rem] font-bold text-muted">{labels[status] ?? status}</span>; }
