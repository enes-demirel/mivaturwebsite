import Link from "next/link";

import { TourList } from "@/components/admin/tours/tour-list";
import { listAdminTours } from "@/lib/db/repositories/tours";

type ToursPageProps = { searchParams: Promise<{ q?: string | string[]; status?: string | string[]; type?: string | string[] }> };
const statusOrder: Record<string, number> = { published: 0, draft: 1, archived: 2 };

export default async function AdminToursPage({ searchParams }: ToursPageProps) {
  const query = await searchParams;
  const q = single(query.q).trim();
  const status = single(query.status);
  const type = single(query.type);
  let allTours: Awaited<ReturnType<typeof listAdminTours>> = [];
  let loadFailed = false;
  try { allTours = await listAdminTours(); } catch { loadFailed = true; }
  const filtered = allTours.filter((tour) => {
    const search = `${tour.title} ${tour.slug}`.toLocaleLowerCase("tr-TR");
    return (!q || search.includes(q.toLocaleLowerCase("tr-TR"))) && (!status || tour.status === status) && (!type || tour.type === type);
  }).sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9) || b.updated_at.localeCompare(a.updated_at));

  return <div className="mx-auto max-w-7xl"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-extrabold tracking-[0.16em] text-brand uppercase">İçerik Yönetimi</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">Turlar</h1><p className="mt-2 text-sm text-muted">Toplam {allTours.length} kayıt</p></div><Link href="/admin/turlar/yeni" className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-5 text-sm font-bold text-white">Yeni Tur Ekle</Link></div>
    <form className="mt-7 grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_180px_180px_auto]"><label className="sr-only" htmlFor="tour-search">Tur ara</label><input id="tour-search" name="q" defaultValue={q} placeholder="Tur adı veya slug ara" className="min-h-11 min-w-0 rounded-md border border-border bg-background px-3 text-sm" /><label className="sr-only" htmlFor="tour-status">Durum</label><select id="tour-status" name="status" defaultValue={status} className="min-h-11 rounded-md border border-border bg-background px-3 text-sm"><option value="">Tüm durumlar</option><option value="draft">Taslak</option><option value="published">Yayında</option><option value="archived">Arşiv</option></select><label className="sr-only" htmlFor="tour-type">Tür</label><select id="tour-type" name="type" defaultValue={type} className="min-h-11 rounded-md border border-border bg-background px-3 text-sm"><option value="">Tüm türler</option><option value="international">Yurtdışı</option><option value="domestic">Yurtiçi</option></select><button className="min-h-11 rounded-md border border-border px-4 text-sm font-bold">Filtrele</button></form>
    <div className="mt-6">{loadFailed ? <Empty title="Turlar yüklenemedi" description="Veriler şu anda alınamıyor. Lütfen tekrar deneyin." /> : allTours.length === 0 ? <Empty title="Henüz tur eklenmedi" description="İlk tur kaydını oluşturmak için Yeni Tur Ekle butonunu kullanın." /> : filtered.length === 0 ? <Empty title="Filtreye uygun tur bulunamadı" description="Arama veya filtre seçimlerini değiştirerek tekrar deneyin." /> : <TourList tours={filtered} />}</div></div>;
}
function single(value: string | string[] | undefined) { return typeof value === "string" ? value : ""; }
function Empty({ title, description }: { title: string; description: string }) { return <div className="rounded-lg border border-border bg-surface px-5 py-14 text-center"><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 text-sm text-muted">{description}</p></div>; }
