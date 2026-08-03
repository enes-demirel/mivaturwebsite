const overviewCards = [
  { title: "Turlar", description: "Yönetim altyapısı hazır" },
  { title: "Blog Yazıları", description: "İçerik yönetimi sonraki aşamada" },
  { title: "Rezervasyon Talepleri", description: "Güvenli veri erişimi hazır" },
  { title: "Destinasyonlar", description: "Yönetim altyapısı hazır" },
] as const;

const systemStatus = [
  "Supabase bağlantısı aktif",
  "Admin oturumu doğrulandı",
  "Veritabanı güvenlik politikaları aktif",
  "İçerik yönetimi sonraki aşamada eklenecek",
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <p className="text-xs font-extrabold tracking-[0.16em] text-brand uppercase">Mivatur Yönetim</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">Genel Bakış</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">İçerik yönetimi modülleri eklenmeden önce güvenli yönetim altyapısının mevcut durumunu inceleyin.</p>
      </header>

      <section aria-labelledby="admin-modules-title" className="mt-8">
        <h2 id="admin-modules-title" className="sr-only">Yönetim modülleri</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => <article key={card.title} className="rounded-lg border border-border bg-surface p-5 shadow-card"><h3 className="font-bold text-text">{card.title}</h3><p className="mt-3 text-sm leading-6 text-muted">{card.description}</p><span className="mt-5 inline-flex rounded-full border border-border px-2.5 py-1 text-[0.6875rem] font-bold text-muted">Yakında</span></article>)}
        </div>
      </section>

      <section aria-labelledby="system-status-title" className="mt-8 rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6">
        <h2 id="system-status-title" className="text-xl font-bold text-text">Sistem durumu</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">{systemStatus.map((status, index) => <li key={status} className="flex items-start gap-3 text-sm leading-6 text-muted"><span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${index < 3 ? "bg-emerald-500" : "bg-border"}`} />{status}</li>)}</ul>
      </section>
    </div>
  );
}
