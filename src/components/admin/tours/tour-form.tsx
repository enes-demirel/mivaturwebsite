"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { createTourAction, type TourFormState, updateTourAction } from "@/app/admin/(protected)/turlar/actions";
import { DepartureFields, emptyDeparture, type DepartureDraft } from "@/components/admin/tours/departure-fields";
import { createTurkishSlug } from "@/lib/turkish-slug";
import type { Database } from "@/types/database.types";

type TourRow = Database["public"]["Tables"]["tours"]["Row"];
type DepartureRow = Database["public"]["Tables"]["tour_departures"]["Row"];
const initialTourFormState: TourFormState = { message: null, fieldErrors: {} };

export function TourForm({ tour, initialDepartures = [] }: { tour?: TourRow; initialDepartures?: readonly DepartureRow[] }) {
  const action = tour ? updateTourAction.bind(null, tour.id) : createTourAction;
  const [state, formAction] = useActionState<TourFormState, FormData>(action, initialTourFormState);
  const [title, setTitle] = useState(tour?.title ?? "");
  const [slug, setSlug] = useState(tour?.slug ?? "");
  const slugEdited = useRef(Boolean(tour));
  const keyCounter = useRef(1);
  const [departures, setDepartures] = useState<DepartureDraft[]>(() => initialDepartures.length > 0 ? initialDepartures.map((departure) => ({ ...departure, clientKey: departure.id })) : [emptyDeparture("new-0")]);

  function changeTitle(value: string) {
    setTitle(value);
    if (!slugEdited.current) setSlug(createTurkishSlug(value));
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.message && <div role="alert" className="rounded-md border border-brand/20 bg-brand/5 px-4 py-3 text-sm font-semibold text-brand">{state.message}</div>}
      <FormSection title="Temel Bilgiler">
        <div className="grid gap-4 md:grid-cols-2"><Input label="Tur adı" name="title" value={title} onChange={(event) => changeTitle(event.target.value)} error={state.fieldErrors.title} required /><Input label="Slug" name="slug" value={slug} onChange={(event) => { slugEdited.current = true; setSlug(event.target.value); }} error={state.fieldErrors.slug} required /><Select label="Tur türü" name="type" defaultValue={tour?.type ?? "international"} options={[["international", "Yurtdışı"], ["domestic", "Yurtiçi"]]} /><Input label="Bölge" name="region" defaultValue={tour?.region ?? ""} /></div>
        <div className="mt-4"><Textarea label="Kısa açıklama" name="short_description" defaultValue={tour?.short_description ?? ""} error={state.fieldErrors.short_description} required rows={3} /></div>
        <div className="mt-4"><Textarea label="Uzun açıklama" name="long_description" defaultValue={tour?.long_description ?? ""} rows={6} /></div>
      </FormSection>
      <FormSection title="Tur Süresi ve Ulaşım"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Input label="Gün" name="duration_days" type="number" min="1" defaultValue={tour?.duration_days ?? 1} error={state.fieldErrors.duration_days} required /><Input label="Gece" name="duration_nights" type="number" min="0" defaultValue={tour?.duration_nights ?? 0} error={state.fieldErrors.duration_nights} required /><Select label="Ulaşım" name="transportation_type" defaultValue={tour?.transportation_type ?? ""} options={[["", "Belirtilmedi"], ["plane", "Uçak"], ["bus", "Otobüs"], ["train", "Tren"], ["mixed", "Karma"]]} /><Select label="Vize" name="visa_status" defaultValue={tour?.visa_status ?? ""} options={[["", "Belirtilmedi"], ["visa-free", "Vizesiz"], ["visa-required", "Vizeli"], ["special", "Özel durum"]]} /></div></FormSection>
      <FormSection title="Fiyatlandırma Ek Bilgileri"><div className="grid gap-4 md:grid-cols-3"><Input label="Oda fiyat tanımı" name="room_occupancy_label" defaultValue={tour?.room_occupancy_label ?? ""} /><Input label="Tek kişilik oda farkı" name="single_room_supplement" type="number" min="0" step="0.01" defaultValue={tour?.single_room_supplement ?? ""} error={state.fieldErrors.single_room_supplement} /><Select label="Para birimi" name="single_room_supplement_currency" defaultValue={tour?.single_room_supplement_currency ?? ""} options={[["", "Seçilmedi"], ["EUR", "EUR"], ["USD", "USD"], ["TRY", "TRY"]]} /></div></FormSection>
      <FormSection title="Ana Sayfa Ayarları"><div className="grid gap-4 sm:grid-cols-2"><label className="flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" name="featured_home" defaultChecked={tour?.featured_home ?? false} className="size-4 accent-brand" />Ana sayfada öne çıkar</label><Input label="Öne çıkan sırası" name="featured_order" type="number" min="0" defaultValue={tour?.featured_order ?? 0} error={state.fieldErrors.featured_order} /></div></FormSection>
      <FormSection title="SEO"><div className="grid gap-4 md:grid-cols-2"><Input label="SEO başlığı" name="seo_title" defaultValue={tour?.seo_title ?? ""} error={state.fieldErrors.seo_title} /><Textarea label="SEO açıklaması" name="seo_description" defaultValue={tour?.seo_description ?? ""} error={state.fieldErrors.seo_description} rows={3} /></div></FormSection>
      <DepartureFields departures={departures} errors={state.fieldErrors} onAdd={() => { const key = `new-${keyCounter.current++}`; setDepartures((current) => [...current, emptyDeparture(key)]); }} onRemove={(clientKey) => setDepartures((current) => current.filter((departure) => departure.clientKey !== clientKey))} />
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end"><SubmitButtons /></div>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6"><h2 className="mb-5 text-xl font-bold text-text">{title}</h2>{children}</section>; }
function Input({ label, name, error, required = false, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string }) { return <div><label htmlFor={name} className="mb-1.5 block text-sm font-semibold">{label}</label><input id={name} name={name} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm normal-case outline-none focus:border-brand" {...props} />{error && <p id={`${name}-error`} className="mt-1 text-xs text-brand">{error}</p>}</div>; }
function Textarea({ label, name, error, required = false, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string; error?: string }) { return <div><label htmlFor={name} className="mb-1.5 block text-sm font-semibold">{label}</label><textarea id={name} name={name} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm normal-case outline-none focus:border-brand" {...props} />{error && <p id={`${name}-error`} className="mt-1 text-xs text-brand">{error}</p>}</div>; }
function Select({ label, name, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; name: string; options: readonly (readonly [string, string])[] }) { return <div><label htmlFor={name} className="mb-1.5 block text-sm font-semibold">{label}</label><select id={name} name={name} className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm" {...props}>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></div>; }
function SubmitButtons() { const { pending } = useFormStatus(); return <><button type="submit" name="submit_intent" value="draft" disabled={pending} className="min-h-11 rounded-md border border-border px-5 text-sm font-bold disabled:opacity-60">{pending ? "Kaydediliyor…" : "Taslak Kaydet"}</button><button type="submit" name="submit_intent" value="published" disabled={pending} className="min-h-11 rounded-md bg-brand px-5 text-sm font-bold text-white disabled:opacity-60">{pending ? "Kaydediliyor…" : "Kaydet ve Yayınla"}</button></>; }
