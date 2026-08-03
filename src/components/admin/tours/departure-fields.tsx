"use client";

import type { Database } from "@/types/database.types";

type DepartureRow = Database["public"]["Tables"]["tour_departures"]["Row"];
export type DepartureDraft = Pick<DepartureRow, "id" | "start_date" | "end_date" | "departure_city" | "arrival_point" | "price" | "currency" | "previous_price" | "airline" | "transportation_note" | "status"> & { clientKey: string };

export function emptyDeparture(clientKey: string): DepartureDraft {
  return { clientKey, id: "", start_date: "", end_date: "", departure_city: "", arrival_point: "", price: 0, currency: "EUR", previous_price: null, airline: "", transportation_note: "", status: "planned" };
}

export function DepartureFields({ departures, onAdd, onRemove, errors }: { departures: readonly DepartureDraft[]; onAdd: () => void; onRemove: (clientKey: string) => void; errors: Record<string, string> }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6" aria-labelledby="departures-title">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="departures-title" className="text-xl font-bold text-text">Kalkış Tarihleri</h2><p className="mt-1 text-sm text-muted">Tamamen boş satırlar kaydedilmez.</p></div><button type="button" onClick={onAdd} className="min-h-11 rounded-md border border-border px-4 text-sm font-bold hover:border-brand hover:text-brand">Kalkış Ekle</button></div>
      {errors.departures && <p className="mt-3 text-sm text-brand">{errors.departures}</p>}
      <input type="hidden" name="departure_count" value={departures.length} />
      <div className="mt-5 space-y-5">
        {departures.map((departure, index) => (
          <fieldset key={departure.clientKey} className="rounded-md border border-border bg-background p-4">
            <legend className="px-2 text-sm font-bold text-text">{index + 1}. kalkış</legend>
            <input type="hidden" name={`departures.${index}.id`} value={departure.id} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Başlangıç" name={`departures.${index}.start_date`} type="date" defaultValue={departure.start_date} error={errors[`departures.${index}.start_date`]} required={false} />
              <Field label="Bitiş" name={`departures.${index}.end_date`} type="date" defaultValue={departure.end_date} error={errors[`departures.${index}.end_date`]} required={false} />
              <Field label="Çıkış şehri" name={`departures.${index}.departure_city`} defaultValue={departure.departure_city} error={errors[`departures.${index}.departure_city`]} />
              <Field label="Varış noktası" name={`departures.${index}.arrival_point`} defaultValue={departure.arrival_point ?? ""} />
              <Field label="Fiyat" name={`departures.${index}.price`} type="number" min="0" step="0.01" defaultValue={departure.price || ""} error={errors[`departures.${index}.price`]} />
              <SelectField label="Para birimi" name={`departures.${index}.currency`} defaultValue={departure.currency} options={[["EUR", "EUR"], ["USD", "USD"], ["TRY", "TRY"]]} />
              <Field label="Önceki fiyat" name={`departures.${index}.previous_price`} type="number" min="0" step="0.01" defaultValue={departure.previous_price ?? ""} error={errors[`departures.${index}.previous_price`]} />
              <Field label="Havayolu" name={`departures.${index}.airline`} defaultValue={departure.airline ?? ""} />
              <SelectField label="Durum" name={`departures.${index}.status`} defaultValue={departure.status} options={[["planned", "Planlanıyor"], ["available", "Uygun"], ["sold-out", "Tükendi"]]} />
              <div className="sm:col-span-2 lg:col-span-3"><label className="mb-1.5 block text-sm font-semibold" htmlFor={`departures-${index}-note`}>Ulaşım notu</label><textarea id={`departures-${index}-note`} name={`departures.${index}.transportation_note`} rows={2} defaultValue={departure.transportation_note ?? ""} className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm normal-case" /></div>
            </div>
            <button type="button" onClick={() => onRemove(departure.clientKey)} className="mt-4 min-h-10 text-sm font-bold text-brand underline-offset-4 hover:underline">Bu kalkışı kaldır</button>
          </fieldset>
        ))}
      </div>
    </section>
  );
}

function Field({ label, name, error, type = "text", required = false, ...props }: { label: string; name: string; error?: string; type?: string; required?: boolean; defaultValue?: string | number; min?: string; step?: string }) {
  const id = name.replaceAll(".", "-");
  return <div><label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label><input id={id} name={name} type={type} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm normal-case outline-none focus:border-brand" {...props} />{error && <p id={`${id}-error`} className="mt-1 text-xs text-brand">{error}</p>}</div>;
}

function SelectField({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: readonly (readonly [string, string])[] }) {
  const id = name.replaceAll(".", "-");
  return <div><label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label><select id={id} name={name} defaultValue={defaultValue} className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm">{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></div>;
}
