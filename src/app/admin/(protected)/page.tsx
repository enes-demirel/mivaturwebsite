import { first } from "@/lib/db/query";

const systemStatus = [
  "Cloudflare D1 bağlantısı aktif",
  "Admin oturumu doğrulandı",
  "D1 oturum doğrulaması aktif",
  "Tur, blog ve destinasyon yönetimi aktif",
] as const;

export default async function AdminDashboardPage() {
  const [tours, reservations, customRequests, blogs] = await Promise.all([
    first<{ published: number | null; draft: number | null }>("SELECT SUM(CASE WHEN status='published' THEN 1 ELSE 0 END) published,SUM(CASE WHEN status='draft' THEN 1 ELSE 0 END) draft FROM tours"),
    first<{ count: number }>("SELECT COUNT(*) count FROM reservation_requests WHERE status='new'"),
    first<{ count: number }>("SELECT COUNT(*) count FROM custom_tour_requests WHERE status='new'"),
    first<{ count: number }>("SELECT COUNT(*) count FROM blog_posts WHERE status='published'"),
  ]);
  const overviewCards = [{ title: "Yayındaki Turlar", value: tours?.published ?? 0 }, { title: "Taslak Turlar", value: tours?.draft ?? 0 }, { title: "Yeni Rezervasyon", value: reservations?.count ?? 0 }, { title: "Yeni Özel Tur Talebi", value: customRequests?.count ?? 0 }, { title: "Yayındaki Blog", value: blogs?.count ?? 0 }];
  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <p className="text-xs font-extrabold tracking-[0.16em] text-brand uppercase">Mivatur Yönetim</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">Genel Bakış</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">Yayın durumlarını ve yeni talepleri tek bakışta izleyin.</p>
      </header>

      <section aria-labelledby="admin-modules-title" className="mt-8">
        <h2 id="admin-modules-title" className="sr-only">Yönetim modülleri</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {overviewCards.map((card) => <article key={card.title} className="rounded-lg border border-border bg-surface p-5 shadow-card"><h3 className="text-sm font-bold text-muted">{card.title}</h3><p className="mt-3 text-3xl font-extrabold text-text">{card.value}</p></article>)}
        </div>
      </section>

      <section aria-labelledby="system-status-title" className="mt-8 rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6">
        <h2 id="system-status-title" className="text-xl font-bold text-text">Sistem durumu</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">{systemStatus.map((status, index) => <li key={status} className="flex items-start gap-3 text-sm leading-6 text-muted"><span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${index < 3 ? "bg-emerald-500" : "bg-border"}`} />{status}</li>)}</ul>
      </section>
    </div>
  );
}
