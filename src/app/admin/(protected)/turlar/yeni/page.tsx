import Link from "next/link";

import { TourForm } from "@/components/admin/tours/tour-form";

export default function NewTourPage() {
  return <div className="mx-auto max-w-6xl"><Link href="/admin/turlar" className="text-sm font-bold text-brand hover:underline">← Tur listesine dön</Link><header className="mt-5"><p className="text-xs font-extrabold tracking-[0.16em] text-brand uppercase">Tur Yönetimi</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Yeni Tur Ekle</h1><p className="mt-3 text-sm leading-6 text-muted">Temel tur bilgilerini ve kalkış tarihlerini oluşturun.</p></header><div className="mt-8"><TourForm /></div></div>;
}
